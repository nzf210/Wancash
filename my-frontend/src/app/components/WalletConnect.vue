<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAppKit, useAppKitAccount, type UseAppKitAccountReturn } from '@reown/appkit/vue'
import ProfileIcon from './ProfileIcon.vue'

const { open } = useAppKit()
const accountData = useAppKitAccount() as unknown as UseAppKitAccountReturn

import { authService } from '@/utils/auth.service'
import { toast } from 'vue-sonner'
import { useConnection } from '@wagmi/vue'
import { wagmiConfig } from './config/appkit'
import { signMessage as signMessageAsync } from '@wagmi/core'
import { useWalletStore } from '../stores/wallet.store'

const { address, isConnected } = useConnection()

// Local state
const isLoading = ref(false)
const error = ref('')
const signMessage = ref('')
const currentNonce = ref('')

// Computed
const isAuthenticated = computed(() => authService.isAuthenticated)
const walletStore = useWalletStore()

const connectWallet = async () => {
  if (!walletStore.isConnected) {
    open() // ✅ save the wallet to the store
  }
}

watch([isConnected, address], () => {
  if (isConnected.value && address.value) {
    console.log('Wallet connected:', address.value)
    handleSignAndLogin()
  }
})

const handleSignAndLogin = async () => {
  if (!address.value) {
    toast.error('Wallet not connected')
    return
  }

  isLoading.value = true
  error.value = ''


  try {
    // 1. Request nonce from server
    const nonceResponse = await authService.requestNonce(address.value)
    currentNonce.value = nonceResponse.nonce
    signMessage.value = nonceResponse.message

    // 2. Sign the message with wallet
    // const signature = signMessageAsync.mutate({message: nonceResponse.message})0
    const signature = await signMessageAsync(wagmiConfig, { message: nonceResponse.message })

    // 3. Login with signature
    await authService.loginWithSignature(
      address.value,
      signature,
      nonceResponse.nonce
    )

    // 4. Clear temporary state
    signMessage.value = ''
    currentNonce.value = ''

  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message || 'Authentication failed';
      console.error('Authentication error:', err);
    } else {
      // Handle the case when err is not an instance of Error
      console.error('Unknown error authenticating:', err);
    }
  } finally {
    isLoading.value = false
  }
}

// Watch for wallet connection changes
watch(isConnected, (newVal) => {
  if (!newVal && isAuthenticated.value) {
    // Wallet disconnected but user still authenticated
    // You might want to logout or show warning
    authService.logout()
    console.log('Wallet disconnected but user still authenticated')
  }
})

defineProps<{
  isMobile: boolean
}>()
</script>


<template>
  <div class="wallet-actions">
    <ProfileIcon v-if="accountData.isConnected && !isMobile" />
    <button v-else @click="connectWallet" class="connect-button">
      Connect Wallet
    </button>
  </div>
</template>

<style scoped>
.wallet-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.connect-button {
  background: #4f46e5;
  color: white;
  border: none;
  width: 100%;
}

.connect-button:hover {
  background: #4338ca;
}

.connected-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.connected-actions button {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #111827;
}

.connected-actions button:hover {
  background: #e5e7eb;
}

.connected-actions button:disabled {
  background: #f3f4f6;
  color: #333333;
  /* Updated text color with higher contrast */
  cursor: not-allowed;
}

.transaction-info {
  grid-column: span 2;
  padding: 1rem;
  background: #f0fdf4;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
}

.tx-hash {
  font-family: monospace;
  word-break: break-all;
  font-size: 0.875rem;
  color: #065f46;
  margin-top: 0.5rem;
}

.error-message {
  grid-column: span 2;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.875rem;
}
</style>
