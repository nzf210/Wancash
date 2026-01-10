<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/SendHeader.vue'
import { useChain } from '@/app/composables/useChain'

const { getExplorerTxUrl, currentChain } = useChain()

interface TransactionHistory {
    id: number
    hash: string
    from: string
    to: string
    amount: number
    timestamp: number
    status: 'pending' | 'success' | 'failed'
    memo?: string
    chainId?: number  // Added to track which chain the tx was on
}

const router = useRouter()
const transactions = ref<TransactionHistory[]>([])
const loading = ref(true)

const loadHistory = () => {
    try {
        const history = JSON.parse(localStorage.getItem('wancash_transactions') || '[]')
        transactions.value = history
    } catch (error) {
        console.error('Failed to load transaction history:', error)
        transactions.value = []
    } finally {
        loading.value = false
    }
}

const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(timestamp))
}

const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(amount)
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

// Get explorer URL based on chainId in transaction, fallback to current chain
const getTxExplorerUrl = (tx: TransactionHistory) => {
    // If tx has chainId, use it; otherwise use current chain
    const chainId = tx.chainId || currentChain.value?.id
    if (!chainId || !tx.hash) return ''
    return getExplorerTxUrl(tx.hash, chainId)
}

const goToPortfolio = () => router.push('/portfolio')

onMounted(() => {
    loadHistory()
    // Refresh history every 5 seconds just in case
    setInterval(loadHistory, 5000)
})
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
        <div class="max-w-6xl mx-auto">
            <Header @go-to-portfolio="goToPortfolio" />

            <div
                class="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
                    <button @click="router.push('/sendToken')"
                        class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Back to Send
                    </button>
                </div>

                <div v-if="loading" class="p-8 text-center text-gray-500">
                    Loading history...
                </div>

                <div v-else-if="transactions.length === 0" class="p-12 text-center text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No transaction history found</p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    To</th>
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
                            <tr v-for="tx in transactions" :key="tx.id"
                                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                    {{ formatDate(tx.timestamp) }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">
                                    {{ shortenAddress(tx.to) }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                                    {{ formatAmount(tx.amount) }} WCH
                                </td>
                                <td class="px-6 py-4 text-sm">
                                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                                        :class="getStatusColor(tx.status)">
                                        {{ tx.status.charAt(0).toUpperCase() + tx.status.slice(1) }}
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
