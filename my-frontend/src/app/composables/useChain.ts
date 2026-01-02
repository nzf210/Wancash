// frontend/src/composables/useChain.ts
import { computed } from 'vue'
import { useConnection } from '@wagmi/vue'

export const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum', currency: 'ETH' },
  { id: 56, name: 'BSC', currency: 'ETH' },
  { id: 97, name: 'BSC Test', currency: 'BSC' },
  { id: 8453, name: 'Base', currency: 'ETH' },
  { id: 43114, name: 'Base', currency: 'ETH' },
  { id: 137, name: 'Polygon', currency: 'MATIC' },
  { id: 11155111, name: 'Sepolia', currency: 'ETH' },
  { id: 42161, name: 'Arbitrum', currency: 'ARB' },
  { id: 80002, name: 'Amoy', currency: 'POL' },
  { id: 43113, name: 'Fuji', currency: 'AVA' }
]

export const useChain = () => {
  // const { chainId, switchChain } = useWallet()
  const {  chainId } = useConnection()

  const isSupportedChain = computed(() => {
    if (!chainId.value) return false
    return SUPPORTED_CHAINS.some(chain => chain.id === chainId.value)
  })

  const currentChain = computed(() => {
    if (!chainId.value) return null
    return SUPPORTED_CHAINS.find(chain => chain.id === chainId.value) || null
  })

  const getChainInfo = (chainId: number) => {
    return SUPPORTED_CHAINS.find(chain => chain.id === chainId) || null
  }

  const switchToSupportedChain = async () => {
    if (SUPPORTED_CHAINS.length === 0) return

    try {
      await switchChain(SUPPORTED_CHAINS[0].id)
    } catch (error: unknown) {
      console.error('Failed to switch chain:', error)
      throw error
    }
  }

  return {
    isSupportedChain,
    currentChain,
    supportedChains: SUPPORTED_CHAINS,
    getChainInfo,
    switchToSupportedChain
  }
}


async function switchChain(chainId: number) {
  if (!chainId && !Number.isNaN(chainId))
  throw new Error('Function not implemented.')
}
