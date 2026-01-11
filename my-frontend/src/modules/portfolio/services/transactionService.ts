/**
 * Portfolio Transaction Service
 * Provides transaction history fetching using global services
 * 
 * This is a wrapper around global services for portfolio-specific needs
 */

import type { SendTransaction, BridgeTransaction, RedeemTransaction } from '../types'
import { transactionHistoryService } from '@/app/services/transactionHistoryService'
import { redemptionService } from '@/app/services/redemptionService'

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

/**
 * Service for fetching transaction history from the backend
 */
export const transactionService = {
    /**
     * Fetch send token transactions for a wallet
     */
    async fetchSendTransactions(_walletAddress: string): Promise<SendTransaction[]> {
        try {
            const transactions = await transactionHistoryService.fetchFromBackend({ type: 'send' })

            return transactions.map(tx => ({
                id: typeof tx.id === 'number' ? tx.id : parseInt(tx.id as string) || Date.now(),
                date: new Date(tx.timestamp),
                recipient: tx.to,
                recipientName: tx.memo || null,
                amount: parseFloat(tx.amount) || 0,
                fee: 0,
                status: tx.status as 'success' | 'pending' | 'failed',
                hash: tx.hash || null,
            }))
        } catch (error) {
            console.error('Error fetching send transactions:', error)
            throw error
        }
    },

    /**
     * Fetch bridge transactions for a wallet
     */
    async fetchBridgeTransactions(_walletAddress: string): Promise<BridgeTransaction[]> {
        try {
            const transactions = await transactionHistoryService.fetchFromBackend({ type: 'bridge' })

            return transactions.map(tx => ({
                id: typeof tx.id === 'number' ? tx.id : parseInt(tx.id as string) || Date.now(),
                date: new Date(tx.timestamp),
                fromChain: tx.fromChainName || 'Unknown',
                toChain: tx.toChainName || 'Unknown',
                amount: parseFloat(tx.amount) || 0,
                fee: 0,
                status: mapBridgeStatus(tx.status),
                estimatedTime: '15-30 minutes',
                transactionHash: tx.hash || undefined,
            }))
        } catch (error) {
            console.error('Error fetching bridge transactions:', error)
            throw error
        }
    },

    /**
     * Fetch redeem transactions for a wallet
     * Uses authenticated wallet from auth_state
     */
    async fetchRedeemTransactions(_walletAddress: string): Promise<RedeemTransaction[]> {
        try {
            const redemptions = await redemptionService.getRedemptions()

            return redemptions.map(redemption => ({
                id: parseInt(redemption.id) || Date.now(),
                date: new Date(redemption.created_at),
                amount: redemption.total_token_amount || 0,
                bankName: redemption.recipient_name || 'Redemption Request',
                accountNumber: redemption.phone_number || '',
                accountName: redemption.recipient_name || '',
                status: mapRedeemStatus(redemption.status),
                transactionHash: undefined,
                processingTime: '1-2 business days',
                rejectReason: redemption.status === 'rejected' ? redemption.admin_notes : undefined,
            }))
        } catch (error) {
            console.error('Error fetching redeem transactions:', error)
            throw error
        }
    },

    /**
     * Get details for a specific transaction
     */
    async getTransactionDetails(transactionId: number): Promise<SendTransaction | BridgeTransaction | null> {
        try {
            // Fetch all transactions and find by ID
            const allTransactions = await transactionHistoryService.fetchFromBackend()
            const found = allTransactions.find(tx => tx.id === transactionId || tx.id === transactionId.toString())

            if (!found) return null

            if (found.type === 'send') {
                return {
                    id: typeof found.id === 'number' ? found.id : parseInt(found.id as string) || Date.now(),
                    date: new Date(found.timestamp),
                    recipient: found.to,
                    recipientName: found.memo || null,
                    amount: parseFloat(found.amount) || 0,
                    fee: 0,
                    status: found.status as 'success' | 'pending' | 'failed',
                    hash: found.hash || null,
                }
            } else {
                return {
                    id: typeof found.id === 'number' ? found.id : parseInt(found.id as string) || Date.now(),
                    date: new Date(found.timestamp),
                    fromChain: found.fromChainName || 'Unknown',
                    toChain: found.toChainName || 'Unknown',
                    amount: parseFloat(found.amount) || 0,
                    fee: 0,
                    status: mapBridgeStatus(found.status),
                    estimatedTime: '15-30 minutes',
                    transactionHash: found.hash || undefined,
                }
            }
        } catch (error) {
            console.error('Error fetching transaction details:', error)
            throw error
        }
    },
}
