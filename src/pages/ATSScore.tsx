import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  X,
  Download,
  BarChart,
  Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from "jspdf";
import { extractResumeText, type ResumeExtractMeta } from "@/lib/extractResumeText";

interface ATSResult {
  atsScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  formatAnalysis: {
    score: number;
    issues: string[];
    strengths: string[];
  };
  contentAnalysis: {
    score: number;
    keywordDensity: "low" | "medium" | "high";
    actionVerbs: number;
    quantifiableAchievements: number;
  };
  sectionScores: { name: string; score: number; feedback: string }[];
  detectedKeywords: {
    technical: string[];
    soft: string[];
    tools: string[];
    certifications: string[];
  };
  missingElements: string[];
  formattingIssues: string[];
  improvementTips: { priority: "high" | "medium" | "low"; tip: string; impact: string }[];
  summary: string;
}

interface OptimizedResume {
  optimizedResume: {
    contactInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      linkedin?: string;
    };
    professionalSummary: string;
    workExperience: {
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      bullets: string[];
    }[];
    education: {
      degree: string;
      school: string;
      location: string;
      graduationDate: string;
      gpa?: string;
      relevantCourses?: string;
    }[];
    skills: {
      technical: string[];
      soft: string[];
      tools: string[];
    };
    certifications: string[];
    projects: {
      name: string;
      description: string;
      technologies: string[];
    }[];
  };
  improvements: string[];
  estimatedNewScore: number;
}

const gradeConfig = {
  A: { color: "text-success", bgColor: "bg-success/10", label: "Excellent" },
  B: { color: "text-primary", bgColor: "bg-primary/10", label: "Good" },
  C: { color: "text-warning", bgColor: "bg-warning/10", label: "Average" },
  D: { color: "text-warning", bgColor: "bg-warning/10", label: "Below Average" },
  F: { color: "text-destructive", bgColor: "bg-destructive/10", label: "Needs Work" },
};

const ATSScore = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [extractionMeta, setExtractionMeta] = useState<ResumeExtractMeta | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<ATSResult | null>(null);
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setResults(null);
    setOptimizedResume(null);
    setError(null);
    setExtractionMeta(null);

    try {
      const { text, meta } = await extractResumeText(selectedFile);
      setResumeText(text);
      setExtractionMeta(meta);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || 
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        droppedFile.type === "text/plain")) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const analyzeATS = async () => {
    if (!resumeText) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ats-score", {
        body: { resumeText }
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      setResults(data);
      toast({
        title: "Analysis Complete",
        description: `Your ATS Score: ${data.atsScore}/100`,
      });

    } catch (err) {
      console.error("ATS analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "Analysis failed";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const optimizeResume = async () => {
    if (!resumeText || !results) return;
    
    setIsOptimizing(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("optimize-resume", {
        body: { resumeText, analysisResult: results }
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);

      setOptimizedResume(data);
      toast({
        title: "Resume Optimized!",
        description: `Estimated new score: ${data.estimatedNewScore}/100`,
      });

    } catch (err) {
      console.error("Optimization error:", err);
      toast({
        title: "Optimization Failed",
        description: err instanceof Error ? err.message : "Failed to optimize resume",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const generatePDF = () => {
    if (!optimizedResume) return;

    const { optimizedResume: resume } = optimizedResume;
    const doc = new jsPDF();
    
    let yPos = 20;
    const leftMargin = 20;
    const pageWidth = 170;
    const lineHeight = 6;

    // Helper to add text with word wrap
    const addWrappedText = (text: string, fontSize: number, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, pageWidth);
      lines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, leftMargin, yPos);
        yPos += lineHeight;
      });
    };

    const addSectionHeader = (title: string) => {
      yPos += 4;
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setDrawColor(50, 50, 50);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yPos, leftMargin + pageWidth, yPos);
      yPos += 6;
      addWrappedText(title.toUpperCase(), 12, true);
      yPos += 2;
    };

    // Contact Information
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(resume.contactInfo.name || "Your Name", leftMargin, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const contactLine = [
      resume.contactInfo.email,
      resume.contactInfo.phone,
      resume.contactInfo.location
    ].filter(Boolean).join(" | ");
    doc.text(contactLine, leftMargin, yPos);
    yPos += 5;
    
    if (resume.contactInfo.linkedin) {
      doc.text(resume.contactInfo.linkedin, leftMargin, yPos);
      yPos += 5;
    }

    // Professional Summary
    if (resume.professionalSummary) {
      addSectionHeader("Professional Summary");
      addWrappedText(resume.professionalSummary, 10);
    }

    // Work Experience
    if (resume.workExperience?.length > 0) {
      addSectionHeader("Work Experience");
      resume.workExperience.forEach((exp) => {
        addWrappedText(`${exp.title} | ${exp.company}`, 11, true);
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.text(`${exp.location} | ${exp.startDate} - ${exp.endDate}`, leftMargin, yPos);
        yPos += lineHeight;
        
        exp.bullets?.forEach((bullet) => {
          addWrappedText(`• ${bullet}`, 10);
        });
        yPos += 3;
      });
    }

    // Education
    if (resume.education?.length > 0) {
      addSectionHeader("Education");
      resume.education.forEach((edu) => {
        addWrappedText(edu.degree, 11, true);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`${edu.school} | ${edu.location} | ${edu.graduationDate}`, leftMargin, yPos);
        yPos += lineHeight;
        if (edu.gpa) {
          doc.text(`GPA: ${edu.gpa}`, leftMargin, yPos);
          yPos += lineHeight;
        }
        yPos += 2;
      });
    }

    // Skills
    if (resume.skills) {
      addSectionHeader("Skills");
      if (resume.skills.technical?.length > 0) {
        addWrappedText(`Technical: ${resume.skills.technical.join(", ")}`, 10);
      }
      if (resume.skills.tools?.length > 0) {
        addWrappedText(`Tools: ${resume.skills.tools.join(", ")}`, 10);
      }
      if (resume.skills.soft?.length > 0) {
        addWrappedText(`Soft Skills: ${resume.skills.soft.join(", ")}`, 10);
      }
    }

    // Certifications
    if (resume.certifications?.length > 0) {
      addSectionHeader("Certifications");
      resume.certifications.forEach((cert) => {
        addWrappedText(`• ${cert}`, 10);
      });
    }

    // Projects
    if (resume.projects?.length > 0) {
      addSectionHeader("Projects");
      resume.projects.forEach((proj) => {
        addWrappedText(proj.name, 11, true);
        addWrappedText(proj.description, 10);
        if (proj.technologies?.length > 0) {
          doc.setFontSize(9);
          doc.setFont("helvetica", "italic");
          doc.text(`Technologies: ${proj.technologies.join(", ")}`, leftMargin, yPos);
          yPos += lineHeight + 2;
        }
      });
    }

    // Save the PDF
    doc.save("ATS-Optimized-Resume.pdf");
    
    toast({
      title: "PDF Downloaded!",
      description: "Your ATS-optimized resume has been saved.",
    });
  };

  const resetAnalysis = () => {
    setFile(null);
    setResumeText("");
    setExtractionMeta(null);
    setResults(null);
    setOptimizedResume(null);
    setError(null);
  };

  const gradeInfo = results ? gradeConfig[results.grade] : null;

  return (
    <div className="container py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
            <Target className="h-4 w-4" />
            ATS Score Analyzer
          </div>
          <h1 className="font-display text-4xl font-bold">
            Check Your Resume&apos;s <span className="text-gradient">ATS Compatibility</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your resume to get an instant ATS score. We&apos;ll analyze it and create an optimized version for you to download.
          </p>
        </div>

        {/* Upload Section */}
        {!results && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl border-2 border-dashed bg-card p-8 shadow-card">
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-xl p-12 transition-all cursor-pointer",
                  isDragging ? "bg-primary/10 border-primary" : "hover:bg-muted/50",
                  file && "bg-success/5"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("ats-file-input")?.click()}
              >
                <input
                  id="ats-file-input"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileInput}
                />
                
                {file ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                    <p className="font-semibold text-lg">{file.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    {extractionMeta && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Extracted {extractionMeta.wordCount.toLocaleString()} words
                      </p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetAnalysis();
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-semibold text-lg">Drop your resume here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse (PDF, DOCX, TXT)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-center gap-3">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              size="xl"
              variant="hero"
              className="w-full gap-2"
              disabled={!file || !resumeText || isAnalyzing}
              onClick={analyzeATS}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Check ATS Score
                </>
              )}
            </Button>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-6 animate-slide-in-up">
            {/* Main Score Card */}
            <div className="rounded-2xl border bg-card p-8 shadow-card">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <ScoreRing score={results.atsScore} size="xl" showLabel label="ATS Score" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                    <h2 className="font-display text-2xl font-bold">Your ATS Score</h2>
                    <span className={cn(
                      "rounded-full px-4 py-1 text-sm font-bold",
                      gradeInfo?.bgColor,
                      gradeInfo?.color
                    )}>
                      Grade: {results.grade} - {gradeInfo?.label}
                    </span>
                  </div>
                  <p className="mt-3 text-muted-foreground">{results.summary}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button variant="outline" onClick={resetAnalysis}>
                      Analyze Another
                    </Button>
                    {!optimizedResume && (
                      <Button 
                        variant="gradient" 
                        className="gap-2"
                        onClick={optimizeResume}
                        disabled={isOptimizing}
                      >
                        {isOptimizing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Optimizing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4" />
                            Optimize & Get PDF
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Optimized Resume Card */}
            {optimizedResume && (
              <div className="rounded-2xl border-2 border-success/30 bg-success/5 p-6 shadow-card animate-fade-in">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <ScoreRing score={optimizedResume.estimatedNewScore} size="lg" showLabel label="New Score" />
                      <div className="absolute -top-2 -right-2 rounded-full bg-success px-2 py-1 text-xs font-bold text-success-foreground">
                        +{optimizedResume.estimatedNewScore - results.atsScore}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-display text-xl font-bold text-success">Resume Optimized!</h3>
                    <p className="text-muted-foreground mt-1">
                      Your resume has been transformed for maximum ATS compatibility.
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Improvements made:</p>
                      <div className="flex flex-wrap gap-2">
                        {optimizedResume.improvements.slice(0, 4).map((imp, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-success/10 text-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {imp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="mt-4 gap-2"
                      onClick={generatePDF}
                    >
                      <Download className="h-5 w-5" />
                      Download ATS-Optimized PDF
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Section Scores */}
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold">Section Analysis</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {results.sectionScores.map((section, idx) => (
                  <div key={idx} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{section.name}</span>
                      <span className={cn(
                        "font-bold",
                        section.score >= 80 ? "text-success" :
                        section.score >= 60 ? "text-primary" :
                        section.score >= 40 ? "text-warning" : "text-destructive"
                      )}>
                        {section.score}%
                      </span>
                    </div>
                    <Progress value={section.score} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">{section.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detected Keywords */}
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <Zap className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-display text-xl font-bold">Detected Keywords</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {results.detectedKeywords.technical.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.detectedKeywords.technical.map((kw, idx) => (
                        <Badge key={idx} variant="secondary">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {results.detectedKeywords.soft.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Soft Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.detectedKeywords.soft.map((kw, idx) => (
                        <Badge key={idx} variant="outline">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {results.detectedKeywords.tools.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.detectedKeywords.tools.map((kw, idx) => (
                        <Badge key={idx} className="bg-primary/10 text-primary border-primary/20">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {results.detectedKeywords.certifications.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.detectedKeywords.certifications.map((kw, idx) => (
                        <Badge key={idx} className="bg-success/10 text-success border-success/20">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Issues & Missing Elements */}
            <div className="grid gap-6 md:grid-cols-2">
              {results.formattingIssues.length > 0 && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold">Formatting Issues</h3>
                  </div>
                  <ul className="space-y-2">
                    {results.formattingIssues.map((issue, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.missingElements.length > 0 && (
                <div className="rounded-2xl border border-warning/20 bg-warning/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <h3 className="font-semibold">Missing Elements</h3>
                  </div>
                  <ul className="space-y-2">
                    {results.missingElements.map((element, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-warning mt-1">•</span>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Improvement Tips */}
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold">Improvement Tips</h3>
              </div>
              <div className="space-y-4">
                {results.improvementTips.map((tip, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "rounded-lg border p-4",
                      tip.priority === "high" ? "border-destructive/30 bg-destructive/5" :
                      tip.priority === "medium" ? "border-warning/30 bg-warning/5" :
                      "border-muted"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={
                        tip.priority === "high" ? "destructive" :
                        tip.priority === "medium" ? "default" : "secondary"
                      }>
                        {tip.priority} priority
                      </Badge>
                    </div>
                    <p className="font-medium">{tip.tip}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Impact:</strong> {tip.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSScore;
