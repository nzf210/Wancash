<script lang="ts" setup>
import { ref, unref, watchEffect } from 'vue'
import {
  useDisconnect,
  useAppKit,
  useAppKitNetwork,
  useAppKitAccount,
  type UseAppKitAccountReturn,
  type UseAppKitNetworkReturn
} from "@reown/appkit/vue"
import { networks } from "@/app/components/config/wagmi"
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
import type { AppKitNetwork } from '@reown/appkit/networks'

// Type for test transaction
interface TestTransaction {
  to: Address
  value: ReturnType<typeof parseGwei>
}

const TEST_TX: TestTransaction = {
  to: "0x50200216532355Fa9971074Ca352FA706346c04C", // change to your address
  value: parseGwei('0.00001')
}
// Composable returns with types
const { disconnect } = useDisconnect()
const { open } = useAppKit()

const networkData = unref(useAppKitNetwork()) as UseAppKitNetworkReturn
const accountData = unref(useAppKitAccount()) as UseAppKitAccountReturn

// Wagmi hooks with types
const { data: gas } = useEstimateGas({ ...TEST_TX }) as UseEstimateGasReturnType
const { data: hash, sendTransaction, error } = useSendTransaction() as UseSendTransactionReturnType
const { signMessageAsync } = useSignMessage() as UseSignMessageReturnType

// Reactive data
const txError = ref<Error | null>(null)

// Methods
const openAppKit = () => open()

const switchToNetwork = async () => {
  try {
    await networkData.switchNetwork(networks[1].id as unknown as AppKitNetwork)
  } catch (err) {
    console.error("Network switch error:", err)
    txError.value = err as Error
  }
}

const handleDisconnect = async () => {
  try {
    await disconnect()
  } catch (err) {
    console.error("Disconnect error:", err)
    txError.value = err as Error
  }
}

const handleSignMessage = async () => {
  if (!accountData.address) return

  try {
    const msg = "Hello Reown AppKit!"
    const sig = await signMessageAsync({
      message: msg,
      account: accountData.address as `0x${string}`,
    })
    console.log("Signed message:", sig)
  } catch (err) {
    console.error("Sign message error:", err)
    txError.value = err as Error
  }
}

const handleSendTx = async () => {
  if (!gas.value) return

  try {
    await sendTransaction({
      ...TEST_TX,
      gas: gas.value
    })
  } catch (err) {
    console.error("Transaction error:", err)
    txError.value = err as Error
  }
}

// Watch for changes
watchEffect(() => {
  if (hash.value) {
    console.log("Transaction hash:", hash.value)
  }
  if (error.value) {
    txError.value = error.value
    console.error("Transaction error:", error.value)
  }
})
</script>

<template>
  <div>
    <div v-if="accountData.isConnected">
      <button @click="handleDisconnect">Disconnect</button>
      <button @click="switchToNetwork">Switch Network</button>
      <button @click="handleSignMessage">Sign Message</button>
      <button @click="handleSendTx">Send Transaction</button>

      <div v-if="hash" class="tx-hash">Transaction Hash: {{ hash }}</div>
      <div v-if="txError" class="error">{{ txError.message }}</div>
    </div>
    <button v-else @click="openAppKit">Connect Wallet</button>
  </div>
</template>

<style scoped>
button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background: #4338ca;
}

button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.tx-hash {
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f3f4f6;
  border-radius: 0.375rem;
  font-family: monospace;
  word-break: break-all;
}

.error {
  color: #ef4444;
  margin-top: 1rem;
}
</style>
