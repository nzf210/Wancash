<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ThemeToggle from '../ThemeToggle.vue'

import MobileMenuSheet from './MobileMenuSheet.vue'
import { useConnection, useDisconnect, useConfig } from '@wagmi/vue'
import { readContract } from '@wagmi/core'
import { useAuth } from '@/app/composables/useAuth'
import { useChain } from '@/app/composables/useChain'
import type { NavbarProps, NavbarEmits, ProfileAuthStores } from './types'
import { navigationItems, productMenuItems } from './menuItem'
import { useProfileStore } from '@/modules/profile/store/profileStore'
import { wancashAbi, wancashContractAddress } from '@/app/services/contracts'

// Composables
const { address: walletAddress, chainId, isConnected: wagmiConnected } = useConnection()
const { isAuthenticated, user, logout } = useAuth()
const { getChainInfo } = useChain()
const { mutateAsync: walletDisconnect } = useDisconnect()
const config = useConfig()

// Props & Emits
const props = defineProps<NavbarProps>()
const emit = defineEmits<NavbarEmits>()

// State
const isMobileMenuOpen = ref(false)
const balance = ref('0.00')
const currentChain = computed(() => getChainInfo(chainId.value || 0))
const contractAddress = computed(() => {
  if (!chainId.value) return null
  return wancashContractAddress[chainId.value] ?? '0x03A71968491d55603FFe1b11A9e23eF013f75bCF'
})

// Computed
const hasNotifications = computed(() => props.notificationCount || 1 > 0)

const disconnectWallet = async () => {
  try {
    if (isAuthenticated && isAuthenticated.value) {
      await logout()
      console.info('Signed out')
    }
    await walletDisconnect()
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : 'Disconnect failed')
  }
}

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
    balance.value = '0.00'
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
    refreshBalance()
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
  handleDisconnect: () => disconnectWallet()
})) as unknown as ProfileAuthStores


// Methods
const handleNotificationClick = () => {
  emit('notificationClick')
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background">
    <div class="container flex h-16 items-center justify-between px-4 mx-auto">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <RouterLink to="/" class="flex items-center gap-2 group">
          <img src="@/assets/image/logo.jpg" alt="Wancash Logo" class="w-8 h-8 rounded-full" />
          <span class="text-xl font-bold text-primary">
            Wancash
          </span>
        </RouterLink>
      </div>

      <!-- Mobile Actions -->
      <div class="flex items-center gap-2">
        <ThemeToggle v-if="props.showThemeToggle" />

        <!-- Mobile Notifications (Authenticated) -->
        <Button v-if="false" variant="ghost" size="icon" class="relative h-9 w-9" @click="handleNotificationClick">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <Badge v-if="hasNotifications" variant="destructive"
            class="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
            {{ props.notificationCount || 0 > 9 ? '9+' : props.notificationCount }}
          </Badge>
        </Button>

        <!-- Mobile Menu Button -->
        <Button variant="ghost" size="icon" class="h-9 w-9" @click="isMobileMenuOpen = true">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span class="sr-only">Toggle menu</span>
        </Button>
      </div>

      <!-- Mobile Menu Sheet -->
      <MobileMenuSheet :open="isMobileMenuOpen" :profile-info="profileAuthStores" :product-menu-items="productMenuItems"
        :navigation-items="navigationItems" @update:open="isMobileMenuOpen = $event" @close="closeMobileMenu" />
    </div>
  </header>
</template>

<style scoped>
.mobile-menu-item {
  padding: 0.75rem;
  border-radius: var(--radius-md);
}

.mobile-menu-item:hover {
  background-color: var(--accent);
  color: var(--accent-foreground);
}
</style>
