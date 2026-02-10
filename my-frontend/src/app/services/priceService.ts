import { statsApi } from './statsApi'

export interface TokenPrice {
    priceUsd: number
    percentChange1h?: number
    percentChange6h?: number
    percentChange24h: number
    volume24h?: number
    marketCap?: number
    pairAddress?: string
}

/**
 * Service to fetch token prices and statistics
 */
export const priceService = {
    /**
     * Fetch ETH price from CoinCap (Fallback)
     */
    async fetchEthPrice(): Promise<TokenPrice | null> {
        try {
            const COINCAP_API_BASE = 'https://api.coincap.io/v2'
            const response = await fetch(`${COINCAP_API_BASE}/assets/ethereum`)
            if (!response.ok) throw new Error('Failed to fetch ETH price')

            const data = await response.json()
            return {
                priceUsd: parseFloat(data.data.priceUsd),
                percentChange24h: parseFloat(data.data.changePercent24Hr)
            }
        } catch (error) {
            console.warn('Error fetching ETH price:', error)
            return null
        }
    },

    /**
     * Fetch WCH price and statistics from Backend
     */
    async fetchWchPrice(): Promise<TokenPrice> {
        try {
            const data = await statsApi.getTokenPrice()

            return {
                priceUsd: parseFloat(data.priceUsd),
                percentChange1h: data.priceChange?.h1 || 0,
                percentChange6h: data.priceChange?.h6 || 0,
                percentChange24h: data.priceChange?.h24 || 0,
                volume24h: data.volume?.h24 || 0,
                marketCap: data.marketCap || 0,
                pairAddress: data.pairAddress
            }
        } catch (error) {
            console.warn('Error fetching WCH price from backend:', error)
            return {
                priceUsd: 0.0013,
                percentChange24h: 0
            }
        }
    }
}

