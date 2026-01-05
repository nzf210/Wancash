<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ThemeToggle from '../ThemeToggle.vue'
// import WalletAuthButton from './WalletAuthButton.vue'
import ProfileIcon from './ProfileIcon.vue'
import MobileMenuSheet from './MobileMenuSheet.vue'
import { useConnection } from '@wagmi/vue'
import { useAuth } from '@/app/composables/useAuth'
import { useChain } from '@/app/composables/useChain'
import { shortenAddress } from '@/utils/helpers'
import type { NavbarProps, NavbarEmits, ProductMenuItem, NavigationItem, ProfileAuthStores } from './types'

// Composables
const { isConnected, address: walletAddress, chainId } = useConnection()
const { isAuthenticated, user } = useAuth()
const { getChainInfo } = useChain()

// Props & Emits
const props = defineProps<NavbarProps>()
const emit = defineEmits<NavbarEmits>()

// State
const isMobileMenuOpen = ref(false)
const currentChain = computed(() => getChainInfo(chainId.value || 0))

// Constants
const productMenuItems: ProductMenuItem[] = [
  {
    title: 'Redem',
    description: 'Redem your token for gold',
    href: '/redem',
    icon: '💰'
  },
  {
    title: 'Bridge',
    description: 'Send your token to other chains',
    href: '/bridgeToken',
    icon: '📋'
  },
  {
    title: 'Send',
    description: 'Send your token to other wallet',
    href: '/sendToken',
    icon: '💸'
  }
]

const navigationItems: NavigationItem[] = [
  {
    title: 'Support',
    href: '/support',
  }
]

// Computed
const hasNotifications = computed(() => props.notificationCount || 1 > 0)

const profileAuthStores = computed(() => ({
  walletAddress: walletAddress.value || null,
  isConnected: isAuthenticated.value,
  userAvatar: user.value?.avatar || null,
  userDisplayName: user.value?.name || 'User',
  userInitials: (user.value?.name?.charAt(0) || 'U').toUpperCase(),
  userEmail: user.value?.email || null,
  network: currentChain.value?.name || '',
  balance: '0.00',
  handleDisconnect: () => emit('logout')
}))

const mobileProfileInfo = computed(() => ({
  ...profileAuthStores.value,
  shortAddress: walletAddress.value ? shortenAddress(walletAddress.value) : ''
})) as ProfileAuthStores

// Methods
const handleNotificationClick = () => {
  emit('notificationClick')
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleProfileClick = () => {
  emit('profileClick')
  closeMobileMenu()
}

const handleLogin = () => {
  emit('login')
}

const handleLogout = async () => {
  emit('logout')
  closeMobileMenu()
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
        <Button v-if="isAuthenticated" variant="ghost" size="icon" class="relative h-9 w-9"
          @click="handleNotificationClick">
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

        <!-- Mobile Profile Icon -->
        <ProfileIcon v-if="isConnected && isAuthenticated" :auth-stores="profileAuthStores" :is-mobile="true"
          @profile-click="handleProfileClick" />

        <!-- Mobile Menu Button -->
        <Button variant="ghost" size="icon" class="h-9 w-9" @click="isMobileMenuOpen = true">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span class="sr-only">Toggle menu</span>
        </Button>
      </div>

      <!-- Mobile Menu Sheet -->
      <MobileMenuSheet :open="isMobileMenuOpen" :is-connected="isConnected" :is-authenticated="isAuthenticated"
        :profile-info="mobileProfileInfo" :product-menu-items="productMenuItems" :navigation-items="navigationItems"
        @update:open="isMobileMenuOpen = $event" @close="closeMobileMenu" @login="handleLogin" @logout="handleLogout"
        @profile-click="handleProfileClick" />
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
