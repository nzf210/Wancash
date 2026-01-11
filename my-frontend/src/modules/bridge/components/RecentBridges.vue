<template>
    <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Recent Bridges</h3>
            <router-link to="/bridge/history"
                class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1">
                <span>View All</span>
                <ChevronRightIcon class="w-4 h-4" />
            </router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="bridge in recentBridges" :key="bridge.id"
                class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                        <div
                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center overflow-hidden">
                            <img v-if="getChainLogo(bridge.fromChain)" :src="getChainLogo(bridge.fromChain)"
                                :alt="bridge.fromChain" class="w-full h-full object-contain p-1" />
                            <span v-else class="text-white text-xs font-bold">{{ bridge.fromChain.charAt(0) }}</span>
                        </div>
                        <ArrowRightIcon class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <div
                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center overflow-hidden">
                            <img v-if="getChainLogo(bridge.toChain)" :src="getChainLogo(bridge.toChain)"
                                :alt="bridge.toChain" class="w-full h-full object-contain p-1" />
                            <span v-else class="text-white text-xs font-bold">{{ bridge.toChain.charAt(0) }}</span>
                        </div>
                    </div>
                    <StatusBadge :status="bridge.status" />
                </div>
                <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {{ formatAmount(bridge.amount) }} {{ bridge.token }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <ClockIcon class="w-3 h-3 mr-1" />
                    {{ formatTime(bridge.timestamp) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    ChevronRightIcon,
    ArrowRightIcon,
    ClockIcon
} from '@radix-icons/vue'
import StatusBadge from '@/modules/bridge/components/StatusBadge.vue'
import type { BridgeHistory } from '@/modules/bridge/types/bridge.types'
import { CHAIN_LOGOS } from '@/shared/constants/chainLogos'

defineProps<{
    recentBridges: BridgeHistory[]
}>()

const getChainLogo = (chainName: string): string | undefined => {
    const normalize = (s: string) => s.toLowerCase()
    if (normalize(chainName).includes('eth')) return CHAIN_LOGOS.ETHEREUM
    if (normalize(chainName).includes('bsc') || normalize(chainName).includes('bnb')) return CHAIN_LOGOS.BSC
    if (normalize(chainName).includes('avax') || normalize(chainName).includes('avalanche')) return CHAIN_LOGOS.AVALANCHE
    if (normalize(chainName).includes('matic') || normalize(chainName).includes('polygon')) return CHAIN_LOGOS.POLYGON
    if (normalize(chainName).includes('arbitrum')) return CHAIN_LOGOS.ARBITRUM
    return undefined
}

const formatAmount = (amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num)
}

const formatTime = (timestamp: number): string => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}
</script>
