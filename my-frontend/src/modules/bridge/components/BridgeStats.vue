<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePriceStore } from '@/stores/priceStore'
import { storeToRefs } from 'pinia'

const priceStore = usePriceStore()
const { wchPrice } = storeToRefs(priceStore)

const totalVolumeToken = ref(0)
const successfulBridges = ref(0)
const loading = ref(true)

const totalVolumeUSD = computed(() => {
    return totalVolumeToken.value * wchPrice.value
})

const formatCompact = (num: number, isCurrency = false) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
        style: isCurrency ? 'currency' : 'decimal',
        currency: 'USD'
    }).format(num)
}

const fetchStats = async () => {
    try {
        const baseUrl = import.meta.env.VITE_API_URL || ''
        const response = await fetch(`${baseUrl}/api/stats/bridge`)
        const data = await response.json()

        if (data.success) {
            totalVolumeToken.value = data.data.volume
            successfulBridges.value = data.data.count
        }
    } catch (error) {
        console.error('Failed to fetch bridge stats:', error)
        // Fallback or leave as 0
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchStats()
})
</script>

<template>
    <div
        class="px-4 md:px-6 lg:px-8 py-4 md:py-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
            <div>
                <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Token Bridge</h2>
                <p class="text-sm md:text-base text-gray-600 dark:text-gray-400">Secure cross-chain transfers</p>
            </div>
            <div class="flex items-center space-x-4 md:space-x-6">
                <!-- Total Volume -->
                <div class="text-left md:text-right">
                    <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Volume</div>
                    <div v-if="loading" class="h-7 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div v-else class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                        {{ formatCompact(totalVolumeUSD, true) }}+
                    </div>
                </div>
                <!-- Successful Bridges -->
                <div class="text-left md:text-right">
                    <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400">Successful Bridges</div>
                    <div v-if="loading" class="h-7 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div v-else class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                        {{ formatCompact(successfulBridges) }}+
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
