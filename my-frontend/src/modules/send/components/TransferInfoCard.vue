<template>
  <div
    class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
    <div class="p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Transfer Information</h3>
      </div>

      <div class="space-y-4">
        <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
          <span class="text-sm text-gray-600 dark:text-gray-400">Minimum Transfer</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(minimumTransfer) }} WCH</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
          <span class="text-sm text-gray-600 dark:text-gray-400">Maximum per Transaction</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(maxTransferPerTx) }} WCH</span>
        </div>
        <div class="flex justify-between items-center py-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Daily Limit</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(dailyLimit) }} WCH</span>
        </div>
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Network</p>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <span class="font-semibold text-gray-900 dark:text-white">Ethereum Mainnet</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ minimumTransfer: number; maxTransferPerTx: number; dailyLimit: number }>()

const formatNumber = (num: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
</script>
