<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-10">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Portfolio & History</h1>
                            <p class="text-gray-600 dark:text-gray-300">Manage your token assets and monitor all
                                transactions</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <Button @click="handleRefresh"
                            class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </Button>
                        <Button @click="goToTransfer"
                            class="hidden md:flex bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            Transfer Token
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Wallet Connection Banner -->
            <div v-if="!isConnected" class="mb-8">
                <div
                    class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                    <div class="p-6 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-semibold text-gray-900 dark:text-white">Wallet not connected</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Connect wallet to view portfolio and
                                    history
                                </p>
                            </div>
                        </div>
                        <Button @click="connectWallet"
                            class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6">
                            Connect Wallet
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div v-else>
                <!-- Portfolio Overview -->
                <div class="mb-10">
                    <PortfolioSummary v-bind="portfolioSummaryProps" @refresh="handleRefresh" />
                </div>

                <!-- Transaction History Tabs -->
                <div class="mb-8">
                    <div class="flex border-b border-gray-200 dark:border-gray-800 mb-6">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                            'px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300',
                            activeTab === tab.id
                                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                        ]">
                            {{ tab.label }}
                            <span :class="[
                                'ml-2 px-2 py-1 text-xs rounded-full',
                                activeTab === tab.id
                                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            ]">
                                {{ tab.count }}
                            </span>
                        </button>
                    </div>

                    <!-- Send Token History -->
                    <SendTransactionTable v-if="activeTab === 'send'" :transactions="filteredSendTransactions"
                        :token-price="tokenPrice" @view-details="handleViewTransactionDetails" />

                    <!-- Bridge Token History -->
                    <BridgeTransactionCards v-else-if="activeTab === 'bridge'"
                        :transactions="filteredBridgeTransactions" @view-details="handleViewBridgeDetails"
                        @go-to-bridge="goToBridge" />

                    <!-- Redeem Token History -->
                    <RedeemTransactionCards v-else-if="activeTab === 'redeem'"
                        :transactions="filteredRedeemTransactions" @view-details="handleViewRedeemDetails"
                        @go-to-redeem="goToRedeem" />
                </div>

                <!-- Quick Stats -->
                <div class="mt-8">
                    <TransactionStatistics v-bind="statisticsProps" />
                </div>
            </div>

            <!-- Transaction Details Dialog -->
            <TransactionDetailsDialog v-model:open="showTransactionDetails" :transaction="selectedTransaction" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import PortfolioSummary from './PortfolioSummary.vue'
import SendTransactionTable from './SendTransactionTable.vue'
import BridgeTransactionCards from './BridgeTransactionCards.vue'
import RedeemTransactionCards from './RedeemTransactionCards.vue'
import TransactionStatistics from './TransactionStatistics.vue'
import TransactionDetailsDialog from './TransactionDetailsDialog.vue'
import {
    usePortfolioData,
    useTransactionHistory,
    useTransactionFilters,
    useFormatters
} from '../composables'
import type { SendTransaction, BridgeTransaction, RedeemTransaction } from '../types'

const router = useRouter()
const { formatDateTime } = useFormatters()

// Wallet connection state (TODO: integrate with actual wallet)
const isConnected = ref(true)
const walletAddress = ref('0x742d35Cc6634C0532925a3b844Bc9e')

// Portfolio data
const {
    totalBalance,
    availableBalance,
    lockedBalance,
    tokenPrice,
    priceChange,
    totalValue,
    availableValue,
    lockedValue,
    fetchPortfolioData,
    refreshPortfolioData,
} = usePortfolioData()

// Transaction history
const {
    sendTransactions,
    bridgeTransactions,
    redeemTransactions,
    fetchSendTransactions,
    fetchBridgeTransactions,
    fetchRedeemTransactions,
    refreshTransactions,
} = useTransactionHistory()

// Filters
const { filteredSendTransactions, filteredBridgeTransactions, filteredRedeemTransactions } = useTransactionFilters(
    sendTransactions,
    bridgeTransactions,
    redeemTransactions
)

// UI state
const activeTab = ref<'send' | 'bridge' | 'redeem'>('send')
const lastUpdate = ref(formatDateTime(new Date()))
const showTransactionDetails = ref(false)
const selectedTransaction = ref<SendTransaction | null>(null)

// Tabs configuration
const tabs = computed(() => [
    { id: 'send' as const, label: 'Transfer Token', count: sendTransactions.value.length },
    { id: 'bridge' as const, label: 'Bridge Token', count: bridgeTransactions.value.length },
    { id: 'redeem' as const, label: 'Redeem Token', count: redeemTransactions.value.length },
])

// Props for child components
const portfolioSummaryProps = computed(() => ({
    totalBalance: totalBalance.value,
    availableBalance: availableBalance.value,
    lockedBalance: lockedBalance.value,
    tokenPrice: tokenPrice.value,
    priceChange: priceChange.value,
    totalValue: totalValue.value,
    availableValue: availableValue.value,
    lockedValue: lockedValue.value,
    lastUpdate: lastUpdate.value,
}))

const statisticsProps = computed(() => ({
    totalSendTransactions: sendTransactions.value.length,
    successfulSendTransactions: sendTransactions.value.filter((t) => t.status === 'success').length,
    totalBridgeTransactions: bridgeTransactions.value.length,
    totalBridgeVolume: bridgeTransactions.value
        .filter((t) => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0) * tokenPrice.value,
}))

// Methods
const connectWallet = () => {
    // TODO: Implement actual wallet connection
    isConnected.value = true
    handleRefresh()
}

const handleRefresh = async () => {
    lastUpdate.value = formatDateTime(new Date())
    if (isConnected.value && walletAddress.value) {
        await Promise.all([
            refreshPortfolioData(walletAddress.value),
            refreshTransactions(walletAddress.value),
        ])
    }
}

const goToTransfer = () => router.push('/sendToken')
const goToBridge = () => router.push('/bridge')
const goToRedeem = () => router.push('/redeem')

const handleViewTransactionDetails = (transaction: SendTransaction) => {
    selectedTransaction.value = transaction
    showTransactionDetails.value = true
}

const handleViewBridgeDetails = (bridge: BridgeTransaction) => {
    console.log('View bridge details:', bridge)
    // TODO: Implement bridge details modal
}

const handleViewRedeemDetails = (redeem: RedeemTransaction) => {
    console.log('View redeem details:', redeem)
    // TODO: Implement redeem details modal
}

// Lifecycle
onMounted(async () => {
    if (isConnected.value && walletAddress.value) {
        await Promise.all([
            fetchPortfolioData(walletAddress.value),
            fetchSendTransactions(walletAddress.value),
            fetchBridgeTransactions(walletAddress.value),
            fetchRedeemTransactions(walletAddress.value),
        ])
    }
})
</script>
