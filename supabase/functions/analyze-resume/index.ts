import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription, companyName } = await req.json();
    
    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Resume text and job description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const OPENAI_MODEL = Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini';

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      throw new Error('AI service is not configured');
    }

    console.log('Starting resume analysis...');
    console.log('Resume length:', resumeText.length);
    console.log('Job description length:', jobDescription.length);

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and career counselor. 
Your task is to analyze a resume against a job description and provide detailed compatibility analysis.

You MUST respond with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "compatibilityScore": <number 0-100>,
  "matchedKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "sectionScores": [
    {"name": "Skills Match", "score": <number 0-100>},
    {"name": "Experience Relevance", "score": <number 0-100>},
    {"name": "Education", "score": <number 0-100>},
    {"name": "Projects", "score": <number 0-100>},
    {"name": "Keywords Density", "score": <number 0-100>}
  ],
  "riskLevel": "<low|medium|high>",
  "rejectionProbability": <number 0-100>,
  "rejectionReasons": ["reason1", "reason2", ...],
  "suggestions": [
    {
      "category": "Skills|Experience|Projects|Format",
      "priority": "high|medium|low",
      "title": "suggestion title",
      "description": "detailed description",
      "action": "specific action to take"
    }
  ]
}

Analysis Guidelines:
1. Extract and compare technical skills, tools, and technologies
2. Evaluate experience relevance and years of experience match
3. Check for industry-specific keywords and terminology
4. Assess project relevance to the job requirements
5. Consider formatting and ATS-friendliness
6. Identify skill gaps and missing qualifications
7. Provide actionable improvement suggestions

Be thorough but realistic in your scoring. A perfect match is rare.`;

    const userPrompt = `Analyze this resume against the job description${companyName ? ` for ${companyName}` : ''}.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide a comprehensive ATS compatibility analysis as a JSON object.`;

    // If OPENAI_API_KEY is provided, attempt streaming response back to the client
    if (OPENAI_API_KEY) {
      console.log('Using OpenAI streaming path');

      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: true,
        }),
      });

      if (!openaiRes.ok) {
        const errText = await openaiRes.text();
        console.error('OpenAI error:', openaiRes.status, errText);
        throw new Error(`OpenAI error: ${openaiRes.status}`);
      }

      const encoder = new TextEncoder();
      const reader = openaiRes.body!.getReader();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              // Forward chunks as SSE-style "data: ...\n\n" so client can parse safely
              const chunk = typeof value === 'string' ? value : new TextDecoder().decode(value);
              // Many OpenAI streams already contain 'data: ' prefixes; forward raw
              controller.enqueue(encoder.encode(chunk));
            }
          } catch (streamErr) {
            console.error('Error streaming from OpenAI:', streamErr);
            controller.error(streamErr);
          } finally {
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
      });
    }

    // Fallback to Lovable gateway (non-streaming)
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response - handle potential markdown code blocks
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      let jsonContent = content.trim();
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.slice(7);
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.slice(3);
      }
      if (jsonContent.endsWith('```')) {
        jsonContent = jsonContent.slice(0, -3);
      }
      jsonContent = jsonContent.trim();
      
      analysisResult = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse analysis result');
    }

    console.log('Analysis complete, score:', analysisResult.compatibilityScore);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
