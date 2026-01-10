<script lang="ts" setup>
import { useChain } from '@/app/composables/useChain'

const { currentChain } = useChain()

defineProps<{ estimatedTime: string; amount: number }>()

// Format for native currency (small decimals like ETH gas)
const formatGasFee = (num: number) => {
  if (num < 0.0001) return '< 0.0001'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6
  }).format(num)
}

// Format for token amounts (WCH)
const formatNumber = (num: number) => new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4
}).format(num)
</script>
<template>
  <div
    class="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
    <div class="space-y-4">
      <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="text-sm text-gray-700 dark:text-gray-300">Network Fee (Gas Fee)</span>
        <span class="font-medium text-gray-900 dark:text-white">
          ~{{ formatGasFee(0.0001) }} {{ currentChain?.symbol || 'ETH' }}
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">(estimated)</span>
        </span>
      </div>
      <div class="flex justify-between items-center py-2">
        <span class="text-sm text-gray-700 dark:text-gray-300">Estimated Time</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ estimatedTime }}</span>
      </div>
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <span class="font-semibold text-gray-900 dark:text-white">Amount to Send</span>
          <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(amount) }} WCH</span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          * Gas fee will be paid in {{ currentChain?.symbol || 'native coin' }} from your wallet
        </p>
      </div>
    </div>
  </div>
</template>
