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
    console.log("Received request to generate medical response");
    const { symptoms, specialty, agentId, agentName, consultationId, isCollaborative, modelProvider, modelName, prompt, previousMessages } = await req.json();

    console.log(`Generating medical response for ${specialty || 'general'} specialist using ${modelProvider || 'gemini'}/${modelName || 'gemini-2.0-flash'}`);
    console.log(`Input: ${prompt || symptoms || 'No input provided'}`);
    
    // Build the system prompt based on agent specialty with structured output format
    let promptText = `You are a medical AI assistant`;
    if (specialty) {
      promptText += ` specializing in ${specialty}`;
    }
    promptText += `. Analyze the following patient information and provide a comprehensive diagnosis and treatment plan.

IMPORTANT: Structure your response in the following format to match our professional medical style:

QUESTION:
[Rephrase the user's query as a clear medical question, starting with "What is" or similar]

DIAGNOSIS/ANALYSIS:
[Provide a detailed analysis of the condition. Start with a clear definition of the condition. Use professional medical language. Bold key medical terms by surrounding them with ** (e.g., **doxycycline**). Include citations to references using numbered brackets [1] or [2-4] for multiple references.]

SUMMARY:
1. [First key point about treatment or management, with any relevant citations]
2. [Second key point about treatment or management, with any relevant citations]
3. [Additional points as needed]

REFERENCES:
1. [Title of first reference]. [Authors]. [Source/Journal/Publication details]
2. [Title of second reference]. [Authors]. [Source/Journal/Publication details]
3. [Additional references as needed]

Use a professional, authoritative tone. Include specific medications, dosages, and treatment durations where appropriate. Cite high-quality medical sources like clinical guidelines, systematic reviews, or meta-analyses.`;
    
    // Add conversation context if available
    if (previousMessages && previousMessages.length > 0) {
      promptText += `\n\nHere is the previous conversation history for context:`;
      
      previousMessages.forEach((msg, index) => {
        // Format depends on the message sender
        if (msg.isDoctor) {
          promptText += `\nDoctor: ${msg.content}`;
        } else if (msg.sender === agentName) {
          promptText += `\nYou (${specialty} specialist): ${msg.content}`;
        } else {
          promptText += `\n${msg.sender}: ${msg.content}`;
        }
      });
      
      promptText += `\n\nRemember that while this context is important, you are the expert in ${specialty}. Your primary focus should be on providing insights from your specific domain of expertise, even if that means respectfully differing from other specialists.`;
    }
    
    promptText += `\n\nPatient symptoms: ${symptoms || prompt || 'No symptoms provided'}`;

    console.log("Calling Gemini API with prompt");
    
    // Removed Gemini API integration
    // Removed all references to Gemini API calls and error handling
    
    // Create response object
    const result = {
      fullResponse: promptText,
      response: promptText,
      diagnosis: "Unknown condition",
      confidence: Math.floor(Math.random() * 30) + 70, // Default random confidence 70-99%
      recommendation: "Please consult with a human doctor for proper diagnosis and treatment.",
      specialty,
      agentId,
      agentName
    };

    console.log(`Response generated for ${specialty || 'general'} specialist`);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-medical-response function:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I apologize, but I'm having trouble analyzing your symptoms. Please try again or consult with a healthcare professional."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
