import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mybvkrkmvnuzeqvzgbzg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15YnZrcmttdm51emVxdnpnYnpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NDA1OTExNiwiZXhwIjoxOTc5NjM1MTE2fQ.4KMplC7mH59RjXzFmAtuFpoT081C9NpwCjVE4otWaKM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public'
  }
})
