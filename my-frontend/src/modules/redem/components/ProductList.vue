<template>
    <div class="flex gap-6">
        <!-- Category Filter Sidebar -->
        <aside v-if="categories.length > 0" class="hidden lg:block w-64 flex-shrink-0">
            <div class="sticky top-4">
                <CategoryFilter :categories="categories" :total-products="allProducts.length" v-model="selectedCategory"
                    @select="handleCategoryChange" />
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 space-y-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ activeCategory?.name || 'All Products' }}
                    <span class="text-gray-500 text-base font-normal">({{ filteredProducts.length }})</span>
                </h2>

                <!-- Mobile Category Dropdown -->
                <select v-if="categories.length > 0" v-model="selectedCategory"
                    class="lg:hidden px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option :value="null">🛍️ All Products ({{ allProducts.length }})</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.icon }} {{ cat.name }} ({{ cat.product_count }})
                    </option>
                </select>

                <!-- Sort Dropdown -->
                <select v-model="sortBy"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option value="default">Sort: Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="name">Name A-Z</option>
                </select>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center py-12">
                <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-8 text-red-500">
                {{ error }}
                <button @click="fetchData" class="block mx-auto mt-2 text-blue-500 underline">Try Again</button>
            </div>

            <!-- Products Grid -->
            <div v-else-if="sortedProducts.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <ProductCard v-for="product in sortedProducts" :key="product.id" :product="product"
                    :quantity="cart[product.id] || 0" @increase="$emit('increase', product.id)"
                    @decrease="$emit('decrease', product.id)" @view-detail="openProductDetail" />
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20">
                <div class="text-6xl mb-4">📭</div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No products found
                </h3>
                <p class="text-gray-500 mb-4">
                    {{ selectedCategory ? 'No products in this category' : 'No products available' }}
                </p>
                <button v-if="selectedCategory" @click="selectedCategory = null"
                    class="text-blue-600 hover:text-blue-700 font-medium">
                    View All Products
                </button>
            </div>
        </div>

        <!-- Product Detail Dialog (outside conditional rendering) -->
        <ProductDetailDialog v-if="selectedProduct" :open="showProductDetail" :product="selectedProduct"
            :quantity="cart[selectedProduct.id] || 0" @update:open="showProductDetail = $event"
            @update-quantity="handleUpdateQuantity" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { redemptionService, type Product, type ProductCategory } from '@/app/services/redemptionService'
import ProductCard from './ProductCard.vue'
import CategoryFilter from './CategoryFilter.vue'
import ProductDetailDialog from './ProductDetailDialog.vue'

// Cart modeled as Record<ProductId, Quantity>
const props = defineProps<{
    cart: Record<string, number>
}>()

const emit = defineEmits<{
    'increase': [id: string]
    'decrease': [id: string]
}>()

const allProducts = ref<Product[]>([])
const categories = ref<ProductCategory[]>([])
const isLoading = ref(true)
const error = ref('')
const selectedCategory = ref<string | null>(null)
const sortBy = ref('default')

// Product Detail Dialog State
const showProductDetail = ref(false)
const selectedProduct = ref<Product | null>(null)

const activeCategory = computed(() => {
    if (!selectedCategory.value) return null
    return categories.value.find(c => c.id === selectedCategory.value)
})

const filteredProducts = computed(() => {
    // First filter: Only show active products
    let products = allProducts.value.filter(p => p.is_active)

    // Second filter: Category filter (if selected)
    if (selectedCategory.value) {
        products = products.filter(p => p.category_id === selectedCategory.value)
    }

    return products
})

const sortedProducts = computed(() => {
    const products = [...filteredProducts.value]

    switch (sortBy.value) {
        case 'price-low':
            return products.sort((a, b) => a.price_wch - b.price_wch)
        case 'price-high':
            return products.sort((a, b) => b.price_wch - a.price_wch)
        case 'newest':
            return products.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
        case 'name':
            return products.sort((a, b) => a.name.localeCompare(b.name))
        default:
            return products
    }
})

const fetchData = async () => {
    isLoading.value = true
    error.value = ''
    try {
        // Fetch both products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
            redemptionService.getGoldProducts(),
            redemptionService.getCategories()
        ])

        allProducts.value = productsData
        categories.value = categoriesData

        // Debug logging
        const activeCount = productsData.filter(p => p.is_active).length
        const inactiveCount = productsData.length - activeCount
        console.log('✅ Products loaded:', productsData.length, 'total products')
        console.log('   ├─ Active products:', activeCount)
        console.log('   └─ Inactive products:', inactiveCount)
        console.log('📦 All products:', allProducts.value)
        console.log('🔢 Filtered & sorted products:', sortedProducts.value.length)
        if (sortedProducts.value.length === 0 && productsData.length > 0) {
            console.warn('⚠️ Products exist but none are showing! Check is_active status in database.')
        }
    } catch (e) {
        error.value = 'Failed to load products'
        console.error('❌ Error loading products:', e)
    } finally {
        isLoading.value = false
    }
}

const openProductDetail = (product: Product) => {
    selectedProduct.value = product
    showProductDetail.value = true
}

const handleUpdateQuantity = (productId: string, quantity: number) => {
    // Get current quantity from cart props
    const currentQty = props.cart[productId] || 0

    if (quantity > currentQty) {
        // Increase
        for (let i = currentQty; i < quantity; i++) {
            emit('increase', productId)
        }
    } else if (quantity < currentQty) {
        // Decrease
        for (let i = currentQty; i > quantity; i--) {
            emit('decrease', productId)
        }
    }
}

const handleCategoryChange = (categoryId: string | null) => {
    selectedCategory.value = categoryId
}

onMounted(() => {
    fetchData()
})

defineExpose({
    products: allProducts,
    categories
})
</script>
