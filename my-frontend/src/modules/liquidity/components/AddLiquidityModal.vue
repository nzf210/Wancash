<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

interface Pool {
  id: number
  name: string
  tvl: number
  apy: number
}

const props = defineProps<{ pool: Pool | null }>()
console.log(props.pool)
const amount = ref(0)

function add() {
  if (amount.value <= 0) return
  // Kirim event ke parent
  // Bisa ditambah validasi atau panggil smart contract nanti
  emit('added', amount.value)
  amount.value = 0
}

const emit = defineEmits<{
  (e: 'added', amount: number): void
  (e: 'close'): void
}>()

</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg p-6 w-96">
      <h3 class="text-lg font-semibold mb-4">Add Liquidity to {{ pool?.name }}</h3>
      <input v-model.number="amount" type="number" min="0" placeholder="Amount"
        class="w-full px-3 py-2 border rounded" />
      <div class="mt-4 flex justify-end gap-2">
        <button @click="$emit('close')" class="btn btn-ghost">Cancel</button>
        <button @click="add" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</template>
