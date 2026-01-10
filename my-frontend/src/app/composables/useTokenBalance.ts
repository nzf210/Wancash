// composables/useTokenBalance.ts
import { computed, watch, ref, onMounted, getCurrentInstance } from 'vue'
import { useConnection } from '@wagmi/vue'
import { useBalanceStore } from '@/app/stores/useBalanceStore'

interface UseTokenBalanceOptions {
  contractAddress?: string
  userAddress?: string
  chainId?: number
  decimals?: number
  autoFetch?: boolean
}

interface TokenBalanceReturn {
  balance: string | null
  rawBalance: bigint | undefined
  isLoading: boolean
  isError: boolean
  chainId: number | undefined
  userAddress: string | undefined
  contractAddress: string | undefined
  cacheKey: string | null
  fetchBalance: () => Promise<void>
  refetch: () => Promise<void>
  updateChainId: (newChainId: number) => void
  updateUserAddress: (newAddress: string) => void
  updateContractAddress: (newAddress: string) => void
}

export function useTokenBalance(options: UseTokenBalanceOptions = {}): TokenBalanceReturn {
  const {
    contractAddress: customContractAddress,
    userAddress: customUserAddress,
    chainId: customChainId,
    decimals = 18,
    autoFetch = true,
  } = options

  console.log('Custom contract address:', options)
  // Periksa apakah kita berada dalam konteks Vue
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useTokenBalance must be called within a Vue component setup function')
  }

  const balanceStore = useBalanceStore()
  const { chainId: connectedChainId, address: connectedAddress } = useConnection()

  // Debug logging
  console.log('useTokenBalance initialized with:', {
    customContractAddress,
    customUserAddress,
    customChainId,
    connectedChainId: connectedChainId.value,
    connectedAddress: connectedAddress.value
  })

  // Reactive references
  const chainId = ref(customChainId || connectedChainId.value)
  const userAddress = ref(customUserAddress || connectedAddress.value)
  const contractAddress = ref<string>('')
  const lastError = ref<unknown>(null)

  // State untuk menangani async operations
  const isLoading = ref(false)
  const isError = ref(false)
  const balance = ref<string | null>(null)
  const rawBalance = ref<bigint | undefined>(undefined)
  const cacheKey = ref<string | null>(null)

  // Update cache key
  const updateCacheKey = () => {
    if (!chainId.value || !contractAddress.value || !userAddress.value) {
      cacheKey.value = null
      return
    }
    const key = balanceStore.getCacheKey(chainId.value, contractAddress.value, userAddress.value)
    console.log('Generated cache key:', key)
    cacheKey.value = key
  }

  // Get contract address based on chain
  const getContractAddress = (chainIdValue: number): string => {
    if (customContractAddress) {
      console.log('Using custom contract address:', customContractAddress)
      return customContractAddress
    }

    const defaultAddr = balanceStore.defaultContractAddresses[chainIdValue] ||
      balanceStore.defaultContractAddresses[1]
    console.log('Selected contract address for chain', chainIdValue, ':', defaultAddr)
    return defaultAddr
  }

  // Update contract address when chain changes
  const updateContractAddressFromChain = () => {
    console.log('Chain changed to:', chainId.value)
    if (chainId.value) {
      contractAddress.value = getContractAddress(chainId.value)
      console.log('Updated contract address to:', contractAddress.value)
      updateCacheKey()
    }
  }

  // Watch for chain changes
  watch([chainId, userAddress, contractAddress], () => {
    updateCacheKey()
  })

  // Manual fetch function - tanpa menggunakan useReadContract di dalamnya
  const fetchBalance = async () => {
    console.log('Manual fetchBalance called')

    if (!contractAddress.value || !userAddress.value || !chainId.value) {
      console.warn('Cannot fetch balance: missing required parameters')
      return
    }

    // Set loading state
    if (cacheKey.value) {
      balanceStore.setLoading(cacheKey.value, true)
    }
    isLoading.value = true
    isError.value = false

    try {
      console.log('Fetching balance with params:', {
        address: contractAddress.value,
        chainId: chainId.value,
        userAddress: userAddress.value
      })

      // Gunakan readContract secara manual jika diperlukan
      // Atau gunakan store untuk fetch
      const result = await balanceStore.fetchBalanceFromChain(
        chainId.value,
        contractAddress.value,
        userAddress.value,
        decimals
      )

      if (result) {
        balance.value = result.formatted
        rawBalance.value = result.raw
        console.log('Balance fetched successfully:', result.formatted)
      }

    } catch (error) {
      console.error('Error fetching balance:', error)
      lastError.value = error
      isError.value = true

      if (cacheKey.value) {
        balanceStore.setError(cacheKey.value, true)
      }
    } finally {
      if (cacheKey.value) {
        balanceStore.setLoading(cacheKey.value, false)
      }
      isLoading.value = false
    }
  }

  // Initialize contract address
  onMounted(() => {
    updateContractAddressFromChain()

    // Load cached balance jika ada
    if (cacheKey.value) {
      const cached = balanceStore.getBalance(cacheKey.value)
      if (cached) {
        balance.value = cached
        console.log('Loaded cached balance:', cached)
      }
    }

    // Auto fetch jika diperlukan
    if (autoFetch && contractAddress.value && userAddress.value && chainId.value) {
      // Delay sedikit untuk memastikan semuanya siap
      setTimeout(() => {
        fetchBalance()
      }, 500)
    }
  })

  // Watch untuk auto-refetch
  watch([userAddress, chainId, contractAddress], () => {
    if (autoFetch && userAddress.value && chainId.value && contractAddress.value) {
      // Gunakan nextTick untuk memastikan dalam Vue context
      instance.proxy?.$nextTick(() => {
        fetchBalance()
      })
    }
  })

  // Return reactive values
  return {
    balance: computed(() => balance.value) as unknown as string,
    rawBalance: computed(() => rawBalance.value) as unknown as bigint,
    isLoading: computed(() => isLoading.value) as unknown as boolean,
    isError: computed(() => isError.value) as unknown as boolean,
    chainId: computed(() => chainId.value) as unknown as number,
    userAddress: computed(() => userAddress.value) as unknown as `0x${string}`,
    contractAddress: computed(() => contractAddress.value) as unknown as `0x${string}`,
    cacheKey: computed(() => cacheKey.value) as unknown as string,
    fetchBalance,
    refetch: async () => {
      console.log('refetch called')
      return fetchBalance()
    },
    updateChainId: (newChainId: number) => {
      console.log('Updating chainId from', chainId.value, 'to', newChainId)
      chainId.value = newChainId
      updateContractAddressFromChain()
    },
    updateUserAddress: (newAddress: string) => {
      console.log('Updating userAddress from', userAddress.value, 'to', newAddress)
      userAddress.value = newAddress
      updateCacheKey()
    },
    updateContractAddress: (newAddress: string) => {
      console.log('Updating contractAddress from', contractAddress.value, 'to', newAddress)
      contractAddress.value = newAddress
      updateCacheKey()
    },
  }
}

// Tambahkan fungsi di balance store untuk fetch dari chain:
