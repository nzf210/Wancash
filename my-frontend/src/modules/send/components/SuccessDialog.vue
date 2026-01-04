<script lang="ts" setup>
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

defineProps<{ open: boolean; form: { recipientAddress: string; amount: string; memo: string }; recipientName: string; transactionHash: string }>()

defineEmits<{ 'update:open': [boolean]; 'copy-transaction-hash': []; 'go-to-history': [] }>()

const formatNumber = (num: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
const shortenAddress = (address: string) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
const shortenTransactionHash = (hash: string) => hash ? `${hash.slice(0, 8)}...${hash.slice(-6)}` : ''
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <DialogHeader>
        <DialogTitle class="text-center text-green-600 dark:text-green-400">Transfer Successful!</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col items-center justify-center py-4">
        <div
          class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 border border-green-200 dark:border-green-800">
          <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="text-center font-semibold text-gray-900 dark:text-white mb-2">{{ formatNumber(Number(form.amount)) }}
          GLD successfully sent!</p>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-1">To: {{ recipientName ||
          shortenAddress(form.recipientAddress) }}</p>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">Transaction Hash:</p>
        <div class="flex items-center gap-2 mt-2">
          <code
            class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-gray-900 dark:text-white">{{ shortenTransactionHash(transactionHash) }}</code>
          <Button @click="$emit('copy-transaction-hash')"
            class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </Button>
        </div>
      </div>
      <DialogFooter class="flex-col sm:flex-row gap-2">
        <Button @click="$emit('update:open', false)"
          class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">Close</Button>
        <Button @click="$emit('go-to-history')"
          class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">View
          History</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
