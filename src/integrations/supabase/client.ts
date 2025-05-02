import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Using environment variables for Supabase credentials
// With fallback values for development environments
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://correct-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'correct-anon-key';

// Debug for development
if (import.meta.env.DEV) {
  console.log('Supabase configuration:', { 
    url: SUPABASE_URL ? 'Configured ✓' : 'Missing ✗',
    key: SUPABASE_ANON_KEY ? 'Configured ✓' : 'Missing ✗' 
  });
}

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

// Initialize and export the Supabase client with fallback values
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
