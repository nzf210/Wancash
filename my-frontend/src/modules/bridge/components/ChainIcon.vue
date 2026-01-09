<template>
  <div class="flex items-center justify-center">
    <template v-if="chain">
      <!-- Image icon if available -->
      <img v-if="chain.icon" :src="chain.icon" :alt="chain.name" class="w-full h-full object-contain" />

      <!-- SVG fallbacks for chains without icon -->
      <template v-else>
        <!-- WANChain -->
        <svg v-if="chain.network === 'wanchain'" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L1 21h22L12 2zm0 3.5l8.5 15h-17L12 5.5z" />
        </svg>

        <!-- Ethereum -->
        <svg v-else-if="chain.network === 'ethereum' || chain.network === 'sepolia'" class="w-full h-full"
          viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L3 12l9 10 9-10L12 2zm0 18l-7-8 7-8 7 8-7 8z" />
        </svg>

        <!-- Default icon untuk chain lainnya -->
        <svg v-else class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" />
        </svg>
      </template>
    </template>

    <!-- Fallback icon jika chain tidak ada -->
    <svg v-else class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import type { Chain } from '../types/bridge.types'

defineProps<{
  chain: Chain | null
}>()
</script>
