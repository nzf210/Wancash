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
    return headers
  }

  // Helper to update state
  const resetState = () => {
    console.log('🔄 resetting auth state')
    state.value = {
      status: 'UNAUTHENTICATED',
      user: {},
      walletAddress: null,
      chainId: null,
      lastChecked: Date.now()
    }
    localStorage.removeItem('auth_state')
  }

  // --- API INTERACTION ---

  const requestNonce = async (address: string, chainId: number) => {
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

      return await response.json()
    } catch (error) {
      console.error('Nonce error:', error)
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
    if (state.value.status === 'CHECKING') return

    state.value.status = 'CHECKING'
    state.value.walletAddress = address
    state.value.chainId = chainId

    try {
      // 1. Get Nonce
      const { nonce, message } = await requestNonce(address, chainId)

      // 2. Sign Message
      const signature = await signMessage(address, message)
      if (!signature) throw new Error('Signature failed')

      // 3. Verify
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          address,
          signature,
          message,
          chainId
        })
      })

      if (!verifyResponse.ok) {
        const err = await verifyResponse.json()
        throw new Error(err.error || 'Verification failed')
      }

      const data = await verifyResponse.json()

      // 4. Update State
      state.value.status = 'AUTHENTICATED'
      state.value.user = data.user
      state.value.lastChecked = Date.now()

      // Persist for quick restore
      localStorage.setItem('auth_state', JSON.stringify({
        address,
        chainId,
        user: data.user,
        timestamp: Date.now()
      }))

      toast.success('Successfully connected!')
      return true

    } catch (error: any) {
      console.error('Login failed:', error)
      resetState()
      state.value.status = 'ERROR'

      const msg = error.message || 'Login failed'
      if (msg.includes('User rejected')) {
        toast.info('Connection cancelled')
      } else {
        toast.error(msg)
      }
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
    // Debounce/Throttle check
    const now = Date.now()
    if (!force && isAuthenticated.value && (now - state.value.lastChecked < 30000)) {
      return true
    }

    // Don't check if we haven't even tried to restore or connect yet
    if (!state.value.walletAddress && !isConnected.value) {
      return false
    }

    const prevStatus = state.value.status
    state.value.status = 'CHECKING'

    try {
      const res = await fetch('/api/me', {
        headers: getAuthHeaders()
      })

      if (res.ok) {
        state.value.status = 'AUTHENTICATED'
        state.value.lastChecked = now
        return true
      }

      // Attempt refresh
      const refreshRes = await fetch('/api/auth/refresh', {
        headers: {
          'X-No-Retry': 'true',
          ...getAuthHeaders()
        }
      })

      if (refreshRes.ok) {
        state.value.status = 'AUTHENTICATED'
        state.value.lastChecked = now
        return true
      }

      throw new Error('Session invalid')

    } catch (error) {
      console.warn('Session check failed:', error)
      // Only reset if we were previously authenticated
      if (prevStatus === 'AUTHENTICATED') {
        resetState()
      } else {
        state.value.status = 'UNAUTHENTICATED'
      }
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
    checkSession
  }
}
