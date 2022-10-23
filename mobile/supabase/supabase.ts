import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from '@env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
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
