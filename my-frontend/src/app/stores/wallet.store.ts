// // stores/wallet.store.ts
import { defineStore } from 'pinia'
import { useConnection, useChainId } from '@wagmi/vue'

export const useWalletStore = defineStore('wallet', () => {
  const { address, isConnected, status } = useConnection()
  const chainId = useChainId()

  return {
    address,
    isConnected,
    status,
    chainId
  }
})
