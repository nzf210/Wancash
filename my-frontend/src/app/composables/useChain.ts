// frontend/src/composables/useChain.ts
import { computed } from 'vue'
import { useConnection } from '@wagmi/vue'

export const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum', currency: 'ETH', symbol: 'ETH', type: 'Mainnet', fee: 0.1, network: 'ethereum', icon: '/public/wancash.png', eid: 30101 },
  { id: 56, name: 'BSC', currency: 'BNB', symbol: 'BNB', type: 'Mainnet', fee: 0.1, network: 'bsc', icon: '/public/wancash.png', eid: 30102 },
  { id: 97, name: 'BSC Testnet', currency: 'BNB', symbol: 'BNB', type: 'Testnet', fee: 0.1, network: 'bsc-testnet', icon: '/public/wancash.png', eid: 40102 },
  { id: 8453, name: 'Base', currency: 'ETH', symbol: 'ETH', type: 'Layer 2', fee: 0.1, network: 'base', icon: '/public/wancash.png', eid: 30184 },
  { id: 43114, name: 'Avalanche', currency: 'AVAX', symbol: 'AVAX', type: 'Mainnet', fee: 0.1, network: 'avalanche', icon: '/public/wancash.png', eid: 30106 },
  { id: 137, name: 'Polygon', currency: 'MATIC', symbol: 'MATIC', type: 'Mainnet', fee: 0.1, network: 'polygon', icon: '/public/wancash.png', eid: 30109 },
  { id: 11155111, name: 'Sepolia', currency: 'ETH', symbol: 'ETH', type: 'Testnet', fee: 0.1, network: 'sepolia', icon: '/public/wancash.png', eid: 40161 },
  { id: 42161, name: 'Arbitrum', currency: 'ETH', symbol: 'ETH', type: 'Layer 2', fee: 0.1, network: 'arbitrum', icon: '/public/wancash.png', eid: 30110 },
  { id: 80002, name: 'Amoy', currency: 'MATIC', symbol: 'MATIC', type: 'Testnet', fee: 0.1, network: 'amoy', icon: '/public/wancash.png', eid: 40267 },
  { id: 43113, name: 'Fuji', currency: 'AVAX', symbol: 'AVAX', type: 'Testnet', fee: 0.1, network: 'fuji', icon: '/public/wancash.png', eid: 40106 },
  { id: 421614, name: 'Arbitrum Sepolia', currency: 'ETH', symbol: 'ETH', type: 'Layer 2', fee: 0.1, network: 'arbitrum-sepolia', icon: '/public/wancash.png', eid: 40231 }
]

export const useChain = () => {
  // const { chainId, switchChain } = useWallet()
  const { chainId } = useConnection()

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
