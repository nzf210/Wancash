import { ref } from 'vue'
import type { SendTransaction, BridgeTransaction } from '../types'

/**
 * Composable for managing transaction history data
 */
export function useTransactionHistory() {
    // State
    const sendTransactions = ref<SendTransaction[]>([])
    const bridgeTransactions = ref<BridgeTransaction[]>([])
    const isLoadingSend = ref(false)
    const isLoadingBridge = ref(false)
    const error = ref<string | null>(null)

    /**
     * Fetch send transactions from backend
     */
    const fetchSendTransactions = async (walletAddress: string) => {
        try {
            isLoadingSend.value = true
            error.value = null

            // TODO: Replace with actual API call
            // const data = await transactionService.fetchSendTransactions(walletAddress)

            // Mock data for now
            sendTransactions.value = [
                {
                    id: 1,
                    date: new Date('2024-01-15T10:30:00'),
                    recipient: '0x742d35Cc6634C0532925a3b844Bc9e',
                    recipientName: 'John Doe',
                    amount: 1000,
                    fee: 2.5,
                    status: 'success',
                    hash: '0x8a2b4c6d9e1f3a5b7c9d2e4f6a8b0c2d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b',
                },
                {
                    id: 2,
                    date: new Date('2024-01-14T14:20:00'),
                    recipient: '0x8b3c5d7e9f1a3b5c7d9e2f4a6b8c0d2e4f6a8b',
                    recipientName: 'Jane Smith',
                    amount: 2500,
                    fee: 3.2,
                    status: 'success',
                    hash: '0x9b3c5d7e9f1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d3e5f7a9b1c3d5e7f9a1b',
                },
                {
                    id: 3,
                    date: new Date('2024-01-13T09:15:00'),
                    recipient: '0x9c4d6e8f0a2b4c6d8e0f2a4b6c8e0f2a4b6c8d',
                    recipientName: null,
                    amount: 500,
                    fee: 1.8,
                    status: 'pending',
                    hash: null,
                },
                {
                    id: 4,
                    date: new Date('2024-01-12T16:45:00'),
                    recipient: '0xad5e7f9a1b3c5d7e9f1a3b5c7d9e2f4a6b8c0d',
                    recipientName: 'Company Wallet',
                    amount: 7500,
                    fee: 5.5,
                    status: 'success',
                    hash: '0xac5e7f9a1b3c5d7e9f1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d3e5f7a9b1c3',
                },
                {
                    id: 5,
                    date: new Date('2024-01-11T11:20:00'),
                    recipient: '0xbe6f8a0c2d4e6f8a0c2d4e6f8a0c2d4e6f8a0c',
                    recipientName: null,
                    amount: 1200,
                    fee: 2.1,
                    status: 'failed',
                    hash: null,
                },
            ]
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
    const fetchBridgeTransactions = async (walletAddress: string) => {
        try {
            isLoadingBridge.value = true
            error.value = null

            // TODO: Replace with actual API call
            // const data = await transactionService.fetchBridgeTransactions(walletAddress)

            // Mock data for now
            bridgeTransactions.value = [
                {
                    id: 1,
                    date: new Date('2024-01-15T09:45:00'),
                    fromChain: 'Ethereum',
                    toChain: 'Polygon',
                    amount: 5000,
                    fee: 25,
                    status: 'completed',
                    estimatedTime: '15 minutes',
                    transactionHash: '0x3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7',
                },
                {
                    id: 2,
                    date: new Date('2024-01-14T13:30:00'),
                    fromChain: 'BSC',
                    toChain: 'Arbitrum',
                    amount: 3200,
                    fee: 18,
                    status: 'completed',
                    estimatedTime: '10 minutes',
                    transactionHash: '0x4c6d8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8',
                },
                {
                    id: 3,
                    date: new Date('2024-01-13T08:20:00'),
                    fromChain: 'Polygon',
                    toChain: 'Optimism',
                    amount: 1800,
                    fee: 12,
                    status: 'processing',
                    estimatedTime: '20 minutes',
                    transactionHash: '0x5d7e9f1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d3e5f7a9b1c3d5e7f9a1b3c5d7e9',
                },
                {
                    id: 4,
                    date: new Date('2024-01-12T17:10:00'),
                    fromChain: 'Avalanche',
                    toChain: 'Fantom',
                    amount: 4200,
                    fee: 22,
                    status: 'completed',
                    estimatedTime: '25 minutes',
                    transactionHash: '0x6e8f0a2b4c6d8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0',
                },
            ]
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch bridge transactions'
            console.error('Error fetching bridge transactions:', err)
        } finally {
            isLoadingBridge.value = false
        }
    }

    /**
     * Refresh all transaction data
     */
    const refreshTransactions = async (walletAddress: string) => {
        await Promise.all([
            fetchSendTransactions(walletAddress),
            fetchBridgeTransactions(walletAddress),
        ])
    }

    return {
        // State
        sendTransactions,
        bridgeTransactions,
        isLoadingSend,
        isLoadingBridge,
        error,

        // Methods
        fetchSendTransactions,
        fetchBridgeTransactions,
        refreshTransactions,
    }
}
