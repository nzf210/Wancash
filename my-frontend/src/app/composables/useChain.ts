// frontend/src/composables/useChain.ts
import { computed } from 'vue'
import { useConnection } from '@wagmi/vue'

// Check if we're in production mode
const isProduction = import.meta.env.VITE_NODE_ENV === 'production'

// Mainnet chains (for production)
export const MAINNET_CHAINS = [
  { id: 1, name: 'Ethereum', currency: 'ETH', symbol: 'ETH', type: 'Mainnet', fee: 0.1, network: 'ethereum', icon: '/wancash.png', eid: 30101 },
  { id: 56, name: 'BSC', currency: 'BNB', symbol: 'BNB', type: 'Mainnet', fee: 0.1, network: 'bsc', icon: '/wancash.png', eid: 30102 },
  { id: 8453, name: 'Base', currency: 'ETH', symbol: 'ETH', type: 'Layer 2', fee: 0.1, network: 'base', icon: '/wancash.png', eid: 30184 },
  { id: 43114, name: 'Avalanche', currency: 'AVAX', symbol: 'AVAX', type: 'Mainnet', fee: 0.1, network: 'avalanche', icon: '/wancash.png', eid: 30106 },
  { id: 137, name: 'Polygon', currency: 'MATIC', symbol: 'MATIC', type: 'Mainnet', fee: 0.1, network: 'polygon', icon: '/wancash.png', eid: 30109 },
  { id: 42161, name: 'Arbitrum', currency: 'ETH', symbol: 'ETH', type: 'Layer 2', fee: 0.1, network: 'arbitrum', icon: '/wancash.png', eid: 30110 },
]

// Testnet chains (for development)
export const TESTNET_CHAINS = [
  { id: 97, name: 'BSC Testnet', currency: 'BNB', symbol: 'BNB', type: 'Testnet', fee: 0.1, network: 'bsc-testnet', icon: '/wancash.png', eid: 40102 },
  { id: 11155111, name: 'Sepolia', currency: 'ETH', symbol: 'ETH', type: 'Testnet', fee: 0.1, network: 'sepolia', icon: '/wancash.png', eid: 40161 },
  { id: 80002, name: 'Amoy', currency: 'MATIC', symbol: 'MATIC', type: 'Testnet', fee: 0.1, network: 'amoy', icon: '/wancash.png', eid: 40267 },
  { id: 43113, name: 'Fuji', currency: 'AVAX', symbol: 'AVAX', type: 'Testnet', fee: 0.1, network: 'fuji', icon: '/wancash.png', eid: 40106 },
  { id: 421614, name: 'Arbitrum Sepolia', currency: 'ETH', symbol: 'ETH', type: 'Testnet', fee: 0.1, network: 'arbitrum-sepolia', icon: '/wancash.png', eid: 40231 },
]

// Export the appropriate chains based on environment
export const SUPPORTED_CHAINS = isProduction ? MAINNET_CHAINS : TESTNET_CHAINS

export const useChain = () => {

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
