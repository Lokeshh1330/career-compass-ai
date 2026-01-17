import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Starting ATS score analysis...");

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Your job is to analyze resumes purely for ATS compatibility - how well the resume will be parsed and scored by automated systems, regardless of any specific job description.

Analyze the resume for:
1. **ATS Score (0-100)**: Overall score based on formatting, keyword density, structure, and readability by ATS systems.

2. **Format Analysis**:
   - File format compatibility
   - Header/section structure clarity
   - Use of standard section headings
   - Bullet point formatting
   - Font and styling compatibility (based on text patterns)

3. **Content Analysis**:
   - Keyword optimization level
   - Action verb usage
   - Quantifiable achievements
   - Skills section completeness
   - Contact information presence

4. **Section Scores** (0-100 each):
   - Contact Information
   - Professional Summary
   - Work Experience
   - Education
   - Skills
   - Overall Structure

5. **Detected Keywords**: Technical skills, soft skills, tools, certifications found

6. **Missing Elements**: Common ATS-friendly elements that are missing

7. **Formatting Issues**: Specific problems that could cause ATS parsing errors

8. **Improvement Tips**: Actionable recommendations to improve ATS score

Respond with a JSON object in this exact format:
{
  "atsScore": number (0-100),
  "grade": "A" | "B" | "C" | "D" | "F",
  "formatAnalysis": {
    "score": number,
    "issues": string[],
    "strengths": string[]
  },
  "contentAnalysis": {
    "score": number,
    "keywordDensity": "low" | "medium" | "high",
    "actionVerbs": number,
    "quantifiableAchievements": number
  },
  "sectionScores": [
    { "name": string, "score": number, "feedback": string }
  ],
  "detectedKeywords": {
    "technical": string[],
    "soft": string[],
    "tools": string[],
    "certifications": string[]
  },
  "missingElements": string[],
  "formattingIssues": string[],
  "improvementTips": [
    { "priority": "high" | "medium" | "low", "tip": string, "impact": string }
  ],
  "summary": string
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this resume for ATS compatibility:\n\n${resumeText}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Empty AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI Response received, parsing...");

    // Parse the JSON response
    let analysisResult;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonString = jsonMatch[1].trim();
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Raw content:", content);
      
      // Return a default structure if parsing fails
      analysisResult = {
        atsScore: 65,
        grade: "C",
        formatAnalysis: { score: 60, issues: ["Unable to fully parse resume format"], strengths: [] },
        contentAnalysis: { score: 65, keywordDensity: "medium", actionVerbs: 5, quantifiableAchievements: 2 },
        sectionScores: [
          { name: "Overall Structure", score: 65, feedback: "Resume structure could be improved" }
        ],
        detectedKeywords: { technical: [], soft: [], tools: [], certifications: [] },
        missingElements: ["Detailed analysis unavailable"],
        formattingIssues: [],
        improvementTips: [{ priority: "high", tip: "Upload a clearer resume format", impact: "Better analysis results" }],
        summary: "Please upload your resume as a plain text file for more accurate ATS analysis."
      };
    }

    console.log("ATS analysis complete, score:", analysisResult.atsScore);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("ATS Score function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
