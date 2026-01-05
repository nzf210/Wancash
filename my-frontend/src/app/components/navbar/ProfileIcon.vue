<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useNavigate } from '../../composables/useNavigate'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Copy, User, BriefcaseBusiness, Settings, LogOut } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { computed } from 'vue'
import ReadContract from '../ReadContract.vue'

const { goToPortfolio, goToProfile, goToSettings } = useNavigate()

// Props
const props = defineProps<{
  authStores: {
    walletAddress: string | null
    isConnected: boolean
    userAvatar: string | null
    userDisplayName: string
    userInitials: string
    userEmail: string | null
    network?: string
    balance?: number | string
    handleDisconnect: () => void
  }
}>()

// Computed properties
const avatarFallback = computed(() => {
  if (props.authStores.userInitials?.trim()) {
    return props.authStores.userInitials
  }

  if (props.authStores.userDisplayName) {
    const initials = props.authStores.userDisplayName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
    return initials || 'U'
  }

  return 'U'
})

const avatarSrc = computed(() => {
  if (props.authStores.userAvatar?.trim()) {
    return props.authStores.userAvatar
  }
  return null
})

const formatWalletAddress = (address: string | null): string => {
  if (!address) return 'Not connected'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const copyToClipboard = async () => {
  if (!props.authStores.walletAddress) return

  try {
    await navigator.clipboard.writeText(props.authStores.walletAddress)
    toast.success('Wallet address copied!')
  } catch (err) {
    console.error('Failed to copy:', err)
    toast.error('Failed to copy address')
  }
}

// Event handlers
const handleAvatarError = (e: Event) => {
  const target = e.target as HTMLElement
  target.style.display = 'none'
}

const handleDisconnect = () => {
  props.authStores.handleDisconnect()
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <div class="relative inline-block">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="relative h-10 w-10 rounded-full hover:bg-accent p-0">
                <Avatar class="h-10 w-10">
                  <AvatarImage :src="avatarSrc || 'avatar-placeholder.png'" :alt="authStores.userDisplayName"
                    @error="handleAvatarError" />
                  <AvatarFallback class="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {{ avatarFallback }}
                  </AvatarFallback>
                </Avatar>

                <div v-if="authStores.isConnected"
                  class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-56 z-[1000]" align="end" :side-offset="8">
              <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium leading-none">{{ authStores.userDisplayName }}</p>
                  <p v-if="authStores.userEmail" class="text-xs leading-none text-muted-foreground">
                    {{ authStores.userEmail }}
                  </p>
                  <p v-if="authStores.walletAddress" class="text-xs font-mono text-gray-500">
                    {{ formatWalletAddress(authStores.walletAddress) }}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem @click="goToProfile" class="cursor-pointer">
                <User class="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>

              <DropdownMenuItem @click="goToPortfolio" class="cursor-pointer">
                <BriefcaseBusiness class="mr-2 h-4 w-4" />
                <span>Portfolio</span>
              </DropdownMenuItem>

              <DropdownMenuItem @click="goToSettings" class="cursor-pointer">
                <Settings class="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem @click="handleDisconnect"
                class="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Disconnect</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipTrigger>

      <TooltipContent side="bottom" align="end"
        class="z-[1001] p-0 border-2 transition-all duration-300 border-purple-300 dark:border-gray-600"
        :side-offset="5">
        <div class="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-md">
          <!-- Wallet Address Section -->
          <div class="mb-4">
            <p class="text-xs font-medium mb-2 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              WALLET ADDRESS
            </p>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
              <div class="flex items-center justify-between">
                <p class="font-mono text-sm text-gray-900 dark:text-white font-medium truncate mr-2">
                  {{ formatWalletAddress(authStores.walletAddress) }}
                </p>
                <Button v-if="authStores.walletAddress" variant="ghost" size="icon"
                  class="h-7 w-7 flex-shrink-0 hover:bg-purple-50 dark:hover:bg-gray-700" @click="copyToClipboard"
                  title="Copy address">
                  <Copy class="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Status & Network Section -->
          <div v-if="authStores.isConnected"
            class="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <div>
                <span class="text-sm font-medium text-green-700 dark:text-green-300">
                  Connected
                </span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Online</p>
              </div>
            </div>

            <Badge v-if="authStores.network" variant="secondary"
              class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-2 py-0.5">
              {{ authStores.network }}
            </Badge>
          </div>

          <!-- Balance Section -->
          <div v-if="authStores.balance !== undefined">
            <p class="text-xs font-medium mb-2 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              BALANCE
            </p>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
              <div v-if="authStores.network" class="flex justify-between items-center mb-1">
                <span class="text-sm text-gray-600 dark:text-gray-400">WCH Balance &nbsp;</span>
                <Badge variant="outline"
                  class="text-xs px-2 py-0.5 border-purple-200 dark:border-gray-600 text-purple-600 dark:text-purple-400">
                  {{ authStores.network }}
                </Badge>
              </div>
              <ReadContract />
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                  ≈ ${{ (Number(authStores.balance) * 3500).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }) }}
                </span>
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  <span class="text-xs text-green-600 dark:text-green-400">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
