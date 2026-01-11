<template>
  <div class="flex items-center justify-center">
    <template v-if="token">
      <!-- WAN Token -->
      <img v-if="token.symbol === 'WAN' || token.symbol === 'WCH'" :src="wancashLogo" alt="Wancash"
        class="w-full h-full rounded-full object-contain" />

      <!-- Token Logos from Central Source -->
      <img v-else-if="getTokenLogo(token.symbol)" :src="getTokenLogo(token.symbol)" :alt="token.symbol"
        class="w-full h-full object-contain rounded-full" />

      <!-- Default token icon -->
      <svg v-else class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    </template>

    <!-- Fallback icon -->
    <svg v-else class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import type { Token } from '../types/bridge.types'
import { CHAIN_LOGOS } from '@/shared/constants/chainLogos'
import wancashLogo from '@/assets/image/logo.jpg'

defineProps<{
  token: Token | null
}>()

const getTokenLogo = (symbol: string): string | undefined => {
  const map: Record<string, string> = {
    'ETH': CHAIN_LOGOS.ETHEREUM,
    'AVAX': CHAIN_LOGOS.AVALANCHE,
    'MATIC': CHAIN_LOGOS.POLYGON,
    'BNB': CHAIN_LOGOS.BSC,
    'ARB': CHAIN_LOGOS.ARBITRUM,
    'WETH': CHAIN_LOGOS.ETHEREUM,
  }
  return map[symbol]
}
</script>
