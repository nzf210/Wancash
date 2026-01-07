// stores/useBalanceStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { formatUnits } from 'viem'
import { useReadContract } from '@wagmi/vue'
import { wancashAbi } from '../services/contracts'

export const useBalanceStore = defineStore('balance', () => {
  const balances = ref<Map<string, string>>(new Map())
  const loadingStates = ref<Map<string, boolean>>(new Map())
  const errorStates = ref<Map<string, boolean>>(new Map())

  // Default contract addresses for each chain
  const defaultContractAddresses: Record<number, string> = {
    1: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF',
    56: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF',
    8453: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF',
    43114: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF',
    42161: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF',
    137: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF',
    80002: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF',
    11155111: '0xcE9F3d7b1d4e5dAe4Ba9F9564d2008667ed59344',
    97: '0x30ca352E6931C5e1e87B7259BA3521BEb6E0013B',
    43113: '0x5241625774FB5b9F8e7b8F1fe8b861Af3F6D786b',
  }

  // Helper to generate cache key
  const getCacheKey = (
    chainId: number,
    contractAddress: string,
    userAddress: string
  ): string => {
    return `${chainId}:${contractAddress}:${userAddress}`.toLowerCase()
  }

  // Format balance
  const formatBalance = (balance: bigint, decimals: number = 18): string => {
    try {
      const balanceStr = formatUnits(balance, decimals)
      const [integerPart, decimalPart = ''] = balanceStr.split('.')
      const formattedInteger = integerPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')
      const formattedDecimal = decimalPart.padEnd(2, '0').slice(0, 2)
      return `${formattedInteger}.${formattedDecimal}`
    } catch (error) {
      console.error('Error formatting balance:', error)
      return '0.00'
    }
  }

  // Get balance from store
  const getBalance = (cacheKey: string): string | null => {
    return balances.value.get(cacheKey) || null
  }

  // Set balance in store
  const setBalance = (cacheKey: string, balance: string): void => {
    balances.value.set(cacheKey, balance)
  }

  // Set loading state
  const setLoading = (cacheKey: string, loading: boolean): void => {
    loadingStates.value.set(cacheKey, loading)
  }

  // Set error state
  const setError = (cacheKey: string, error: boolean): void => {
    errorStates.value.set(cacheKey, error)
  }

  // Check if balance is loading
  const isLoading = (cacheKey: string): boolean => {
    return loadingStates.value.get(cacheKey) || false
  }

  // Check if balance has error
  const hasError = (cacheKey: string): boolean => {
    return errorStates.value.get(cacheKey) || false
  }

  // Clear all cached balances
  const clearBalances = (): void => {
    balances.value.clear()
    loadingStates.value.clear()
    errorStates.value.clear()
  }

  // Clear specific balance
  const clearBalance = (cacheKey: string): void => {
    balances.value.delete(cacheKey)
    loadingStates.value.delete(cacheKey)
    errorStates.value.delete(cacheKey)
  }

  // Get all cached balances for a user
  const getUserBalances = (userAddress: string): Array<{cacheKey: string, balance: string}> => {
    const result: Array<{cacheKey: string, balance: string}> = []
    const lowerUserAddress = userAddress.toLowerCase()

    balances.value.forEach((balance, cacheKey) => {
      if (cacheKey.includes(lowerUserAddress)) {
        result.push({ cacheKey, balance })
      }
    })

    return result
  }

  const fetchBalanceFromChain = async (
  chainId: number,
  contractAddress: string,
  userAddress: string,
  decimals: number
) => {
  console.log('Fetching balance with params:', {
    address: contractAddress,
    chainId: chainId,
    userAddress: userAddress
  })
  try {
    const result = useReadContract({
      address: contractAddress as `0x${string}`,
      abi: wancashAbi.abi,
      functionName: 'balanceOf',
      args: [userAddress as `0x${string}`],
      chainId: chainId,
    })

    const rawBalance = result as unknown as bigint
    const formatted = formatBalance(rawBalance, decimals)

    const cacheKey = getCacheKey(chainId, contractAddress, userAddress)
    setBalance(cacheKey, formatted)

    return {
      raw: rawBalance,
      formatted: formatted
    }
  } catch (error) {
    console.error('Error in fetchBalanceFromChain:', error)
    throw error
  }
}

  return {
    balances,
    loadingStates,
    errorStates,
    defaultContractAddresses,

    // Methods
    getCacheKey,
    formatBalance,
    getBalance,
    setBalance,
    setLoading,
    setError,
    isLoading,
    hasError,
    clearBalances,
    clearBalance,
    getUserBalances,
    fetchBalanceFromChain
  }
})
