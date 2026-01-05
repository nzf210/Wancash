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
  const user = ref<{
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
    avatar?: string;
  }>({
    id: '',
    name: '',
    email: '',
    picture: ''
  })

  const loading = ref(false)

  const lastToastTimeAuth = ref(0)
  const lastToastTimeSign = ref(0)
  const hasSessionInLocalStorage = ref(false)

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

  const isMobileDevice = (): boolean => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }

  const getCurrentAccount = () => {
    const account = getAccount(wagmiAdapter.wagmiConfig)
    return {
      address: account.address,
      chainId: account.chainId,
      connector: account.connector,
      isConnected: account.isConnected
    }
  }

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

  const signMessageWithWagmi = async (
    address: string,
    message: BackendMessage
  ): Promise<string> => {
    try {
      const issuedAtTimestamp = Math.floor(new Date(message.message.issuedAt).getTime() / 1000)
      const expirationTimeTimestamp = Math.floor(new Date(message.message.expirationTime).getTime() / 1000)

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

      const typedDataForSigning = message

      let signature

      try {
        signature = await provider.request({
          method: 'eth_signTypedData_v4',
          params: [address, JSON.stringify(typedDataForSigning)]
        })
      } catch (e) {
        console.warn('eth_signTypedData_v4 failed, trying v3:', e)
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

  const signMessage = async (address: string, message: BackendMessage): Promise<string> => {
    try {
      return await signMessageWithWagmi(address, message)
    } catch (wagmiError) {
      console.warn('Wagmi signing failed, trying provider fallback:', wagmiError)

      try {
        return await signMessageWithProvider(address, message)
      } catch (providerError: unknown) {
        if (providerError instanceof Error) {
          if (isMobileDevice()) {
            throw new Error('Please open your wallet app to sign the message')
          }
          throw new Error(`Signing failed: ${providerError.message}`)
        }
        throw new Error(`Signing failed.`)
      }
    }
  }

  const login = async (address: string, chain_id: number): Promise<unknown> => {
    if (!address || !chain_id) {
      throw new Error('Wallet not connected')
    }

    loading.value = true

    try {
      const { message } = await requestNonce(address, chain_id)

      if (message.message.address.toLowerCase() !== address.toLowerCase()) {
        throw new Error('Address in message does not match connected address')
      }

      const signature = await signMessage(address, message)

      if (!signature) {
        throw new Error('User rejected signature or signing failed')
      }

      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          address: address,
          signature,
          message,
          chainId: chain_id
        })
      })

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json()
        throw new Error(error.error || 'Authentication failed')
      }

      const data = await verifyResponse.json()

      isAuthenticated.value = true
      user.value = data.user
      hasSessionInLocalStorage.value = true

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

  const autoLoginOnConnect = async () => {
    const account = getCurrentAccount()

    if (account.isConnected && account.address && account.chainId) {
      try {
        if (!isAuthenticated.value) {
          await login(account.address, account.chainId)
        }
      } catch (error) {
        console.warn('Auto-login failed:', error)
      }
    }
  }

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
        user.value = {}
        activeConnector.value = null
        hasSessionInLocalStorage.value = false
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
      user.value = {}
      hasSessionInLocalStorage.value = false
      localStorage.removeItem('auth_state')
    }
  }

  const checkAuth = async (retries = 1): Promise<{ isExpired: boolean; needsSign: boolean }> => {
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
          return { isExpired: false, needsSign: false }
        }

        user.value = data.user
        isAuthenticated.value = true
        hasSessionInLocalStorage.value = true
        return { isExpired: false, needsSign: false }
      }

      if (response.status === 401) {
        const result = await handleUnauthorized(retries)
        return result
      }

      isAuthenticated.value = false
      return { isExpired: false, needsSign: false }
    } catch (error: unknown) {
      console.error('Auth check failed:', error instanceof Error ? error.message : 'Unknown error')
      isAuthenticated.value = false
      return { isExpired: false, needsSign: false }
    } finally {
      loading.value = false
    }
  }

  const handleUnauthorized = async (retries: number): Promise<{ isExpired: boolean; needsSign: boolean }> => {
    // check last session in local storage
    const hasPreviousSession = localStorage.getItem('auth_state') !== null
    const currentAccount = getCurrentAccount()

    // Wallet already connected, but not have last session in local storage
    // Wallet need to sign
    if (currentAccount.isConnected && !hasPreviousSession) {
      isAuthenticated.value = false
      return { isExpired: false, needsSign: true }
    }

    // if has have last session, refresh
    const refreshed = await refreshToken()

    if (refreshed) {
      // if refresh success, check auth again
      await new Promise(resolve => setTimeout(resolve, 500))
      return await checkAuth(retries - 1)
    }

    if (retries > 0) {
      // if a have refresh, try again
      await new Promise(resolve => setTimeout(resolve, 500))
      return await checkAuth(retries - 1)
    }

    // refresh failed and have last session, session expired.
    if (hasPreviousSession) {
      isAuthenticated.value = false
      hasSessionInLocalStorage.value = false
      showSessionExpiredToast()
      return { isExpired: true, needsSign: false }
    }

    // if not have last session, and not connected
    isAuthenticated.value = false
          const now = Date.now()
      if (now - lastToastTimeSign.value > 3000) {
        toast.info('Please sign in ...')
        lastToastTimeSign.value = now
      }
    return { isExpired: false, needsSign: false }
  }

  const showSessionExpiredToast = () => {
    const now = Date.now()
    if (now - lastToastTimeAuth.value > 3000) {
      toast.warning('Session expired. Please sign in again.')
      lastToastTimeAuth.value = now
    }
  }

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

  const restoreFromLocalStorage = (): boolean => {
    const savedAuth = localStorage.getItem('auth_state')
    if (savedAuth) {
      try {
        const authState = JSON.parse(savedAuth)
        const age = Date.now() - authState.timestamp

        if (age < 60 * 60 * 1000) {
          if (walletAddress.value && authState.walletAddress) {
            if (isAddressEqual(authState.walletAddress as `0x${string}`, walletAddress.value as `0x${string}`)) {
              isAuthenticated.value = authState.authenticated
              user.value = authState.user
              hasSessionInLocalStorage.value = true
              console.log('Auth restored from localStorage')
              return true
            }
          }
        }

        localStorage.removeItem('auth_state')
        console.warn('Invalid or expired localStorage auth_state')
      } catch (error) {
        console.error('Error parsing localStorage auth_state:', error)
        localStorage.removeItem('auth_state')
      }
    }
    hasSessionInLocalStorage.value = false
    return false
  }

  watch(chainId, () => {
    recentChainChange.value = true
    setTimeout(() => {
      recentChainChange.value = false
    }, 2000)
  })

  watch(isConnected, async (connected) => {
    if (connected) {
      const restored = restoreFromLocalStorage()
      if (!restored) {
        const result = await checkAuth()
        // Jika wallet baru perlu sign, jangan tampilkan toast session expired
        if (result.needsSign) {
          console.log('New wallet connected, ready for sign-in')
        }
      }
    } else if (isAuthenticated.value && !recentChainChange.value) {
      await logout()
    }
  }, { immediate: true })

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

  onMounted(async () => {
    const savedAuth = localStorage.getItem('auth_state')
    hasSessionInLocalStorage.value = savedAuth !== null

    if (savedAuth) {
      try {
        const authState = JSON.parse(savedAuth)
        if (authState.authenticated) {
          const result = await checkAuth()
          // Jika session expired, toast sudah ditampilkan di handleUnauthorized
          if (result.isExpired) {
            console.log('Previous session expired')
          }
        }
      } catch (error) {
        console.error('Error checking auth on mount:', error)
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
