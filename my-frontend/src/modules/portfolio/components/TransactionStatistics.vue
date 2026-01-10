<template>
    <div
        class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Transaction Statistics</h3>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center">
                    <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ totalSendTransactions }}</div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Total Transfers</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{{
                        successfulSendTransactions
                        }}</div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Successful Transfers</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ totalBridgeTransactions }}
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Total Bridges</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{{
                        formatCurrency(totalBridgeVolume) }}</div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Bridge Volume</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFormatters } from '../composables'

interface Props {
    totalSendTransactions: number
    successfulSendTransactions: number
    totalBridgeTransactions: number
    totalBridgeVolume: number
}

defineProps<Props>()

const { formatCurrency } = useFormatters()
</script>
