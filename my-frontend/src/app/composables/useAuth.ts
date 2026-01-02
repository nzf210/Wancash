// frontend/src/composables/useAuth.ts
import { ref, onMounted, watch } from 'vue'
import {  watchAccount, reconnect as coreReconnect } from '@wagmi/core'  // Use core functions
import { config } from '@/app/components/config/wagmi'  // Import your Wagmi config
import { z } from 'zod';
import { toast } from 'vue-sonner';
import { isAddressEqual } from 'viem';
import { useRouter } from 'vue-router';

const nonceSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.coerce.number().int().positive()  // Add z.coerce to handle string-to-number conversion
});

// const { address, chainId: chainid, status } = getAccount(config)

export const useAuth = () => {
  const walletAddress = ref<string | undefined>('');
  const chainId = ref<number | undefined>(0);
  const isConnected = ref(false);
  const recentChainChange = ref(false);  // To ignore false disconnects after chain switch
  const router = useRouter()
  // State
  const isAuthenticated = ref(false);
  const user = ref<unknown>(null);
  const loading = ref(false);

  // Watch for account changes using core watchAccount
  watchAccount(config, {
    onChange: (account) => {
      isConnected.value = account.status === 'connected';
    },
  });

  const requestNonce = async (address: string, chain_id: number): Promise<{ nonce: string; message: unknown }> => {
    if (!address || !chain_id) {
      throw new Error('Wallet not connected.');
    }

    const parsedChainId = Number(chain_id);
    try {
      nonceSchema.parse({ address, chainId: chain_id });
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        throw new Error(`Invalid parameters: ${e.message}`);
      }
      throw new Error(`Invalid parameters`);
    }

    const response = await fetch(
      `/api/auth/nonce?address=${address}&chainId=${parsedChainId}`,
      { credentials: 'include' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get nonce');
    }

    return response.json();
  };

  const login = async (address: string, chain_id: number): Promise<unknown> => {
    if (!address || !chain_id) {
      throw new Error('Wallet not connected');
    }

    loading.value = true;

    try {
      const { message } = await requestNonce(address,chain_id);

      if (!globalThis.window.ethereum) {
        throw new Error('Ethereum provider not found');
      }

      const signature = await (globalThis.window.ethereum.request as (args: { method: string; params?: unknown[] }) => Promise<string>)({
      method: 'eth_signTypedData_v4',
        params: [address, JSON.stringify(message)]
     });


     if (!signature) {
       throw new Error('User rejected signature');
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
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.error || 'Authentication failed');
      }

      const data = await verifyResponse.json();

      isAuthenticated.value = true;
      user.value = data.user;

      localStorage.setItem('auth_state', JSON.stringify({
        authenticated: true,
        user: data.user,
        walletAddress: address,
        timestamp: Date.now()
      }));

      walletAddress.value = address;
      chainId.value = chain_id;

      return data;
  } finally {
      loading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        isAuthenticated.value = false;
        user.value = null;
        toast.info('Logged out successfully');
        localStorage.removeItem('auth_state');
        try {
          await router.push('/');
        } catch (error) {
          console.error('Navigation failed:', error);
        }

      } else {
        toast.error('Logout failed: ' + response.statusText);
      }
    } catch (error) {
      console.warn('Backend logout failed:', error);
    } finally {
      isAuthenticated.value = false;
      user.value = null;
      localStorage.removeItem('auth_state');
    }
  };

  const checkAuth = async (retries = 1) => {
    loading.value = true;
    try {
      const response = await fetch('/api/me', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (walletAddress.value && !isAddressEqual(data.user.address, walletAddress.value as `0x${string}`)) {
          await logout();
          return;
        }
        user.value = data.user;
        isAuthenticated.value = true;
      } else if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          await checkAuth(retries - 1);
        } else if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
          await checkAuth(retries - 1);
        } else {
          isAuthenticated.value = false;
          toast.warning('Session expired. Please sign in again.');
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Auth check failed:', error.message);
      }
      isAuthenticated.value = false;
    } finally {
      loading.value = false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        credentials: 'include'
      });
      return response.ok;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const restoreFromLocalStorage = () => {

    const savedAuth = localStorage.getItem('auth_state');
    if (savedAuth) {
      const authState = JSON.parse(savedAuth);
      const age = Date.now() - authState.timestamp;
      if (age < 60 * 60 * 1000 && walletAddress.value && isAddressEqual(authState.walletAddress as `0x${string}`, walletAddress.value as `0x${string}`)) {
        isAuthenticated.value = authState.authenticated;
        user.value = authState.user;
        console.log('Auth restored from localStorage');
      } else {
        console.warn('Invalid or expired localStorage auth_state');
      }
    }
  };

  const waitForConnection = (timeoutMs = 5000): Promise<void> => {
    return new Promise((resolve, reject) => {

      if (isConnected.value) return resolve();
      const interval = setInterval(() => {

        if (isConnected.value) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Connection timeout'));
      }, timeoutMs);
    });
  };

  // Watch for chain changes
  watch(chainId, () => {
    recentChainChange.value = true;
    setTimeout(() => {
      recentChainChange.value = false;
    }, 2000);
  });

  // Watch for connection status
  watch(isConnected, async (connected) => {
    if (connected) {
      restoreFromLocalStorage();
      await checkAuth();
    } else if (isAuthenticated.value) {
      await logout();
    }
  }, { immediate: true });

  // Watch for address changes
  watch(walletAddress, async (newAddress, oldAddress) => {
    if (newAddress === undefined && oldAddress && recentChainChange.value) {
      console.log('Ignoring spurious disconnect after recent chain change');
      return;
    }
    if (isAuthenticated.value && newAddress && oldAddress && !isAddressEqual(newAddress as `0x${string}`, oldAddress as `0x${string}`)) {
      await logout();
      toast.warning('Wallet address has changed. Please sign in again.');
    }
  });

  // Attempt reconnection
  onMounted(async () => {
    const savedAuth = localStorage.getItem('auth_state');

    if (savedAuth && !isConnected.value) {
      try {
        await coreReconnect(config);
        await waitForConnection();
        console.log('Reconnection successful');
      } catch (error) {
        console.error('Reconnection failed:', error);
        toast.error('Failed to reconnect wallet. Please connect manually.');
        localStorage.removeItem('auth_state');
      }
    }
  });

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth,
    refreshToken
  };
};
