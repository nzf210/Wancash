// frontend/src/composables/useChain.ts
import { computed } from 'vue'
import { useConnection } from '@wagmi/vue'

import { CHAIN_LOGOS } from '@/shared/constants/chainLogos'

// Check if we're in production mode
const isProduction = import.meta.env.VITE_NODE_ENV === 'production'

// Mainnet chains (for production)
export const MAINNET_CHAINS = [
  { id: 1, name: 'Ethereum', currency: 'ETH', symbol: 'ETH', type: 'Mainnet', fee: 0.1, network: 'ethereum', icon: CHAIN_LOGOS.ETHEREUM, eid: 30101, explorerUrl: 'https://etherscan.io' },
  { id: 56, name: 'BSC', currency: 'BNB', symbol: 'BNB', type: 'Mainnet', fee: 0.1, network: 'bsc', icon: CHAIN_LOGOS.BSC, eid: 30102, explorerUrl: 'https://bscscan.com' },
  { id: 8453, name: 'Base', currency: 'ETH', symbol: 'ETH', type: 'Layer 2', fee: 0.1, network: 'base', icon: '/wancash.png', eid: 30184, explorerUrl: 'https://basescan.org' },
  { id: 43114, name: 'Avalanche', currency: 'AVAX', symbol: 'AVAX', type: 'Mainnet', fee: 0.1, network: 'avalanche', icon: CHAIN_LOGOS.AVALANCHE, eid: 30106, explorerUrl: 'https://snowtrace.io' },
  { id: 137, name: 'Polygon', currency: 'MATIC', symbol: 'MATIC', type: 'Mainnet', fee: 0.1, network: 'polygon', icon: CHAIN_LOGOS.POLYGON, eid: 30109, explorerUrl: 'https://polygonscan.com' },
  { id: 42161, name: 'Arbitrum', currency: 'ETH', symbol: 'ETH', type: 'Layer 2', fee: 0.1, network: 'arbitrum', icon: CHAIN_LOGOS.ARBITRUM, eid: 30110, explorerUrl: 'https://arbiscan.io' },
]

// Testnet chains (for development)
export const TESTNET_CHAINS = [
  { id: 97, name: 'BSC Testnet', currency: 'BNB', symbol: 'BNB', type: 'Testnet', fee: 0.1, network: 'bsc-testnet', icon: CHAIN_LOGOS.BSC, eid: 40102, explorerUrl: 'https://testnet.bscscan.com' },
  { id: 11155111, name: 'Sepolia', currency: 'ETH', symbol: 'ETH', type: 'Testnet', fee: 0.1, network: 'sepolia', icon: CHAIN_LOGOS.ETHEREUM, eid: 40161, explorerUrl: 'https://sepolia.etherscan.io' },
  { id: 80002, name: 'Amoy', currency: 'MATIC', symbol: 'MATIC', type: 'Testnet', fee: 0.1, network: 'amoy', icon: CHAIN_LOGOS.POLYGON, eid: 40267, explorerUrl: 'https://amoy.polygonscan.com' },
  { id: 43113, name: 'Fuji', currency: 'AVAX', symbol: 'AVAX', type: 'Testnet', fee: 0.1, network: 'fuji', icon: CHAIN_LOGOS.AVALANCHE, eid: 40106, explorerUrl: 'https://testnet.snowtrace.io' },
  { id: 421614, name: 'Arbitrum Sepolia', currency: 'ETH', symbol: 'ETH', type: 'Testnet', fee: 0.1, network: 'arbitrum-sepolia', icon: CHAIN_LOGOS.ARBITRUM, eid: 40231, explorerUrl: 'https://sepolia.arbiscan.io' },
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

  // Get explorer transaction URL for a specific chain
  const getExplorerTxUrl = (txHash: string, chainIdParam?: number): string => {
    const targetChainId = chainIdParam ?? chainId.value
    if (!targetChainId) return ''

    const chain = SUPPORTED_CHAINS.find(c => c.id === targetChainId)
    if (!chain) return ''

    return `${chain.explorerUrl}/tx/${txHash}`
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
