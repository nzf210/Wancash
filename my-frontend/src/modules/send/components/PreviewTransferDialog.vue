<script lang="ts" setup>
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

defineProps<{ open: boolean; form: { recipientAddress: string; amount: string; memo: string }; recipientName: string; networkFee: number; totalAmount: number }>()

defineEmits<{ 'update:open': [boolean]; 'confirm-transfer': [] }>()

const formatNumber = (num: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
const shortenAddress = (address: string) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <DialogHeader>
        <DialogTitle class="text-gray-900 dark:text-white">Preview Transfer</DialogTitle>
        <DialogDescription class="text-gray-600 dark:text-gray-400">Review transfer details before confirming
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-6 py-4">
        <div class="space-y-4">
          <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
            <span class="text-gray-600 dark:text-gray-400">Recipient:</span>
            <div class="text-right">
              <p class="font-semibold text-gray-900 dark:text-white">{{ recipientName || 'Unknown' }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-mono">{{ shortenAddress(form.recipientAddress) }}
              </p>
            </div>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
            <span class="text-gray-600 dark:text-gray-400">Amount:</span>
            <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(Number(form.amount)) }}
              GLD</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
            <span class="text-gray-600 dark:text-gray-400">Network Fee:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatNumber(networkFee) }} GLD</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-600 dark:text-gray-400">Total:</span>
            <span class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(totalAmount) }} GLD</span>
          </div>
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-gray-600 dark:text-gray-400 mb-2">Note:</p>
            <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">{{ form.memo
              || 'No note' }}</p>
          </div>
        </div>
      </div>
      <DialogFooter class="flex-col sm:flex-row gap-2">
        <Button @click="$emit('update:open', false)"
          class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">Back</Button>
        <Button @click="$emit('confirm-transfer')"
          class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Confirm Transfer
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
