<template>
    <div class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Add Prize to Cart</h2>

        <div v-if="isLoading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </div>

        <div v-else-if="error" class="text-center py-8 text-red-500">
            {{ error }}
            <button @click="fetchProducts" class="block mx-auto mt-2 text-blue-500 underline">Try Again</button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard v-for="product in products" :key="product.id" :product="product"
                :quantity="cart[product.id] || 0" @increase="$emit('increase', product.id)"
                @decrease="$emit('decrease', product.id)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { redemptionService, type GoldProduct } from '@/app/services/redemptionService'
import ProductCard from './ProductCard.vue'

// Cart modeled as Record<ProductId, Quantity>
defineProps<{
    cart: Record<string, number>
}>()

defineEmits<{
    'increase': [id: string]
    'decrease': [id: string]
}>()

const products = ref<GoldProduct[]>([])
const isLoading = ref(true)
const error = ref('')

const fetchProducts = async () => {
    isLoading.value = true
    error.value = ''
    try {
        products.value = await redemptionService.getGoldProducts()
    } catch (e) {
        error.value = 'Failed to load products'
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchProducts()
})

defineExpose({
    products
})
</script>
