<template>
  <div class="flex items-center justify-center">
    <template v-if="chain">
      <!-- Image icon from centralized source or chain object -->
      <img v-if="getChainIcon(chain)" :src="getChainIcon(chain)" :alt="chain.name"
        class="w-full h-full object-contain" />

      <!-- SVG fallbacks (legacy/fallback only) -->
      <template v-else>
        <!-- WANChain -->
        <svg v-if="chain.network === 'wanchain'" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L1 21h22L12 2zm0 3.5l8.5 15h-17L12 5.5z" />
        </svg>

        <!-- Ethereum fallback -->
        <svg v-else-if="chain.network === 'ethereum' || chain.network === 'sepolia'" class="w-full h-full"
          viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L3 12l9 10 9-10L12 2zm0 18l-7-8 7-8 7 8-7 8z" />
        </svg>

        <!-- Default icon -->
        <svg v-else class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" />
        </svg>
      </template>
    </template>

    <!-- Fallback icon -->
    <svg v-else class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import type { Chain } from '../types/bridge.types'
import { CHAIN_LOGOS } from '@/shared/constants/chainLogos'

defineProps<{
  chain: Chain | null
}>()

const getChainIcon = (chain: Chain): string | undefined => {
  if (!chain) return undefined

  // Normalize network name for mapping
  const network = chain.network?.toLowerCase() || ''
  const name = chain.name?.toLowerCase() || ''

  // Centralized mapping
  if (network === 'ethereum' || network === 'sepolia' || name.includes('eth')) return CHAIN_LOGOS.ETHEREUM
  if (network === 'bsc' || network === 'bsc-testnet' || name.includes('bsc') || name.includes('bnb')) return CHAIN_LOGOS.BSC
  if (network === 'avalanche' || network === 'fuji' || name.includes('avalanche')) return CHAIN_LOGOS.AVALANCHE
  if (network === 'polygon' || network === 'amoy' || name.includes('polygon') || name.includes('matic')) return CHAIN_LOGOS.POLYGON
  if (network.includes('arbitrum') || name.includes('arbitrum')) return CHAIN_LOGOS.ARBITRUM

  // Fallback to chain.icon if specific mapping not found
  return chain.icon
}
</script>
