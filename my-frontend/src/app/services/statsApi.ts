import { apiClient } from '@/utils/apiClient'

export interface TokenPrice {
    priceUsd: string
    priceChange: {
        h1: number
        h6: number
        h24: number
    }
    volume: {
        h24: number
    }
    marketCap: number
    pairAddress: string
}

export interface PriceHistoryItem {
    timestamp: number
    open: number
    high: number
    low: number
    close: number
    price: number
    volume: number
}

export interface PriceHistoryResponse {
    success: boolean
    timeframe: string
    points: number
    data: PriceHistoryItem[]
    error?: string
    details?: string
}

export const statsApi = {
    /**
     * Fetch token price history for charts
     */
    async getTokenPriceHistory(timeframe: string = '1d', points: number = 60): Promise<PriceHistoryResponse> {
        const response = await apiClient.fetch(`/api/stats/token-price-history?timeframe=${timeframe}&points=${points}`)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to fetch price history')
        }

        return await response.json()
    },

    /**
     * Fetch current WCH token price and stats
     */
    async getTokenPrice(): Promise<TokenPrice> {
        const response = await apiClient.fetch('/api/stats/token-price')

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to fetch token price')
        }

        return await response.json()
    }
}
