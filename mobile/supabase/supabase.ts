import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from "./database.types";

// @ts-ignore
export const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLIC_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
  });
