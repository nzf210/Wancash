<script setup lang="ts">
import { watch } from 'vue'
import { useAppKit, useAppKitAccount, type UseAppKitAccountReturn } from '@reown/appkit/vue'
import { useWalletStore } from '@/app/stores/wallet.store'
import ProfileIcon from './ProfileIcon.vue'
import { supabase } from '@/utils/supabase'

const { open } = useAppKit()
const walletStore = useWalletStore()

const connectWallet = async () => {
  if (!walletStore.isConnected) {
    open() // ✅ save the wallet to the store
  }
}

const accountData = useAppKitAccount() as unknown as UseAppKitAccountReturn

watch(
  () => walletStore.isConnected,
  async (connected) => {
    console.log('✅ Wallet address:', walletStore.address)
    if (!connected || !walletStore.address) return

    const { data: usrData, error: errGet } = await supabase.from('profiles').select('*').eq('wallet_address', walletStore.address)
    if (errGet) {
      console.error('❌ Supabase get error:', errGet)
      return
    }

    if (usrData && usrData.length > 0) {
      console.log('✅ Profile already exists')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          wallet_address: walletStore.address,
          last_login: new Date().toISOString()
        },
        { onConflict: 'wallet_address' }
      )
    console.log('✅ Wallet ChaindId:', walletStore.chainId)

    if (error) {
      console.error('❌ Supabase upsert error:', error)
    } else {
      console.log('✅ Profile recorded')
    }
  },
  { immediate: true }
)

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
