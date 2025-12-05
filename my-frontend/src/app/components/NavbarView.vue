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
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import Sheet from '@/components/ui/sheet/Sheet.vue'
import SheetContent from '@/components/ui/sheet/SheetContent.vue'
import SheetHeader from '@/components/ui/sheet/SheetHeader.vue'
import SheetTitle from '@/components/ui/sheet/SheetTitle.vue'
import SheetTrigger from '@/components/ui/sheet/SheetTrigger.vue'
// import SheetDescription from '@/components/ui/sheet/SheetDescription.vue'
import { Badge } from '@/components/ui/badge'
import ThemeToggle from './ThemeToggle.vue'
import WalletConnect from './WalletConnect.vue'
import ProfileIcon from './ProfileIcon.vue'
import { useAppKitAccount, type UseAppKitAccountReturn } from '@reown/appkit/vue'

const accountData = useAppKitAccount() as unknown as UseAppKitAccountReturn
const isAuthenticated = accountData.isConnected
interface Props {
  user?: {
    name?: string
    email?: string
    avatar?: string
    initials?: string
  }
  notificationCount?: number
  // isAuthenticated?: boolean
  showWalletConnect?: boolean
  showThemeToggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  notificationCount: 0,
  // isAuthenticated: false,
  showWalletConnect: true,
  showThemeToggle: true,
})

// Emits untuk event handling
const emit = defineEmits<{
  login: []
  logout: []
  profileClick: []
  settingsClick: []
  notificationClick: []
}>()

// Reactive state
const route = useRoute()
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

// Menu items configuration
const productMenuItems = [
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

const navigationItems = [
  {
    title: 'Support',
    href: '/help'
  }
]

// Computed properties
const hasNotifications = computed(() => props.notificationCount > 0)


// Scroll handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// Mobile menu handler
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Event handlers
// const handleLogin = () => {
//   emit('login')
// }

const handleNotificationClick = () => {
  emit('notificationClick')
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header :class="[
    'sticky top-0 z-50 w-full border-b transition-all duration-300 navbar-blur',
    isScrolled
      ? 'bg-background navbar-shadow'
      : 'bg-background'
  ]">
    <div class="container flex h-16 items-center justify-between px-4 mx-auto">

      <!-- Logo -->
      <div class="flex items-center gap-2">
        <RouterLink to="/" class="flex items-center gap-2 group">
          <img src="@/assets/image/logo.jpg" alt="Wancash Logo" class="w-8 h-8 rounded-full logo-hover" />
          <span class="text-xl font-bold text-primary transition-colors group-hover:text-primary">
            Wancash
          </span>
        </RouterLink>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8">
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

      <!-- Desktop User Menu -->
      <div class="hidden md:flex items-center gap-4">
        <!-- Wallet Connect Button (Not Authenticated) -->
        <ThemeToggle />
        <WalletConnect v-if="!isAuthenticated" :isMobile="false" />

        <!-- Theme Toggle -->

        <!-- User Menu (Authenticated) -->
        <template v-if="isAuthenticated">
          <!-- Notifications -->
          <Button variant="ghost" size="icon" class="relative hover:bg-accent" @click="handleNotificationClick">
            <span class="sr-only">Notifikasi</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <Badge v-if="hasNotifications" variant="destructive"
              class="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs notification-badge">
              {{ notificationCount > 99 ? '99+' : notificationCount }}
            </Badge>
          </Button>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden flex items-center gap-2">
        <div class="flex">
          <ThemeToggle />
        </div>
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
            {{ notificationCount > 9 ? '9+' : notificationCount }}
          </Badge>
        </Button>

        <!-- Mobile Menu Sheet -->
        <Sheet v-model:open="isMobileMenuOpen">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" class="h-9 w-9">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span class="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-[300px] sm:w-[400px] mobile-sheet">
            <SheetHeader>
              <div>
                <SheetTitle class="text-left">Menu</SheetTitle>
                <div>
                  {{ isAuthenticated }}
                </div>
                <div class="absolute top-2  right-12" v-if="accountData.isConnected">
                  <ProfileIcon />
                </div>
              </div>
            </SheetHeader>

            <div class="mt-6 flex flex-col space-y-4">

              <!-- Mobile Navigation Items -->
              <div class="space-y-2">
                <div class="text-sm font-medium text-muted-foreground mb-2">Produk</div>
                <RouterLink v-for="item in productMenuItems" :key="item.href" :to="item.href" @click="closeMobileMenu"
                  class="flex items-center gap-3 p-3 rounded-md menu-item-hover">
                  <span>{{ item.icon }}</span>
                  <div>
                    <div class="text-sm font-medium">{{ item.title }}</div>
                    <div class="text-xs text-muted-foreground">{{ item.description }}</div>
                  </div>
                </RouterLink>

                <RouterLink v-for="item in navigationItems" :key="item.href" :to="item.href" @click="closeMobileMenu"
                  class="flex items-center gap-3 p-3 rounded-md menu-item-hover">
                  <div class="text-sm font-medium">{{ item.title }}</div>
                </RouterLink>
              </div>


              <!-- Mobile Actions -->
              <div class="space-y-2 pt-4 border-t">
                <div v-if="!isAuthenticated">
                  <WalletConnect :is-mobile="true" />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Smooth transitions menggunakan CSS variables yang sudah ada */
.router-link-active {
  background-color: var(--accent);
  color: var(--accent-foreground);
  border-radius: var(--radius-md);
}

/* Custom styles untuk navbar */
.navbar-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .mobile-menu-item {
    padding: 0.75rem;
    border-radius: var(--radius-md);
  }

  .mobile-menu-item:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
}

/* Desktop specific */
@media (min-width: 769px) {
  .desktop-menu-item:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
}
</style>
