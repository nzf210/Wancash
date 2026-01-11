<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Token Bridge History</h3>
            <div class="flex items-center gap-3 w-full sm:w-auto">
                <select v-model="bridgeFilterStatus"
                    class="w-full sm:w-auto bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                </select>
            </div>
        </div>

        <!-- Bridge Transaction Cards -->
        <div v-if="transactions.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="bridge in transactions" :key="bridge.id"
                class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div class="p-6">
                    <!-- Header with Status -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div :class="[
                                'w-3 h-3 rounded-full',
                                bridge.status === 'completed' ? 'bg-green-500' :
                                    bridge.status === 'processing' ? 'bg-amber-500' :
                                        'bg-red-500'
                            ]"></div>
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ bridge.status === 'completed' ? 'Completed' : bridge.status === 'processing' ?
                                    'Processing' :
                                    'Failed' }}
                            </span>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(bridge.date) }}</span>
                    </div>

                    <!-- Bridge Path -->
                    <div class="flex flex-col sm:flex-row items-center justify-between mb-6 gap-6 sm:gap-0">
                        <div class="text-center w-full sm:w-auto">
                            <div
                                class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-2">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ bridge.fromChain }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">From</p>
                        </div>

                        <div
                            class="relative flex-1 mx-0 sm:mx-4 w-full sm:w-auto h-12 sm:h-auto flex items-center justify-center">
                            <!-- Desktop Line -->
                            <div class="hidden sm:block absolute inset-0 flex items-center">
                                <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <!-- Mobile Line -->
                            <div class="sm:hidden absolute inset-0 flex justify-center">
                                <div class="h-full border-l border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <!-- Direction Icon -->
                            <div
                                class="relative z-10 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transform rotate-90 sm:rotate-0">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>

                        <div class="text-center w-full sm:w-auto">
                            <div
                                class="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center mx-auto mb-2">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ bridge.toChain }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">To</p>
                        </div>
                    </div>

                    <!-- Amount and Details -->
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(bridge.amount) }}
                                WCH</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Bridge Fee:</span>
                            <span class="text-gray-900 dark:text-white">{{ formatNumber(bridge.fee) }} WCH</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Estimated Time:</span>
                            <span class="text-gray-900 dark:text-white">{{ bridge.estimatedTime }}</span>
                        </div>
                        <div v-if="bridge.transactionHash" class="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Transaction Hash:</p>
                            <div class="flex items-center justify-between">
                                <code class="text-xs font-mono text-gray-900 dark:text-white truncate">
                  {{ shortenTransactionHash(bridge.transactionHash) }}
                </code>
                                <button @click="handleCopyHash(bridge.transactionHash)"
                                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs">
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button @click="$emit('view-details', bridge)"
                            class="w-full py-2 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bridge history yet</h4>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                You haven't performed any token bridge between networks. Try bridging tokens to see history here.
            </p>
            <Button @click="$emit('go-to-bridge')"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6">
                Try Bridge Token
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import type { BridgeTransaction } from '../types'
import { useFormatters } from '../composables'

interface Props {
    transactions: BridgeTransaction[]
}

defineProps<Props>()
defineEmits<{
    'view-details': [bridge: BridgeTransaction]
    'go-to-bridge': []
}>()

const { formatNumber, formatDate, shortenTransactionHash, copyToClipboard } = useFormatters()

const bridgeFilterStatus = ref<'all' | 'completed' | 'processing' | 'failed'>('all')

const handleCopyHash = async (hash: string) => {
    const success = await copyToClipboard(hash)
    if (success) {
        // TODO: Show toast notification instead of alert
        console.log('Hash copied to clipboard')
    }
}
</script>
