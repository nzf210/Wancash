<template>
    <div @click="$emit('view-detail', product)"
        class="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 transition-all duration-300 overflow-hidden cursor-pointer"
        :class="[
            quantity > 0
                ? 'border-blue-500 shadow-xl scale-[1.02]'
                : 'border-transparent hover:border-blue-300 shadow-md hover:shadow-lg'
        ]">
        <!-- content -->
        <div class="flex flex-col items-center text-center space-y-4">
            <!-- Image Carousel or Placeholder -->
            <div class="relative w-full pb-[100%] flex-shrink-0" @mouseenter="stopSlide" @mouseleave="startSlide">
                <!-- Image Display -->
                <div v-if="displayImages.length > 0"
                    class="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-inner bg-white flex items-center justify-center p-2">
                    <img :src="displayImages[currentImageIndex]" :alt="product.name"
                        class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>

                <!-- Fallback Gradient Placeholder -->
                <div v-else
                    class="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <span class="text-2xl font-bold text-white shadow-sm">{{ product.weight_grams }}g</span>
                </div>


                <!-- Quantity Badge -->
                <div v-if="quantity > 0"
                    class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-md z-10 animate-in zoom-in spin-in-12 duration-300">
                    {{ quantity }}
                </div>

                <!-- Carousel Controls -->
                <div v-if="displayImages.length > 1"
                    class="absolute inset-x-0 bottom-2 flex justify-center gap-1 z-10 transition-opacity duration-200">
                    <button @click.stop="prevImage"
                        class="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button @click.stop="nextImage"
                        class="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <!-- Dots Indicator -->
                <div v-if="displayImages.length > 1"
                    class="absolute -bottom-4 left-0 right-0 flex justify-center gap-1">
                    <span v-for="(_, idx) in displayImages" :key="idx"
                        class="w-1.5 h-1.5 rounded-full transition-colors"
                        :class="idx === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"></span>
                </div>
            </div>

            <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ product.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ product.purity }} Purity</p>
            </div>

            <div class="w-full pt-4 border-t border-gray-100 dark:border-gray-700">
                <div class="flex justify-between items-center text-sm mb-2">
                    <span class="text-gray-600 dark:text-gray-400">Price</span>
                    <span class="font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(product.price_wch) }}
                        WCH</span>
                </div>

                <!-- Available Stock Info -->
                <div class="mb-3 p-2 bg-gray-100 dark:bg-gray-600 rounded-lg space-y-1">
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-gray-600 dark:text-gray-300">Available</span>
                        <span 
                            class="font-semibold"
                            :class="{
                                'text-green-600 dark:text-green-400': (product.stock - (product.reserved_stock || 0)) > 5,
                                'text-yellow-600 dark:text-yellow-400': (product.stock - (product.reserved_stock || 0)) > 0 && (product.stock - (product.reserved_stock || 0)) <= 5,
                                'text-red-600 dark:text-red-400': (product.stock - (product.reserved_stock || 0)) === 0
                            }"
                        >
                            {{ product.stock - (product.reserved_stock || 0) }} units
                        </span>
                    </div>
                    <div 
                        v-if="product.reserved_stock && product.reserved_stock > 0"
                        class="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400"
                    >
                        <span>Reserved by others</span>
                        <span>{{ product.reserved_stock }} units</span>
                    </div>
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
                        :disabled="(product.stock - (product.reserved_stock || 0)) <= quantity"
                        :title="(product.stock - (product.reserved_stock || 0)) <= quantity ? 'Maximum available stock reached' : 'Add to cart'">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Product as GoldProduct } from '@/app/services/redemptionService'

const props = defineProps<{
    product: GoldProduct
    quantity: number
}>()

defineEmits<{
    'increase': [product: GoldProduct]
    'decrease': [product: GoldProduct]
    'view-detail': [product: GoldProduct]
}>()

const currentImageIndex = ref(0)
const displayImages = computed(() => {
    // Merge images array and legacy image_url, removing duplicates and empty strings
    const images = props.product.images || []
    const legacyUrl = props.product.image_url

    // Start with array from `images`
    const combined = [...images]

    // Add legacy URL if not present
    if (legacyUrl && !combined.includes(legacyUrl)) {
        combined.unshift(legacyUrl)
    }

    return combined.filter(url => url && url.trim().length > 0)
})

const nextImage = () => {
    if (displayImages.value.length > 0) {
        currentImageIndex.value = (currentImageIndex.value + 1) % displayImages.value.length
    }
}

const prevImage = () => {
    if (displayImages.value.length > 0) {
        currentImageIndex.value = (currentImageIndex.value - 1 + displayImages.value.length) % displayImages.value.length
    }
}

// Auto-slide functionality
const autoSlideInterval = ref<any>(null)

const startSlide = () => {
    // Stop any existing interval first
    stopSlide()

    // Only auto-slide if there are multiple images
    if (displayImages.value.length > 1) {
        autoSlideInterval.value = setInterval(() => {
            nextImage()
        }, 3000) // Change slide every 3 seconds
    }
}

const stopSlide = () => {
    if (autoSlideInterval.value) {
        clearInterval(autoSlideInterval.value)
        autoSlideInterval.value = null
    }
}

onMounted(() => {
    startSlide()
})

onUnmounted(() => {
    stopSlide()
})

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}
</script>
