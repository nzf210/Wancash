<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { useConnection, useDisconnect } from '@wagmi/vue'
import { useAuth } from '@/app/composables/useAuth'
import { useChain } from '@/app/composables/useChain'
import { shortenAddress } from '@/utils/helpers'
import { toast } from 'vue-sonner'
import ProfileIcon from './ProfileIcon.vue'
import type { EIP1193Provider } from 'viem'
import { useAppKitAccount } from '@reown/appkit/vue'
import { Spinner } from '@/components/ui/spinner'
import { appkit } from '@/app/components/config/appkit'
import type { ProfileAuthStores } from './types'
import { useRouter } from "vue-router"


defineProps<{
  isMobile: boolean
}>()

// Composables
const { isConnected, address: walletAddress, chainId } = useConnection()
const { mutateAsync: walletDisconnect } = useDisconnect()
const { isAuthenticated, login, logout, checkAuth, loading: authLoading, user, authStabilizing } = useAuth()
const { isSupportedChain, getChainInfo } = useChain()
const accountData = useAppKitAccount()

// State
const connecting = ref(false)
const recentChainChange = ref(false)

// Computed
const currentChain = computed(() => getChainInfo(chainId.value || 0))

const router = useRouter()

const profileAuthStores = computed(() => ({
  walletAddress: walletAddress.value || null,
  isConnected: isAuthenticated.value,
  userAvatar: null,
  userDisplayName: user.value?.name || 'User',
  userInitials: (user.value?.name?.charAt(0) || 'U').toUpperCase(),
  userEmail: user.value?.email || null,
  network: currentChain.value?.name || '',
  balance: '0.00',
  handleDisconnect: disconnectWallet
})) as unknown as ProfileAuthStores

// Watchers
watch(chainId, () => {
  console.log('Chain changed to:', chainId.value)
  recentChainChange.value = true
  setTimeout(() => {
    recentChainChange.value = false
  }, 2000)

  if (chainId.value && !isSupportedChain.value) {
    toast.warning('Unsupported network, some features may not work')
  }
})

watch(walletAddress, async (newAddress, oldAddress) => {
  console.log('Wallet address change detected:', { new: newAddress, old: oldAddress })

  if (newAddress === undefined && oldAddress && recentChainChange.value) {
    console.log('Ignoring spurious disconnect after recent chain change')
    return
  }

  if (isAuthenticated.value && newAddress && oldAddress && newAddress !== oldAddress) {
    await logout()
    toast.warning("Wallet address has changed. Please sign in again.")
  }
})

watch([isConnected, walletAddress], async ([connected, address]) => {
  if (authStabilizing.value) return
  if (!connected || !address) {
    console.log('Wallet disconnected')
  } else {
    await checkAuth()
  }
})

// Lifecycle hooks
const handleRedirect = async () => {
  if (isAuthenticated.value) {
    const route = sessionStorage.getItem('intended_route')
    console.log('intended_route', route)
    if (route) {
      sessionStorage.removeItem('intended_route')
      router.replace(route)
    }
  }
}

watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    handleRedirect()
  }
})

onMounted(async () => {
  if (globalThis.window?.ethereum) {
    const ethereum = globalThis.window.ethereum as EIP1193Provider

    const handleAccountsChanged = async (accounts: string[]) => {
      console.log('MetaMask accounts changed:', accounts)

      if (accounts.length === 0 && recentChainChange.value) {
        console.log('Ignoring spurious disconnect after recent chain change')
        return
      }

      if (isAuthenticated.value && accounts.length > 0 && accounts[0] !== walletAddress.value) {
        await logout()
        toast.warning('MetaMask account has changed. Please sign in again.')
      }
    }

    ethereum.on('accountsChanged', handleAccountsChanged)

    onUnmounted(() => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged)
    })
  } else {
    console.log('Ethereum is not available')
  }

  // Initial check
  if (isConnected.value && walletAddress.value) {
    await checkAuth();
    await handleRedirect();
  }
})

// Methods
const connectWallet = async () => {
  try {
    connecting.value = true
    if (!accountData.value.isConnected) {
      await appkit.open()
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : 'Failed to connect')
  } finally {
    connecting.value = false
  }
}

const handleAuth = async () => {
  try {
    if (!isSupportedChain.value) {
      toast.error('Please switch to a supported network')
      return
    }
    await login(walletAddress.value!, chainId.value!)
  } catch (error: unknown) {
    toast.error(error instanceof Error ? error.message : 'Authentication failed')
  }
}

const disconnectWallet = async () => {
  try {
    if (isAuthenticated.value) {
      await logout()
      console.info('Signed out')
    }
    await walletDisconnect()
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : 'Disconnect failed')
  }
}
</script>

<template>
  <div class="wallet-auth-container">
    <!-- State 1: Not Connected -->
    <button v-if="!isConnected" @click="connectWallet" :disabled="connecting" class="connect-button">
      <span v-if="connecting" class="spinner"></span>
      {{ connecting ? 'Connecting...' : 'Connect Wallet' }}
    </button>

    <!-- Loading State -->
    <div v-if="authLoading" class="flex items-center">
      <Spinner class="mr-2" />
      <span class="auth-loading">Loading...</span>
    </div>

    <!-- State 2: Connected but Not Authenticated -->
    <button v-else-if="isConnected && !isAuthenticated" @click="handleAuth" :disabled="authLoading"
      class="connect-button">
      <span v-if="authLoading" class="spinner"></span>
      <span v-else class="wallet-info">
        <span class="wallet-address text-[10px]">
          {{ shortenAddress(walletAddress) }}
        </span>
        <span class="auth-status">(Sign In)</span>
      </span>
    </button>

    <!-- State 3: Connected and Authenticated -->
    <div v-else-if="isConnected && isAuthenticated" class="authenticated-state">
      <ProfileIcon v-if="!isMobile" :auth-stores="profileAuthStores" />
    </div>
  </div>
</template>

<style scoped>
.wallet-auth-container {
  display: flex;
  align-items: center;
}

.connect-button {
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.connect-button:hover {
  background: #4338ca;
}

.connect-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.wallet-info {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.wallet-address {
  font-family: monospace;
}

.auth-status {
  font-size: 0.8em;
  opacity: 0.8;
}

.spinner {
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.auth-loading {
  margin-left: 8px;
}
</style>
