import type { SendTransaction, BridgeTransaction } from '../types'

/**
 * Service for fetching transaction history from the backend
 */
export const transactionService = {
    /**
     * Fetch send token transactions for a wallet
     */
    async fetchSendTransactions(walletAddress: string): Promise<SendTransaction[]> {
        try {
            // TODO: Replace with actual API endpoint
            // const response = await fetch(`/api/transactions/send?wallet=${walletAddress}`)
            // if (!response.ok) throw new Error('Failed to fetch send transactions')
            // return await response.json()

            // Mock implementation - return empty array for now
            // Actual data will be loaded in the composable
            return []
        } catch (error) {
            console.error('Error fetching send transactions:', error)
            throw error
        }
    },

    /**
     * Fetch bridge transactions for a wallet
     */
    async fetchBridgeTransactions(walletAddress: string): Promise<BridgeTransaction[]> {
        try {
            // TODO: Replace with actual API endpoint
            // const response = await fetch(`/api/transactions/bridge?wallet=${walletAddress}`)
            // if (!response.ok) throw new Error('Failed to fetch bridge transactions')
            // return await response.json()

            // Mock implementation
            return []
        } catch (error) {
            console.error('Error fetching bridge transactions:', error)
            throw error
        }
    },

    /**
     * Get details for a specific transaction
     */
    async getTransactionDetails(transactionId: number): Promise<SendTransaction | BridgeTransaction | null> {
        try {
            // TODO: Replace with actual API endpoint
            // const response = await fetch(`/api/transactions/${transactionId}`)
            // if (!response.ok) throw new Error('Failed to fetch transaction details')
            // return await response.json()

            // Mock implementation
            return null
        } catch (error) {
            console.error('Error fetching transaction details:', error)
            throw error
        }
    },
}
