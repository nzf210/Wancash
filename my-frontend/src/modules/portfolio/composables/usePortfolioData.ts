import { ref, computed } from 'vue'
import type { PortfolioData, PortfolioValue } from '../types'
import { usePriceStore } from '@/stores/priceStore'
import { storeToRefs } from 'pinia'

/**
 * Composable for managing portfolio balance data
 */
export function usePortfolioData() {
    // State
    const totalBalance = ref(0)
    const availableBalance = ref(0)
    const lockedBalance = ref(0)
    // Removed local tokenPrice state in favor of global store
    const priceChange = ref(0)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const priceStore = usePriceStore()
    const { wchPrice: tokenPrice } = storeToRefs(priceStore)

    // Computed values
    const totalValue = computed(() => {
        // console.log('DEBUG: totalBalance', totalBalance.value, 'tokenPrice', tokenPrice.value)
        return totalBalance.value * tokenPrice.value
    })
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
    const fetchPortfolioData = async (walletAddress: string) => {
        try {
            isLoading.value = true
            error.value = null

            // Mock data for now - using hardcoded values as requested to fix zero view
            totalBalance.value = 15_000
            availableBalance.value = 12_000
            lockedBalance.value = 3_000

            // Trigger price fetch but don't await it to show balance immediately with default store price
            priceStore.fetchPrices().then(() => {
                // Update local price change ref after fetch if needed, 
                // though components should use store refs directly if possible.
                priceChange.value = priceStore.wchChange24h
            }).catch(console.error)

            // Initialize priceChange from store immediately (in case it already has data)
            priceChange.value = priceStore.wchChange24h
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
    const refreshPortfolioData = async (walletAddress: string) => {
        await fetchPortfolioData(walletAddress)
    }

    return {
        // State
        totalBalance,
        availableBalance,
        lockedBalance,
        tokenPrice,
        priceChange,
        isLoading,
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
