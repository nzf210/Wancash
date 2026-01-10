import type { PortfolioData } from '../types'

/**
 * Service for fetching portfolio-related data from the backend
 */
export const portfolioService = {
    /**
     * Fetch portfolio balance for a wallet address
     */
    async fetchPortfolioBalance(walletAddress: string): Promise<PortfolioData> {
        try {
            // TODO: Replace with actual API endpoint
            // const response = await fetch(`/api/portfolio/${walletAddress}`)
            // if (!response.ok) throw new Error('Failed to fetch portfolio balance')
            // return await response.json()

            // Mock implementation for now
            return {
                totalBalance: 15_000,
                availableBalance: 12_000,
                lockedBalance: 3_000,
                tokenPrice: 500_000,
                priceChange: 2.5,
            }
        } catch (error) {
            console.error('Error fetching portfolio balance:', error)
            throw error
        }
    },

    /**
     * Fetch current token price
     */
    async fetchTokenPrice(): Promise<{ price: number; priceChange: number }> {
        try {
            // TODO: Replace with actual API endpoint
            // const response = await fetch('/api/token/price')
            // if (!response.ok) throw new Error('Failed to fetch token price')
            // return await response.json()

            // Mock implementation
            return {
                price: 500_000,
                priceChange: 2.5,
            }
        } catch (error) {
            console.error('Error fetching token price:', error)
            throw error
        }
    },
}
