import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  // Add other parameters as needed from DeepSeek documentation
}

interface DeepSeekResponseChoice {
  index: number;
  message: {
    role: "assistant";
    content: string;
  };
  finish_reason: string;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: DeepSeekResponseChoice[];
  // Add other fields like usage if needed
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (!DEEPSEEK_API_KEY) {
    console.error("DEEPSEEK_API_KEY is not set in environment variables.");
    return new Response(JSON.stringify({ error: "Server configuration error: Missing API key." }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  let requestPayload: { messages: Message[], model?: string, temperature?: number, max_tokens?: number };
  try {
    requestPayload = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response(JSON.stringify({ error: "Invalid request body. Expected JSON." }), {
      status: 400,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const {
    messages: userMessages, // Renamed to avoid conflict with the modified messages array
    model = "deepseek-chat", // Default model
    temperature = 0.6,      // Adjusted default temperature
    max_tokens = 1024,      // Default max_tokens
  } = requestPayload;

  if (!userMessages || !Array.isArray(userMessages) || userMessages.length === 0) {
    return new Response(JSON.stringify({ error: "Missing or invalid 'messages' in request body." }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Define the new system prompt
  const systemPrompt: Message = {
    role: "system",
    content: "You are Dr. Roo, a friendly, empathetic, and knowledgeable medical information assistant. Your goal is to provide clear, understandable, and supportive information. Please structure your answers with clear points where appropriate. Avoid overly robotic or curt responses. Maintain a conversational and helpful tone throughout."
  };

  // Prepend the system prompt to the conversation history
  const messages: Message[] = [systemPrompt, ...userMessages];

  const deepSeekPayload: DeepSeekRequest = {
    model,
    messages, // Use the modified messages array
    temperature,
    max_tokens,
  };

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deepSeekPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`DeepSeek API error: ${response.status} ${response.statusText}`, errorBody);
      return new Response(JSON.stringify({ 
        error: "Failed to fetch response from AI provider.", 
        provider_status: response.status,
        provider_error: errorBody 
      }), {
        status: response.status, // Proxy the status from DeepSeek
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const data = await response.json() as DeepSeekResponse;

    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      return new Response(JSON.stringify({ aiMessage: data.choices[0].message.content }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", // Also needed for actual response
        },
      });
    } else {
      console.error("Unexpected response structure from DeepSeek API:", data);
      return new Response(JSON.stringify({ error: "Unexpected response structure from AI provider." }), {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (error) {
    console.error("Error calling DeepSeek API or processing response:", error);
    return new Response(JSON.stringify({ error: "Internal server error while contacting AI provider." }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});