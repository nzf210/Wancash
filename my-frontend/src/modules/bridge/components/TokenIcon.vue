<template>
  <div class="flex items-center justify-center">
    <template v-if="token">
      <!-- WAN Token -->
      <svg v-if="token.symbol === 'WAN'" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="16" text-anchor="middle" font-size="10" fill="white">W</text>
      </svg>

      <!-- Ethereum -->
      <svg v-else-if="token.symbol === 'ETH'" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L3 12l9 10 9-10L12 2zm0 18l-7-8 7-8 7 8-7 8z" />
      </svg>

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

defineProps<{
  token: Token | null
}>()
</script>
