
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lkukgmezfsezunqhrabg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BUC_T9GBRoxt_Qunan2M3Q_GUoN6rrY';

export const supabase = createClient(supabaseUrl, supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-client-info': 'wallet-login',
      },
    },
    // 🔥 MATIKAN ANALYTICS
    realtime: {
      params: {
        eventsPerSecond: 0,
      },
    },
  }
);

