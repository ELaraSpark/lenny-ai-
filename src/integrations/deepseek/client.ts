// DeepSeek API client for Leny AI app
// This file handles communication with the DeepSeek API

// Types for DeepSeek API requests and responses
export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | DeepSeekContent[];
}

export interface DeepSeekContent {
  type: 'text' | 'image';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface DeepSeekRequestOptions {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface DeepSeekResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: {
    index: number;
    message: DeepSeekMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Default model to use
export const DEFAULT_MODEL = 'deepseek-chat';

// Environment variables
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Validates if the DeepSeek API key is configured
 */
export const isDeepSeekConfigured = (): boolean => {
  return !!DEEPSEEK_API_KEY;
};

/**
 * Generates a response from the DeepSeek API
 * @param options Request options
 * @returns Promise with the DeepSeek response
 */
export const generateDeepSeekResponse = async (
  options: DeepSeekRequestOptions
): Promise<DeepSeekResponse> => {
  if (!isDeepSeekConfigured()) {
    throw new Error('DeepSeek API key is not configured');
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: options.model || DEFAULT_MODEL,
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 2048,
        stream: options.stream || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API error:', errorData);
      throw new Error(`DeepSeek API error (${response.status}): ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
};

/**
 * Converts a file to a base64 data URL
 * @param file The file to convert
 * @returns Promise with the base64 data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a message with text and optional image attachments
 * @param text The text content
 * @param attachments Optional file attachments
 * @returns Promise with the DeepSeek message
 */
export const createMessageWithAttachments = async (
  text: string,
  attachments?: File[]
): Promise<DeepSeekMessage> => {
  // If no attachments, return a simple text message
  if (!attachments || attachments.length === 0) {
    return {
      role: 'user',
      content: text,
    };
  }

  // Create a multimodal message with text and images
  const content: DeepSeekContent[] = [];

  // Add text content if provided
  if (text) {
    content.push({
      type: 'text',
      text,
    });
  }

  // Process attachments
  for (const file of attachments) {
    // Only process image files for now
    if (file.type.startsWith('image/')) {
      const dataUrl = await fileToDataUrl(file);
      content.push({
        type: 'image',
        image_url: {
          url: dataUrl,
        },
      });
    } else {
      console.warn(`Unsupported file type: ${file.type}`);
      // For non-image files, we could extract text or handle differently
    }
  }

  return {
    role: 'user',
    content,
  };
};
