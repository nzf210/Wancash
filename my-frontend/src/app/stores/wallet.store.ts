import { defineStore } from "pinia"
import { useConnection, useChainId } from "@wagmi/vue"

export const useWalletStore = defineStore("wallet", () => {
  const { address, isConnected } = useConnection()
  const chainId = useChainId()

  return { address, isConnected, chainId }
})
