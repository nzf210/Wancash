import { supabase } from "@/utils/supabase"

export async function loginWithWallet(
  address: string,
  signMessageAsync: (options: {
    message: string
    account: `0x${string}`
  }) => Promise<string>
) {
  console.log("🚀 LOGIN START", address);

  const url = 'https://lkukgmezfsezunqhrabg.supabase.co/functions/v1/reg-nonce'

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sb_publishable_BUC_T9GBRoxt_Qunan2M3Q_GUoN6rrY',
      'apikey': 'sb_publishable_BUC_T9GBRoxt_Qunan2M3Q_GUoN6rrY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address: address })
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Request failed: ${res.status} ${errText}`)
  }

  const { nonce } = await res.json()
  console.log("🔥 NONCE", nonce);

  // 2️⃣ Sign nonce
  const signature = await signMessageAsync({
    message: `Login:${nonce}`,
    account: address as `0x${string}`,
  })

  const { data : verifyRes, error: err } = await supabase.functions.invoke('auth-verf', {
      body: JSON.stringify({ address, nonce, signature }),
  })

  if (err) {
    throw new Error('Signature verification failed')
  }

  const { access_token, refresh_token } = verifyRes;
  console.log("🔥 TOKENS", access_token?.slice(0, 10));

  // 4️⃣ SET SUPABASE SESSION (INI KUNCI)
  await supabase.auth.setSession({
    access_token,
    refresh_token
  })
  // 6️⃣ Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .single()

  return profile
}
