
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
    console.log("Received request to generate consultation verdict");
    const { diagnoses, messages, symptoms } = await req.json();

    console.log(`Generating verdict based on ${diagnoses.length} diagnoses and ${messages.length} messages`);
    
    // Build the prompt
    let promptText = `You are a medical AI assistant tasked with synthesizing multiple expert opinions into a coherent verdict.
    
    PATIENT SYMPTOMS: ${symptoms}
    
    SPECIALIST OPINIONS:`;
    
    // Add specialist diagnoses, grouped by specialist to avoid counting duplicate opinions
    const specialistOpinions = {};
    diagnoses.forEach(diagnosis => {
      if (!specialistOpinions[diagnosis.agentId]) {
        specialistOpinions[diagnosis.agentId] = [];
      }
      specialistOpinions[diagnosis.agentId].push(diagnosis);
    });
    
    // For each specialist, add their most recent diagnosis
    Object.keys(specialistOpinions).forEach(specialistId => {
      const specialistDiagnoses = specialistOpinions[specialistId];
      // Sort by timestamp (if available) or assume last item is most recent
      const latestDiagnosis = specialistDiagnoses[specialistDiagnoses.length - 1];
      
      promptText += `\n\n${latestDiagnosis.agentName} (${latestDiagnosis.specialty}):
      - Diagnosis: ${latestDiagnosis.diagnosis}
      - Confidence: ${latestDiagnosis.confidence}%
      - Recommendation: ${latestDiagnosis.recommendation}`;
    });
    
    // Add conversation snippets for context
    promptText += "\n\nRELEVANT CONVERSATION SNIPPETS:";
    
    // Only include last 10 messages for context, filtering out system messages
    const relevantMessages = messages
      .filter(m => m.senderId !== "system" && m.senderId !== "doctor")
      .slice(-10);
      
    relevantMessages.forEach(message => {
      promptText += `\n\n${message.sender} (${message.senderId}): "${message.content}"`;
    });
    
    promptText += `\n\nBased on the above information, please provide:
    
    1. CONSENSUS DIAGNOSIS: Determine the most likely diagnosis based on the specialists' input. Include confidence level.
    2. AGREEMENT ANALYSIS: Explain the level of agreement between specialists, noting any significant disagreements.
    3. INTEGRATED RECOMMENDATIONS: Synthesize the recommendations from different specialists into a cohesive treatment plan.
    4. NEXT STEPS: Suggest any additional tests, specialist consultations, or monitoring that would be appropriate.
    
    Format your response as a structured medical report with clear sections for each of the above. Use professional medical language but make it accessible to doctors from any specialty.`;

    console.log("Calling Gemini API with prompt for verdict generation");
    
    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptText }]
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
    console.log("Gemini API response received for verdict");

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error("No response from Gemini API:", geminiData);
      throw new Error("No response from Gemini API");
    }

    const verdictText = geminiData.candidates[0].content.parts[0].text;
    
    // Parse the verdict sections
    const consensusMatch = verdictText.match(/CONSENSUS DIAGNOSIS:?\s*([\s\S]*?)(?=AGREEMENT ANALYSIS:|$)/i);
    const agreementMatch = verdictText.match(/AGREEMENT ANALYSIS:?\s*([\s\S]*?)(?=INTEGRATED RECOMMENDATIONS:|$)/i);
    const recommendationsMatch = verdictText.match(/INTEGRATED RECOMMENDATIONS:?\s*([\s\S]*?)(?=NEXT STEPS:|$)/i);
    const nextStepsMatch = verdictText.match(/NEXT STEPS:?\s*([\s\S]*?)(?=$)/i);
    
    const verdict = {
      fullText: verdictText,
      consensusDiagnosis: consensusMatch ? consensusMatch[1].trim() : "No consensus reached",
      agreementAnalysis: agreementMatch ? agreementMatch[1].trim() : "No agreement analysis available",
      recommendations: recommendationsMatch ? recommendationsMatch[1].trim() : "No recommendations provided",
      nextSteps: nextStepsMatch ? nextStepsMatch[1].trim() : "No next steps provided",
      timestamp: new Date().toISOString(),
    };
    
    console.log("Verdict generated successfully");
    
    return new Response(JSON.stringify(verdict), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-consultation-verdict function:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      fullText: "Unable to generate a comprehensive verdict at this time.",
      consensusDiagnosis: "Error in verdict generation",
      agreementAnalysis: "",
      recommendations: "Please review individual specialist recommendations.",
      nextSteps: "Consult with a healthcare professional."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
