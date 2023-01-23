import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  'https://mybvkrkmvnuzeqvzgbzg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15YnZrcmttdm51emVxdnpnYnpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NDA1OTExNiwiZXhwIjoxOTc5NjM1MTE2fQ.4KMplC7mH59RjXzFmAtuFpoT081C9NpwCjVE4otWaKM');
