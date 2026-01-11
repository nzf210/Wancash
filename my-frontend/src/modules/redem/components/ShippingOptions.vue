<template>
    <div class="mb-8">
        <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div class="p-6">
                <div class="flex items-center gap-2 mb-6">
                    <div
                        class="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path
                                d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-10a1 1 0 00-1-1H3zM14 7h2v6h-2V7z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Shipping Cost</h3>
                </div>

                <div class="space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ description }}
                    </p>

                    <!-- Shipping Details -->
                    <div v-if="!hideCost"
                        class="mt-6 p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div class="space-y-4">
                            <div
                                class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <span class="text-gray-700 dark:text-gray-300">Gold Subtotal:</span>
                                <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(tokenGold) }}
                                    WCH</span>
                            </div>
                            <div
                                class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <span class="text-gray-700 dark:text-gray-300">Shipping Cost:</span>
                                <span class="font-semibold text-gray-900 dark:text-white">
                                    {{ shippingCost > 0 ? formatNumber(shippingCost) + ' WCH' : 'Calculated Later' }}
                                </span>
                            </div>
                            <div class="pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                                <div
                                    class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <span class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Total
                                        Required:</span>
                                    <span class="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {{ formatNumber(totalToken) }} WCH
                                        <span v-if="shippingCost === 0" class="text-sm text-amber-500">+ Shipping</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Label } from '@/components/ui/label'


defineProps<{
    shippingOption: string
    tokenGold: number
    shippingCost: number
    totalToken: number
    description?: string
    hideCost?: boolean
}>()

defineEmits<{
    'update:shippingOption': [value: string]
}>()

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}
</script>
