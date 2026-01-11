<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Token Redemption History</h3>
            <div class="flex items-center gap-3">
                <select v-model="redeemFilterStatus"
                    class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
        </div>

        <!-- Redeem Transaction Cards -->
        <div v-if="transactions.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="redeem in transactions" :key="redeem.id"
                class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div class="p-6">
                    <!-- Header with Status -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div :class="[
                                'w-3 h-3 rounded-full',
                                redeem.status === 'completed' ? 'bg-green-500' :
                                    redeem.status === 'processing' ? 'bg-blue-500' :
                                        redeem.status === 'pending' ? 'bg-amber-500' :
                                            'bg-red-500'
                            ]"></div>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ getStatusLabel(redeem.status) }}
                            </span>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(redeem.date) }}</span>
                    </div>

                    <!-- Bank & Amount Info -->
                    <div class="mb-6">
                        <div class="flex items-center gap-3 mb-3">
                            <div
                                class="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="flex-1">
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{
                                    formatNumber(redeem.amount) }} WCH</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Redeem Amount</p>
                            </div>
                        </div>
                    </div>

                    <!-- Bank Details -->
                    <div class="space-y-3 mb-4">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Bank:</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{ redeem.bankName }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Account Name:</span>
                            <span class="text-gray-900 dark:text-white">{{ redeem.accountName }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Account Number:</span>
                            <span class="font-mono text-gray-900 dark:text-white">{{
                                formatAccountNumber(redeem.accountNumber) }}</span>
                        </div>

                        <div v-if="redeem.processingTime" class="flex justify-between items-center">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Processing Time:</span>
                            <span class="text-gray-900 dark:text-white">{{ redeem.processingTime }}</span>
                        </div>

                        <!-- Reject Reason (if rejected) -->
                        <div v-if="redeem.status === 'rejected' && redeem.rejectReason"
                            class="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p class="text-xs font-medium text-gray-900 dark:text-white mb-1">Reject Reason:</p>
                            <p class="text-sm text-red-600 dark:text-red-400">{{ redeem.rejectReason }}</p>
                        </div>

                        <!-- Transaction Hash -->
                        <div v-if="redeem.transactionHash" class="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Transaction Hash:</p>
                            <div class="flex items-center justify-between">
                                <code class="text-xs font-mono text-gray-900 dark:text-white truncate">
                  {{ shortenTransactionHash(redeem.transactionHash) }}
                </code>
                                <button @click="handleCopyHash(redeem.transactionHash)"
                                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs">
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button @click="$emit('view-details', redeem)"
                            class="w-full py-2 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <div
                class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No redemption history yet</h4>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                You haven't redeemed any tokens to your bank account yet. Try redeeming tokens to see history here.
            </p>
            <Button @click="$emit('go-to-redeem')"
                class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl px-6">
                Try Redeem Token
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import type { RedeemTransaction, RedeemStatus } from '../types'
import { useFormatters } from '../composables'

interface Props {
    transactions: RedeemTransaction[]
}

defineProps<Props>()
defineEmits<{
    'view-details': [redeem: RedeemTransaction]
    'go-to-redeem': []
}>()

const { formatNumber, formatDate, shortenTransactionHash, copyToClipboard } = useFormatters()

const redeemFilterStatus = ref<'all' | RedeemStatus>('all')

const getStatusLabel = (status: RedeemStatus): string => {
    const labels: Record<RedeemStatus, string> = {
        completed: 'Completed',
        processing: 'Processing',
        pending: 'Pending',
        rejected: 'Rejected',
    }
    return labels[status]
}

const formatAccountNumber = (accountNumber: string): string => {
    // Format account number with dots for readability
    if (accountNumber.length > 4) {
        return `${accountNumber.slice(0, -4).replace(/./g, '•')}${accountNumber.slice(-4)}`
    }
    return accountNumber
}

const handleCopyHash = async (hash: string) => {
    const success = await copyToClipboard(hash)
    if (success) {
        // TODO: Show toast notification instead of console
        console.log('Hash copied to clipboard')
    }
}
</script>
