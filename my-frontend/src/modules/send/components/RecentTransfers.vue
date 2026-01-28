<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { useChain } from '@/app/composables/useChain'
import { useAuth } from '@/app/composables/useAuth'
import ChainIcon from '@/modules/bridge/components/ChainIcon.vue'

const { getExplorerTxUrl, currentChain } = useChain()
const { walletAddress } = useAuth()

defineProps<{
  recentTransfers: Array<{
    id: number | string;
    recipientShort: string;
    amount: number | string;
    time: string;
    status: string;
    hash?: string;
    toAddress?: string; // Need this for isIncoming
  }>
}>()

defineEmits<{ 'go-to-history': [] }>()

const formatNumber = (num: number | string) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(Number(num))

const isIncomingTransfer = (transfer: any) => {
  if (!walletAddress.value || !transfer.toAddress) return false
  return transfer.toAddress.toLowerCase() === walletAddress.value.toLowerCase()
}
</script>

<template>
  <div
    class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
    <div class="p-6">
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-2">
          <ChainIcon :chain="currentChain" class="w-full h-full" />
        </div>
        <h3 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Recent Transfers</h3>
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
            <!-- View on Explorer Link -->
            <a v-if="transfer.hash && getExplorerTxUrl(transfer.hash)" :href="getExplorerTxUrl(transfer.hash)"
              target="_blank" rel="noopener noreferrer"
              class="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-1">
              <span>View Tx</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <div class="text-right">
            <p :class="[
              'font-semibold',
              isIncomingTransfer(transfer) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            ]">
              {{ isIncomingTransfer(transfer) ? '+' : '-' }}{{ formatNumber(transfer.amount) }} WCH
            </p>
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
