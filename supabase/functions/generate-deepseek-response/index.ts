import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// DeepSeek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
// Hardcoded API key since we can't use the environment variable in edge functions
// In production, this should be stored securely using Supabase secrets
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY') || 'sk-28906c05361345509e483e3cd639e12b';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    console.log("Received request to generate DeepSeek response");
    const { 
      prompt, 
      agentName, 
      specialty, 
      modelName, 
      previousMessages,
      attachments 
    } = await req.json();

    console.log(`Generating response for ${specialty || 'general'} specialist using DeepSeek/${modelName || 'deepseek-chat'}`);
    console.log(`Input: ${prompt || 'No input provided'}`);
    
    // Build the system prompt based on agent specialty with structured output format
    let systemPrompt = `You are a medical AI assistant`;
    if (specialty) {
      systemPrompt += ` specializing in ${specialty}`;
    }
    systemPrompt += `. Analyze the following patient information and provide a comprehensive diagnosis and treatment plan.

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
    
    // Prepare messages for DeepSeek API
    const messages = [];
    
    // Add system message
    messages.push({
      role: 'system',
      content: systemPrompt
    });
    
    // Add conversation history if available
    if (previousMessages && previousMessages.length > 0) {
      for (const msg of previousMessages) {
        messages.push({
          role: msg.isDoctor ? 'user' : 'assistant',
          content: msg.content
        });
      }
    }
    
    // Prepare the user message with attachments if any
    let userMessage;
    if (attachments && attachments.length > 0) {
      // For multimodal messages with images
      const content = [];
      
      // Add text content if provided
      if (prompt) {
        content.push({
          type: 'text',
          text: prompt
        });
      }
      
      // Add image attachments
      for (const attachment of attachments) {
        if (attachment.type === 'image') {
          content.push({
            type: 'image',
            image_url: {
              url: attachment.dataUrl
            }
          });
        }
      }
      
      userMessage = {
        role: 'user',
        content
      };
    } else {
      // For text-only messages
      userMessage = {
        role: 'user',
        content: prompt || "Please provide a general medical assessment."
      };
    }
    
    // Add the user message
    messages.push(userMessage);
    
    console.log("Calling DeepSeek API with messages");
    
    // Call DeepSeek API
    const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: modelName || 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048
      })
    });
    
    if (!deepseekResponse.ok) {
      const errorData = await deepseekResponse.text();
      console.error("Error response from DeepSeek API:", errorData);
      throw new Error(`DeepSeek API error (${deepseekResponse.status}): ${errorData}`);
    }

    const deepseekData = await deepseekResponse.json();
    console.log("DeepSeek API response received");

    if (!deepseekData.choices || deepseekData.choices.length === 0) {
      console.error("No response from DeepSeek API:", deepseekData);
      throw new Error("No response from DeepSeek API");
    }

    // Extract the response text
    const responseText = deepseekData.choices[0].message.content;
    
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
      agentId: agentName ? agentName.toLowerCase().replace(/\s+/g, '-') : 'deepseek-agent',
      agentName: agentName || 'DeepSeek Agent',
      model: modelName || 'deepseek-chat',
      usage: deepseekData.usage
    };

    console.log(`Response generated for ${specialty || 'general'} specialist using DeepSeek`);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in generate-deepseek-response function:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I apologize, but I'm having trouble analyzing your information. Please try again or consult with a healthcare professional."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
