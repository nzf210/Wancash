<!-- frontend/src/components/WalletAuthButton.vue -->
<template>
  <div class="wallet-auth-container">
    <!-- State 1: Not Connected -->
    <button v-if="!isConnected" @click="connectWallet" :disabled="connecting" class="connect-button">
      <span v-if="connecting" class="spinner"></span>
      {{ connecting ? 'Connecting...' : 'Connect Wallet' }}
    </button>

    <div v-if="authLoading" class="flex flex-row">
      <span class="mt-1 pr-1">
        <Spinner />
      </span>
      <span class="auth-loading">Loading...</span>
    </div>

    <!-- State 2: Connected but Not Authenticated -->
    <button v-else-if="isConnected && !isAuthenticated" @click="handleAuth" :disabled="authLoading"
      class="connect-button">
      <span v-if="authLoading" class="spinner"></span>
      <span v-else class="wallet-info">
        <span class="wallet-address text-sm">
          {{ shortenAddress(walletAddress) }}
        </span>
        <span class="auth-status">(Sign In)</span>
      </span>
    </button>

    <!-- State 3: Connected and Authenticated -->
    <div v-else>
      <ProfileIcon v-if="isAuthenticated && !isMobile" :user="user" :auth-stores="{
        walletAddress: walletAddress || null,
        isConnected: isAuthenticated,
        userAvatar: null,
        userDisplayName: 'User',
        userInitials: ('U').charAt(0).toUpperCase(),
        userEmail: null,
        network: currentChain?.name! ?? '',
        balance: '0.00',
        handleDisconnect: () => {
          disconnectWallet()
        }
      }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { useConnection, useDisconnect } from '@wagmi/vue'
import { useAuth } from '@/app/composables/useAuth'
import { useChain } from '@/app/composables/useChain'
import { shortenAddress } from '@/utils/helpers'
import { toast } from 'vue-sonner'
import ProfileIcon from './ProfileIcon.vue'
import type { EIP1193Provider } from 'viem'
import { useAppKitAccount, type UseAppKitAccountReturn } from '@reown/appkit/vue'
import { Spinner } from '@/components/ui/spinner'
import { appkit } from '@/app/components/config/appkit'

defineProps<{
  isMobile: boolean
}>()

// Composables
const {
  isConnected,
  address: walletAddress,
  chainId,
} = useConnection()

const { mutateAsync: walletDisconnect } = useDisconnect()


const {
  isAuthenticated,
  login,
  logout,
  checkAuth,
  loading: authLoading,
  user
} = useAuth()

const {
  isSupportedChain,
  getChainInfo,
} = useChain()

// State
const connecting = ref(false)
const showDropdown = ref(false)
const recentChainChange = ref(false);  // New flag for ignoring false disconnects

// Computed
const currentChain = computed(() => getChainInfo(chainId.value || 0))

// Watchers
watch(chainId, () => {
  console.log('Chain changed to:', chainId.value);
  recentChainChange.value = true;
  setTimeout(() => {
    recentChainChange.value = false;
  }, 2000);
  if (chainId.value && !isSupportedChain.value) {
    toast.warning('Unsupported network, some features may not work');
  }
});

watch(walletAddress, async (newAddress, oldAddress) => {
  console.log('Wallet address change detected:', { new: newAddress, old: oldAddress });
  if (newAddress === undefined && oldAddress && recentChainChange.value) {
    console.log('Ignoring spurious disconnect after recent chain change');
    return;
  }
  if (isAuthenticated.value && newAddress && oldAddress && newAddress !== oldAddress) {
    await logout();
    toast.warning("Wallet address has changed. Please sign in again.");
  }
});

watch([isConnected, walletAddress], async ([connected, address]) => {
  if (!connected || !address) {
    console.log('Wallet disconnected');
  } else {
    console.log('Wallet connected:', address);
    await checkAuth();
  }
});

// Lifecycle hooks
onMounted(async () => {
  if (globalThis.window && globalThis.window.ethereum) {
    const ethereum = globalThis.window.ethereum as EIP1193Provider;

    const handleAccountsChanged = async (accounts: string[]) => {
      console.log('MetaMask accounts changed:', accounts);
      if (accounts.length === 0 && recentChainChange.value) {
        console.log('Ignoring spurious disconnect after recent chain change');
        return;
      }
      if (isAuthenticated.value && accounts.length > 0 && accounts[0] !== walletAddress.value) {
        await logout();
        toast.warning('MetaMask account has changed. Please sign in again.');
      }
    };

    ethereum.on('accountsChanged', handleAccountsChanged);

    onUnmounted(() => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
    });
  } else {
    console.log('Ethereum is not available');
  }

  if (isConnected.value && walletAddress.value) {
    await checkAuth();
  }
});

// const { open } = useAppKit()
const accountData = useAppKitAccount() as unknown as UseAppKitAccountReturn
// Methods
const connectWallet = async () => {
  try {
    if (!accountData.isConnected) {
      // open()
      await appkit.open()
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message || 'Failed to connect');
    } else {
      toast.error('Failed to connect');
    }
  } finally {
    connecting.value = false;
  }
}

const handleAuth = async () => {
  try {
    if (!isSupportedChain.value) {
      toast.error('Please switch to a supported network');
      return;
    }

    await login(walletAddress.value!, chainId.value!);
    toast.success('Successfully signed in!');
    showDropdown.value = false;
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message || 'Authentication failed');
    } else {
      toast.error('Authentication failed.');
    }
  }
}

const disconnectWallet = async () => {
  try {
    if (isAuthenticated.value) {
      await logout();
      console.info('Signed out');
    }
    await walletDisconnect();
    showDropdown.value = false;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message || 'Disconnect failed');
    } else {
      console.error('Disconnect failed');
    }
  }
}

</script>

<style scoped>
.wallet-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.connect-button {
  background: #4f46e5;
  color: white;
  border: none;
  width: 100%;
}

.connect-button:hover {
  background: #4338ca;
}

.connected-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.connected-actions button {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #111827;
}

.connected-actions button:hover {
  background: #e5e7eb;
}

.connected-actions button:disabled {
  background: #f3f4f6;
  color: #333333;
  cursor: not-allowed;
}

.transaction-info {
  grid-column: span 2;
  padding: 1rem;
  background: #f0fdf4;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
}

.tx-hash {
  font-family: monospace;
  word-break: break-all;
  font-size: 0.875rem;
  color: #065f46;
  margin-top: 0.5rem;
}

.error-message {
  grid-column: span 2;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.875rem;
}
</style>
