<script setup lang="ts">
import Sheet from '@/components/ui/sheet/Sheet.vue'
import SheetContent from '@/components/ui/sheet/SheetContent.vue'
import SheetHeader from '@/components/ui/sheet/SheetHeader.vue'
import SheetTitle from '@/components/ui/sheet/SheetTitle.vue'
import { RouterLink } from 'vue-router'
// import WalletAuthButton from './WalletAuthButton.vue'
import type { ProductMenuItem, NavigationItem, ProfileAuthStores } from './types'
import ProfileIcon from './ProfileIcon.vue'
import { useAppKitAccount } from '@reown/appkit/vue'
import { appkit } from '@/app/components/config/appkit'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAuth } from '@/app/composables/useAuth'
import { useConnection } from '@wagmi/vue'
import { shortenAddress } from '@/utils/helpers'
import { useChain } from '@/app/composables/useChain'
import Spinner from '@/components/ui/spinner/Spinner.vue'

interface Props {
  open: boolean
  // isConnected: boolean
  // isAuthenticated: boolean
  profileInfo: ProfileAuthStores
  productMenuItems: ProductMenuItem[]
  navigationItems: NavigationItem[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const handleClose = () => {
  emit('update:open', false)
}

const accountData = useAppKitAccount()

// State
const connecting = ref(false)

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

const { isConnected, address: walletAddress, chainId } = useConnection()
const { isSupportedChain } = useChain()
const { isAuthenticated, login, loading: authLoading } = useAuth()

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
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent side="right" class="w-[300px] sm:w-[400px]">
      <SheetHeader class="flex flex-row gap-32">
        <SheetTitle class="text-left">Menu</SheetTitle>
        <div v-if="isConnected && isAuthenticated">
          <ProfileIcon :auth-stores="{ isConnected: isConnected, ...profileInfo }" />
        </div>
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
        <div class="space-y-2 border-t mx-auto">
          <!-- Not Connected -->
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
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>


<style scoped>
.wallet-auth-container {
  display: flex;
  align-items: center;
}

.connect-button {
  padding: 0.2rem 0.2rem;
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
