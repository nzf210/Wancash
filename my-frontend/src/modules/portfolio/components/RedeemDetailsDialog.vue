<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="sm:max-w-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <DialogHeader>
                <DialogTitle class="text-gray-900 dark:text-white flex items-center gap-3">
                    <div
                        class="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    Redemption Details
                </DialogTitle>
            </DialogHeader>

            <div v-if="transaction" class="space-y-6 py-4">
                <!-- Status Badge -->
                <div class="flex items-center justify-center">
                    <span :class="[
                        'px-4 py-2 rounded-full text-sm font-semibold',
                        statusClass
                    ]">
                        {{ getStatusLabel(transaction.status) }}
                    </span>
                </div>

                <!-- Amount Section -->
                <div class="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">
                        {{ formatNumber(transaction.amount) }} WCH
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Redemption Amount</p>
                </div>

                <!-- Details Grid -->
                <div class="space-y-3">
                    <div class="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                        <span class="text-gray-600 dark:text-gray-400">Date</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ formatDateTime(transaction.date)
                        }}</span>
                    </div>

                    <div class="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                        <span class="text-gray-600 dark:text-gray-400">Recipient Name</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ transaction.bankName }}</span>
                    </div>

                    <div class="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                        <span class="text-gray-600 dark:text-gray-400">Account Name</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ transaction.accountName }}</span>
                    </div>

                    <div class="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                        <span class="text-gray-600 dark:text-gray-400">Phone Number</span>
                        <span class="font-mono text-gray-900 dark:text-white">{{ transaction.accountNumber }}</span>
                    </div>

                    <div v-if="transaction.processingTime"
                        class="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
                        <span class="text-gray-600 dark:text-gray-400">Processing Time</span>
                        <span class="text-gray-900 dark:text-white">{{ transaction.processingTime }}</span>
                    </div>
                </div>

                <!-- Reject Reason (if rejected) -->
                <div v-if="transaction.status === 'rejected' && transaction.rejectReason"
                    class="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                    <p class="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Rejection Reason:</p>
                    <p class="text-sm text-red-600 dark:text-red-400">{{ transaction.rejectReason }}</p>
                </div>

                <!-- Transaction Hash (if available) -->
                <div v-if="transaction.transactionHash" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">Transaction Hash:</p>
                    <div class="flex items-center justify-between">
                        <code class="text-sm font-mono text-gray-600 dark:text-gray-400 truncate flex-1 mr-2">
                            {{ shortenTransactionHash(transaction.transactionHash) }}
                        </code>
                        <button @click="handleCopyHash"
                            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                            Copy
                        </button>
                    </div>
                </div>

                <!-- Status Timeline/Info -->
                <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p class="text-sm font-medium text-blue-800 dark:text-blue-300">{{
                                getStatusInfo(transaction.status).title }}</p>
                            <p class="text-sm text-blue-600 dark:text-blue-400">{{
                                getStatusInfo(transaction.status).description }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter class="gap-2">
                <Button @click="$emit('update:open', false)"
                    class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { RedeemTransaction, RedeemStatus } from '../types'
import { useFormatters } from '../composables'

interface Props {
    open: boolean
    transaction: RedeemTransaction | null
}

const props = defineProps<Props>()
defineEmits<{
    'update:open': [value: boolean]
}>()

const { formatNumber, formatDateTime, shortenTransactionHash, copyToClipboard } = useFormatters()

const statusClass = computed(() => {
    if (!props.transaction) return ''
    switch (props.transaction.status) {
        case 'completed':
            return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        case 'processing':
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
        case 'pending':
            return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        case 'rejected':
            return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        default:
            return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
    }
})

const getStatusLabel = (status: RedeemStatus): string => {
    const labels: Record<RedeemStatus, string> = {
        completed: 'Completed',
        processing: 'Processing',
        pending: 'Pending',
        rejected: 'Rejected',
    }
    return labels[status]
}

const getStatusInfo = (status: RedeemStatus): { title: string; description: string } => {
    const info: Record<RedeemStatus, { title: string; description: string }> = {
        pending: {
            title: 'Awaiting Processing',
            description: 'Your redemption request has been submitted and is waiting to be processed by our team.'
        },
        processing: {
            title: 'Being Processed',
            description: 'Your redemption is currently being processed. You will receive confirmation shortly.'
        },
        completed: {
            title: 'Redemption Complete',
            description: 'Your token redemption has been successfully completed.'
        },
        rejected: {
            title: 'Redemption Rejected',
            description: 'Unfortunately, your redemption request was rejected. Please check the reason above.'
        },
    }
    return info[status]
}

const handleCopyHash = async () => {
    if (props.transaction?.transactionHash) {
        const success = await copyToClipboard(props.transaction.transactionHash)
        if (success) {
            toast.success('Transaction hash copied to clipboard')
        }
    }
}
</script>
