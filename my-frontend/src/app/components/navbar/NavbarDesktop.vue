<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ThemeToggle from '../ThemeToggle.vue'
import WalletAuthButton from './WalletAuthButton.vue'
import { useConnection } from '@wagmi/vue'
import { useAuth } from '@/app/composables/useAuth'
import type { NavbarProps, NavbarEmits } from './types'
import { navigationItems, productMenuItems } from './menuItem'

// Composables
const { isConnected, address: walletAddress } = useConnection()
const { checkAuth } = useAuth()


// Props & Emits
const props = defineProps<NavbarProps>()
const emit = defineEmits<NavbarEmits>()

// State
const route = useRoute()
const isScrolled = ref(false)

// Computed
const hasNotifications = computed(() => props.notificationCount || 1 > 0)

// Methods
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

const handleNotificationClick = () => {
  emit('notificationClick')
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  if (isConnected.value && walletAddress.value) {
    checkAuth()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header :class="[
    'sticky top-0 z-50 w-full border-b transition-all duration-300',
    isScrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' : 'bg-background'
  ]">
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

      <!-- Desktop Navigation -->
      <div class="flex items-center gap-8">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger class="gap-2">
                <span>Services</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                  <li v-for="item in productMenuItems" :key="item.href">
                    <NavigationMenuLink as-child>
                      <RouterLink :to="item.href"
                        class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group">
                        <div class="flex items-center gap-2">
                          <span>{{ item.icon }}</span>
                          <div class="text-sm font-medium leading-none">{{ item.title }}</div>
                        </div>
                        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {{ item.description }}
                        </p>
                      </RouterLink>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem v-for="item in navigationItems" :key="item.href">
              <RouterLink :to="item.href" :class="[
                navigationMenuTriggerStyle(),
                route.path === item.href ? 'bg-accent text-accent-foreground' : ''
              ]">
                {{ item.title }}
              </RouterLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <!-- Desktop Actions -->
      <div class="flex items-center gap-4">
        <ThemeToggle v-if="props.showThemeToggle" />

        <!-- Show WalletConnect when not authenticated -->
        <WalletAuthButton :isMobile="false" />

        <!-- Show ProfileIcon and Notifications when authenticated -->
        <div v-if="(props.notificationCount || 0) >= 1" class="flex flex-row">
          <!-- Notifications -->
          <Button variant="ghost" size="icon" class="relative mr-4 mt-1" @click="handleNotificationClick">
            <span class="sr-only">Notifikasi</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <Badge v-if="hasNotifications && props.notificationCount || 0 > 99" variant="destructive"
              class="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {{ props.notificationCount || 0 > 99 ? '99+' : props.notificationCount }}
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  background-color: var(--accent);
  color: var(--accent-foreground);
  border-radius: var(--radius-md);
}

.desktop-menu-item:hover {
  background-color: var(--accent);
  color: var(--accent-foreground);
}
</style>
