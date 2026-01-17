<template>
  <div class="flex items-center justify-center">
    <template v-if="token">
      <!-- WAN Token -->
      <WancashIcon v-if="token.symbol === 'WAN' || token.symbol === 'WCH'" class-name="w-full h-full" />

      <!-- Chain Tokens (SVG Components) -->
      <component v-else-if="getTokenIcon(token.symbol)" :is="getTokenIcon(token.symbol)" class="w-full h-full" />

      <!-- Fallback / Default -->
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
import WancashIcon from '@/components/icons/WancashIcon.vue'
import EthIcon from '@/components/icons/chains/EthIcon.vue'
import BscIcon from '@/components/icons/chains/BscIcon.vue'
import AvaxIcon from '@/components/icons/chains/AvaxIcon.vue'
import MaticIcon from '@/components/icons/chains/MaticIcon.vue'
import ArbIcon from '@/components/icons/chains/ArbIcon.vue'
import type { Component } from 'vue'

defineProps<{
  token: Token | null
}>()

const getTokenIcon = (symbol: string): Component | undefined => {
  const map: Record<string, Component> = {
    'ETH': EthIcon,
    'AVAX': AvaxIcon,
    'MATIC': MaticIcon,
    'BNB': BscIcon,
    'ARB': ArbIcon,
    'WETH': EthIcon,
  }
  return map[symbol]
}
</script>
