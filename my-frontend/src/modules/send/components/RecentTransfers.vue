<script lang="ts" setup>
import { Button } from '@/components/ui/button'

defineProps<{ recentTransfers: Array<{ id: number; recipientShort: string; amount: number; time: string; status: string }> }>()
defineEmits<{ 'go-to-history': [] }>()
</script>

<template>
  <div
    class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
    <div class="p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transfers</h3>
      </div>

      <div v-if="recentTransfers.length === 0" class="text-center py-6">
        <p class="text-gray-500 dark:text-gray-400">No transfer history yet</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="transfer in recentTransfers.slice(0, 3)" :key="transfer.id"
          class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <div>
            <p class="font-medium text-sm text-gray-900 dark:text-white">{{ transfer.recipientShort }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ transfer.time }}</p>
          </div>
          <div class="text-right">
            <p class="font-semibold text-red-600 dark:text-red-400">-{{ transfer.amount }} WCH</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ transfer.status }}</p>
          </div>
        </div>
        <Button @click="$emit('go-to-history')"
          class="w-full mt-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-xl">
          View All History
        </Button>
      </div>
    </div>
  </div>
</template>
