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
                                class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
                                <ChainIcon :chain="getChainObject(transaction?.fromChain)" class="w-7 h-7 text-white" />
                            </div>
                            <div class="flex flex-col">
                                <span>Bridge Details</span>
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
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bridge Amount</p>
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

                    <!-- Bridge Path Visual -->
                    <div
                        class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                        <div
                            class="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 relative z-10">
                            <!-- From Chain -->
                            <div class="flex flex-col items-center">
                                <div
                                    class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
                                    <ChainIcon :chain="getChainObject(transaction.fromChain)"
                                        class="w-8 h-8 text-white" />
                                </div>
                                <span
                                    class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From</span>
                                <span class="text-lg font-bold text-gray-900 dark:text-white mt-1">{{
                                    transaction.fromChain }}</span>
                            </div>

                            <!-- Connector -->
                            <div
                                class="relative flex-1 mx-0 sm:mx-6 w-full sm:w-auto h-16 sm:h-auto flex items-center justify-center">
                                <!-- Desktop Line -->
                                <div class="hidden sm:flex absolute inset-0 items-center">
                                    <div class="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-700">
                                    </div>
                                </div>
                                <!-- Mobile Line -->
                                <div class="sm:hidden absolute inset-0 flex justify-center">
                                    <div class="h-full border-l-2 border-dashed border-gray-300 dark:border-gray-700">
                                    </div>
                                </div>
                                <!-- Direction Icon -->
                                <div
                                    class="relative z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center transform rotate-90 sm:rotate-0">
                                    <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>

                            <!-- To Chain -->
                            <div class="flex flex-col items-center">
                                <div
                                    class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/20">
                                    <ChainIcon :chain="getChainObject(transaction.toChain)"
                                        class="w-8 h-8 text-white" />
                                </div>
                                <span
                                    class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">To</span>
                                <span class="text-lg font-bold text-gray-900 dark:text-white mt-1">{{
                                    transaction.toChain }}</span>
                            </div>
                        </div>
                    </div>


                    <!-- Details Grid -->
                    <div class="space-y-6">
                        <h4
                            class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Transaction Info
                        </h4>

                        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                            <div
                                class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <dt class="text-sm text-gray-500 dark:text-gray-400">Date Created</dt>
                                <dd class="text-sm font-medium text-gray-900 dark:text-white">{{
                                    formatDateTime(transaction.date) }}</dd>
                            </div>
                            <div
                                class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <dt class="text-sm text-gray-500 dark:text-gray-400">Bridge Fee</dt>
                                <dd class="text-sm font-medium text-gray-900 dark:text-white">{{
                                    formatNumber(transaction.fee) }} WCH</dd>
                            </div>
                            <div
                                class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <dt class="text-sm text-gray-500 dark:text-gray-400">Estimated Time</dt>
                                <dd class="text-sm font-medium text-gray-900 dark:text-white">{{
                                    transaction.estimatedTime }}</dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Full Width Sections -->
                    <div class="space-y-4">
                        <div v-if="transaction.transactionHash"
                            class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700/50">
                            <div class="flex items-center justify-between mb-2">
                                <dt
                                    class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Transaction Hash</dt>
                                <button @click="handleCopyHash"
                                    class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
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
import { SUPPORTED_CHAINS } from '@/app/composables/useChain'
import ChainIcon from '@/modules/bridge/components/ChainIcon.vue'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { BridgeTransaction, BridgeStatus } from '../types'
import { useFormatters } from '../composables'

interface Props {
    open: boolean
    transaction: BridgeTransaction | null
}

const props = defineProps<Props>()
defineEmits<{
    'update:open': [value: boolean]
}>()

const { formatNumber, formatDateTime, copyToClipboard } = useFormatters()

const statusClass = computed(() => {
    if (!props.transaction) return ''
    switch (props.transaction.status) {
        case 'completed':
            return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        case 'processing':
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
        case 'failed':
            return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        default:
            return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
    }
})

const getStatusLabel = (status: BridgeStatus): string => {
    const labels: Record<BridgeStatus, string> = {
        completed: 'Completed',
        processing: 'Processing',
        failed: 'Failed',
    }
    return labels[status]
}

const getStatusInfo = (status: BridgeStatus): { title: string; description: string } => {
    const info: Record<BridgeStatus, { title: string; description: string }> = {
        processing: {
            title: 'Bridge in Progress',
            description: 'Your assets are moving across chains. This typically takes 15-30 minutes.'
        },
        completed: {
            title: 'Bridge Completed',
            description: 'Your assets have successfully arrived on the destination network.'
        },
        failed: {
            title: 'Bridge Failed',
            description: 'The bridge transaction failed. Assets should revert to original chain.'
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

const getChainObject = (name: string | undefined) => {
    if (!name) return null
    const chain = SUPPORTED_CHAINS.find(c =>
        c.name.toLowerCase() === name.toLowerCase() ||
        c.network.toLowerCase() === name.toLowerCase() ||
        c.symbol?.toLowerCase() === name.toLowerCase()
    )
    return (chain || { name, network: name.toLowerCase() }) as any
}
</script>
