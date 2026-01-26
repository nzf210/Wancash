// composables/useMultipleBalances.ts
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import { useTokenBalance } from '@/app/composables/useTokenBalance'
import { useConnection } from '@wagmi/vue'
import { wancashContractAddress } from '@/app/services/contracts'

interface TokenConfig {
  contractAddress?: string
  chainId: number
  userAddress: string
  decimals?: number
  symbol?: string
  name?: string
}

interface TokenBalanceItem {
  symbol?: string
  name?: string
  balance: string | null
  rawBalance: bigint | undefined
  isLoading: boolean
  isError: boolean
  contractAddress?: string
  chainId?: number
  fetchBalance: () => Promise<void>
}

export function useMultipleBalances(tokenConfigs: TokenConfig[] | Ref<TokenConfig[]>) {

  // Convert to reactive reference if needed
  const tokenConfigsRef = Array.isArray(tokenConfigs) ? ref(tokenConfigs) : tokenConfigs

  const tokenBalances = ref<TokenBalanceItem[]>([])
  const isLoading = ref(true)
  const initializationComplete = ref(false)
  const contractAddress = wancashContractAddress[tokenConfigsRef.value[0].chainId]
  // Create reactive token balances
  const initializeBalances = async () => {
    console.log('Initializing balances with configs:', tokenConfigsRef.value)

    isLoading.value = true
    try {
      const balances = await Promise.all(
        tokenConfigsRef.value.map(async (config) => {
          const balanceComposable = useTokenBalance({
            contractAddress: contractAddress,
            chainId: config.chainId,
            decimals: config.decimals,
            autoFetch: true,
            userAddress: config.userAddress
          })

          // Wait for initial fetch if needed
          if (balanceComposable.isLoading) {
            await balanceComposable.fetchBalance()
          }

          return {
            symbol: config.symbol,
            name: config.name,
            balance: balanceComposable.balance,
            rawBalance: balanceComposable.rawBalance,
            isLoading: balanceComposable.isLoading,
            isError: balanceComposable.isError,
            contractAddress: config.contractAddress,
            chainId: config.chainId,
            fetchBalance: balanceComposable.fetchBalance,
          }
        })
      )

      tokenBalances.value = balances
      initializationComplete.value = true
    } catch (error) {
      console.error('Error initializing balances:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Watch for changes in wallet connection
  const { chainId, address } = useConnection()
  watch([chainId, address], () => {
    if (chainId.value && address.value) {
      console.log('Wallet connection changed, reinitializing balances...')
      initializeBalances()
    }
  })

  // Initialize on setup
  onMounted(() => {
    initializeBalances()
  })

  // Watch for changes in tokenConfigs
  watch(tokenConfigsRef, () => {
    initializeBalances()
  }, { deep: true })

  // Total balance
  const totalBalance = computed(() => {
    let total = 0
    tokenBalances.value.forEach(token => {
      if (token.balance) {
        const numericBalance = Number.parseFloat(token.balance.replaceAll(',', ''))
        if (!Number.isNaN(numericBalance)) {
          total += numericBalance
        }
      }
    })
    return total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  })

  // Check if any balance is loading
  const isBalancesLoading = computed(() => {
    return isLoading.value || tokenBalances.value.some(token => token.isLoading)
  })

  // Check if any balance has error
  const hasError = computed(() => {
    return tokenBalances.value.some(token => token.isError)
  })

  // Refresh all balances
  const refreshAll = async () => {
    console.log('Refreshing all balances...')
    isLoading.value = true
    try {
      const promises = tokenBalances.value.map(token => token.fetchBalance())
      await Promise.all(promises)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    tokenBalances,
    totalBalance,
    isLoading: isBalancesLoading,
    hasError,
    tokenCount: computed(() => tokenBalances.value.length),
    loadedCount: computed(() => tokenBalances.value.filter(token => token.balance !== null && !token.isLoading).length),

    // Methods
    refreshAll,
    initializeBalances,
  }
}
