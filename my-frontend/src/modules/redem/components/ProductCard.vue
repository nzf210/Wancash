<template>
    <div class="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 transition-all duration-300 overflow-hidden"
        :class="[
            quantity > 0
                ? 'border-blue-500 shadow-xl scale-[1.02]'
                : 'border-transparent hover:border-blue-300 shadow-md hover:shadow-lg'
        ]">
        <!-- content -->
        <div class="flex flex-col items-center text-center space-y-4">
            <!-- Image placeholder / Icon -->
            <div
                class="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 relative">
                <span class="text-2xl font-bold text-white shadow-sm">{{ product.weight_grams }}g</span>

                <!-- Badge for quantity if > 0 -->
                <div v-if="quantity > 0"
                    class="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-md animate-in zoom-in spin-in-12 duration-300">
                    {{ quantity }}
                </div>
            </div>

            <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ product.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ product.purity }} Purity</p>
            </div>

            <div class="w-full pt-4 border-t border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-center text-sm mb-3">
                    <span class="text-gray-600 dark:text-gray-400">Price</span>
                    <span class="font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(product.price_wch) }}
                        WCH</span>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-1">
                    <button @click.stop="$emit('decrease', product)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-600 text-gray-600 dark:text-white shadow-sm hover:bg-gray-100 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors"
                        :disabled="quantity === 0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                    </button>

                    <span class="w-8 text-center font-bold text-gray-900 dark:text-white">{{ quantity }}</span>

                    <button @click.stop="$emit('increase', product)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        :disabled="product.stock <= quantity">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { GoldProduct } from '@/app/services/redemptionService'

defineProps<{
    product: GoldProduct
    quantity: number
}>()

defineEmits<{
    'increase': [product: GoldProduct]
    'decrease': [product: GoldProduct]
}>()

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}
</script>
