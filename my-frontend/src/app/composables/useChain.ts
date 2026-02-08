// frontend/src/composables/useChain.ts
import { computed } from 'vue'
import { useConnection } from '@wagmi/vue'

// Check if we're in production mode
const isProduction = import.meta.env.VITE_NODE_ENV === 'production'

// Mainnet chains (for production)
export const MAINNET_CHAINS = [
  { id: 1, name: 'Ethereum', currency: 'ETH', symbol: 'ETH', type: 'Mainnet', fee: 0.1, network: 'ethereum', icon: '', eid: 30101, explorerUrl: import.meta.env.VITE_EXPLORER_URL_ETH || 'https://etherscan.io' },
  { id: 56, name: 'BSC', currency: 'BNB', symbol: 'BNB', type: 'Mainnet', fee: 0.1, network: 'bsc', icon: '', eid: 30102, explorerUrl: import.meta.env.VITE_EXPLORER_URL_BSC || 'https://bscscan.com' },
  { id: 8453, name: 'Base', currency: 'ETH', symbol: 'ETH', type: 'Layer 2', fee: 0.1, network: 'base', icon: '/wancash.png', eid: 30184, explorerUrl: import.meta.env.VITE_EXPLORER_URL_BASE || 'https://basescan.org' },
  { id: 43114, name: 'Avalanche', currency: 'AVAX', symbol: 'AVAX', type: 'Mainnet', fee: 0.1, network: 'avalanche', icon: '', eid: 30106, explorerUrl: import.meta.env.VITE_EXPLORER_URL_AVALANCE || 'https://snowtrace.io' },
  { id: 137, name: 'Polygon', currency: 'MATIC', symbol: 'MATIC', type: 'Mainnet', fee: 0.1, network: 'polygon', icon: '', eid: 30109, explorerUrl: import.meta.env.VITE_EXPLORER_URL_POLYGON || 'https://polygonscan.com' },
  { id: 42161, name: 'Arbitrum', currency: 'ETH', symbol: 'ETH', type: 'Layer 2', fee: 0.1, network: 'arbitrum', icon: '', eid: 30110, explorerUrl: import.meta.env.VITE_EXPLORER_URL_ARBITRUM || 'https://arbiscan.io' },
]

// Testnet chains (for development)
export const TESTNET_CHAINS = [
  { id: 97, name: 'BSC Testnet', currency: 'BNB', symbol: 'BNB', type: 'Testnet', fee: 0.1, network: 'bsc-testnet', icon: '', eid: 40102, explorerUrl: import.meta.env.VITE_EXPLORER_URL_BSC || 'https://testnet.bscscan.com' },
  { id: 11155111, name: 'Sepolia', currency: 'ETH', symbol: 'ETH', type: 'Testnet', fee: 0.1, network: 'sepolia', icon: '', eid: 40161, explorerUrl: import.meta.env.VITE_EXPLORER_URL_ETH || 'https://sepolia.etherscan.io' },
  { id: 80002, name: 'Amoy', currency: 'MATIC', symbol: 'MATIC', type: 'Testnet', fee: 0.1, network: 'amoy', icon: '', eid: 40267, explorerUrl: import.meta.env.VITE_EXPLORER_URL_POLYGON || 'https://amoy.polygonscan.com' },
  { id: 43113, name: 'Fuji', currency: 'AVAX', symbol: 'AVAX', type: 'Testnet', fee: 0.1, network: 'fuji', icon: '', eid: 40106, explorerUrl: import.meta.env.VITE_EXPLORER_URL_AVALANCE || 'https://testnet.snowtrace.io' },
  { id: 421614, name: 'Arbitrum Sepolia', currency: 'ETH', symbol: 'ETH', type: 'Testnet', fee: 0.1, network: 'arbitrum-sepolia', icon: '', eid: 40231, explorerUrl: import.meta.env.VITE_EXPLORER_URL_ARBITRUM || 'https://sepolia.arbiscan.io' },
]

// Export the appropriate chains based on environment
export const SUPPORTED_CHAINS = isProduction ? MAINNET_CHAINS : TESTNET_CHAINS

// Standalone helper for getting explorer URL (valid for both User and Admin)
export const getChainExplorerUrl = (chainId: number | undefined, txHash: string): string => {
  if (!txHash) return '#'
  if (!chainId) return '#' // or fallback to a default chain?

  // Search in both lists to be safe (Admin might view Mainnet tx in Testnet env or vice versa)
  const chain = [...MAINNET_CHAINS, ...TESTNET_CHAINS].find(c => c.id === chainId)

  if (chain) {
    return `${chain.explorerUrl}/tx/${txHash}`
  }

  // Fallback for unknown chains
  return '#'
}

export const getChainName = (chainId: number | undefined): string => {
  if (!chainId) return 'Unknown'
  const chain = [...MAINNET_CHAINS, ...TESTNET_CHAINS].find(c => c.id === chainId)
  return chain ? chain.name : `Chain ${chainId}`
}

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

  // Get explorer transaction URL for a specific chain
  const getExplorerTxUrl = (txHash: string, chainIdParam?: number): string => {
    const targetChainId = chainIdParam ?? chainId.value
    return getChainExplorerUrl(targetChainId, txHash)
  }

  return {
    isSupportedChain,
    currentChain,
    supportedChains: SUPPORTED_CHAINS,
    getChainInfo,
    getExplorerTxUrl,
    switchToSupportedChain
  }
}


async function switchChain(chainId: number) {
  if (!chainId && !Number.isNaN(chainId))
    throw new Error('Function not implemented.')
}
