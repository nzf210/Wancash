<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent
            class="w-[95vw] max-w-lg sm:max-w-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
            <div class="max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div
                    class="px-6 py-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10 transition-colors">
                    <DialogHeader>
                        <DialogTitle class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
                            <div
                                class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="flex flex-col">
                                <span>Redemption Details</span>
                                <span class="text-sm font-normal text-gray-500 dark:text-gray-400 mt-0.5">
                                    Transaction ID: #{{ transaction?.id }}
                                </span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div v-if="transaction" class="px-6 py-6 space-y-8">
                    <!-- Top Section: Amount & Status -->
                    <div class="grid sm:grid-cols-2 gap-6">
                        <!-- Amount Card -->
                        <div
                            class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-6 border border-gray-100 dark:border-gray-700/50">
                            <div class="absolute top-0 right-0 p-4 opacity-10">
                                <svg class="w-24 h-24 text-gray-900 dark:text-white" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Redemption Amount</p>
                            <div class="flex items-baseline gap-1 relative z-10">
                                <span class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    {{ formatNumber(transaction.amount) }}
                                </span>
                                <span class="text-lg font-semibold text-gray-500 dark:text-gray-400">WCH</span>
                            </div>
                        </div>

                        <!-- Status Card -->
                        <div
                            class="flex flex-col justify-center rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Current Status</p>
                            <div class="flex items-center gap-3">
                                <span
                                    :class="['px-3 py-1.5 rounded-lg text-sm font-semibold capitalize flex items-center gap-2', statusClass]">
                                    <span class="w-2 h-2 rounded-full bg-current opacity-75"></span>
                                    {{ getStatusLabel(transaction.status) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Details Grid -->
                    <div class="grid md:grid-cols-2 gap-x-12 gap-y-6">
                        <div class="space-y-6">
                            <h4
                                class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Transaction Info
                            </h4>

                            <dl class="space-y-4">
                                <div class="flex justify-between items-center group">
                                    <dt class="text-sm text-gray-500 dark:text-gray-400">Date Created</dt>
                                    <dd class="text-sm font-medium text-gray-900 dark:text-white">{{
                                        formatDateTime(transaction.date) }}</dd>
                                </div>
                                <div v-if="transaction.goldAmount" class="flex justify-between items-center group">
                                    <dt class="text-sm text-gray-500 dark:text-gray-400">Gold Amount</dt>
                                    <dd
                                        class="text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-md">
                                        {{ formatNumber(transaction.goldAmount) }}g
                                    </dd>
                                </div>
                                <div v-if="transaction.processingTime" class="flex justify-between items-center group">
                                    <dt class="text-sm text-gray-500 dark:text-gray-400">Processing Time</dt>
                                    <dd class="text-sm font-medium text-gray-900 dark:text-white">{{
                                        transaction.processingTime }}</dd>
                                </div>
                            </dl>
                        </div>

                        <div class="space-y-6">
                            <h4
                                class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                User Details
                            </h4>

                            <dl class="space-y-4">
                                <div class="flex justify-between items-center">
                                    <dt class="text-sm text-gray-500 dark:text-gray-400">Recipient Name</dt>
                                    <dd class="text-sm font-medium text-gray-900 dark:text-white">{{
                                        transaction.bankName }}</dd>
                                </div>
                                <div class="flex justify-between items-center">
                                    <dt class="text-sm text-gray-500 dark:text-gray-400">Account Name</dt>
                                    <dd class="text-sm font-medium text-gray-900 dark:text-white">{{
                                        transaction.accountName }}</dd>
                                </div>
                                <div class="flex justify-between items-center">
                                    <dt class="text-sm text-gray-500 dark:text-gray-400">Phone Number</dt>
                                    <dd
                                        class="text-sm font-mono text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                        {{ transaction.accountNumber }}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <!-- Full Width Sections -->
                    <div class="space-y-4">
                        <div v-if="transaction.shippingAddress"
                            class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700/50">
                            <dt
                                class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Shipping Address</dt>
                            <dd class="text-sm text-gray-900 dark:text-white leading-relaxed break-words">
                                {{ transaction.shippingAddress }}
                            </dd>
                        </div>

                        <div v-if="transaction.status === 'rejected' && transaction.rejectReason"
                            class="rounded-xl bg-red-50 dark:bg-red-900/10 p-4 border border-red-100 dark:border-red-900/20">
                            <dt
                                class="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                                    </path>
                                </svg>
                                Rejection Reason
                            </dt>
                            <dd class="text-sm text-red-700 dark:text-red-300">
                                {{ transaction.rejectReason }}
                            </dd>
                        </div>

                        <div v-if="transaction.transactionHash"
                            class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700/50">
                            <div class="flex items-center justify-between mb-2">
                                <dt
                                    class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Transaction Hash</dt>
                                <button @click="handleCopyHash"
                                    class="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                                        </path>
                                    </svg>
                                    Copy Hash
                                </button>
                            </div>
                            <code
                                class="block text-xs font-mono text-gray-600 dark:text-gray-400 break-all bg-white dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                {{ transaction.transactionHash }}
                            </code>
                        </div>

                        <!-- Status Info Box -->
                        <div
                            class="rounded-xl bg-blue-50 dark:bg-blue-900/10 p-4 border border-blue-100 dark:border-blue-900/20">
                            <div class="flex gap-3">
                                <span
                                    class="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </span>
                                <div>
                                    <h5 class="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                                        {{ getStatusInfo(transaction.status).title }}
                                    </h5>
                                    <p class="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                                        {{ getStatusInfo(transaction.status).description }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="sticky bottom-0 px-6 py-4 bg-gray-50 dark:bg-gray-800/80 backdrop-blur border-t border-gray-200 dark:border-gray-700">
                    <Button @click="$emit('update:open', false)"
                        class="w-full h-11 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl font-medium transition-all shadow-sm">
                        Close Details
                    </Button>
                </div>
            </div>
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
        case 'waiting_payment':
            return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
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
        pending: 'Pending',
        waiting_payment: 'Waiting Payment',
        processing: 'Processing',
        completed: 'Completed',
        rejected: 'Rejected'
    }
    return labels[status]
}

const getStatusInfo = (status: RedeemStatus): { title: string; description: string } => {
    const info: Record<RedeemStatus, { title: string; description: string }> = {
        pending: {
            title: 'Request Submitted',
            description: 'Your redemption request has been received and is awaiting admin review.'
        },
        waiting_payment: {
            title: 'Waiting for Payment',
            description: 'Please complete the payment to proceed with your redemption.'
        },
        processing: {
            title: 'Being Processed',
            description: 'Your request is currently being processed by our team.'
        },
        completed: {
            title: 'Completed',
            description: 'Your redemption has been completed successfully!'
        },
        rejected: {
            title: 'Request Rejected',
            description: 'Your redemption request was rejected. Please check the rejection reason below.'
        }
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
