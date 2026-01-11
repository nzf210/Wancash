import { ref, computed, watch } from 'vue'
import type { PortfolioData, PortfolioValue } from '../types'
import { usePriceStore } from '@/stores/priceStore'
import { useWalletStore } from '@/app/stores/wallet.store'
import { storeToRefs } from 'pinia'
import { useReadContract } from '@wagmi/vue'
import { wancashAbi, wancashContractAddress } from '@/app/services/contracts'
import { formatUnits } from 'viem'

/**
 * Composable for managing portfolio balance data
 */
export function usePortfolioData() {
    // State
    const lockedBalance = ref(0) // Global variable as requested, currently 0
    // Removed local tokenPrice state in favor of global store
    const priceChange = ref(0)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const priceStore = usePriceStore()
    const walletStore = useWalletStore()
    const { wchPrice: tokenPrice } = storeToRefs(priceStore)
    const { address: walletAddress, isConnected, chainId } = storeToRefs(walletStore)

    const contractAddress = computed(() => {
        if (!chainId.value) return undefined
        return wancashContractAddress[chainId.value] as `0x${string}` | undefined
    })

    // Wagmi Contract Read for Available Balance
    const { data: balanceData, refetch: refetchBalance, isLoading: isBalanceLoading } = useReadContract({
        address: contractAddress,
        abi: wancashAbi.abi as any,
        functionName: 'balanceOf',
        args: computed(() => walletAddress.value ? [walletAddress.value as `0x${string}`] : undefined),
        query: {
            enabled: computed(() => !!walletAddress.value && isConnected.value && !!contractAddress.value),
        }
    })

    // Computed values
    const availableBalance = computed(() => {
        if (!balanceData.value) return 0
        // formatted WCH balance (assuming 18 decimals)
        return Number(formatUnits(balanceData.value as bigint, 18))
    })

    const totalBalance = computed(() => availableBalance.value + lockedBalance.value)

    const totalValue = computed(() => totalBalance.value * tokenPrice.value)
    const availableValue = computed(() => availableBalance.value * tokenPrice.value)
    const lockedValue = computed(() => lockedBalance.value * tokenPrice.value)

    const portfolioData = computed<PortfolioData>(() => ({
        totalBalance: totalBalance.value,
        availableBalance: availableBalance.value,
        lockedBalance: lockedBalance.value,
        tokenPrice: tokenPrice.value,
        priceChange: priceChange.value,
    }))

    const portfolioValue = computed<PortfolioValue>(() => ({
        totalValue: totalValue.value,
        availableValue: availableValue.value,
        lockedValue: lockedValue.value,
    }))

    /**
     * Fetch portfolio data from API
     */
    const fetchPortfolioData = async (address?: string) => {
        try {
            isLoading.value = true
            error.value = null

            // Refresh price
            await priceStore.fetchPrices()
            priceChange.value = priceStore.wchChange24h

            // Refetch balance if address is provided (though wagmi handles reactivity)
            if (address || walletAddress.value) {
                await refetchBalance()
            }

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch portfolio data'
            console.error('Error fetching portfolio data:', err)
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Refresh portfolio data
     */
    const refreshPortfolioData = async (address: string) => {
        await fetchPortfolioData(address)
    }

    // Initialize
    watch(walletAddress, (newAddress) => {
        if (newAddress) {
            fetchPortfolioData(newAddress)
        }
    }, { immediate: true })

    return {
        // State
        totalBalance,
        availableBalance,
        lockedBalance,
        tokenPrice,
        priceChange,
        isLoading: computed(() => isLoading.value || isBalanceLoading.value),
        error,

        // Computed
        totalValue,
        availableValue,
        lockedValue,
        portfolioData,
        portfolioValue,

        // Methods
        fetchPortfolioData,
        refreshPortfolioData,
    }
}
