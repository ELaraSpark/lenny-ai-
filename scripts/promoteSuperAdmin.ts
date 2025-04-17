/**
 * Promote a user to super admin in Supabase.
 * Usage: Set SUPABASE_SERVICE_KEY, SUPABASE_URL, and USER_EMAIL as environment variables, then run:
 *   npx ts-node scripts/promoteSuperAdmin.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const USER_EMAIL = process.env.USER_EMAIL!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !USER_EMAIL) {
  console.error('Please set SUPABASE_URL, SUPABASE_SERVICE_KEY, and USER_EMAIL environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function promoteSuperAdmin() {
  // Find user by email in users table
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', USER_EMAIL)
    .single();

  if (error || !user) {
    console.error('User not found or error:', error?.message);
    process.exit(1);
  }

  // Update user_role to 'super_admin'
  const { error: updateError } = await supabase
    .from('users')
    .update({ user_role: 'super_admin' })
    .eq('id', user.id);

  if (updateError) {
    console.error('Failed to update user_role:', updateError.message);
    process.exit(1);
  }

  console.log(`User with email ${USER_EMAIL} promoted to super_admin.`);
}

promoteSuperAdmin();
