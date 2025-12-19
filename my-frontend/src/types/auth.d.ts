export interface UserProfile {
  id?: string
  wallet_address: string
  display_name?: string
  avatar?: string
  email?: string
  chain_id?: number
  last_login?: string
  nonce?: string
  initials?: string
}

interface TestTransaction {
  to: Address
  value: ReturnType<typeof parseGwei>
}

interface SupabaseAuthUser {
  id: string
  email?: string
  user_metadata?: {
    display_name?: string
    avatar?: string
    [key: string]: unknown
  }
}
