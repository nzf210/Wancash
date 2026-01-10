import { ref, computed } from 'vue'
import type { PortfolioData, PortfolioValue } from '../types'

/**
 * Composable for managing portfolio balance data
 */
export function usePortfolioData() {
    // State
    const totalBalance = ref(0)
    const availableBalance = ref(0)
    const lockedBalance = ref(0)
    const tokenPrice = ref(0)
    const priceChange = ref(0)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Computed values
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
    const fetchPortfolioData = async (walletAddress: string) => {
        try {
            isLoading.value = true
            error.value = null

            // TODO: Replace with actual API call
            // const data = await portfolioService.fetchPortfolioBalance(walletAddress)

            // Mock data for now
            totalBalance.value = 15_000
            availableBalance.value = 12_000
            lockedBalance.value = 3_000
            tokenPrice.value = 500_000
            priceChange.value = 2.5
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
