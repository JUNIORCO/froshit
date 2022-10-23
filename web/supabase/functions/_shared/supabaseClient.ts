// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^1.33.2';

export const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  // use service key not anon key to create auth user
  Deno.env.get('SUPABASE_SERVICE_KEY') ?? '',
);
