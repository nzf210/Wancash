<template>
  <div class="card p-4">
    <h2 class="font-semibold">Stake STG</h2>
    <div class="mt-3">
      <input v-model.number="amount" type="number" class="w-full px-3 py-2 border rounded" placeholder="Amount" />
    </div>
    <div class="mt-3 flex gap-2">
      <button @click="stake" class="btn btn-primary">Stake</button>
      <button @click="max" class="btn btn-ghost">Max</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStakingStore } from '../store/staking.store'

const amount = ref(0)
const store = useStakingStore()

function stake() {
  if (amount.value <= 0) return
  store.stake(amount.value)
  amount.value = 0
}
function max() {
  amount.value = store.balance
}
</script>
