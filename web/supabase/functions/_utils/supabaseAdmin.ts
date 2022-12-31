// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const getAdminSupabase = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl) throw new Error('Supabase URL not found');
  if (!supabaseServiceRoleKey) throw new Error('Supabase service role key not found');

  return createClient(supabaseUrl, supabaseServiceRoleKey);
};
