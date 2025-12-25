<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useAppKit, useAppKitAccount, type UseAppKitAccountReturn } from '@reown/appkit/vue'
import ProfileIcon from './ProfileIcon.vue'

const { open } = useAppKit()
const accountData = useAppKitAccount() as unknown as UseAppKitAccountReturn

import { authService } from '@/utils/auth.service'
import { toast } from 'vue-sonner'
import { useConnection } from '@wagmi/vue'
import { wagmiConfig } from './config/appkit'
import { signMessage as signMessageAsync } from '@wagmi/core'
import { useAuthStore } from '@/app/stores/auth'

const { address, isConnected } = useConnection()


const authStore = useAuthStore()
// Local state
const isLoading = ref(false)
const error = ref('')
const signMessage = ref('')
const currentNonce = ref('')

// Computed - HAPUS user computed karena sudah dari props
const isAuthenticated = computed(() => authService.isAuthenticated)
// const authInitialized = computed(() => authService.initialized.value)

// Props - SIMPLIFIKASI props
defineProps<{
  isMobile: boolean
}>()

// Computed untuk cek kesamaan wallet - gunakan dari authService
const isSameWallet = computed(() => {
  if (!address.value || !authService.user.value) return false
  return address.value.toLowerCase() === authService.user.value.wallet_address.toLowerCase()
})

const handleAutoLogin = async (): Promise<boolean> => {
  if (!isSameWallet.value || !authService.token.value) return false

  isLoading.value = true
  error.value = ''

  try {
    const { valid, user: updatedUser } = await authService.validateTokenWithUser(
      authService.token.value
    )

    if (valid) {
      if (updatedUser) {
        // Update user state jika ada perubahan
        authService.user.value = updatedUser
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      console.log('Session restored via auto-login')
      return true
    }

    // Token invalid, minta sign baru
    return false
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message || 'Auto login failed'
      console.error('Auto login error:', err)
    }
    return false
  } finally {
    isLoading.value = false
  }
}

const connectWallet = async () => {
  if (!accountData.isConnected) {
    open()
  }
}

const handleSignAndLogin = async () => {
  if (!address.value) {
    toast.error('Wallet not connected')
    return
  }

  // Cek jika auto-login mungkin
  if (isSameWallet.value && authService.isAuthenticated) {
    const autoLoggedIn = await handleAutoLogin()
    if (autoLoggedIn) {
      return // Auto login sukses, tidak perlu sign
    }
  }

  // Auto login gagal atau wallet berbeda, perlu sign
  isLoading.value = true
  error.value = ''

  try {
    // 1. Request nonce dari server
    const nonceResponse = await authService.requestNonce(address.value)
    currentNonce.value = nonceResponse.nonce
    signMessage.value = nonceResponse.message

    // 2. Sign message dengan wallet
    const signature = await signMessageAsync(wagmiConfig, {
      message: nonceResponse.message
    })

    // 3. Login dengan signature
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
      console.error('Unknown error authenticating:', err);
    }
  } finally {
    isLoading.value = false
  }
}

// Watch untuk auto-login saat page load atau wallet reconnect
onMounted(() => {
  if (authService.isAuthenticated && !isConnected.value) {
    toast.info('Please connect your wallet to continue')
  }
})

// Watch auto login ketika wallet connect
watch([isConnected, address], ([newConnected, newAddress]) => {

  if (newConnected && newAddress) {

    // Cek wallet sama dengan stored user
    if (authService.isAuthenticated && authService.user.value) {
      const isSame = newAddress.toLowerCase() === authService.user.value.wallet_address.toLowerCase()
      if (isSame) {
        handleAutoLogin().then(success => {
          if (!success) {
            handleSignAndLogin()
          }
        })
      } else {
        handleSignAndLogin()
      }
    } else if (!authService.isAuthenticated) {
      handleSignAndLogin()
    }
  }
})

watch(isConnected, (newVal) => {
  if (!newVal && isAuthenticated.value) {
    // console.log('Wallet disconnected but user still authenticated')
    // authService.logout()
    authStore.handleDisconnect()
  }
})
</script>

<template>
  <div class="wallet-actions">
    <ProfileIcon v-if="accountData.isConnected && isAuthenticated && !isMobile" :user="authService.user.value"
      :auth-stores="{
        walletAddress: authService.user.value?.wallet_address || null,
        isConnected: accountData.isConnected,
        userAvatar: authService.user.value?.avatar_url || null,
        userDisplayName: authService.user.value?.username || 'User',
        userInitials: (authService.user.value?.username || 'U').charAt(0).toUpperCase(),
        userEmail: authService.user.value?.email || null,
        network: 'Ethereum',
        balance: '0.00',
        handleDisconnect: () => {
          authStore.handleDisconnect()
        }
      }" />
    <button v-else @click="connectWallet" class="connect-button" :disabled="isLoading">
      <span v-if="isLoading">Connecting...</span>
      <span v-else>Connect Wallet</span>
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
