<template>
  <div
    class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
    <div class="p-6">
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center p-2">
          <ChainIcon :chain="currentChain" />
        </div>
        <h3 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Transfer Information</h3>
      </div>

      <div class="space-y-4">
        <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
          <span class="text-xs md:text-sm text-gray-600 dark:text-gray-400">Minimum Transfer</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(minimumTransfer) }} WCH</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
          <span class="text-xs md:text-sm text-gray-600 dark:text-gray-400">Maximum per Transaction</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(maxTransferPerTx) }} WCH</span>
        </div>
        <div class="flex justify-between items-center py-2">
          <span class="text-xs md:text-sm text-gray-600 dark:text-gray-400">Daily Limit</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(dailyLimit) }} WCH</span>
        </div>
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">Network</p>
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center p-1.5">
              <ChainIcon :chain="currentChain" />
            </div>
            <span class="font-semibold text-gray-900 dark:text-white">{{ network }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useChain } from '@/app/composables/useChain'
import ChainIcon from '@/modules/bridge/components/ChainIcon.vue'

defineProps<{ minimumTransfer: number; maxTransferPerTx: number; dailyLimit: number; network: string }>()

const { currentChain } = useChain()

const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
</script>
