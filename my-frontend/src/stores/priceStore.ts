import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { priceService } from '@/app/services/priceService'

export const usePriceStore = defineStore('price', () => {
    // State
    const wchPrice = ref(0.0015) // Default fallback
    const wchChange24h = ref(0)

    const nativePrice = ref(0) // ETH/BNB price in USD
    const nativeChange24h = ref(0)

    const isLoading = ref(false)
    const lastUpdated = ref<Date | null>(null)

    // Computed
    const formattedWchPrice = computed(() => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 4,
            maximumFractionDigits: 6
        }).format(wchPrice.value)
    })

    const formattedNativePrice = computed(() => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(nativePrice.value)
    })

    // Actions
    async function fetchPrices() {
        isLoading.value = true
        try {
            // Fetch ETH price (as proxy for native coin price representation for now)
            const ethData = await priceService.fetchEthPrice()
            if (ethData) {
                nativePrice.value = ethData.priceUsd
                nativeChange24h.value = ethData.percentChange24h
            }

            // Fetch WCH price
            const wchData = await priceService.fetchWchPrice()
            wchPrice.value = wchData.priceUsd
            wchChange24h.value = wchData.percentChange24h

            lastUpdated.value = new Date()
        } catch (error) {
            console.error('Failed to update prices:', error)
        } finally {
            isLoading.value = false
        }
    }

    function init() {
        fetchPrices()
        // Auto-refresh every 5 minutes
        setInterval(fetchPrices, 5 * 60 * 1000)
    }

    return {
        // State
        wchPrice,
        wchChange24h,
        nativePrice,
        nativeChange24h,
        isLoading,
        lastUpdated,

        // Computed
        formattedWchPrice,
        formattedNativePrice,

        // Actions
        fetchPrices,
        init
    }
})
