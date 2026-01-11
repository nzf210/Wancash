<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <DialogHeader>
                <DialogTitle class="text-gray-900 dark:text-white">Transaction Details</DialogTitle>
            </DialogHeader>
            <div v-if="transaction" class="space-y-6 py-4">
                <!-- Transaction Info -->
                <div class="space-y-4">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                        <span class="text-gray-600 dark:text-gray-400">Status:</span>
                        <span :class="[
                            'font-medium',
                            transaction.status === 'success' ? 'text-green-600 dark:text-green-400' :
                                transaction.status === 'pending' ? 'text-amber-600 dark:text-amber-400' :
                                    'text-red-600 dark:text-red-400'
                        ]">
                            {{ transaction.status === 'success' ? 'Successful' : transaction.status === 'pending' ?
                                'Pending' : 'Failed' }}
                        </span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                        <span class="text-gray-600 dark:text-gray-400">Date:</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ formatDateTime(transaction.date)
                            }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                        <span class="text-gray-600 dark:text-gray-400">Amount:</span>
                        <span class="font-bold text-red-600 dark:text-red-400">-{{ formatNumber(transaction.amount) }}
                            WCH</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                        <span class="text-gray-600 dark:text-gray-400">Fee:</span>
                        <span class="text-gray-900 dark:text-white">{{ formatNumber(transaction.fee) }} WCH</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                        <span class="text-gray-600 dark:text-gray-400">Total:</span>
                        <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{
                            formatNumber(transaction.amount + transaction.fee) }} WCH</span>
                    </div>
                </div>

                <!-- Recipient Info -->
                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">Recipient:</p>
                    <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p class="font-medium text-gray-900 dark:text-white">{{ transaction.recipientName || 'Unknown'
                            }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">{{ transaction.recipient
                            }}</p>
                    </div>
                </div>

                <!-- Transaction Hash -->
                <div v-if="transaction.hash" class="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">Transaction Hash:</p>
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <code class="text-sm font-mono text-gray-900 dark:text-white truncate">
              {{ shortenTransactionHash(transaction.hash) }}
            </code>
                        <button @click="handleCopyHash"
                            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                            Copy
                        </button>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button @click="$emit('update:open', false)"
                    class="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { SendTransaction } from '../types'
import { useFormatters } from '../composables'

interface Props {
    open: boolean
    transaction: SendTransaction | null
}

const props = defineProps<Props>()
defineEmits<{
    'update:open': [value: boolean]
}>()

const { formatNumber, formatDateTime, shortenTransactionHash, copyToClipboard } = useFormatters()

const handleCopyHash = async () => {
    if (props.transaction?.hash) {
        const success = await copyToClipboard(props.transaction.hash)
        if (success) {
            // TODO: Show toast notification
            console.log('Hash copied to clipboard')
        }
    }
}
</script>
