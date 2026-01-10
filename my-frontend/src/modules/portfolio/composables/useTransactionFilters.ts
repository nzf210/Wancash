import { ref, computed, type Ref } from 'vue'
import type { SendTransaction, BridgeTransaction, TransactionStatus, BridgeStatus } from '../types'

/**
 * Composable for filtering transaction lists
 */
export function useTransactionFilters(
    sendTransactions: Ref<SendTransaction[]>,
    bridgeTransactions: Ref<BridgeTransaction[]>
) {
    // Filter state
    const searchQuery = ref('')
    const filterStatus = ref<'all' | TransactionStatus>('all')
    const bridgeFilterStatus = ref<'all' | BridgeStatus>('all')

    /**
     * Filtered send transactions based on search and status
     */
    const filteredSendTransactions = computed(() => {
        let filtered = sendTransactions.value

        // Filter by status
        if (filterStatus.value !== 'all') {
            filtered = filtered.filter((t) => t.status === filterStatus.value)
        }

        // Filter by search query
        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase()
            filtered = filtered.filter(
                (t) =>
                    t.recipient.toLowerCase().includes(q) ||
                    t.recipientName?.toLowerCase().includes(q) ||
                    t.amount.toString().includes(q) ||
                    t.hash?.toLowerCase().includes(q)
            )
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) => +b.date - +a.date)
    })

    /**
     * Filtered bridge transactions based on status
     */
    const filteredBridgeTransactions = computed(() => {
        let filtered = bridgeTransactions.value

        // Filter by status
        if (bridgeFilterStatus.value !== 'all') {
            filtered = filtered.filter((t) => t.status === bridgeFilterStatus.value)
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) => +b.date - +a.date)
    })

    /**
     * Reset all filters
     */
    const resetFilters = () => {
        searchQuery.value = ''
        filterStatus.value = 'all'
        bridgeFilterStatus.value = 'all'
    }

    return {
        // State
        searchQuery,
        filterStatus,
        bridgeFilterStatus,

        // Computed
        filteredSendTransactions,
        filteredBridgeTransactions,

        // Methods
        resetFilters,
    }
}
