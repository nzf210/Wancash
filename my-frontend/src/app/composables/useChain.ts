// frontend/src/composables/useChain.ts
import { computed } from 'vue'
import { useConnection } from '@wagmi/vue'

export const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum', currency: 'ETH' },
  { id: 137, name: 'Polygon', currency: 'MATIC' },
  { id: 42161, name: 'Arbitrum', currency: 'ETH' },
  { id: 10, name: 'Optimism', currency: 'ETH' },
  { id: 80002, name: 'Amoy', currency: 'POL' }
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
