<template>
  <div class="card p-4 flex flex-col justify-between">
    <div>
      <h2 class="font-semibold text-lg">{{ pool.name }}</h2>
      <p>TVL: ${{ pool.tvl.toLocaleString() }}</p>
      <p>APY: {{ pool.apy }}%</p>
    </div>
    <button @click="$emit('addLiquidity')" class="btn btn-primary mt-4 self-start">
      Add Liquidity
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Pool {
  id: number
  name: string
  tvl: number
  apy: number
}

const props = defineProps<{ pool: Pool }>()
</script>
