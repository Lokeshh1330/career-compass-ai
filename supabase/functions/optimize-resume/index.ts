import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, analysisResult } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
    
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Starting resume optimization...");

    const systemPrompt = `You are an expert ATS resume optimizer. Your task is to transform the given resume into a highly ATS-optimized version that will score 90+ on ATS systems.

CRITICAL RULES FOR ATS OPTIMIZATION:
1. Use standard section headings: "CONTACT INFORMATION", "PROFESSIONAL SUMMARY", "WORK EXPERIENCE", "EDUCATION", "SKILLS", "CERTIFICATIONS", "PROJECTS"
2. Use simple bullet points (• or -)
3. Include strong action verbs at the start of each bullet
4. Add quantifiable achievements where possible
5. Use industry-standard keywords
6. Keep formatting simple - no tables, columns, or graphics
7. Spell out acronyms at least once
8. Include relevant keywords naturally
9. Use consistent date formatting (Month Year - Month Year)
10. Keep it clean and scannable

${analysisResult ? `Based on the analysis, focus on fixing these issues:
- Missing elements: ${JSON.stringify(analysisResult.missingElements || [])}
- Formatting issues: ${JSON.stringify(analysisResult.formattingIssues || [])}
- Improvement tips: ${JSON.stringify(analysisResult.improvementTips?.map((t: any) => t.tip) || [])}` : ''}

Return ONLY a JSON object with this exact structure:
{
  "optimizedResume": {
    "contactInfo": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "linkedin": "string (optional)"
    },
    "professionalSummary": "string (2-3 sentences)",
    "workExperience": [
      {
        "title": "string",
        "company": "string",
        "location": "string",
        "startDate": "string",
        "endDate": "string",
        "bullets": ["string", "string", ...]
      }
    ],
    "education": [
      {
        "degree": "string",
        "school": "string",
        "location": "string",
        "graduationDate": "string",
        "gpa": "string (optional)",
        "relevantCourses": "string (optional)"
      }
    ],
    "skills": {
      "technical": ["string", ...],
      "soft": ["string", ...],
      "tools": ["string", ...]
    },
    "certifications": ["string", ...],
    "projects": [
      {
        "name": "string",
        "description": "string",
        "technologies": ["string", ...]
      }
    ]
  },
  "improvements": ["string - what was improved", ...],
  "estimatedNewScore": number (85-98)
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Transform this resume into an ATS-optimized version:\n\n${resumeText}` }
        ],
        temperature: 0.4,
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
        JSON.stringify({ error: "AI optimization failed" }),
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

    console.log("AI Response received, parsing optimization result...");

    let optimizationResult;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonString = jsonMatch[1].trim();
      optimizationResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse optimization response:", parseError);
      console.log("Raw content:", content);
      
      return new Response(
        JSON.stringify({ error: "Failed to parse optimized resume" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Resume optimization complete, estimated new score:", optimizationResult.estimatedNewScore);

    return new Response(
      JSON.stringify(optimizationResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Optimize Resume function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
