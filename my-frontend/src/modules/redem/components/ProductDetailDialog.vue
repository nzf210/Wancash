<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ product.name }}
                </DialogTitle>
                <DialogDescription class="text-gray-600 dark:text-gray-400">
                    {{ product.purity }} Purity • {{ product.weight_grams }}g
                </DialogDescription>
            </DialogHeader>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <!-- Left Column: Images -->
                <div class="space-y-4">
                    <!-- Main Image Display -->
                    <div class="relative w-full pb-[100%] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                        <img v-if="displayImages.length > 0" :src="displayImages[currentImageIndex]" :alt="product.name"
                            class="absolute inset-0 w-full h-full object-contain p-4" />
                        <div v-else
                            class="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center">
                            <span class="text-4xl font-bold text-white">{{ product.weight_grams }}g</span>
                        </div>

                        <!-- Image Navigation -->
                        <div v-if="displayImages.length > 1"
                            class="absolute inset-x-0 bottom-4 flex justify-center gap-2 z-10">
                            <button @click="prevImage"
                                class="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button @click="nextImage"
                                class="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Thumbnail Gallery -->
                    <div v-if="displayImages.length > 1" class="flex gap-2 overflow-x-auto pb-2">
                        <button v-for="(img, idx) in displayImages" :key="idx" @click="currentImageIndex = idx" :class="[
                            'flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all',
                            idx === currentImageIndex
                                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                        ]">
                            <img :src="img" :alt="`${product.name} - ${idx + 1}`" class="w-full h-full object-cover" />
                        </button>
                    </div>

                    <!-- Video Player (if available) -->
                    <div v-if="product.video_url" class="rounded-xl overflow-hidden">
                        <video :src="product.video_url" controls class="w-full" />
                    </div>
                </div>

                <!-- Right Column: Details -->
                <div class="space-y-6">
                    <!-- Price & Stock -->
                    <div class="space-y-3">
                        <div class="flex items-baseline gap-3">
                            <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {{ formatNumber(product.price_wch) }} WCH
                            </span>
                            <span v-if="product.compare_at_price && product.compare_at_price > product.price_wch"
                                class="text-lg text-gray-500 dark:text-gray-400 line-through">
                                {{ formatNumber(product.compare_at_price) }} WCH
                            </span>
                        </div>

                        <!-- Stock Status -->
                        <div class="flex items-center gap-2">
                            <div :class="[
                                'w-2 h-2 rounded-full',
                                product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            ]"></div>
                            <span class="text-sm text-gray-600 dark:text-gray-400">
                                {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                            </span>
                        </div>

                        <!-- Badges -->
                        <div class="flex flex-wrap gap-2">
                            <span v-if="product.is_featured"
                                class="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                                ⭐ Featured
                            </span>
                            <span v-if="product.is_new"
                                class="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                                🆕 New
                            </span>
                            <span v-if="product.is_on_sale"
                                class="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-medium rounded-full">
                                🔥 Sale
                            </span>
                        </div>
                    </div>

                    <!-- Short Description -->
                    <div v-if="product.short_description" class="text-gray-700 dark:text-gray-300">
                        <p>{{ product.short_description }}</p>
                    </div>

                    <!-- Quantity Selector -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                        <div class="flex items-center gap-4">
                            <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                                <button @click="decreaseQty"
                                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                                    :disabled="localQuantity === 0">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M20 12H4" />
                                    </svg>
                                </button>

                                <span class="w-12 text-center font-bold text-gray-900 dark:text-white">{{
                                    localQuantity }}</span>

                                <button @click="increaseQty"
                                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    :disabled="product.stock <= localQuantity">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                Subtotal: <span class="font-bold text-gray-900 dark:text-white">{{
                                    formatNumber(product.price_wch * localQuantity) }} WCH</span>
                            </span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3">
                        <Button @click="addToCart"
                            class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                            :disabled="product.stock === 0 || localQuantity === 0">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Add to Cart
                        </Button>
                    </div>

                    <!-- Tabs for Additional Info -->
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div class="flex gap-4 border-b border-gray-200 dark:border-gray-700">
                            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                                'pb-3 px-1 text-sm font-medium border-b-2 transition-colors',
                                activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            ]">
                                {{ tab.label }}
                            </button>
                        </div>

                        <div class="mt-4 text-sm text-gray-700 dark:text-gray-300 max-h-60 overflow-y-auto">
                            <!-- Description Tab -->
                            <div v-if="activeTab === 'description'">
                                <p v-if="product.long_description" class="whitespace-pre-line">{{
                                    product.long_description }}</p>
                                <p v-else-if="product.description" class="whitespace-pre-line">{{ product.description
                                    }}</p>
                                <p v-else class="text-gray-500 dark:text-gray-400 italic">No description available.</p>
                            </div>

                            <!-- Specifications Tab -->
                            <div v-else-if="activeTab === 'specifications'">
                                <dl v-if="product.specifications && Object.keys(product.specifications).length > 0"
                                    class="space-y-2">
                                    <div v-for="(value, key) in product.specifications" :key="key"
                                        class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                        <dt class="font-medium text-gray-900 dark:text-white capitalize">{{ key }}</dt>
                                        <dd class="text-gray-600 dark:text-gray-400">{{ value }}</dd>
                                    </div>
                                </dl>
                                <div v-else>
                                    <dl class="space-y-2">
                                        <div
                                            class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                            <dt class="font-medium text-gray-900 dark:text-white">Weight</dt>
                                            <dd class="text-gray-600 dark:text-gray-400">{{ product.weight_grams }}g
                                            </dd>
                                        </div>
                                        <div
                                            class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                            <dt class="font-medium text-gray-900 dark:text-white">Purity</dt>
                                            <dd class="text-gray-600 dark:text-gray-400">{{ product.purity }}</dd>
                                        </div>
                                        <div v-if="product.brand"
                                            class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                            <dt class="font-medium text-gray-900 dark:text-white">Brand</dt>
                                            <dd class="text-gray-600 dark:text-gray-400">{{ product.brand }}</dd>
                                        </div>
                                        <div v-if="product.sku"
                                            class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                            <dt class="font-medium text-gray-900 dark:text-white">SKU</dt>
                                            <dd class="text-gray-600 dark:text-gray-400">{{ product.sku }}</dd>
                                        </div>
                                        <div v-if="product.min_holding_required && product.min_holding_required > 0"
                                            class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 bg-purple-50 dark:bg-purple-900/10 px-3 -mx-3 rounded-lg">
                                            <dt
                                                class="font-medium text-purple-900 dark:text-purple-300 flex items-center gap-2">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                Min Holding Required
                                            </dt>
                                            <dd class="font-bold text-purple-700 dark:text-purple-400">{{
                                                formatNumber(product.min_holding_required) }} WCH</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <!-- Features Tab -->
                            <div v-else-if="activeTab === 'features'">
                                <ul v-if="product.features && product.features.length > 0" class="space-y-2 list-none">
                                    <li v-for="(feature, idx) in product.features" :key="idx"
                                        class="flex items-start gap-2">
                                        <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor"
                                            viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <span>{{ feature }}</span>
                                    </li>
                                </ul>
                                <p v-else class="text-gray-500 dark:text-gray-400 italic">No features listed.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Product } from '@/app/services/redemptionService'
import { toast } from 'vue-sonner'

const props = defineProps<{
    open: boolean
    product: Product
    quantity: number
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
    'update-quantity': [productId: string, quantity: number]
}>()

const currentImageIndex = ref(0)
const localQuantity = ref(props.quantity)
const activeTab = ref<'description' | 'specifications' | 'features'>('description')

const tabs = computed(() => {
    const allTabs = [
        { id: 'description' as const, label: 'Description' },
        { id: 'specifications' as const, label: 'Specifications' },
        { id: 'features' as const, label: 'Features' }
    ]
    return allTabs
})

const displayImages = computed(() => {
    const images = props.product.images || []
    const legacyUrl = props.product.image_url

    const combined = [...images]
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

const increaseQty = () => {
    if (localQuantity.value < props.product.stock) {
        localQuantity.value++
    }
}

const decreaseQty = () => {
    if (localQuantity.value > 0) {
        localQuantity.value--
    }
}

const addToCart = () => {
    emit('update-quantity', props.product.id, localQuantity.value)
    emit('update:open', false)
    toast.success(`Added ${localQuantity.value}x ${props.product.name} to cart`)
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}

// Reset local quantity when dialog opens
watch(() => props.open, (newVal) => {
    if (newVal) {
        localQuantity.value = props.quantity
        currentImageIndex.value = 0
        activeTab.value = 'description'
    }
})
</script>
