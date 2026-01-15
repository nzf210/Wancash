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
    liquidity: {
        usd: number
    }
    fdv: number
    marketCap: number
}

// BNB Address (WBNB)
const BNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

export const dexScreenerService = {
    /**
     * Fetch Token Data from DexScreener
     * Prioritizes PancakeSwap USDT pairs
     * @param tokenAddress The contract address of the token (defaults to WBNB for now)
     */
    async getTokenData(tokenAddress: string = BNB_ADDRESS): Promise<DexTokenData | null> {
        try {
            const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)
            const pairs = response.data?.pairs || []

            if (pairs.length === 0) return null

            // Filter for PancakeSwap and USDT quote, or fall back to the most liquid pair
            const bestPair = pairs.find((p: any) =>
                p.dexId === 'pancakeswap' &&
                p.quoteToken.symbol === 'USDT'
            ) || pairs[0]

            return {
                pairAddress: bestPair.pairAddress,
                priceUsd: bestPair.priceUsd,
                priceChange: {
                    h24: bestPair.priceChange.h24
                },
                volume: {
                    h24: bestPair.volume.h24
                },
                liquidity: {
                    usd: bestPair.liquidity.usd
                },
                fdv: bestPair.fdv,
                marketCap: bestPair.fdv
            }
        } catch (error) {
            console.error('DexScreener API Error:', error)
            return null
        }
    }
}
