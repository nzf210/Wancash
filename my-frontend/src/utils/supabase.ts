import { createClient } from "@supabase/supabase-js";
import { authService } from '@/utils/auth.service'

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
// Authenticated Supabase client
export const getAuthenticatedClient = () => {
  const token = authService.token.value

  return createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  )
}

// Helper untuk fetch dengan auth token
export const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = authService.token.value

  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    }
  )

  return response
}
