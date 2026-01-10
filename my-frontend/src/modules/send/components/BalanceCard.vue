<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  walletBalance: number
  tokenPrice: number
  nativeBalance: number
  nativeCurrencySymbol: string
}>()
const emit = defineEmits<{
  refresh: []
}>()

const isRefreshing = ref(false)

const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
const formatCurrency = (num: number) => new Intl.NumberFormat('en-US').format(Math.round(num))

// Special formatting for native balance to show proper decimals
const formatNativeBalance = (num: number) => {
  if (num === 0) return '0.0000'
  if (num < 0.0001) return '< 0.0001'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6
  }).format(num)
}

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
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Native Coin Balance</p>
            <div class="flex items-center justify-center gap-2">
              <div
                class="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-400 flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472a4.265 4.265 0 01.264-.521z" />
                </svg>
              </div>
              <p class="text-xl font-bold text-yellow-600 dark:text-yellow-400">{{ formatNativeBalance(nativeBalance) }}
                {{
                  nativeCurrencySymbol }}</p>
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
