import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Using environment variables for Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are defined
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

if (!SUPABASE_URL) {
  console.error('Missing Supabase URL. Make sure your environment variables are loaded correctly.');
}

if (!SUPABASE_ANON_KEY) {
  console.error('Missing Supabase Anon Key. Make sure your environment variables are loaded correctly.');
}

// Initialize and export the Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || ''
);
