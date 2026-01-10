<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-4">
                <button @click="goBack"
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ArrowLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Bridge History</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400">View all your bridge transactions</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button @click="refreshHistory"
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <UpdateIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
            </div>
        </div>

        <!-- Recent 3 Cards (Like RecentBridges) -->
        <div v-if="history.length > 0" class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="bridge in recentThree" :key="bridge.id"
                    class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-2">
                            <div
                                class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                <span class="text-white text-xs font-bold">{{ bridge.fromChain.charAt(0) }}</span>
                            </div>
                            <ArrowRightIcon class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <div
                                class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                                <span class="text-white text-xs font-bold">{{ bridge.toChain.charAt(0) }}</span>
                            </div>
                        </div>
                        <StatusBadge :status="bridge.status" />
                    </div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {{ formatNumber(bridge.amount) }} {{ bridge.token }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <ClockIcon class="w-3 h-3 mr-1" />
                        {{ formatTime(bridge.timestamp) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">All Transactions</h3>
            <div class="flex items-center space-x-2">
                <button v-for="filter in filters" :key="filter.value" @click="activeFilter = filter.value" :class="[
                    'px-3 py-1.5 rounded-lg font-medium text-xs transition-colors',
                    activeFilter === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                ]">
                    {{ filter.label }}
                    <span v-if="getFilterCount(filter.value) > 0"
                        class="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-white/20">
                        {{ getFilterCount(filter.value) }}
                    </span>
                </button>
            </div>
        </div>

        <!-- Detailed List Table -->
        <div
            class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800">
            <!-- Table Header -->
            <div
                class="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div class="col-span-3">Route</div>
                <div class="col-span-2">Token</div>
                <div class="col-span-2 text-right">Amount</div>
                <div class="col-span-2">Status</div>
                <div class="col-span-2">Time</div>
                <div class="col-span-1">Tx</div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredHistory.length === 0" class="p-12 text-center">
                <div
                    class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <ClockIcon class="w-8 h-8 text-gray-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Transactions</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">
                    {{ activeFilter === 'all' ? 'You haven\'t made any bridge transactions yet.' : `No ${activeFilter}
                    transactions found.` }}
                </p>
                <router-link to="/bridgeToken"
                    class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <ArrowLeftIcon class="w-4 h-4" />
                    <span>Start Bridging</span>
                </router-link>
            </div>

            <!-- Transaction Rows -->
            <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
                <div v-for="tx in filteredHistory" :key="tx.id"
                    class="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors items-center">
                    <!-- Route -->
                    <div class="col-span-3 flex items-center space-x-2">
                        <div
                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <span class="text-white text-xs font-bold">{{ tx.fromChain.charAt(0) }}</span>
                        </div>
                        <ArrowRightIcon class="w-4 h-4 text-gray-400" />
                        <div
                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                            <span class="text-white text-xs font-bold">{{ tx.toChain.charAt(0) }}</span>
                        </div>
                        <span class="text-sm text-gray-600 dark:text-gray-400 hidden lg:inline">
                            {{ tx.fromChain }} → {{ tx.toChain }}
                        </span>
                    </div>

                    <!-- Token -->
                    <div class="col-span-2">
                        <span class="font-medium text-gray-900 dark:text-white">{{ tx.token }}</span>
                    </div>

                    <!-- Amount -->
                    <div class="col-span-2 text-right">
                        <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(tx.amount) }}</span>
                    </div>

                    <!-- Status -->
                    <div class="col-span-2">
                        <StatusBadge :status="tx.status" />
                    </div>

                    <!-- Time -->
                    <div class="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                        {{ formatTime(tx.timestamp) }}
                    </div>

                    <!-- Tx Hash -->
                    <div class="col-span-1">
                        <a v-if="tx.txHash" :href="getExplorerUrl(tx.txHash)" target="_blank"
                            class="text-xs text-blue-500 hover:underline flex items-center space-x-1">
                            <span>{{ shortenHash(tx.txHash) }}</span>
                            <ExternalLinkIcon class="w-3 h-3" />
                        </a>
                        <span v-else class="text-xs text-gray-400">-</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Summary -->
        <div class="mt-6 grid grid-cols-3 gap-4">
            <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <div class="text-sm text-gray-500 dark:text-gray-400">Total Transactions</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ history.length }}</div>
            </div>
            <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <div class="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                <div class="text-2xl font-bold text-green-600">{{ getFilterCount('completed') }}</div>
            </div>
            <div class="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <div class="text-sm text-gray-500 dark:text-gray-400">Pending</div>
                <div class="text-2xl font-bold text-yellow-600">{{ getFilterCount('pending') }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBridgeStore } from '@/modules/bridge/store/bridgeStore'
import StatusBadge from '@/modules/bridge/components/StatusBadge.vue'
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ClockIcon,
    UpdateIcon,
    ExternalLinkIcon
} from '@radix-icons/vue'

const router = useRouter()
const bridgeStore = useBridgeStore()
const { history } = storeToRefs(bridgeStore)

// Load persisted history on mount
onMounted(() => {
    bridgeStore.loadHistory()
})

// Filter state
const activeFilter = ref<'all' | 'pending' | 'completed' | 'failed'>('all')
const filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Pending', value: 'pending' as const },
    { label: 'Completed', value: 'completed' as const },
    { label: 'Failed', value: 'failed' as const }
]

// Computed
const recentThree = computed(() => {
    return history.value.slice(0, 3)
})

const filteredHistory = computed(() => {
    if (activeFilter.value === 'all') return history.value
    return history.value.filter(tx => tx.status === activeFilter.value)
})

const getFilterCount = (filter: string) => {
    if (filter === 'all') return history.value.length
    return history.value.filter(tx => tx.status === filter).length
}

// Methods
const goBack = () => {
    router.push('/bridgeToken')
}

const refreshHistory = () => {
    bridgeStore.loadHistory()
}

const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

const formatNumber = (num: string | number): string => {
    if (!num) return '0.00'
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(Number(num))
}

const shortenHash = (hash: string): string => {
    if (!hash) return ''
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

const getExplorerUrl = (hash: string): string => {
    const isProduction = import.meta.env.VITE_NODE_ENV === 'production'
    const baseUrl = isProduction
        ? 'https://layerzeroscan.com/tx'
        : 'https://testnet.layerzeroscan.com/tx'
    return `${baseUrl}/${hash}`
}
</script>
