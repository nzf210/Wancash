import axios from 'axios'

export interface DexTokenData {
    pairAddress: string
    priceUsd: string
    priceChange: {
        h24: number
    }
    volume: {
        h24: number
    }
    liquidity?: {
        usd: number
    }
    fdv?: number
    marketCap: number
}

// Fallback to localhost if env var is not set (it's currently commented out in .env)
// const API_BASE_URL = import.meta.env.VITE_CLOUDE_WORKER || 'http://localhost:8787'

export const dexScreenerService = {
    /**
     * Fetch Token Data from Backend (Moralis Source)
     */
    async getTokenData(): Promise<DexTokenData | null> {
        try {
            console.log(`Fetching price from Backend: /api/stats/token-price`)
            const response = await axios.get(`/api/stats/token-price`)

            if (response.data && !response.data.error) {
                // Ensure optional fields are handled if backend doesn't send them
                const data = response.data
                return {
                    pairAddress: data.pairAddress,
                    priceUsd: data.priceUsd,
                    priceChange: {
                        h24: data.priceChange?.h24 || 0
                    },
                    volume: {
                        h24: data.volume?.h24 || 0
                    },
                    marketCap: data.marketCap || 0,
                    // Optional based on Moralis response capabilities
                    liquidity: { usd: 0 },
                    fdv: 0
                }
            }

            console.warn("Backend returned error or empty data", response.data)
            return null
        } catch (error) {
            console.error('Failed to fetch token data from backend:', error)
            return null
        }
    }
}
