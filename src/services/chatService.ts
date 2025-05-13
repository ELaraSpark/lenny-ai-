import { supabase } from '../integrations/supabase/client'; // Adjusted path
import { PostgrestError } from '@supabase/supabase-js';

// Data Types
export interface ChatSession {
  id: string;
  user_id: string; // Supabase typically uses snake_case for columns
  title: string;
  created_at: string; // Supabase timestamps are strings
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string; // Supabase typically uses snake_case for columns
  sender: 'user' | 'ai';
  text: string;
  timestamp: string; // Supabase timestamps are strings
}

/**
 * Fetches all chat sessions for a given userId.
 * Orders them by updated_at descending.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of chat sessions.
 */
export const getChatSessions = async (userId: string): Promise<ChatSession[]> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching chat sessions:', error);
    throw error;
  }
  return (data as unknown as ChatSession[]) || [];
};

/**
 * Fetches a single chat session by its id.
 * @param sessionId - The ID of the chat session.
 * @returns A promise that resolves to the chat session or null if not found.
 */
export const getChatSession = async (sessionId: string): Promise<ChatSession | null> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching chat session:', error);
    throw error;
  }
  return data as unknown as ChatSession | null;
};

/**
 * Creates a new chat session for the given userId with the provided title.
 * @param userId - The ID of the user.
 * @param title - The title of the new chat session.
 * @returns A promise that resolves to the newly created chat session.
 */
export const createChatSession = async (userId: string, title: string): Promise<ChatSession> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{ user_id: userId, title: title }])
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating chat session:', error);
    throw error || new Error('Failed to create chat session, no data returned.');
  }
  return data as unknown as ChatSession;
};

/**
 * Updates the title of an existing chat session.
 * @param sessionId - The ID of the chat session to update.
 * @param newTitle - The new title for the chat session.
 * @returns A promise that resolves to the updated chat session.
 */
export const updateChatSessionTitle = async (sessionId: string, newTitle: string): Promise<ChatSession> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .update({ title: newTitle }) // Rely on DB trigger for updated_at
    .eq('id', sessionId)
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating chat session title:', error);
    throw error || new Error('Failed to update chat session title, no data returned.');
  }
  return data as unknown as ChatSession;
};

/**
 * Deletes a chat session and its associated messages (due to ON DELETE CASCADE).
 * @param sessionId - The ID of the chat session to delete.
 * @returns A promise that resolves when the session is deleted.
 */
export const deleteChatSession = async (sessionId: string): Promise<void> => {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('Error deleting chat session:', error);
    throw error;
  }
};

/**
 * Fetches all messages for a given sessionId.
 * Orders them by timestamp ascending.
 * @param sessionId - The ID of the chat session.
 * @returns A promise that resolves to an array of chat messages.
 */
export const getChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
  return (data as unknown as ChatMessage[]) || [];
};

/**
 * Adds a new message to a specific chat session.
 * @param sessionId - The ID of the chat session.
 * @param sender - The sender of the message ('user' or 'ai').
 * @param text - The content of the message.
 * @returns A promise that resolves to the newly created chat message.
 */
export const addChatMessage = async (sessionId: string, sender: 'user' | 'ai', text: string): Promise<ChatMessage> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{ session_id: sessionId, sender, text }])
    .select()
    .single();

  if (error || !data) {
    console.error('Error adding chat message:', error);
    throw error || new Error('Failed to add chat message, no data returned.');
  }
  return data as unknown as ChatMessage;
};

// Interface for messages sent to DeepSeek
interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Calls the DeepSeek chat proxy Supabase Edge Function to get an AI response.
 * @param conversationHistory - An array of ChatMessage objects representing the current conversation.
 * @param currentMessageText - The latest message text from the user.
 * @returns A promise that resolves to the AI's response text.
 */
export const getDeepSeekResponse = async (
  conversationHistory: ChatMessage[],
  currentMessageText: string
): Promise<string> => {
  const deepSeekMessages: DeepSeekMessage[] = [
    { role: 'system', content: 'You are a helpful assistant.' }, // System prompt
    ...conversationHistory.map((msg) => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text,
    })),
    { role: 'user', content: currentMessageText }, // Add the latest user message
  ];

  const { data, error } = await supabase.functions.invoke('deepseek-chat-proxy', {
    body: { messages: deepSeekMessages },
  });

  if (error) {
    console.error('Error calling deepseek-chat-proxy function:', error);
    throw error;
  }

  if (data && data.aiMessage) {
    return data.aiMessage;
  } else {
    console.error('Unexpected response from deepseek-chat-proxy:', data);
    throw new Error('Failed to get a valid response from the AI assistant.');
  }
};