<template>
    <div>
        <!-- Add Product Button -->
        <div class="mb-6 flex justify-end">
            <button @click="openAddModal"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Product
            </button>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="product in products" :key="product.id"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img v-if="getProductImage(product)" :src="getProductImage(product)" :alt="product.name"
                        class="w-full h-full object-cover" />
                    <div v-else
                        class="w-full h-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 flex items-center justify-center">
                        <div class="text-center">
                            <p class="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{{ product.weight_grams
                            }}g</p>
                            <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{{ product.purity }}</p>
                        </div>
                    </div>
                    <!-- Image Count Badge if multiple -->
                    <div v-if="getProductImageCount(product) > 1"
                        class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        {{ getProductImageCount(product) }} images
                    </div>
                </div>

                <div class="p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ product.name }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ product.description }}</p>

                    <div class="space-y-2 mb-4">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 dark:text-gray-400">Price:</span>
                            <span class="font-semibold text-gray-900 dark:text-white">{{
                                formatNumber(product.price_wch) }} WCH</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 dark:text-gray-400">Stock:</span>
                            <span class="font-semibold" :class="product.stock > 10 ? 'text-green-600' : 'text-red-600'">
                                {{ product.stock }} units
                            </span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 dark:text-gray-400">Status:</span>
                            <span :class="product.is_active ? 'text-green-600' : 'text-gray-400'">
                                {{ product.is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button @click="editProduct(product)"
                            class="flex-1 px-4 py-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-sm font-medium">
                            Edit
                        </button>
                        <button @click="toggleActive(product)"
                            class="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                            {{ product.is_active ? 'Deactivate' : 'Activate' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="products.length === 0" class="text-center py-16">
            <div class="text-gray-400 dark:text-gray-600 mb-4">
                <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            </div>
            <p class="text-gray-600 dark:text-gray-400">No products found</p>
            <button @click="openAddModal" class="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                Add your first product
            </button>
        </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ editingProduct ? 'Edit Product' : 'Add Product' }}
                </h2>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="saveProduct" class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product
                            Name</label>
                        <input v-model="form.name" required type="text"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight
                            (grams)</label>
                        <input v-model.number="form.weight_grams" required type="number" step="0.1"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea v-model="form.description" rows="3"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Purity</label>
                        <input v-model="form.purity" required type="text" placeholder="99.9%"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price
                            (WCH)</label>
                        <input v-model.number="form.price_wch" required type="number" step="0.01"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stock</label>
                        <input v-model.number="form.stock" required type="number"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                        <select v-model="form.is_active"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option :value="true">Active</option>
                            <option :value="false">Inactive</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product
                        Images</label>
                    <div class="space-y-2">
                        <div v-for="(img, index) in form.images" :key="index" class="flex gap-2">
                            <input v-model="form.images[index]" type="text" placeholder="https://..."
                                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                            <button type="button" @click="removeImage(index)"
                                class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                :disabled="form.images.length === 1 && index === 0" title="Remove Image">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <button type="button" @click="addImage"
                            class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            Add Another Image
                        </button>
                    </div>
                </div>

                <div class="flex gap-3 pt-4">
                    <button type="submit"
                        class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        {{ editingProduct ? 'Update Product' : 'Create Product' }}
                    </button>
                    <button type="button" @click="closeModal"
                        class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'
import { adminApi } from '../services/adminApi'

interface Product {
    id: string
    name: string
    weight_grams: number
    purity: string
    price_wch: number
    image_url: string
    images?: string[]
    stock: number
    is_active: boolean
    description: string
}

const products = ref<Product[]>([])
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)

const form = ref({
    name: '',
    weight_grams: 0,
    purity: '',
    price_wch: 0,
    image_url: '',
    images: [] as string[],
    stock: 0,
    is_active: true,
    description: ''
})

const fetchProducts = async () => {
    try {
        products.value = await adminApi.getProducts()
    } catch (error) {
        console.error('Failed to fetch products:', error)
        toast.error('Failed to load products')
    }
}

const openAddModal = () => {
    editingProduct.value = null
    form.value = {
        name: '',
        weight_grams: 0,
        purity: '99.9%',
        price_wch: 0,
        image_url: '',
        images: [''], // Start with one empty field
        stock: 0,
        is_active: true,
        description: ''
    }
    showModal.value = true
}

const editProduct = (product: Product) => {
    editingProduct.value = product
    // Ensure images array is populated, fallback to image_url if empty
    const initialImages = (product.images && product.images.length > 0)
        ? [...product.images]
        : (product.image_url ? [product.image_url] : [''])

    form.value = {
        ...product,
        image_url: product.image_url || '',
        images: initialImages
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editingProduct.value = null
}

const addImage = () => {
    form.value.images.push('')
}

const removeImage = (index: number) => {
    form.value.images.splice(index, 1)
}

const saveProduct = async () => {
    try {
        // Sync primary image_url with first image in array
        const validImages = form.value.images.filter(img => img.trim() !== '')
        form.value.images = validImages
        form.value.image_url = validImages.length > 0 ? validImages[0] : ''

        if (editingProduct.value) {
            await adminApi.updateProduct(editingProduct.value.id, form.value)
            toast.success('Product updated successfully')
        } else {
            await adminApi.createProduct(form.value)
            toast.success('Product created successfully')
        }
        closeModal()
        fetchProducts()
    } catch (error) {
        console.error('Failed to save product:', error)
        toast.error('Failed to save product')
    }
}

const toggleActive = async (product: Product) => {
    try {
        await adminApi.updateProduct(product.id, { is_active: !product.is_active })
        toast.success(`Product ${product.is_active ? 'deactivated' : 'activated'}`)
        fetchProducts()
    } catch (error) {
        console.error('Failed to update product:', error)
        toast.error('Failed to update product status')
    }
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}

// Image Cycling Logic
const slideTick = ref(0)
let slideInterval: number | null = null

const getProductImage = (product: Product): string | undefined => {
    const images = (product.images || []).filter(img => img && img.trim() !== '')
    const legacy = product.image_url

    const allImages = [...images]
    if (legacy && !allImages.includes(legacy)) {
        allImages.unshift(legacy)
    }

    if (allImages.length === 0) return undefined

    // Cycle based on global tick
    return allImages[slideTick.value % allImages.length]
}

const getProductImageCount = (product: Product) => {
    const images = (product.images || []).filter(img => img && img.trim() !== '')
    const legacy = product.image_url
    let count = images.length
    if (legacy && !images.includes(legacy)) count++
    return count
}

onMounted(() => {
    fetchProducts()
    // Global auto-slide ticker
    slideInterval = window.setInterval(() => {
        slideTick.value++
    }, 3000)
})

onUnmounted(() => {
    if (slideInterval) clearInterval(slideInterval)
})
</script>
