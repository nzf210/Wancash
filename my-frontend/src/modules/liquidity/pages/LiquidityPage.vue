<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Liquidity Pools</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PoolCard v-for="pool in pools" :key="pool.id" :pool="pool" @addLiquidity="openAddLiquidity(pool)" />
    </div>

    <AddLiquidityModal v-if="showAddModal" :pool="selectedPool" @close="showAddModal = false"
      @added="onLiquidityAdded" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PoolCard from '@/modules/liquidity/components/PoolCard.vue'
import AddLiquidityModal from '@/modules/liquidity/components/AddLiquidityModal.vue'

interface Pool {
  id: number
  name: string
  tvl: number
  apy: number
}

const pools = ref<Pool[]>([
  { id: 1, name: 'STG / USDT', tvl: 1200000, apy: 12.3 },
  { id: 2, name: 'STG / ETH', tvl: 800000, apy: 9.7 },
  { id: 3, name: 'STG / BTC', tvl: 500000, apy: 11.2 },
])

const showAddModal = ref(false)
const selectedPool = ref<Pool | null>(null)

function openAddLiquidity(pool: Pool) {
  selectedPool.value = pool
  showAddModal.value = true
}

function onLiquidityAdded(amount: number) {
  if (selectedPool.value) {
    // contoh update TVL
    selectedPool.value.tvl += amount
  }
  showAddModal.value = false
}
</script>
