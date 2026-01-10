// frontend/src/composables/useAuth.ts
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { watchAccount, getAccount, signTypedData } from '@wagmi/core'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { isAddressEqual, type TypedDataDefinition } from 'viem'
import { wagmiAdapter } from '@/app/components/config/appkit'
import { debounce } from '@/utils/debounce'

// Types
type AuthStatus = 'IDLE' | 'CHECKING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'ERROR'

interface User {
  id?: string
  name?: string
  email?: string
  picture?: string
  avatar?: string
}

interface AuthState {
  status: AuthStatus
  user: User
  walletAddress: string | null
  chainId: number | null
  lastChecked: number
}

// Global State (Singleton pattern for composable)
const state = ref<AuthState>({
  status: 'IDLE',
  user: {},
  walletAddress: null,
  chainId: null,
  lastChecked: 0
})

const isConnected = ref(false)
const isRestoring = ref(true) // Flag to prevent premature actions during init
const recentChainChange = ref(false) // Flag to prevent spurious disconnects on chain switch

const nonceSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.coerce.number().int().positive()
})

export const useAuth = () => {
  // Computed helpers
  const isAuthenticated = computed(() => state.value.status === 'AUTHENTICATED')
  const isLoading = computed(() => state.value.status === 'CHECKING' || isRestoring.value)
  const user = computed(() => state.value.user)

  // Helper to get consistent headers
  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Cache-Control': 'no-cache'
    }
    // Critical: Use state address (restored from localStorage) to ensure 401 is fixed
    if (state.value.walletAddress) {
      headers['X-Wallet-Address'] = state.value.walletAddress
    }

    console.log('🔑 [useAuth] getAuthHeaders called:', {
      hasWalletAddress: !!state.value.walletAddress,
      walletAddress: state.value.walletAddress,
      headers
    })

    return headers
  }

  // Helper to update state
  const resetState = () => {
    console.log('🔄 [useAuth] Resetting auth state')
    state.value = {
      status: 'UNAUTHENTICATED',
      user: {},
      walletAddress: null,
      chainId: null,
      lastChecked: Date.now()
    }
    localStorage.removeItem('auth_state')
    console.log('✅ [useAuth] Auth state reset complete')
  }

  // --- API INTERACTION ---

  const requestNonce = async (address: string, chainId: number) => {
    console.log('🔑 [useAuth] Requesting nonce for:', { address, chainId })
    try {
      nonceSchema.parse({ address, chainId })

      const response = await fetch(
        `/api/auth/nonce?address=${address}&chainId=${chainId}`,
        {
          headers: getAuthHeaders()
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get nonce')
      }

      const data = await response.json()
      console.log('✅ [useAuth] Nonce received successfully')
      return data
    } catch (error) {
      console.error('❌ [useAuth] Nonce error:', error)
      throw error
    }
  }

  const signMessage = async (address: string, messageData: any) => {
    try {
      const { message, domain, types, primaryType } = messageData

      // Convert timestamps for signing
      const issuedAt = Math.floor(new Date(message.issuedAt).getTime() / 1000).toString()
      const expirationTime = Math.floor(new Date(message.expirationTime).getTime() / 1000).toString()

      const typedData: TypedDataDefinition = {
        domain: {
          ...domain,
          verifyingContract: domain.verifyingContract as `0x${string}`
        },
        types: {
          EIP712Domain: types.EIP712Domain,
          Auth: types.Auth
        },
        primaryType: primaryType,
        message: {
          ...message,
          issuedAt,
          expirationTime,
          address: message.address as `0x${string}`
        }
      }

      return await signTypedData(wagmiAdapter.wagmiConfig, typedData)
    } catch (error) {
      console.error('Signing error:', error)
      throw error
    }
  }

  const login = async (address: string, chainId: number) => {
    console.log('\n🔐 [useAuth] ========== START LOGIN ==========')
    console.log('🔐 [useAuth] Address:', address)
    console.log('🔐 [useAuth] Chain ID:', chainId)
    console.log('🔐 [useAuth] Current status:', state.value.status)

    if (state.value.status === 'CHECKING') {
      console.log('⚠️ [useAuth] Already checking, aborting')
      return
    }

    state.value.status = 'CHECKING'
    state.value.walletAddress = address
    state.value.chainId = chainId

    try {
      // 1. Get Nonce
      const { nonce, message } = await requestNonce(address, chainId)

      // 2. Sign Message
      console.log('🔐 [useAuth] Requesting signature...')
      const signature = await signMessage(address, message)
      if (!signature) throw new Error('Signature failed')
      console.log('✅ [useAuth] Signature obtained')

      // 3. Verify
      console.log('🔐 [useAuth] Sending verification request...')
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify({
          address,
          signature,
          message,
          chainId
        })
      })

      if (!verifyResponse.ok) {
        const err = await verifyResponse.json()
        console.log('❌ [useAuth] Verification failed:', err)
        throw new Error(err.error || 'Verification failed')
      }

      const data = await verifyResponse.json()
      console.log('✅ [useAuth] Verification successful:', data)

      // 4. Update State
      state.value.status = 'AUTHENTICATED'
      state.value.user = data.user
      state.value.lastChecked = Date.now()

      // Persist for quick restore
      const authState = {
        address,
        chainId,
        user: data.user,
        timestamp: Date.now()
      }
      localStorage.setItem('auth_state', JSON.stringify(authState))
      console.log('✅ [useAuth] Auth state persisted to localStorage')

      toast.success('Successfully connected!')
      console.log('🔐 [useAuth] ========== LOGIN SUCCESS ==========\n')
      return true

    } catch (error: any) {
      console.error('❌ [useAuth] Login failed:', error)
      resetState()
      state.value.status = 'ERROR'

      const msg = error.message || 'Login failed'
      if (msg.includes('User rejected')) {
        toast.info('Connection cancelled')
      } else {
        toast.error(msg)
      }
      console.log('🔐 [useAuth] ========== LOGIN FAILED ==========\n')
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders()
      })
    } catch (e) {
      console.warn('Logout API failed', e)
    } finally {
      resetState()
      toast.info('Disconnected')
    }
  }

  const checkSession = async (force = false) => {
    console.log('\n🔍 [useAuth] ========== CHECK SESSION ==========')
    console.log('🔍 [useAuth] Force:', force)
    console.log('🔍 [useAuth] Current status:', state.value.status)
    console.log('🔍 [useAuth] Wallet address:', state.value.walletAddress)
    console.log('🔍 [useAuth] Is connected:', isConnected.value)

    // Debounce/Throttle check
    const now = Date.now()
    if (!force && isAuthenticated.value && (now - state.value.lastChecked < 30000)) {
      console.log('⏭️ [useAuth] Skipping check (recently checked)')
      console.log('🔍 [useAuth] ========== END (cached) ==========\n')
      return true
    }

    // Don't check if we haven't even tried to restore or connect yet
    if (!state.value.walletAddress && !isConnected.value) {
      console.log('⏭️ [useAuth] Skipping check (no wallet address, not connected)')
      console.log('🔍 [useAuth] ========== END (skip) ==========\n')
      return false
    }

    const prevStatus = state.value.status
    if (state.value.status !== 'AUTHENTICATED') {
      state.value.status = 'CHECKING'
    }

    try {
      console.log('🔍 [useAuth] Fetching /api/me with headers:', getAuthHeaders())
      const res = await fetch('/api/me', {
        headers: getAuthHeaders(),
        credentials: 'include'
      })

      console.log('🔍 [useAuth] /api/me Response status:', res.status)

      if (res.ok) {
        state.value.status = 'AUTHENTICATED'
        state.value.lastChecked = now
        console.log('✅ [useAuth] Session valid')
        console.log('🔍 [useAuth] ========== END (success) ==========\n')
        return true
      }

      // Attempt refresh
      console.log('⚠️ [useAuth] Session check failed, attempting refresh...')
      const refreshed = await refreshSession()
      console.log('🔍 [useAuth] ========== END (attempted refresh) ==========\n')
      return refreshed

    } catch (error) {
      console.warn('❌ [useAuth] Session check error:', error)
      // Only reset if we were previously authenticated
      if (prevStatus === 'AUTHENTICATED') {
        console.log('🔍 [useAuth] Was authenticated, resetting state')
        resetState()
      } else {
        console.log('🔍 [useAuth] Was not authenticated, setting UNAUTHENTICATED')
        state.value.status = 'UNAUTHENTICATED'
      }
      console.log('🔍 [useAuth] ========== END (error) ==========\n')
      return false
    }
  }

  const refreshSession = async (): Promise<boolean> => {
    console.log('\n🔄 [useAuth] ========== REFRESH SESSION ==========')
    const now = Date.now()
    try {
      console.log('🔄 [useAuth] Calling /api/auth/refresh...')
      const refreshRes = await fetch('/api/auth/refresh', {
        headers: {
          'X-No-Retry': 'true',
          ...getAuthHeaders()
        },
        credentials: 'include'
      })

      console.log('🔄 [useAuth] Refresh response status:', refreshRes.status)

      if (refreshRes.ok) {
        state.value.status = 'AUTHENTICATED'
        state.value.lastChecked = now
        console.log('✅ [useAuth] Refresh successful')
        console.log('🔄 [useAuth] ========== END (success) ==========\n')
        return true
      }

      console.log('❌ [useAuth] Refresh failed with status:', refreshRes.status)
      console.log('🔄 [useAuth] ========== END (failed) ==========\n')
      return false
    } catch (e) {
      console.error('❌ [useAuth] Refresh error:', e)
      console.log('🔄 [useAuth] ========== END (error) ==========\n')
      return false
    }
  }

  // --- INITIALIZATION & WATCHERS ---

  // 1. Initialize Wagmi Listener (Run once)
  const initWagmiListener = () => {
    watchAccount(wagmiAdapter.wagmiConfig, {
      onChange: async (account) => {
        const prevConnected = isConnected.value
        const prevAddress = state.value.walletAddress

        isConnected.value = account.status === 'connected'

        // Handle Disconnect
        if (prevConnected && !isConnected.value) {
          if (isAuthenticated.value && !recentChainChange.value) {
            // Wait briefly to see if it reconnects (Wagmi flakiness during chain switch or refresh)
            console.log('Wallet disconnected. Waiting 3s stabilization...')
            setTimeout(async () => {
              const currentAccount = getAccount(wagmiAdapter.wagmiConfig)
              if (!currentAccount.isConnected && isAuthenticated.value) {
                console.log('Final confirmation: Wallet truly disconnected. Logging out.')
                await logout()
              } else {
                console.log('Stabilization success: Wallet reconnected or stay connected.')
              }
            }, 3000)
          }
          return
        }

        // Handle Chain Change (for stability)
        if (account.chainId && state.value.chainId && account.chainId !== state.value.chainId) {
          recentChainChange.value = true
          setTimeout(() => {
            recentChainChange.value = false
          }, 5000)
        }

        // Handle Address Change
        if (account.address && prevAddress && !isAddressEqual(account.address, prevAddress as `0x${string}`)) {
          if (isAuthenticated.value) {
            toast.warning('Account changed, please re-login')
            await logout()
          }
        }
      }
    })
  }

  // 2. Restore Session from LocalStorage
  const restoreSession = async () => {
    const saved = localStorage.getItem('auth_state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Check if session is "fresh" (e.g., < 24 hours for initial trust)
        if (Date.now() - parsed.timestamp < 24 * 3600000) {
          state.value = {
            status: 'AUTHENTICATED',
            user: parsed.user,
            walletAddress: parsed.address,
            chainId: parsed.chainId,
            lastChecked: parsed.timestamp
          }
          console.log('📦 session restored from storage:', parsed.address)
          // Background verification
          checkSession()
        } else {
          localStorage.removeItem('auth_state')
        }
      } catch (e) {
        localStorage.removeItem('auth_state')
      }
    }
    isRestoring.value = false
  }

  // Bootstrap
  const init = () => {
    if (typeof window !== 'undefined' && isRestoring.value) {
      console.log('🚀 initializing auth composable')
      const acc = getAccount(wagmiAdapter.wagmiConfig)
      isConnected.value = acc.isConnected

      // Start restoration immediately without waiting for onMounted
      restoreSession()
      initWagmiListener()
    }
  }

  // Trigger initialization immediately when the composable is used
  if (typeof window !== 'undefined' && isRestoring.value) {
    init()
  }

  return {
    // State
    isAuthenticated,
    isLoading,
    user,
    isConnected,
    isRestoring,
    walletAddress: computed(() => state.value.walletAddress),

    // Actions
    login,
    logout,
    checkSession,
    refreshSession,
    getAuthHeaders
  }
}
