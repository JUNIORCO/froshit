// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabaseClient = createClient(
  Deno.env.get('NEXT_PUBLIC_DATABASE_URL') ?? '',
  Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? '',
);
