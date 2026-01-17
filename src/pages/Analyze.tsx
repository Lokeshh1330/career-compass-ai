import { useState } from "react";
import { ResumeUpload } from "@/components/resume/ResumeUpload";
import AnimatedLottie from "@/components/ui/AnimatedLottie";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { CompatibilityScore } from "@/components/analysis/CompatibilityScore";
import { RejectionPredictor } from "@/components/analysis/RejectionPredictor";
import { ImprovementSuggestions } from "@/components/analysis/ImprovementSuggestions";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, FileText, AlertCircle, Code, Briefcase, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { extractResumeText } from "@/lib/extractResumeText";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface AnalysisResult {
  compatibilityScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  sectionScores: { name: string; score: number }[];
  riskLevel: "low" | "medium" | "high";
  rejectionProbability: number;
  rejectionReasons: string[];
  suggestions: {
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    action: string;
  }[];
}

const Analyze = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [atsQuick, setAtsQuick] = useState<any | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setAnalysisComplete(false);
    setError(null);

    try {
      const { text } = await extractResumeText(selectedFile);
      setResumeText(text);

      // Request a quick ATS-only analysis immediately for instant feedback
      try {
        const { data: atsData, error: atsError } = await supabase.functions.invoke('ats-score', {
          body: { resumeText: text }
        });
        if (atsError) throw new Error(atsError.message);
        if (atsData && !atsData.error) {
          setAtsQuick(atsData);
        }
      } catch (e) {
        console.warn('ATS quick score failed:', e instanceof Error ? e.message : e);
        setAtsQuick(null);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to extract text from this file";
      setResumeText("");
      setError(msg);
      toast({
        title: "Couldn't read this resume",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleJobDescriptionChange = (description: string, company?: string) => {
    setJobDescription(description);
    setSelectedCompany(company);
    setAnalysisComplete(false);
    setError(null);
  };

  const analyzeResume = async () => {
    if (!resumeText || !jobDescription) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      // Call the Edge function directly so we can consume streaming responses when available.
      const functionsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-resume`;

      console.log("Calling analyze-resume function...");
      console.log("Function URL:", functionsUrl);

      const resp = await fetch(functionsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // include publishable key so Supabase functions accept the request
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''}`
        },
        body: JSON.stringify({ resumeText, jobDescription, companyName: selectedCompany })
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Response error:", resp.status, text);
        throw new Error(text || `Function error: ${resp.status}`);
      }

      const contentType = resp.headers.get('content-type') || '';

      // If server sent an event-stream or text stream, read progressively
      if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
        const reader = resp.body!.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let acc = '';
        setResults(null);
        setAnalysisComplete(false);

        while (!done) {
          const { value, done: d } = await reader.read();
          if (value) {
            acc += decoder.decode(value, { stream: true });
            // Update a streaming preview so user sees progress
            setAtsQuick((prev) => prev); // trigger rerender (no-op) - placeholder
            // Try to parse accumulated text as JSON when it looks complete
            try {
              const trimmed = acc.trim();
              // If the stream contains OpenAI-style 'data: ' frames, strip those
              const cleaned = trimmed.split(/\n(?=data: )/).map(s => s.replace(/^data: ?/, '')).join('\n');
              // Attempt parse of the last JSON-looking chunk
              const last = cleaned.split(/\n\n/).pop()?.trim() || cleaned;
              const maybe = last.startsWith('{') ? last : cleaned;
              const parsed = JSON.parse(maybe);
              setResults(parsed as AnalysisResult);
              setAnalysisComplete(true);
              break;
            } catch (e) {
              // not ready yet - continue reading
            }
          }
          if (d) {
            done = true;
          }
        }

        if (!analysisComplete && acc) {
          // Final attempt to parse
          try {
            const parsed = JSON.parse(acc);
            setResults(parsed as AnalysisResult);
            setAnalysisComplete(true);
          } catch (e) {
            // give up and show raw text as error
            setError('Failed to parse streamed analysis result');
          }
        }
      } else {
        // Non-streaming JSON response
        const data = await resp.json();
        if (data.error) throw new Error(data.error);

        const analysisResult: AnalysisResult = {
          compatibilityScore: data.compatibilityScore,
          matchedKeywords: data.matchedKeywords || [],
          missingKeywords: data.missingKeywords || [],
          sectionScores: data.sectionScores || [],
          riskLevel: data.riskLevel || "medium",
          rejectionProbability: data.rejectionProbability || 50,
          rejectionReasons: data.rejectionReasons || [],
          suggestions: data.suggestions || [],
        };

        setResults(analysisResult);
        setAnalysisComplete(true);
      }

      // Save to database if user is logged in and analysis is complete
      if (user && analysisComplete && results) {
        const { error: saveError } = await supabase.from("analyses").insert({
          user_id: user.id,
          resume_filename: file?.name || "resume.txt",
          resume_text: resumeText,
          job_description: jobDescription,
          company_name: selectedCompany,
          compatibility_score: results.compatibilityScore,
          matched_keywords: results.matchedKeywords,
          missing_keywords: results.missingKeywords,
          section_scores: results.sectionScores,
          risk_level: results.riskLevel,
          rejection_probability: results.rejectionProbability,
          rejection_reasons: results.rejectionReasons,
          suggestions: results.suggestions,
        });

        if (saveError) {
          console.error("Failed to save analysis:", saveError);
        } else {
          toast({
            title: "Analysis Saved",
            description: "Your analysis has been saved to your history.",
          });
        }
      }

    } catch (err) {
      console.error("Analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "Analysis failed";
      setError(`❌ ${errorMessage}\n\nPlease ensure:\n1. Your resume and job description are complete\n2. Server API keys are configured properly\n3. Check browser console for more details`);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = !!resumeText && jobDescription.length > 50;

  // Map suggestions to the expected format with icons
  const mappedSuggestions = results?.suggestions.map((s) => ({
    category: s.category,
    icon: s.category === "Skills" ? Code :
          s.category === "Experience" ? Briefcase :
          s.category === "Projects" ? Award :
          FileText,
    priority: s.priority,
    title: s.title,
    description: s.description,
    action: s.action,
  })) || [];

  return (
    <div className="container py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Resume Analysis</h1>
          <p className="mt-2 text-muted-foreground">
            Upload your resume and paste a job description to get AI-powered compatibility insights.
          </p>
          <div className="mt-6 hidden sm:block">
            <AnimatedLottie src="https://assets10.lottiefiles.com/packages/lf20_touohxv0.json" className="w-full max-w-xl mx-auto" />
          </div>
          {!user && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <AlertCircle className="h-5 w-5 text-primary" />
              <p className="text-sm">
                <Link to="/auth" className="font-medium text-primary hover:underline">Sign in</Link>
                {" "}to save your analysis history and track your progress.
              </p>
            </div>
          )}
        </div>

        {/* Upload & Input Section */}
        {!analysisComplete && (
          <div className="space-y-8 animate-fade-in">
            {/* Step 1: Resume Upload */}
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-sm font-bold text-primary-foreground">
                  1
                </div>
                <h2 className="font-display text-lg font-semibold">Upload Your Resume</h2>
              </div>
              <ResumeUpload onFileSelect={handleFileSelect} />
            </div>

            {/* Step 2: Job Description */}
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-sm font-bold text-primary-foreground">
                  2
                </div>
                <h2 className="font-display text-lg font-semibold">Add Job Description</h2>
              </div>
              <JobDescriptionInput onJobDescriptionChange={handleJobDescriptionChange} />
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Quick ATS-only Score (immediate feedback) */}
            {atsQuick && (
              <div className="rounded-xl border bg-card p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">ATS Quick Score: {atsQuick.atsScore ?? atsQuick.atsScore === 0 ? atsQuick.atsScore : "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Grade: {atsQuick.grade || atsQuick.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{atsQuick.summary || "Instant ATS compatibility analysis"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <Button
              size="xl"
              variant="hero"
              className="w-full gap-2"
              disabled={!canAnalyze || isAnalyzing}
              onClick={analyzeResume}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Analyze Compatibility
                </>
              )}
            </Button>

            {!canAnalyze && (
              <p className="text-center text-sm text-muted-foreground">
                Please upload a resume and add a job description (min. 50 characters) to continue.
              </p>
            )}
          </div>
        )}

        {/* Results Section */}
        {analysisComplete && results && (
          <div className="space-y-8 animate-slide-in-up">
            {/* Analysis Header */}
            <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-card">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{file?.name || "Resume"}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCompany ? `vs ${selectedCompany}` : "Custom Job Description"}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => {
                setAnalysisComplete(false);
                setResults(null);
                setFile(null);
                setResumeText("");
                setJobDescription("");
              }}>
                New Analysis
              </Button>
            </div>

            {/* Compatibility Score */}
            <CompatibilityScore
              score={results.compatibilityScore}
              matchedKeywords={results.matchedKeywords}
              missingKeywords={results.missingKeywords}
              sectionScores={results.sectionScores}
            />

            {/* Rejection Predictor */}
            <RejectionPredictor
              riskLevel={results.riskLevel}
              probability={results.rejectionProbability}
              reasons={results.rejectionReasons}
            />

            {/* Improvement Suggestions */}
            {mappedSuggestions.length > 0 && (
              <ImprovementSuggestions suggestions={mappedSuggestions} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
