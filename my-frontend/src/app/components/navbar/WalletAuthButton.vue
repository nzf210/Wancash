<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useConnection, useDisconnect, useConfig } from '@wagmi/vue'
import { readContract } from '@wagmi/core'
import { useAuth } from '@/app/composables/useAuth'
import { useProfileStore } from '@/modules/profile/store/profileStore'
import { useChain } from '@/app/composables/useChain'
import { shortenAddress } from '@/utils/helpers'
import { toast } from 'vue-sonner'
import ProfileIcon from './ProfileIcon.vue'
import { useAppKitAccount } from '@reown/appkit/vue'
import { Spinner } from '@/components/ui/spinner'
import { appkit } from '@/app/components/config/appkit'
import type { ProfileAuthStores } from './types'
import { useRouter } from "vue-router"
import { wancashAbi, wancashContractAddress } from '@/app/services/contracts'

defineProps<{ isMobile: boolean }>()

// Composables
const { isConnected: wagmiConnected, address: walletAddress, chainId } = useConnection()
const { mutateAsync: walletDisconnect } = useDisconnect()
const { isAuthenticated, login, logout, isLoading, user } = useAuth()
const { isSupportedChain, getChainInfo } = useChain()
const accountData = useAppKitAccount() // Keep reown/appkit for modal opening
const router = useRouter()
const config = useConfig()

// State
const isConnectingWallet = ref(false)
const balance = ref('0.00')

// Computed
const currentChain = computed(() => getChainInfo(chainId.value || 0))
const contractAddress = computed(() => {
  if (!chainId.value) return null
  return wancashContractAddress[chainId.value] ?? '0x03A71968491d55603FFe1b11A9e23eF013f75bCF'
})

const profileStore = useProfileStore()

// Balance Fetching
const refreshBalance = async () => {
  if (!wagmiConnected.value || !walletAddress.value || !contractAddress.value) {
    balance.value = '0.00'
    return
  }
  try {
    const rawBalance = await readContract(config, {
      address: contractAddress.value as `0x${string}`,
      abi: wancashAbi.abi,
      functionName: 'balanceOf',
      args: [walletAddress.value as `0x${string}`],
    }) as bigint

    // Format balance (assuming 18 decimals)
    const formatted = Number(rawBalance) / 1e18
    balance.value = formatted.toFixed(4)
  } catch (err) {
    console.error('Failed to fetch balance:', err)
    balance.value = '0.00' // Keep as 0 on error
  }
}

// Watchers
watch([wagmiConnected, walletAddress, chainId], () => {
  refreshBalance()
})

// Watch for auth changes to fetch profile
watch([() => isAuthenticated.value, () => walletAddress.value], async ([auth, address]) => {
  if (auth && address) {
    await profileStore.fetchProfile(address)
    refreshBalance() // Also fetch balance when auth changes
  } else {
    profileStore.reset()
    balance.value = '0.00'
  }
}, { immediate: true })

const profileAuthStores = computed(() => ({
  walletAddress: walletAddress.value || null,
  isConnected: isAuthenticated.value,
  userAvatar: profileStore.avatarUrl || user.value?.avatar || null,
  userDisplayName: profileStore.displayName || user.value?.name || 'User',
  userInitials: ((profileStore.displayName || user.value?.name)?.charAt(0) || 'U').toUpperCase(),
  userEmail: profileStore.profile?.email || user.value?.email || null,
  network: currentChain.value?.name || '',
  balance: balance.value,
  handleDisconnect: disconnectWallet
})) as unknown as ProfileAuthStores

// Methods
const connectWallet = async () => {
  try {
    isConnectingWallet.value = true
    if (!accountData.value.isConnected) {
      await appkit.open()
      // Wait a bit for modal to settle
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  } catch (error: any) {
    toast.error(error.message || 'Failed to connect')
  } finally {
    isConnectingWallet.value = false
  }
}

const handleSignIn = async () => {
  try {
    if (!isSupportedChain.value) {
      toast.error('Please switch to a supported network')
      return
    }
    if (!walletAddress.value || !chainId.value) {
      toast.error('Wallet not fully connected')
      return
    }
    await login(walletAddress.value, chainId.value)
  } catch (error: any) {
    // Error handling is mostly done in useAuth, but safe fallback here
    console.error(error)
  }
}

const disconnectWallet = async () => {
  try {
    await logout()
  } catch (error: any) {
    console.error('Logout failed', error)
  }
}

// Watch for authentication to handle redirects
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    const route = sessionStorage.getItem('intended_route')
    if (route) {
      sessionStorage.removeItem('intended_route')
      router.replace(route)
    }
  }
})

</script>

<template>
  <div class="wallet-auth-container">
    <!-- State 1: Not Connected (Wagmi level) -->
    <button v-if="!wagmiConnected" @click="connectWallet" :disabled="isConnectingWallet" class="connect-button">
      <Spinner v-if="isConnectingWallet" class="spinner-sm mr-2" />
      {{ isConnectingWallet ? 'Connecting...' : 'Connect Wallet' }}
    </button>

    <!-- State 2: Loading Auth Status -->
    <div v-else-if="isLoading" class="flex items-center px-4 py-2 bg-slate-100 rounded-lg dark:bg-slate-800">
      <Spinner class="spinner-sm mr-2" />
      <span class="text-sm font-medium">Verifying...</span>
    </div>

    <!-- State 3: Connected but Not Authenticated (Need to Sign In) -->
    <button v-else-if="wagmiConnected && !isAuthenticated" @click="handleSignIn"
      class="connect-button bg-orange-600 hover:bg-orange-700">
      <span class="wallet-info">
        <span class="wallet-address text-[10px] opacity-90 mr-2">
          {{ shortenAddress(walletAddress) }}
        </span>
        <span class="auth-status font-bold">Sign In</span>
      </span>
    </button>

    <!-- State 4: Fully Authenticated -->
    <div v-else-if="wagmiConnected && isAuthenticated" class="authenticated-state">
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

.spinner-sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
}
</style>
