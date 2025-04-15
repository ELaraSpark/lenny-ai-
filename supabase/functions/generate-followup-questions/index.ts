
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Hardcoded API key since we can't use the environment variable
const GEMINI_API_KEY = 'AIzaSyBBXVIaqFnVmbT7cjp_f1Ow0sWcHGt9teI';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    console.log("Received request to generate follow-up questions");
    const { condition, specialty, modelProvider, modelName } = await req.json();

    if (!condition) {
      throw new Error("Medical condition is required");
    }

    console.log(`Generating follow-up questions for condition: ${condition}`);
    console.log(`Using model: ${modelProvider || 'gemini'}/${modelName || 'gemini-2.0-flash'}`);
    
    if (specialty) {
      console.log(`With specialty context: ${specialty}`);
    }
    
    // Build the prompt for the Gemini API
    const prompt = `
    You are an AI medical assistant helping to generate appropriate follow-up questions for a patient with the following condition: ${condition}.
    ${specialty ? `The doctor specializes in ${specialty}.` : ''}
    
    Generate 3-5 specific follow-up questions that would be valuable to ask this patient during a scheduled follow-up call.
    The questions should:
    1. Check on their current symptoms and any changes
    2. Assess their adherence to treatment plans
    3. Identify any new issues or side effects
    4. Evaluate their overall progress
    
    Format your response as a JSON array of strings, with each string being a question.
    Example format: ["Question 1?", "Question 2?", "Question 3?"]
    `;

    console.log("Calling Gemini API with prompt");
    // Call Gemini API with the format specified in the curl example
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );
    
    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error("Error response from Gemini API:", errorData);
      throw new Error(`Gemini API error (${geminiResponse.status}): ${errorData}`);
    }

    const geminiData = await geminiResponse.json();
    console.log("Gemini API response received");

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error("No response from Gemini API:", geminiData);
      throw new Error("No response from Gemini API");
    }

    const responseText = geminiData.candidates[0].content.parts[0].text;
    
    // Parse the response to extract the questions
    let questions = [];
    try {
      // Try to parse direct JSON array
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback to extracting questions line by line
        const lines = responseText.split('\n').filter(line => 
          line.trim().match(/^[0-9]+[\.\)]\s.*\?$/) || 
          line.trim().match(/^".*\?"$/) ||
          line.trim().match(/^-\s.*\?$/)
        );
        
        questions = lines.map(line => {
          return line.replace(/^[0-9]+[\.\)]\s/, '')
                     .replace(/^-\s/, '')
                     .replace(/^"/, '')
                     .replace(/"$/, '')
                     .trim();
        });
      }
    } catch (parseError) {
      console.error("Error parsing questions:", parseError);
      // If parsing fails, extract text that looks like questions
      const questionMatches = responseText.match(/(?:"[^"]+\?")|(?:[^\n]+\?)/g);
      if (questionMatches) {
        questions = questionMatches.map(q => q.replace(/^"/, '').replace(/"$/, '').trim());
      }
    }
    
    // Ensure we have at least some questions
    if (questions.length === 0) {
      questions = [
        `How have your ${condition} symptoms changed since your last visit?`,
        "Have you been following the prescribed treatment plan?",
        "Have you experienced any new symptoms or side effects?"
      ];
    }
    
    console.log("Generated questions:", questions);
    
    return new Response(JSON.stringify({ questions }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackQuestions: [
        "How have your symptoms changed since your last visit?",
        "Have you been following the prescribed treatment plan?",
        "Have you experienced any new symptoms or side effects?"
      ] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
