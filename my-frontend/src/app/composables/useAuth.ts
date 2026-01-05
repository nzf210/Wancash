// frontend/src/composables/useAuth.ts
import { ref, onMounted, watch } from 'vue'
import { watchAccount, getAccount, signTypedData } from '@wagmi/core'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { isAddressEqual, type TypedDataDefinition } from 'viem'
import { useRouter } from 'vue-router'
import { wagmiAdapter } from '@/app/components/config/appkit'

const nonceSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.coerce.number().int().positive()
})

// Interface untuk message dari backend
interface BackendMessage {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  message: {
    content: string;
    nonce: string;
    issuedAt: string;
    expirationTime: string;
    address: string;
  };
  primaryType: "Auth";
  types: {
    EIP712Domain: Array<{ name: string; type: string }>;
    Auth: Array<{ name: string; type: string }>;
  };
}

// Interface untuk response dari backend
interface NonceResponse {
  nonce: string;
  message: BackendMessage;
  expiresAt: string;
}

interface MyProvider {
  request: (params: unknown) => Promise<string>;
}

export const useAuth = () => {
  const walletAddress = ref<string | undefined>('')
  const chainId = ref<number | undefined>(0)
  const isConnected = ref(false)
  const recentChainChange = ref(false)
  const activeConnector = ref<unknown>(null)
  const router = useRouter()

  const isAuthenticated = ref(false)
  const user = ref<unknown>(null)
  const loading = ref(false)

  // Watch for account changes
  watchAccount(wagmiAdapter.wagmiConfig, {
    onChange: (account) => {
      isConnected.value = account.status === 'connected'
      if (account.address) {
        walletAddress.value = account.address
      }
      if (account.chainId) {
        chainId.value = account.chainId
      }
      if (account.connector) {
        activeConnector.value = account.connector
      }
    }
  })

  // Deteksi device type
  const isMobileDevice = (): boolean => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }

  // Get current account info
  const getCurrentAccount = () => {
    const account = getAccount(wagmiAdapter.wagmiConfig)
    return {
      address: account.address,
      chainId: account.chainId,
      connector: account.connector,
      isConnected: account.isConnected
    }
  }

  // Request nonce dari backend
  const requestNonce = async (address: string, chain_id: number): Promise<NonceResponse> => {
    if (!address || !chain_id) {
      throw new Error('Wallet not connected.')
    }

    const parsedChainId = Number(chain_id)
    try {
      nonceSchema.parse({ address, chainId: chain_id })
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        throw new Error(`Invalid parameters: ${e.message}`)
      }
      throw new Error(`Invalid parameters`)
    }

    const response = await fetch(
      `/api/auth/nonce?address=${address}&chainId=${parsedChainId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get nonce')
    }

    return await response.json()
  }

  // Sign message dengan wagmi signTypedData menggunakan struktur dari backend
  const signMessageWithWagmi = async (
    address: string,
    message: BackendMessage
  ): Promise<string> => {
    try {
      // Konversi issuedAt dan expirationTime dari ISO string ke timestamp
      const issuedAtTimestamp = Math.floor(new Date(message.message.issuedAt).getTime() / 1000)
      const expirationTimeTimestamp = Math.floor(new Date(message.message.expirationTime).getTime() / 1000)

      // Bangun typed data sesuai dengan struktur backend
      const typedData: TypedDataDefinition = {
        domain: {
          name: message.domain.name,
          version: message.domain.version,
          chainId: message.domain.chainId,
          verifyingContract: message.domain.verifyingContract as `0x${string}`
        },
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" }
          ],
          Auth: [
            { name: "content", type: "string" },
            { name: "nonce", type: "string" },
            { name: "issuedAt", type: "string" },
            { name: "expirationTime", type: "string" },
            { name: "address", type: "address" }
          ]
        },
        primaryType: "Auth",
        message: {
          content: message.message.content,
          nonce: message.message.nonce,
          issuedAt: issuedAtTimestamp.toString(),
          expirationTime: expirationTimeTimestamp.toString(),
          address: message.message.address as `0x${string}`
        }
      }

      const signature = await signTypedData(wagmiAdapter.wagmiConfig, typedData)
      return signature
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Wagmi signTypedData error:', error.message)
        throw new Error(`Signing failed: ${error.message}`)
      }
      throw new Error(`Signing failed.`)
    }
  }

  // Sign message dengan provider langsung (fallback)
  const signMessageWithProvider = async (
    address: string,
    message: BackendMessage
  ): Promise<string> => {
    const account = getCurrentAccount()

    if (!account.connector) {
      throw new Error('No active wallet connector')
    }

    try {
      const provider = await account.connector.getProvider() as MyProvider

      if (!provider) {
        throw new Error('Cannot get provider from connector')
      }

      // Gunakan message langsung dari backend tanpa modifikasi
      const typedDataForSigning = message

      let signature

      // Coba berbagai signing methods
      try {
        // Method 1: eth_signTypedData_v4 (recommended)
        signature = await provider.request({
          method: 'eth_signTypedData_v4',
          params: [address, JSON.stringify(typedDataForSigning)]
        })
      } catch (e) {
        console.warn('eth_signTypedData_v4 failed, trying v3:', e)

        // Method 2: eth_signTypedData (v3)
        signature = await provider.request({
          method: 'eth_signTypedData',
          params: [address, typedDataForSigning]
        })
      }

      if (!signature) {
        throw new Error('No signature returned from provider')
      }

      return signature
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Provider signing error:', error.message)
        throw new Error(`Provider signing failed: ${error.message}`)
      }
      console.error('Provider signing error:', error)
      throw new Error(`Provider signing failed.`)
    }
  }

  // Main signing function dengan fallback
  const signMessage = async (address: string, message: BackendMessage): Promise<string> => {
    try {
      // Try wagmi signTypedData first
      return await signMessageWithWagmi(address, message)
    } catch (wagmiError) {
      console.warn('Wagmi signing failed, trying provider fallback:', wagmiError)

      try {
        // Fallback to provider signing
        return await signMessageWithProvider(address, message)
      } catch (providerError: unknown) {
        if (providerError instanceof Error) {
          // For mobile devices, suggest manual signing
          if (isMobileDevice()) {
            throw new Error('Please open your wallet app to sign the message')
          }
          throw new Error(`Signing failed: ${providerError.message}`)
        }
        throw new Error(`Signing failed.`)
      }
    }
  }

  // Main login function
  const login = async (address: string, chain_id: number): Promise<unknown> => {
    if (!address || !chain_id) {
      throw new Error('Wallet not connected')
    }

    loading.value = true

    try {
      // 1. Get nonce dari backend
      const { message } = await requestNonce(address, chain_id)

      // Pastikan address dalam message sama dengan yang login
      if (message.message.address.toLowerCase() !== address.toLowerCase()) {
        throw new Error('Address in message does not match connected address')
      }

      // 2. Sign message menggunakan struktur dari backend
      const signature = await signMessage(address, message)

      if (!signature) {
        throw new Error('User rejected signature or signing failed')
      }

      // 3. Verify signature dengan backend - kirimkan message lengkap dari backend
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          address: address,
          signature,
          message, // Kirim message lengkap dari backend
          chainId: chain_id
        })
      })

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json()
        throw new Error(error.error || 'Authentication failed')
      }

      const data = await verifyResponse.json()

      // 4. Update state
      isAuthenticated.value = true
      user.value = data.user

      localStorage.setItem('auth_state', JSON.stringify({
        authenticated: true,
        user: data.user,
        walletAddress: address,
        chainId: chain_id,
        timestamp: Date.now(),
        nonce: message.message.nonce
      }))

      walletAddress.value = address
      chainId.value = chain_id

      toast.success('Successfully signed in!')
      return data
    } catch (error: unknown) {

      if (error instanceof Error) {
        console.error('Login error:', error.message)
        // Handle specific error cases
        if (error.message.includes('User rejected') || error.message.includes('denied')) {
          toast.error('Signature request was rejected')
        } else if (error.message.includes('Please open your wallet app')) {
          toast.warning('Please open your wallet app to sign the message')
        } else if (error.message.includes('Address in message')) {
          toast.error('Address mismatch. Please try again.')
        } else if (error.message.includes('Signing failed')) {
          toast.error('Signing failed. Please try again or use a different wallet.')
        } else {
          toast.error(error.message || 'Login failed')
        }
      }

      throw error
    } finally {
      loading.value = false
    }
  }

  // Auto-login ketika wallet connect
  const autoLoginOnConnect = async () => {
    const account = getCurrentAccount()

    if (account.isConnected && account.address && account.chainId) {
      try {
        // Cek apakah sudah authenticated
        if (!isAuthenticated.value) {
          await login(account.address, account.chainId)
        }
      } catch (error) {
        console.warn('Auto-login failed:', error)
      }
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        isAuthenticated.value = false
        user.value = null
        activeConnector.value = null
        toast.info('Logged out successfully')
        localStorage.removeItem('auth_state')

        try {
          await router.push('/')
        } catch (error) {
          console.error('Navigation failed:', error)
        }
      } else {
        toast.error('Logout failed: ' + response.statusText)
      }
    } catch (error) {
      console.warn('Backend logout failed:', error)
    } finally {
      isAuthenticated.value = false
      user.value = null
      localStorage.removeItem('auth_state')
    }
  }

  // Check authentication status
  const checkAuth = async (retries = 1) => {
    loading.value = true
    try {
      const response = await fetch('/api/me', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (walletAddress.value && data.user && !isAddressEqual(data.user.address, walletAddress.value as `0x${string}`)) {
          await logout()
          return
        }
        user.value = data.user
        isAuthenticated.value = true
      } else if (response.status === 401) {
        const refreshed = await refreshToken()
        if (refreshed) {
          await checkAuth(retries - 1)
        } else if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 500))
          await checkAuth(retries - 1)
        } else {
          isAuthenticated.value = false
          toast.warning('Session expired. Please sign in again.')
        }
      } else {
        isAuthenticated.value = false
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Auth check failed:', error.message)
      }
      isAuthenticated.value = false
    } finally {
      loading.value = false
    }
  }

  // Refresh token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      return response.ok
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  // Restore from localStorage
  const restoreFromLocalStorage = () => {
    const savedAuth = localStorage.getItem('auth_state')
    if (savedAuth) {
      const authState = JSON.parse(savedAuth)
      const age = Date.now() - authState.timestamp

      // Valid selama 1 jam dan address sama
      if (age < 60 * 60 * 1000) {
        if (walletAddress.value && authState.walletAddress) {
          if (isAddressEqual(authState.walletAddress as `0x${string}`, walletAddress.value as `0x${string}`)) {
            isAuthenticated.value = authState.authenticated
            user.value = authState.user
            console.log('Auth restored from localStorage')
            return true
          }
        }
      }

      // Clean up expired/invalid state
      localStorage.removeItem('auth_state')
      console.warn('Invalid or expired localStorage auth_state')
    }
    return false
  }

  // Watch for chain changes
  watch(chainId, () => {
    recentChainChange.value = true
    setTimeout(() => {
      recentChainChange.value = false
    }, 2000)
  })

  // Watch for connection status
  watch(isConnected, async (connected) => {
    if (connected) {
      const restored = restoreFromLocalStorage()
      if (!restored) {
        await checkAuth()
      }
    } else if (isAuthenticated.value && !recentChainChange.value) {
      await logout()
    }
  }, { immediate: true })

  // Watch for address changes
  watch(walletAddress, async (newAddress, oldAddress) => {
    if (newAddress === undefined && oldAddress && recentChainChange.value) {
      console.log('Ignoring spurious disconnect after recent chain change')
      return
    }

    if (isAuthenticated.value && newAddress && oldAddress &&
        !isAddressEqual(newAddress as `0x${string}`, oldAddress as `0x${string}`)) {
      await logout()
      toast.warning('Wallet address has changed. Please sign in again.')
    }
  })

  // Initialize pada mounted
  onMounted(async () => {
    const savedAuth = localStorage.getItem('auth_state')

    // Jika ada saved auth, coba checkAuth terlebih dahulu
    if (savedAuth) {
      const authState = JSON.parse(savedAuth)
      if (authState.authenticated) {
        await checkAuth()
      }
    }
  })

  return {
    isAuthenticated,
    user,
    loading,
    walletAddress,
    chainId,
    isConnected,
    login,
    logout,
    checkAuth,
    refreshToken,
    autoLoginOnConnect,
    getCurrentAccount
  }
}
