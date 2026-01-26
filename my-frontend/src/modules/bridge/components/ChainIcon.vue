<template>
  <div class="flex items-center justify-center">
    <!-- SVG Component -->
    <component v-if="chain && getChainIconComponent(chain)" :is="getChainIconComponent(chain)" class="w-full h-full" />

    <!-- Fallback icon -->
    <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
      <span class="text-[10px] sm:text-xs font-bold text-gray-500">{{ chain?.name?.[0] || '?' }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Chain } from '../types/bridge.types'
import type { Component } from 'vue'
import WancashIcon from '@/components/icons/WancashIcon.vue'
import EthIcon from '@/components/icons/chains/EthIcon.vue'
import BscIcon from '@/components/icons/chains/BscIcon.vue'
import AvaxIcon from '@/components/icons/chains/AvaxIcon.vue'
import MaticIcon from '@/components/icons/chains/MaticIcon.vue'
import ArbIcon from '@/components/icons/chains/ArbIcon.vue'

defineProps<{
  chain: Chain | null
}>()

const getChainIconComponent = (chain: Chain): Component | undefined => {
  if (!chain) return undefined

  // Normalize
  const network = chain.network?.toLowerCase() || ''
  const name = chain.name?.toLowerCase() || ''

  // Wanchain
  if (network === 'wanchain' || name.includes('wan')) return WancashIcon

  // Others
  if (network === 'ethereum' || network === 'sepolia' || network === 'base' || name.includes('eth') || name.includes('base')) return EthIcon
  if (network === 'bsc' || network === 'bsc-testnet' || name.includes('bsc') || name.includes('bnb')) return BscIcon
  if (network === 'avalanche' || network === 'fuji' || name.includes('avalanche')) return AvaxIcon
  if (network === 'polygon' || network === 'amoy' || name.includes('polygon') || name.includes('matic')) return MaticIcon
  if (network.includes('arbitrum') || name.includes('arbitrum')) return ArbIcon

  return undefined
}
</script>
