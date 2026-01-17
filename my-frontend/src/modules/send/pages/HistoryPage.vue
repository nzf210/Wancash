<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/SendHeader.vue'
import { useChain } from '@/app/composables/useChain'
import { useAuth } from '@/app/composables/useAuth'
import { transactionHistoryService, type TransactionRecord } from '@/app/services/transactionHistoryService'

const { getExplorerTxUrl, currentChain } = useChain()
const { walletAddress } = useAuth()

const router = useRouter()
const transactions = ref<TransactionRecord[]>([])
const loading = ref(true)
const activeFilter = ref<'all' | 'incoming' | 'outgoing' | 'bridge'>('all')

let refreshInterval: ReturnType<typeof setInterval> | null = null

const loadHistory = async () => {
    try {
        // Fetch from backend to ensure data is fresh
        transactions.value = await transactionHistoryService.fetchFromBackend({ limit: 50 })
    } catch (error) {
        console.error('Failed to load transaction history:', error)
        // Fallback to local storage if API fails
        transactions.value = transactionHistoryService.getAll()
    } finally {
        loading.value = false
    }
}

const isIncoming = (tx: TransactionRecord) => {
    if (!walletAddress.value) return false
    const current = walletAddress.value.toLowerCase()
    return tx.to?.toLowerCase() === current && tx.from?.toLowerCase() !== current
}

const filteredTransactions = computed(() => {
    if (activeFilter.value === 'all') {
        return transactions.value
    }

    return transactions.value.filter(tx => {
        if (activeFilter.value === 'incoming') return isIncoming(tx)
        if (activeFilter.value === 'outgoing') return !isIncoming(tx)
        if (activeFilter.value === 'bridge') return tx.type === 'bridge'
        return true
    })
})

const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(timestamp))
}

const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(Number(amount))
}

const shortenAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'success': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
        case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
        case 'failed': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
        default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
}

const getTypeColor = (type: string) => {
    switch (type) {
        case 'send': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
        case 'bridge': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
        default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
}

// Get explorer URL based on chainId in transaction, fallback to current chain
const getTxExplorerUrl = (tx: TransactionRecord) => {
    // For bridge transactions, use LZ Scan URL if available
    if (tx.type === 'bridge' && tx.lzScanUrl) {
        return tx.lzScanUrl
    }
    // Otherwise use chain explorer
    const chainId = tx.fromChainId || currentChain.value?.id
    if (!chainId || !tx.hash) return ''
    return getExplorerTxUrl(tx.hash, chainId)
}

const getChainDisplay = (tx: TransactionRecord) => {
    if (tx.type === 'bridge') {
        return `${tx.fromChainName || 'Unknown'} → ${tx.toChainName || 'Unknown'}`
    }
    return tx.fromChainName || 'Unknown'
}

const getCounterparty = (tx: TransactionRecord) => {
    if (isIncoming(tx)) return tx.from
    return tx.to
}

const goToPortfolio = () => router.push('/portfolio')

onMounted(() => {
    loadHistory()
    // Refresh history every 10 seconds
    refreshInterval = setInterval(loadHistory, 10000)
})

onUnmounted(() => {
    if (refreshInterval) {
        clearInterval(refreshInterval)
    }
})
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
        <div class="max-w-6xl mx-auto">
            <Header @go-to-portfolio="goToPortfolio" />

            <div
                class="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                <div class="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
                        <button @click="router.push('/sendToken')"
                            class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            Back to Send
                        </button>
                    </div>

                    <!-- Filter Tabs -->
                    <div class="flex gap-2 flex-wrap">
                        <button @click="activeFilter = 'all'" :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            activeFilter === 'all'
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        ]">
                            All
                        </button>
                        <button @click="activeFilter = 'incoming'" :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            activeFilter === 'incoming'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        ]">
                            Incoming
                        </button>
                        <button @click="activeFilter = 'outgoing'" :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            activeFilter === 'outgoing'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        ]">
                            Outgoing
                        </button>
                        <button @click="activeFilter = 'bridge'" :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            activeFilter === 'bridge'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        ]">
                            Bridge
                        </button>
                    </div>
                </div>

                <div v-if="loading" class="p-8 text-center text-gray-500">
                    Loading history...
                </div>

                <div v-else-if="filteredTransactions.length === 0" class="p-12 text-center text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No {{ activeFilter === 'all' ? '' : activeFilter }} transactions found</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chain</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    From/To</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hash</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                            <tr v-for="tx in filteredTransactions" :key="tx.id"
                                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td class="px-6 py-4 text-sm">
                                    <div class="flex items-center gap-2">
                                        <div class="p-1.5 rounded-full"
                                            :class="isIncoming(tx) ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'">
                                            <svg v-if="isIncoming(tx)" class="w-4 h-4 transform rotate-180" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                        </div>
                                        <span class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                                            :class="getTypeColor(tx.type)">
                                            {{ tx.type }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                    {{ formatDate(tx.timestamp) }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {{ getChainDisplay(tx) }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">
                                    <div class="flex flex-col">
                                        <span class="text-xs text-gray-400">{{ isIncoming(tx) ? 'From' : 'To' }}</span>
                                        <span>{{ shortenAddress(getCounterparty(tx)) }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm font-medium"
                                    :class="isIncoming(tx) ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'">
                                    {{ isIncoming(tx) ? '+' : '-' }}{{ formatAmount(tx.amount) }} {{ tx.tokenSymbol }}
                                </td>
                                <td class="px-6 py-4 text-sm">
                                    <span class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                                        :class="getStatusColor(tx.status)">
                                        {{ tx.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-blue-600 dark:text-blue-400 font-mono">
                                    <a v-if="getTxExplorerUrl(tx)" :href="getTxExplorerUrl(tx)" target="_blank"
                                        rel="noopener noreferrer"
                                        class="hover:underline inline-flex items-center gap-1">
                                        {{ shortenAddress(tx.hash) }}
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    <span v-else class="text-gray-400">{{ shortenAddress(tx.hash) }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
