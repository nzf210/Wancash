<script lang="ts" setup>
defineProps<{ networkFee: number; estimatedTime: string; totalAmount: number }>()

const formatNumber = (num: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
</script>
<template>
  <div
    class="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
    <div class="space-y-4">
      <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="text-sm text-gray-700 dark:text-gray-300">Network Fee (Gas Fee)</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ formatNumber(networkFee) }} GLD</span>
      </div>
      <div class="flex justify-between items-center py-2">
        <span class="text-sm text-gray-700 dark:text-gray-300">Estimated Time</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ estimatedTime }}</span>
      </div>
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <span class="font-semibold text-gray-900 dark:text-white">Total to be Sent</span>
          <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(totalAmount) }} GLD</span>
        </div>
      </div>
    </div>
  </div>
</template>
