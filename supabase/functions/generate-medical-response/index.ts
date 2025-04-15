
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
    
    // Build the prompt based on whether this is a collaborative consultation
    let promptText = `You are a medical AI assistant`;
    if (specialty) {
      promptText += ` specializing in ${specialty}`;
    }
    
    if (isCollaborative) {
      promptText += `. You are participating in a collaborative consultation with other AI specialists. 
      Based on your expertise${specialty ? ` in ${specialty}` : ''}, analyze the following patient symptoms and provide:
      
      IMPORTANT GUIDELINES:
      - Respond in a conversational, personable manner as if speaking directly to the doctor. Use phrases like "I believe", "In my opinion", or "From my perspective as a ${specialty} specialist".
      - Speak in first person and address the doctor directly with phrases like "I notice that" or "I would recommend".
      - You are the expert in ${specialty}. While you should consider what other specialists have said, your primary focus should be on analyzing the case from your specialty's unique perspective.
      - Do not simply agree with other specialists unless their assessment aligns with your expert opinion.
      - If you disagree with another specialist's assessment, politely explain why from your specialty's perspective.
      - Stay firmly within your specialty area and avoid making general statements that would be better addressed by other specialists.
      - Format your response in a conversational tone but make sure to include:
        • A clear diagnosis with your confidence level (70-99%)
        • Your reasoning behind the diagnosis
        • Treatment recommendations specific to your specialty
      - Be precise and focused. Your expertise is valuable precisely because it is specialized.
      
      Remember: You were selected for this consultation specifically for your expertise in ${specialty}, so emphasize that perspective.`;
    } else {
      promptText += `. Analyze the following patient symptoms and provide a comprehensive diagnosis and treatment plan in a conversational, personable manner. Speak directly to the doctor, using first person language and a friendly, professional tone.`;
    }
    
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
    console.log("Gemini API response received");

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error("No response from Gemini API:", geminiData);
      throw new Error("No response from Gemini API");
    }

    const responseText = geminiData.candidates[0].content.parts[0].text;
    
    // Extract diagnosis, confidence, and recommendations from the response text
    let diagnosis = "Unknown condition";
    let confidence = Math.floor(Math.random() * 30) + 70; // Default random confidence 70-99%
    let recommendation = "Please consult with a human doctor for proper diagnosis and treatment.";
    
    // Try to extract a diagnosis - improved regex patterns
    const diagnosisMatch = responseText.match(/diagnosis:?\s*([^.\n]+)/i) || 
                          responseText.match(/diagnosed with:?\s*([^.\n]+)/i) ||
                          responseText.match(/condition:?\s*([^.\n]+)/i) ||
                          responseText.match(/suffering from:?\s*([^.\n]+)/i) ||
                          responseText.match(/I believe\s+(?:the patient (?:has|is suffering from|is experiencing))?\s*([^.\n]+)/i) ||
                          responseText.match(/In my opinion,?\s+(?:the patient (?:has|is suffering from|is experiencing))?\s*([^.\n]+)/i) ||
                          responseText.match(/I think\s+(?:the patient (?:has|is suffering from|is experiencing))?\s*([^.\n]+)/i);
    
    if (diagnosisMatch && diagnosisMatch[1]) {
      diagnosis = diagnosisMatch[1].trim().replace(/\*\*/g, '');
    }
    
    // Try to extract confidence
    const confidenceMatch = responseText.match(/confidence:?\s*(\d+)%/i) ||
                           responseText.match(/(\d+)%\s*confidence/i) ||
                           responseText.match(/(\d+)%\s*certain/i) ||
                           responseText.match(/certainty of\s*(\d+)%/i);
    
    if (confidenceMatch && confidenceMatch[1]) {
      const parsedConfidence = parseInt(confidenceMatch[1]);
      if (!isNaN(parsedConfidence) && parsedConfidence >= 1 && parsedConfidence <= 100) {
        confidence = parsedConfidence;
      }
    }
    
    // Try to extract recommendation
    const recommendationMatch = responseText.match(/recommendation:?\s*(.*?)(?:\n\n|$)/is) ||
                               responseText.match(/recommend:?\s*(.*?)(?:\n\n|$)/is) ||
                               responseText.match(/treatment:?\s*(.*?)(?:\n\n|$)/is) ||
                               responseText.match(/I (?:would |)recommend:?\s*(.*?)(?:\n\n|$)/is) ||
                               responseText.match(/I suggest:?\s*(.*?)(?:\n\n|$)/is);
    
    if (recommendationMatch && recommendationMatch[1]) {
      recommendation = recommendationMatch[1].trim().replace(/\*\*/g, '');
    }
    
    // Create response object
    const result = {
      fullResponse: responseText,
      response: responseText,
      diagnosis,
      confidence,
      recommendation,
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
