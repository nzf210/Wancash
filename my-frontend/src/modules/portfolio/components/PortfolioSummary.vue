<template>
    <div
        class="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        <!-- Background Gradient Effect -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl">
        </div>

        <div class="relative p-8">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Portfolio Summary</h2>
                <div class="flex items-center gap-2">
                    <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Updated: {{ lastUpdate }}</span>
                    <Button @click="$emit('refresh')" size="sm"
                        class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </Button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Balance Cards -->
                <div v-for="item in summaryItems" :key="item.label"
                    :class="['p-6 rounded-2xl border', item.bgClass, item.borderClass]">
                    <div class="flex items-center justify-between mb-4">
                        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', item.iconBgClass]">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    :d="item.iconPath" />
                            </svg>
                        </div>
                        <span :class="['text-sm font-medium', item.textClass]">{{ item.label }}</span>
                    </div>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {{ formatNumber(item.value) }} WCH
                    </p>
                    <p :class="['text-lg font-semibold', item.textClass]">
                        {{ formatCurrency(item.subValue) }}
                    </p>
                </div>

                <!-- Token Price -->
                <div
                    class="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-purple-100 dark:border-purple-800">
                    <div class="flex items-center justify-between mb-4">
                        <div
                            class="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <span class="text-sm font-medium text-purple-600 dark:text-purple-400">Price</span>
                    </div>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ formatCurrency(tokenPrice) }}
                    </p>
                    <div class="flex items-center gap-2">
                        <span
                            :class="priceChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                            {{ priceChange >= 0 ? '+' : '' }}{{ priceChange.toFixed(2) }}%
                        </span>
                        <svg v-if="priceChange >= 0" class="w-4 h-4 text-green-600 dark:text-green-400" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <svg v-else class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { useFormatters } from '../composables'

interface Props {
    totalBalance: number
    availableBalance: number
    lockedBalance: number
    tokenPrice: number
    priceChange: number
    totalValue: number
    availableValue: number
    lockedValue: number
    lastUpdate: string
}

const props = defineProps<Props>()
defineEmits<{
    refresh: []
}>()

const { formatNumber, formatCurrency } = useFormatters()

const summaryItems = computed(() => [
    {
        label: 'Total',
        value: props.totalBalance,
        subValue: props.totalValue,
        bgClass: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
        borderClass: 'border-blue-100 dark:border-blue-800',
        iconBgClass: 'bg-gradient-to-r from-blue-500 to-cyan-400',
        textClass: 'text-blue-600 dark:text-blue-400',
        iconPath: 'M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z' // pie chart icon
    },
    {
        label: 'Available',
        value: props.availableBalance,
        subValue: props.availableValue,
        bgClass: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
        borderClass: 'border-green-100 dark:border-green-800',
        iconBgClass: 'bg-gradient-to-r from-green-500 to-emerald-400',
        textClass: 'text-green-600 dark:text-green-400',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' // check circle icon
    },
    {
        label: 'Locked',
        value: props.lockedBalance,
        subValue: props.lockedValue,
        bgClass: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30',
        borderClass: 'border-amber-100 dark:border-amber-800',
        iconBgClass: 'bg-gradient-to-r from-amber-500 to-orange-400',
        textClass: 'text-amber-600 dark:text-amber-400',
        iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' // lock icon
    }
])
</script>
