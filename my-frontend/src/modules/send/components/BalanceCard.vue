<script lang="ts" setup>
defineProps<{ walletBalance: number; tokenPrice: number }>()

const formatNumber = (num: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
const formatCurrency = (num: number) => new Intl.NumberFormat('id-ID').format(Math.round(num))
</script>

<template>
  <div class="mb-8">
    <div
      class="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl"></div>
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
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(walletBalance) }} GLD</p>
            </div>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Equivalent Value</p>
            <p class="text-xl font-bold text-blue-600 dark:text-blue-400">Rp {{ formatCurrency(walletBalance *
              tokenPrice) }}</p>
          </div>
          <div class="text-center md:text-right">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Token Price</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">Rp {{ formatCurrency(tokenPrice) }} / GLD</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
