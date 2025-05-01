import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Using environment variables for Supabase credentials
// With fallback values for development environments
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uahphakjrkwfhikyxpqt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaHBoYWtqcmt3Zmhpa3l4cHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MTk3NDMsImV4cCI6MjA2MDk5NTc0M30.iceEb5GvCBzE4wA7U92DxGJZuLt0m-RNcgqVKBIh0EA';

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
