import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Using environment variables for Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const GEMINI_API_KEY = ""; // You may need to set a proper value for this if used in your application

// Initialize and export the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
