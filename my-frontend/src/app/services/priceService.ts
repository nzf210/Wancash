const COINCAP_API_BASE = 'https://api.coincap.io/v2'

export interface TokenPrice {
    priceUsd: number
    percentChange24h: number
}

/**
 * Service to fetch token prices from CoinCap API
 */
export const priceService = {
    /**
     * Fetch ETH price from CoinCap
     */
    async fetchEthPrice(): Promise<TokenPrice | null> {
        try {
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
     * Fetch WCH price
     * Currently uses a fallback as WCH is not listed on public APIs yet.
     */
    async fetchWchPrice(): Promise<TokenPrice> {
        // In the future, this would call an API or smart contract
        // For now, we return the hardcoded price with 0% change
        return {
            priceUsd: 0.0013,
            percentChange24h: 0
        }
    }
}
