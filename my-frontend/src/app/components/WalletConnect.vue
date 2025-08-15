<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'
import {
  useAppKit,
  useAppKitNetwork,
  useAppKitAccount,
  type UseAppKitAccountReturn,
  type UseAppKitNetworkReturn
} from "@reown/appkit/vue"

import {
  useEstimateGas,
  useSendTransaction,
  useSignMessage,
  type UseEstimateGasReturnType,
  type UseSendTransactionReturnType,
  type UseSignMessageReturnType
} from '@wagmi/vue'
import { parseGwei } from 'viem'
import type { Address } from 'viem'
import ProfileIcon from './ProfileIcon.vue'
import { useAuthStore } from '@/app/stores/auth'
import { formatHexAddress } from '@/utils/format'

const authStore = useAuthStore()

// Type for test transaction
interface TestTransaction {
  to: Address
  value: ReturnType<typeof parseGwei>
}

const TEST_TX: TestTransaction = {
  to: "0x50200216532355Fa9971074Ca352FA706346c04C",
  value: parseGwei('0.00001')
}

// Wallet connection hooks
// const { disconnect } = useDisconnect()
const { open } = useAppKit()
const openAppKit = () => open()
const { caipNetwork, chainId } = useAppKitNetwork() as unknown as UseAppKitNetworkReturn

console.log('caipNetwork', caipNetwork, chainId)
const accountData = useAppKitAccount() as unknown as UseAppKitAccountReturn


// Transaction hooks
const { data: gas } = useEstimateGas({ ...TEST_TX }) as UseEstimateGasReturnType
const { data: hash, sendTransaction, error } = useSendTransaction() as UseSendTransactionReturnType
const { signMessageAsync } = useSignMessage() as UseSignMessageReturnType

// State
const txError = ref<Error | null>(null)
const isLoading = ref(false)

// Wallet actions


const shortAddres = (address: string) => {
  if (!address) return
  return formatHexAddress(address)
}



const connectWallet = async () => {
  try {
    // Misalnya kita mendapatkan data user dari wallet
    await openAppKit()
    const address = accountData.address
    authStore.setUserProfile({
      avatar: 'userData.avatar',
      displayName: 'jhonss',
      initials: shortAddres(address!),
      email: shortAddres(address!) || ''
    })
  } catch (error) {
    console.error('Failed to connect wallet:', error)
  }
}

watch(
  () => accountData, // Langsung observe seluruh object
  (newAccountData) => {
    console.log('newAccountData', newAccountData)
    if (newAccountData.isConnected && newAccountData.address && newAccountData.status === 'connected') {
      authStore.setUserProfile({
        avatar: 'userData.avatar',
        displayName: 'jhonss',
        initials: shortAddres(newAccountData.address!),
        email: shortAddres(newAccountData.address!) || ''
      })
      authStore.setAuthenticationStatus(newAccountData.isConnected)
      const appKitConection = localStorage.getItem('@appkit/connection_status')
      if (appKitConection === 'connected') {
        authStore.setAuthenticationStatus(true)
      } else {
        authStore.handleDisconnect()
      }
    }
  },
  { deep: true } // Penting: aktifkan deep watch
)

// Message signing
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleSignMessage = async () => {
  if (!accountData.address) return

  try {
    isLoading.value = true
    const msg = "Hello Reown AppKit!"
    const sig = await signMessageAsync({
      message: msg,
      account: accountData.address as `0x${string}`,
    })
    console.log("Signed message:", sig)
  } catch (err) {
    console.error("Sign message error:", err)
    txError.value = err as Error
  } finally {
    isLoading.value = false
  }
}

// Transaction handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleSendTx = async () => {
  if (!gas.value) return

  try {
    isLoading.value = true
    await sendTransaction({
      ...TEST_TX,
      gas: gas.value
    })
  } catch (err) {
    console.error("Transaction error:", err)
    txError.value = err as Error
  } finally {
    isLoading.value = false
  }
}

// Watch for transaction state changes
watchEffect(() => {
  if (hash.value) {
    console.log("Transaction hash:", hash.value)
    txError.value = null
  }
  if (error.value) {
    txError.value = error.value
    console.error("Transaction error:", error.value)
  }
})

defineProps<{
  isMobile: boolean
}>()
</script>

<template>
  <div class="wallet-actions">
    <ProfileIcon v-if="accountData.isConnected && !isMobile" />
    <button v-if="!accountData.isConnected" @click="connectWallet" class="connect-button">
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
  color: #9ca3af;
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
