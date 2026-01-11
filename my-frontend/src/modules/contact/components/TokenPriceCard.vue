<template>
    <Card class="border-2 border-purple-200 dark:border-blue-light">
        <CardHeader>
            <CardTitle class="text-xl font-bold text-gray-800 dark:text-white">Token Price</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-blue-800/30">
                <div class="flex items-center space-x-3">
                    <div
                        class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        WCH
                    </div>
                    <div>
                        <div class="font-semibold text-gray-800 dark:text-white">Wancash</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">WCH/USD</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg text-gray-800 dark:text-white">
                        {{ formattedWchPrice }}
                    </div>
                    <div :class="wchChange24h >= 0 ? 'text-green-500' : 'text-red-500'" class="text-xs font-medium">
                        {{ wchChange24h >= 0 ? '+' : '' }}{{ wchChange24h }}%
                    </div>
                </div>
            </div>

            <div v-if="nativePrice > 0"
                class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-blue-800/30">
                <div class="flex items-center space-x-3">
                    <div
                        class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                        ETH
                    </div>
                    <div>
                        <div class="font-semibold text-gray-800 dark:text-white">Ethereum</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">ETH/USD</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg text-gray-800 dark:text-white">
                        {{ formattedNativePrice }}
                    </div>
                    <div :class="nativeChange24h >= 0 ? 'text-green-500' : 'text-red-500'" class="text-xs font-medium">
                        {{ nativeChange24h >= 0 ? '+' : '' }}{{ nativeChange24h }}%
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePriceStore } from '@/stores/priceStore'
import { storeToRefs } from 'pinia'

const priceStore = usePriceStore()
const { formattedWchPrice, wchChange24h, formattedNativePrice, nativePrice, nativeChange24h } = storeToRefs(priceStore)

onMounted(() => {
    priceStore.fetchPrices()
})
</script>
