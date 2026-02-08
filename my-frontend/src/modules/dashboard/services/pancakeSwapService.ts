import { createPublicClient, http, parseUnits, erc20Abi } from 'viem'
import { bsc, bscTestnet } from 'viem/chains'
import { SmartRouter, SwapRouter } from '@pancakeswap/smart-router'
import { Token, CurrencyAmount, TradeType, Percent, Native } from '@pancakeswap/sdk'
import { wancashContractAddress } from '@/app/services/contracts'
import { wagmiConfig } from '@/app/components/config/appkit'
import { readContract, writeContract, waitForTransactionReceipt, getAccount } from '@wagmi/core'

export type TokenSymbol = 'BNB' | 'USDT' | 'WCH'

interface ChainConfig {
    chainId: number
    chain: any
    rpc: string
    routerAddress: string
    usdtAddress: string
    wchAddress: string
}

const CHAIN_CONFIGS: Record<number, ChainConfig> = {
    56: {
        chainId: 56,
        chain: bsc,
        rpc: 'https://bsc-dataseed.binance.org',
        routerAddress: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
        usdtAddress: import.meta.env.VITE_BSC_USDT_CONTRACT || '0x55d398326f99059fF775485246999027B3197955',
        wchAddress: wancashContractAddress[56]
    },
    97: {
        chainId: 97,
        chain: bscTestnet,
        rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        routerAddress: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796', // PancakeSwap V3 Testnet Router
        usdtAddress: import.meta.env.VITE_BSC_USDT_CONTRACT || '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
        wchAddress: wancashContractAddress[97]
    }
}

// Client cache
const clients: Record<number, any> = {}

const getClient = (chainId: number) => {
    if (clients[chainId]) return clients[chainId]

    const config = CHAIN_CONFIGS[chainId]
    if (!config) throw new Error(`Unsupported chain ID: ${chainId}`)

    clients[chainId] = createPublicClient({
        chain: config.chain,
        transport: http(config.rpc),
        batch: {
            multicall: {
                batchSize: 1024 * 200,
            },
        },
    })
    return clients[chainId]
}

export interface SwapQuote {
    amountIn: string
    amountOut: string
    route: any
    tokenIn: Token | Native
}

export const pancakeSwapService = {
    /**
     * Get tokens for a specific chain
     */
    getTokens(chainId: number) {
        const config = CHAIN_CONFIGS[chainId]
        if (!config) return null

        return {
            BNB: Native.onChain(chainId),
            USDT: new Token(chainId, config.usdtAddress as `0x${string}`, 18, 'USDT', 'Tether USD'),
            WCH: new Token(chainId, config.wchAddress as `0x${string}`, 18, 'WCH', 'Wancash Token')
        }
    },

    /**
     * Get a quote for swapping tokens
     */
    async getQuote(
        chainId: number,
        amountIn: string,
        tokenInSymbol: TokenSymbol,
        tokenOutSymbol: TokenSymbol
    ): Promise<SwapQuote | null> {
        try {
            if (!amountIn || parseFloat(amountIn) <= 0) return null

            const tokens = this.getTokens(chainId)
            if (!tokens) throw new Error('Unsupported chain')

            const inputCurrency = tokens[tokenInSymbol]
            const outputCurrency = tokens[tokenOutSymbol]
            const client = getClient(chainId)

            const amount = CurrencyAmount.fromRawAmount(
                inputCurrency,
                parseUnits(amountIn, 18).toString()
            )

            const route = await SmartRouter.getBestTrade(
                amount,
                outputCurrency,
                TradeType.EXACT_INPUT,
                {
                    gasPriceWei: () => client.getGasPrice(),
                    maxHops: 2,
                    maxSplits: 2,
                    distributionPercent: 5,
                    quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: () => client } as any),
                    poolProvider: SmartRouter.createPoolProvider({ onChainProvider: () => client } as any),
                }
            )

            if (!route) return null

            return {
                amountIn: amountIn,
                amountOut: route.outputAmount.toExact(),
                route: route,
                tokenIn: inputCurrency
            }
        } catch (error) {
            console.error('Failed to get quote:', error)
            throw error
        }
    },

    /**
     * Get address for a token symbol
     */
    getTokenAddress(chainId: number, symbol: TokenSymbol): `0x${string}` | null {
        const config = CHAIN_CONFIGS[chainId]
        if (!config) return null

        if (symbol === 'BNB') return null
        if (symbol === 'USDT') return config.usdtAddress as `0x${string}`
        if (symbol === 'WCH') return config.wchAddress as `0x${string}`
        return null
    },

    /**
     * Check if allowance is sufficient for swap
     */
    async checkAllowance(chainId: number, amount: string, tokenSymbol: TokenSymbol): Promise<boolean> {
        if (tokenSymbol === 'BNB') return true // Native token doesn't need approval

        const account = getAccount(wagmiConfig)
        if (!account.address) return false

        const tokenAddress = this.getTokenAddress(chainId, tokenSymbol)
        if (!tokenAddress) return false

        const config = CHAIN_CONFIGS[chainId]
        if (!config) return false

        try {
            const allowance = await readContract(wagmiConfig, {
                address: tokenAddress,
                abi: erc20Abi,
                functionName: 'allowance',
                args: [account.address, config.routerAddress as `0x${string}`],
                chainId // Explicitly pass chainId
            })

            const requiredAmount = parseUnits(amount, 18)
            return allowance >= requiredAmount
        } catch (error) {
            console.error('Failed to check allowance:', error)
            return false
        }
    },

    /**
     * Approve token for Smart Router
     */
    async approveToken(chainId: number, amount: string, tokenSymbol: TokenSymbol): Promise<`0x${string}`> {
        const tokenAddress = this.getTokenAddress(chainId, tokenSymbol)
        if (!tokenAddress) throw new Error('Cannot approve native token')

        const config = CHAIN_CONFIGS[chainId]
        if (!config) throw new Error('Unsupported chain')

        const amountToApprove = parseUnits(amount, 18)

        const txHash = await writeContract(wagmiConfig, {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'approve',
            args: [config.routerAddress as `0x${string}`, amountToApprove],
            chainId: chainId
        })

        await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
        return txHash
    },

    /**
     * Execute the swap
     * @param quote The quote received from getQuote
     */
    async executeSwap(chainId: number, quote: SwapQuote, slippagePercent: number = 0.5) {
        const account = getAccount(wagmiConfig)
        if (!account.address) throw new Error('Wallet not connected')

        const config = CHAIN_CONFIGS[chainId]
        if (!config) throw new Error('Unsupported chain')

        const { route } = quote

        // Percent takes numerator and denominator. 
        // 0.5% = 50 / 10000 
        // 1% = 100 / 10000
        // input slippagePercent is like 0.5, 1, 5
        const numerator = Math.floor(slippagePercent * 100)
        const denominator = 10000

        // Call the smart router swap call parameters
        const { calldata, value } = SwapRouter.swapCallParameters(route, {
            recipient: account.address,
            slippageTolerance: new Percent(numerator, denominator),
            deadlineOrPreviousBlockhash: Math.floor(Date.now() / 1000) + 1200, // 20 minutes
        })

        const { sendTransaction } = await import('@wagmi/core')

        const txHash = await sendTransaction(wagmiConfig, {
            to: config.routerAddress as `0x${string}`,
            data: calldata as `0x${string}`,
            value: BigInt(value),
            account: account.address as `0x${string}`,
            chainId: chainId
        })

        return txHash
    }
}
