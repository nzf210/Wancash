<script setup lang="ts">
import Sheet from '@/components/ui/sheet/Sheet.vue'
import SheetContent from '@/components/ui/sheet/SheetContent.vue'
import SheetHeader from '@/components/ui/sheet/SheetHeader.vue'
import SheetTitle from '@/components/ui/sheet/SheetTitle.vue'
import { RouterLink } from 'vue-router'
import WalletAuthButton from './WalletAuthButton.vue'
import type { ProductMenuItem, NavigationItem, ProfileAuthStores } from './types'

interface Props {
  open: boolean
  isConnected: boolean
  isAuthenticated: boolean
  profileInfo?: ProfileAuthStores & { shortAddress?: string }
  productMenuItems: ProductMenuItem[]
  navigationItems: NavigationItem[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
  login: []
  logout: []
  'profile-click': []
}>()

const handleClose = () => {
  emit('update:open', false)
  emit('close')
}
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent side="right" class="w-[300px] sm:w-[400px]">
      <SheetHeader>
        <SheetTitle class="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div class="mt-6 flex flex-col space-y-4">
        <!-- Mobile Navigation Items -->
        <div class="space-y-2">
          <div class="text-sm font-medium text-muted-foreground mb-2">Produk</div>
          <RouterLink v-for="item in productMenuItems" :key="item.href" :to="item.href" @click="handleClose"
            class="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors">
            <span>{{ item.icon }}</span>
            <div>
              <div class="text-sm font-medium">{{ item.title }}</div>
              <div class="text-xs text-muted-foreground">{{ item.description }}</div>
            </div>
          </RouterLink>

          <RouterLink v-for="item in navigationItems" :key="item.href" :to="item.href" @click="handleClose"
            class="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors">
            <div class="text-sm font-medium">{{ item.title }}</div>
          </RouterLink>
        </div>

        <!-- Mobile Auth Info -->
        <div class="space-y-2 pt-4 border-t">
          <!-- Not Connected -->
          <div v-if="!isConnected" class="p-3 bg-accent/50 rounded-lg">
            <WalletAuthButton :is-mobile="true" @login="emit('login')" />
          </div>

          <!-- Connected but Not Authenticated -->
          <div v-else-if="isConnected && !isAuthenticated" class="p-3 bg-accent/50 rounded-lg">
            <WalletAuthButton :is-mobile="true" @login="emit('login')" />
          </div>

          <!-- Connected and Authenticated -->
          <div v-else class="space-y-4">
            <!-- User Info -->
            <div class="flex items-center gap-3 p-3 rounded-lg bg-accent">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                {{ profileInfo?.userInitials }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ profileInfo?.userDisplayName }}</div>
                <div class="text-sm text-muted-foreground truncate">
                  {{ profileInfo?.shortAddress || '' }}
                </div>
                <div class="text-xs text-muted-foreground mt-1">
                  {{ profileInfo?.network }}
                </div>
              </div>
            </div>

            <!-- User Menu -->
            <RouterLink to="/profile" @click="emit('profile-click'); handleClose()"
              class="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>My Profile</span>
            </RouterLink>

            <button @click="emit('logout'); handleClose()"
              class="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors text-red-500 w-full text-left">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
