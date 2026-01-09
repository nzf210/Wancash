// frontend/src/composables/useAuth.ts
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { watchAccount, getAccount, signTypedData } from '@wagmi/core'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { isAddressEqual, type TypedDataDefinition } from 'viem'
import { wagmiAdapter } from '@/app/components/config/appkit'
import { debounce } from '@/utils/debounce'

let lastCheckTime = 0
let pendingCheckAuth: Promise<{ isExpired: boolean; needsSign: boolean }> | null = null;


const nonceSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.coerce.number().int().positive()
})

type RefreshResult = { reason: 'NO_SESSION' | 'EXPIRED' | 'INVALID' | 'ERROR' }

interface refreshResult {
  ok: boolean,
  reason: string | RefreshResult
}

let pendingRefresh: Promise<refreshResult> | null = null;
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

const walletAddress = ref<string>('')
const chainId = ref<number | undefined>(0)
const isConnected = ref(false)
const recentChainChange = ref(false)
const activeConnector = ref<unknown>(null)
// Initialize authStabilizing to true if we have a session to restore, preventing early redirect
const authStabilizing = ref(!!localStorage.getItem('auth_state'))

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

// const lastToastTimeSign = ref(0)
const hasSessionInLocalStorage = ref(false)
interface MyProvider {
  request: (params: unknown) => Promise<string>;
}

export const useAuth = () => {

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
          'Content-Type': 'application/json',
          'X-Wallet-Address': walletAddress.value,
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
        headers: { 'Content-Type': 'application/json', 'X-Wallet-Address': walletAddress.value },
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

      authStabilizing.value = false
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

  const autoLoginOnConnect = debounce(async () => {
    const account = getCurrentAccount();

    if (account.isConnected && account.address && account.chainId) {
      // Jangan auto login jika sudah authenticated
      if (isAuthenticated.value) {
        return;
      }

      // Jangan auto login jika baru saja logout
      const lastLogout = localStorage.getItem('last_logout');
      if (lastLogout && Date.now() - Number.parseInt(lastLogout) < 5000) {
        return;
      }

      try {
        console.log('🤖 Auto-login attempt');
        await login(account.address, account.chainId);
      } catch (error) {
        console.warn('Auto-login failed:', error);
      }
    }
  }, 1500);

  const logout = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Wallet-Address': walletAddress.value
        }
      })

      if (response.ok) {
        activeConnector.value = null
      } else {
        toast.error('Logout failed: ' + response.statusText)
      }
    } catch (error) {
      console.warn('Backend logout failed:', error)
    } finally {
      isAuthenticated.value = false
      authStabilizing.value = true
      user.value = {}
      hasSessionInLocalStorage.value = false
      localStorage.removeItem('auth_state')
      sessionStorage.removeItem('intended_route')
      toast.info('Logged out successfully')
    }
  }

  const checkAuth = async (retries = 1) => {
    const now = Date.now();

    if (pendingCheckAuth && now - lastCheckTime < 1000) {
      console.log('⏭️ [checkAuth] cooldown hit');
      return pendingCheckAuth;
    }
    authStabilizing.value = true
    lastCheckTime = now;
    pendingCheckAuth = performCheckAuth(retries);

    pendingCheckAuth.finally(() => {
      setTimeout(() => (pendingCheckAuth = null), 1000);
    });

    return pendingCheckAuth;
  };

  const performCheckAuth = async (retries: number) => {
    loading.value = true;

    try {
      const res = await fetch('/api/me', {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache', 'X-Wallet-Address': walletAddress.value },
        signal: AbortSignal.timeout(5000)
      });

      if (res.ok) {
        isAuthenticated.value = true;
        return { isExpired: false, needsSign: false };
      }

      if (res.status === 401) {
        return await handleUnauthorized(retries);
      }

      return { isExpired: true, needsSign: true };
    } catch (err) {
      console.error('❌ [performCheckAuth]', err);
      return { isExpired: true, needsSign: true };
    } finally {
      loading.value = false;
      authStabilizing.value = false;
    }
  };

  const handleUnauthorized = async (
    retries: number
  ): Promise<{ isExpired: boolean; needsSign: boolean }> => {

    console.log('🔐 [handleUnauthorized]', retries)

    if (retries <= 0) {
      return { isExpired: true, needsSign: true }
    }

    console.log('🔄 [handleUnauthorized]', retries)
    // 🚨 SELALU coba refresh dulu
    const refresh = await refreshToken() as unknown as refreshResult


    console.log('🔑 [handleUnauthorized] Refresh Result:', refresh?.reason);

    if (refresh.ok) {
      const me = await fetch('/api/me', {
        headers: { 'X-Wallet-Address': walletAddress.value },
        credentials: 'include',
        signal: AbortSignal.timeout(3000)
      })

      if (me.ok) {
        isAuthenticated.value = true
        return { isExpired: false, needsSign: false }
      }

      if (refresh.reason === 'NO_SESSION' && walletAddress.value ||
        refresh.reason === 'EXPIRED' && walletAddress.value ||
        refresh.reason === 'INVALID' && walletAddress.value ||
        refresh.reason === 'ERROR' && !walletAddress.value) {
        console.log('🚨 [handleUnauthorized] NO_SESSION  & Connected - logging out')
        await logout()
        return { isExpired: true, needsSign: true }
      }

      if (refresh.ok && me.ok && me.status === 401) {
        console.log('🚨 [handleUnauthorized] me.ok failed, but refresh ok')
        return { isExpired: true, needsSign: true }
      }

      if (refresh.ok && !me.ok && me.status === 401) {
        console.log('🚨 [handleUnauthorized] me.nok failed, but refresh ok')
        await logout()
        return { isExpired: true, needsSign: true }
      }
    }

    return { isExpired: true, needsSign: true }
  }

  const refreshToken = async (): Promise<refreshResult> => {
    if (pendingRefresh) return pendingRefresh;

    pendingRefresh = (async () => {
      try {
        console.log('🔄 [refreshToken] start');

        const res = await fetch('/api/auth/refresh', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'X-No-Retry': 'true',
            'X-Wallet-Address': walletAddress.value
          },
          signal: AbortSignal.timeout(5000)
        });

        if (res.ok) {
          console.log('✅ [refreshToken] success');
          return { ok: true, reason: 'OK' };
        }

        const body = await res.json().catch(() => ({}));
        console.warn('❌ [refreshToken] failed:', body?.code);

        if (body?.code === 'NO_REFRESH_TOKEN') {
          return { ok: false, reason: 'NO_SESSION' };
        }

        if (body?.code === 'REFRESH_EXPIRED' || body?.code === 'SESSION_NOT_FOUND') {
          localStorage.removeItem('auth_state');
          return { ok: false, reason: 'EXPIRED' };
        }

        return { ok: false, reason: 'INVALID' };
      } catch (err) {
        console.error('❌ [refreshToken] error:', err);
        return { ok: false, reason: 'ERROR' };
      } finally {
        pendingRefresh = null;
      }
    })();

    return pendingRefresh;
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
              user.value = authState.user
              isAuthenticated.value = true
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
        await checkAuthWithDebounce()
      } else {
        // If restored successfully, we are stable
        authStabilizing.value = false
      }
    } else if (isAuthenticated.value && !recentChainChange.value) {
      await logout()
    } else if (!connected && authStabilizing.value) {
      // Check if connection takes too long
      setTimeout(() => {
        if (!isConnected.value && authStabilizing.value) {
          authStabilizing.value = false
        }
      }, 4000)
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

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && isAuthenticated.value) {
      // Check auth ketika user kembali ke tab
      checkAuthWithDebounce(1) // Delay 1 detik
    }
  }

  // Event listener untuk online/offline
  const handleOnline = () => {
    if (isAuthenticated.value) {
      console.log('🌐 Back online, checking auth...')
      checkAuthWithDebounce()
    }
  }

  onMounted(async () => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    globalThis.window.addEventListener('online', handleOnline);

    // Tunggu 2 detik sebelum check auth pertama
    setTimeout(async () => {
      const savedAuth = localStorage.getItem('auth_state');

      if (savedAuth) {
        try {
          const authState = JSON.parse(savedAuth);
          const age = Date.now() - authState.timestamp;

          // Jika session kurang dari 1 jam, coba check auth
          if (age < 60 * 60 * 1000 && isConnected.value) {
            console.log('🔍 Restoring session from localStorage');
            await checkAuth();
          } else {
            // Session expired, hapus
            localStorage.removeItem('auth_state');
          }
        } catch (error) {
          console.error('Error parsing auth_state:', error);
          localStorage.removeItem('auth_state');
        }
      }
    }, 2000);
  });

  // Jangan lupa cleanup
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    globalThis.window.removeEventListener('online', handleOnline);
  });


  // Function untuk force check (bypass semua cache)
  const forceCheckAuth = async (retries = 1): Promise<{ isExpired: boolean; needsSign: boolean }> => {
    console.log('🚀 Force checking auth...')
    return checkAuth(retries)
  }

  // Function untuk check auth dengan retry logic
  const checkAuthWithRetry = async (
    maxRetries = 3,
    initialDelay = 1000
  ): Promise<{ isExpired: boolean; needsSign: boolean }> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await checkAuth(1)

        if (!result.isExpired && !result.needsSign) {
          return result
        }

        // Jika masih ada masalah, tunggu sebelum retry
        if (attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt - 1) // Exponential backoff
          console.log(`⏳ Auth check attempt ${attempt} failed, retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      } catch (error) {
        console.error(`Auth check attempt ${attempt} failed:`, error)
        if (attempt === maxRetries) {
          return { isExpired: true, needsSign: false }
        }
      }
    }

    return { isExpired: true, needsSign: false }
  }

  const debugTokenStatus = async () => {
    try {
      const response = await fetch('/api/auth/debug/token-status', {
        headers: { 'X-Wallet-Address': walletAddress.value },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('🔍 Token Debug Info:', data)
        return data
      }
    } catch (error) {
      console.error('Debug failed:', error)
    }
    return null
  }


  const checkAuthWithDebounce = debounce(
    async (retries: number = 1): Promise<{ isExpired: boolean; needsSign: boolean }> => {
      try {
        return await checkAuth(retries);
      } catch (error) {
        console.error('Debounced checkAuth failed:', error);
        return { isExpired: false, needsSign: false };
      }
    },
    1000 // Delay in milliseconds
  );

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
    checkAuthWithDebounce,  // Export debounced version
    forceCheckAuth,          // Export force check
    checkAuthWithRetry,      // Export retry version
    refreshToken,
    autoLoginOnConnect,
    getCurrentAccount,
    debugTokenStatus,
    authStabilizing
  }
}
