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
        <span class="wallet-address text-sm">
          {{ shortenAddress(walletAddress) }}
        </span>
        <span class="auth-status">(Sign In)</span>
      </span>
    </button>

    <!-- State 3: Connected and Authenticated -->
    <div v-else-if="isConnected && isAuthenticated" class="authenticated-state">
      <!-- Tampilkan ProfileIcon untuk desktop -->
      <ProfileIcon v-if="!isMobile" :auth-stores="profileAuthStores" />

      <!-- Untuk mobile, tampilkan versi minimalis -->
      <div v-else class="mobile-wallet-info">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
            {{ profileAuthStores.userInitials }}
          </div>
          <span class="text-xs truncate max-w-[80px]">
            {{ shortenAddress(walletAddress) }}
          </span>
        </div>
      </div>
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
import { useAppKitAccount } from '@reown/appkit/vue'
import { Spinner } from '@/components/ui/spinner'
import { appkit } from '@/app/components/config/appkit'

defineProps<{
  isMobile: boolean
}>()

// Composables
const { isConnected, address: walletAddress, chainId } = useConnection()
const { mutateAsync: walletDisconnect } = useDisconnect()
const { isAuthenticated, login, logout, checkAuth, loading: authLoading, user } = useAuth()
const { isSupportedChain, getChainInfo } = useChain()
const accountData = useAppKitAccount()

// State
const connecting = ref(false)
const recentChainChange = ref(false)

// Computed
const currentChain = computed(() => getChainInfo(chainId.value || 0))

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
}))

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
  if (!connected || !address) {
    console.log('Wallet disconnected')
  } else {
    console.log('Wallet connected:', address)
    await checkAuth()
  }
})

// Lifecycle hooks
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

  if (isConnected.value && walletAddress.value) {
    await checkAuth()
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
  flex-direction: column;
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
