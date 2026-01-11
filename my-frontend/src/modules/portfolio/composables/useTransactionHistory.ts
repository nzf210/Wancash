import { ref } from 'vue'
import type { SendTransaction, BridgeTransaction, RedeemTransaction } from '../types'
import { transactionHistoryService } from '@/app/services/transactionHistoryService'
import { redemptionService } from '@/app/services/redemptionService'

/**
 * Composable for managing transaction history data
 * Fetches real data from the database using global services
 */
export function useTransactionHistory() {
    // State
    const sendTransactions = ref<SendTransaction[]>([])
    const bridgeTransactions = ref<BridgeTransaction[]>([])
    const redeemTransactions = ref<RedeemTransaction[]>([])
    const isLoadingSend = ref(false)
    const isLoadingBridge = ref(false)
    const isLoadingRedeem = ref(false)
    const error = ref<string | null>(null)

    /**
     * Fetch send transactions from backend
     */
    const fetchSendTransactions = async (_walletAddress: string) => {
        try {
            isLoadingSend.value = true
            error.value = null

            // Fetch from backend using global service
            const transactions = await transactionHistoryService.fetchFromBackend({ type: 'send' })

            // Map API response to SendTransaction type
            sendTransactions.value = transactions.map(tx => ({
                id: typeof tx.id === 'number' ? tx.id : parseInt(tx.id as string) || Date.now(),
                date: new Date(tx.timestamp),
                recipient: tx.to,
                recipientName: tx.memo || null, // Use memo as recipient name if available
                amount: parseFloat(tx.amount) || 0,
                fee: 0, // Fee is paid in native coin, not tracked in WCH
                status: tx.status as 'success' | 'pending' | 'failed',
                hash: tx.hash || null,
            }))
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch send transactions'
            console.error('Error fetching send transactions:', err)
        } finally {
            isLoadingSend.value = false
        }
    }

    /**
     * Fetch bridge transactions from backend
     */
    const fetchBridgeTransactions = async (_walletAddress: string) => {
        try {
            isLoadingBridge.value = true
            error.value = null

            // Fetch from backend using global service
            const transactions = await transactionHistoryService.fetchFromBackend({ type: 'bridge' })

            // Map API response to BridgeTransaction type
            bridgeTransactions.value = transactions.map(tx => ({
                id: typeof tx.id === 'number' ? tx.id : parseInt(tx.id as string) || Date.now(),
                date: new Date(tx.timestamp),
                fromChain: tx.fromChainName || 'Unknown',
                toChain: tx.toChainName || 'Unknown',
                amount: parseFloat(tx.amount) || 0,
                fee: 0, // Bridge fee is paid in native coin
                status: mapBridgeStatus(tx.status),
                estimatedTime: '15-30 minutes',
                transactionHash: tx.hash || undefined,
            }))
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch bridge transactions'
            console.error('Error fetching bridge transactions:', err)
        } finally {
            isLoadingBridge.value = false
        }
    }

    /**
     * Fetch redeem transactions from backend
     */
    const fetchRedeemTransactions = async (_walletAddress: string) => {
        try {
            isLoadingRedeem.value = true
            error.value = null

            // Fetch from backend using global redemption service
            // Always uses authenticated wallet from auth_state
            const redemptions = await redemptionService.getRedemptions()

            // Map API response to RedeemTransaction type
            redeemTransactions.value = redemptions.map(redemption => ({
                id: parseInt(redemption.id) || Date.now(),
                date: new Date(redemption.created_at),
                amount: redemption.total_token_amount || 0,
                bankName: redemption.recipient_name || 'Redemption Request',
                accountNumber: redemption.phone_number || '',
                accountName: redemption.recipient_name || '',
                status: mapRedeemStatus(redemption.status),
                transactionHash: undefined, // Redemption doesn't have blockchain tx hash
                processingTime: '1-2 business days',
                rejectReason: redemption.status === 'rejected' ? redemption.admin_notes : undefined,
                shippingAddress: redemption.shipping_address,
                goldAmount: redemption.gold_amount_grams,
            }))
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch redeem transactions'
            console.error('Error fetching redeem transactions:', err)
        } finally {
            isLoadingRedeem.value = false
        }
    }

    /**
     * Refresh all transaction data
     */
    const refreshTransactions = async (walletAddress: string) => {
        await Promise.all([
            fetchSendTransactions(walletAddress),
            fetchBridgeTransactions(walletAddress),
            fetchRedeemTransactions(walletAddress),
        ])
    }

    return {
        // State
        sendTransactions,
        bridgeTransactions,
        redeemTransactions,
        isLoadingSend,
        isLoadingBridge,
        isLoadingRedeem,
        error,

        // Methods
        fetchSendTransactions,
        fetchBridgeTransactions,
        fetchRedeemTransactions,
        refreshTransactions,
    }
}

/**
 * Map transaction status to bridge status
 */
function mapBridgeStatus(status: string): 'completed' | 'processing' | 'failed' {
    switch (status) {
        case 'success':
            return 'completed'
        case 'pending':
            return 'processing'
        case 'failed':
            return 'failed'
        default:
            return 'processing'
    }
}

/**
 * Map redemption status to redeem transaction status
 */
function mapRedeemStatus(status: string): 'completed' | 'pending' | 'rejected' | 'processing' {
    switch (status) {
        case 'completed':
            return 'completed'
        case 'processing':
        case 'shipped':
            return 'processing'
        case 'rejected':
            return 'rejected'
        case 'pending':
        default:
            return 'pending'
    }
}
