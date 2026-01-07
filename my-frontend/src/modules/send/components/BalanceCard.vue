<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{ walletBalance: number; tokenPrice: number }>()
const emit = defineEmits<{
  refresh: []
}>()

const isRefreshing = ref(false)

const formatNumber = (num: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
const formatCurrency = (num: number) => new Intl.NumberFormat('id-ID').format(Math.round(num))

const handleRefresh = async () => {
  if (isRefreshing.value) return

  isRefreshing.value = true
  emit('refresh')

  // Simulasi loading selama 1.5 detik
  setTimeout(() => {
    isRefreshing.value = false
  }, 1500)
}
</script>

<template>
  <div class="mb-8">
    <div
      class="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl"></div>

      <!-- Refresh Button -->
      <button @click="handleRefresh" :disabled="isRefreshing"
        class="absolute mt-1 md:-mt-3 Md:-ml-4 md:top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
        aria-label="Refresh balance">
        <svg :class="{ 'animate-spin': isRefreshing }" class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      <div class="relative p-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center md:text-left">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Available Token Balance</p>
            <div class="flex items-center justify-center md:justify-start gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(walletBalance) }} WCH</p>
            </div>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Equivalent Value</p>
            <p class="text-xl font-bold text-blue-600 dark:text-blue-400">USD {{ formatCurrency(walletBalance *
              tokenPrice) }}</p>
          </div>
          <div class="text-center md:text-right">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Token Price</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">USD {{ tokenPrice }} $ / WCH
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
