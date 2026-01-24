<template>
    <div>
        <!-- Header with Filters -->
        <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <!-- Category/Type Filter -->
            <div class="flex gap-3">
                <select v-model="filterType"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="all">All Types</option>
                    <option value="physical">Physical Products</option>
                    <option value="digital">Digital Products</option>
                </select>
                <select v-model="filterStatus"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                </select>
            </div>

            <!-- Add Product Button -->
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
            <div v-for="product in filteredProducts" :key="product.id"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                <div class="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img v-if="getProductImage(product)" :src="getProductImage(product)" :alt="product.name"
                        class="w-full h-full object-cover" />
                    <div v-else
                        class="w-full h-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 flex items-center justify-center">
                        <div class="text-center">
                            <p class="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                                {{ product.weight_grams ? product.weight_grams + 'g' : product.name.charAt(0) }}
                            </p>
                            <p v-if="product.purity" class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                {{ product.purity }}
                            </p>
                        </div>
                    </div>

                    <!-- Product Type Badge -->
                    <div class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium" :class="product.product_type === 'digital'
                        ? 'bg-purple-500 text-white'
                        : 'bg-blue-500 text-white'">
                        {{ product.product_type === 'digital' ? '💾 Digital' : '📦 Physical' }}
                    </div>

                    <!-- Status Badges -->
                    <div class="absolute top-2 right-2 flex flex-col gap-1">
                        <span v-if="product.is_featured"
                            class="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">⭐
                            Featured</span>
                        <span v-if="product.is_new"
                            class="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">🆕 New</span>
                        <span v-if="product.is_on_sale"
                            class="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">🔥 Sale</span>
                    </div>

                    <!-- Image Count Badge -->
                    <div v-if="getProductImageCount(product) > 1"
                        class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        {{ getProductImageCount(product) }} images
                    </div>
                </div>

                <div class="p-4 flex flex-col flex-1">
                    <div class="flex-1">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="font-semibold text-gray-900 dark:text-white flex-1">{{ product.name }}</h3>
                            <span v-if="product.category_name" class="text-xs text-gray-500 ml-2">{{
                                product.category_icon
                                }}</span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {{ product.short_description || product.description }}
                        </p>

                        <div class="space-y-2 mb-4">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Price:</span>
                                <span class="font-semibold text-gray-900 dark:text-white">
                                    {{ formatNumber(product.price_wch) }} WCH
                                </span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Stock:</span>
                                <span class="font-semibold"
                                    :class="product.stock > 10 ? 'text-green-600' : 'text-red-600'">
                                    {{ product.stock }} units
                                </span>
                            </div>
                            <div v-if="product.sku" class="flex justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">SKU:</span>
                                <span class="text-xs text-gray-500 font-mono">{{ product.sku }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Status:</span>
                                <span :class="product.is_active ? 'text-green-600' : 'text-gray-400'">
                                    {{ product.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button @click.stop="editProduct(product)"
                            class="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-sm font-medium">
                            Edit
                        </button>
                        <button @click.stop="toggleActive(product)"
                            class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                            {{ product.is_active ? 'Deactivate' : 'Activate' }}
                        </button>
                        <button @click.stop="confirmDelete(product)"
                            class="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            title="Delete Product">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="text-center py-16">
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

    <!-- Delete Confirmation Dialog -->
    <div v-if="deleteDialog.show"
        class="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full shadow-2xl">
            <!-- Header -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Product</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="p-6">
                <div v-if="deleteDialog.product"
                    class="mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                            <img v-if="deleteDialog.product.image_url" :src="deleteDialog.product.image_url"
                                :alt="deleteDialog.product.name" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-semibold text-gray-900 dark:text-white truncate">{{
                                deleteDialog.product.name }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ formatNumber(deleteDialog.product.price_wch) }} WCH •
                                {{ deleteDialog.product.stock }} in stock
                            </p>
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <p class="text-gray-700 dark:text-gray-300">
                        Are you sure you want to permanently delete this product?
                    </p>

                    <div
                        class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <div class="flex gap-2">
                            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Warning:</p>
                                <ul class="text-xs text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                                    <li>• Product will be removed from database</li>
                                    <li>• This action cannot be reversed</li>
                                    <li>• May affect existing orders referencing this product</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button @click="cancelDelete" :disabled="deleteDialog.isDeleting"
                    class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50">
                    Cancel
                </button>
                <button @click="deleteProduct" :disabled="deleteDialog.isDeleting"
                    class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                    <svg v-if="deleteDialog.isDeleting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {{ deleteDialog.isDeleting ? 'Deleting...' : 'Delete Product' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showModal"
        class="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        @click.self="closeModal">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div
                class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
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

            <form @submit.prevent="saveProduct" class="p-6 space-y-6">
                <!-- Product Type Selection -->
                <div class="p-4 rounded-lg"
                    :class="editingProduct ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'">
                    <div class="flex items-center justify-between mb-3">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Type</label>
                        <span v-if="editingProduct"
                            class="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
                            🔒 Cannot be changed
                        </span>
                    </div>

                    <!-- Warning message when editing -->
                    <div v-if="editingProduct"
                        class="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div class="flex gap-2">
                            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Product type cannot
                                    be
                                    changed after creation</p>
                                <p class="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                    Changing product type could cause data inconsistency. Create a new product instead.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <label class="relative flex items-center p-4 border-2 rounded-lg transition-all" :class="[
                            form.product_type === 'physical'
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                                : 'border-gray-300 dark:border-gray-600',
                            editingProduct ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        ]">
                            <input type="radio" v-model="form.product_type" value="physical"
                                :disabled="!!editingProduct" class="sr-only" />
                            <div class="flex-1">
                                <div class="text-2xl mb-2">📦</div>
                                <div class="font-semibold text-gray-900 dark:text-white">Physical Product</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Tangible items (gold,
                                    merchandise, etc.)</div>
                            </div>
                            <div v-if="editingProduct && form.product_type === 'physical'"
                                class="absolute top-2 right-2">
                                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                        </label>
                        <label class="relative flex items-center p-4 border-2 rounded-lg transition-all" :class="[
                            form.product_type === 'digital'
                                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                                : 'border-gray-300 dark:border-gray-600',
                            editingProduct ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        ]">
                            <input type="radio" v-model="form.product_type" value="digital" :disabled="!!editingProduct"
                                class="sr-only" />
                            <div class="flex-1">
                                <div class="text-2xl mb-2">💾</div>
                                <div class="font-semibold text-gray-900 dark:text-white">Digital Product</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Digital goods, vouchers,
                                    codes</div>
                            </div>
                            <div v-if="editingProduct && form.product_type === 'digital'"
                                class="absolute top-2 right-2">
                                <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Basic Information -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Product Name <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.name" required type="text" placeholder="e.g., Gold 1g Bar"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category
                            </label>
                            <select v-model="form.category_id"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                <option value="">Select Category</option>
                                <option v-for="category in availableCategories" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>

                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SKU</label>
                            <input v-model="form.sku" type="text" placeholder="Auto-generated if empty"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Short Description
                        </label>
                        <input v-model="form.short_description" type="text" maxlength="255"
                            placeholder="Brief product description (shown in cards)"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Long Description
                        </label>
                        <textarea v-model="form.long_description" rows="4"
                            placeholder="Detailed product description (shown in detail view)"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                    </div>
                </div>

                <!-- Physical Product Fields -->
                <div v-if="form.product_type === 'physical'" class="space-y-4 border-t pt-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Physical Product Details</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Weight (grams)
                            </label>
                            <input v-model.number="form.weight_grams" type="number" step="0.1" placeholder="0.0"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Purity
                            </label>
                            <input v-model="form.purity" type="text" placeholder="99.9%"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Brand
                            </label>
                            <input v-model="form.brand" type="text" placeholder="e.g., Antam, UBS"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Dimensions
                            </label>
                            <input v-model="form.dimensions" type="text" placeholder="e.g., 10x15x2mm"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                </div>

                <!-- Digital Product Fields -->
                <div v-if="form.product_type === 'digital'" class="space-y-4 border-t pt-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Digital Product Details</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Delivery Type <span class="text-red-500">*</span>
                            </label>
                            <select v-model="form.delivery_type"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                <option value="">Select delivery type</option>
                                <option value="instant">Instant (Auto-delivered)</option>
                                <option value="email">Email</option>
                                <option value="manual">Manual Processing</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                License Type
                            </label>
                            <input v-model="form.license_type" type="text" placeholder="e.g., Single User, Multi-User"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>

                    <div>
                        <label class="flex items-center gap-2">
                            <input type="checkbox" v-model="form.auto_fulfill"
                                class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="text-sm text-gray-700 dark:text-gray-300">Enable Auto-Fulfillment</span>
                        </label>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                            Automatically deliver digital product after payment confirmation
                        </p>
                    </div>
                </div>

                <!-- Pricing & Stock -->
                <div class="space-y-4 border-t pt-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Inventory</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Price (WCH) <span class="text-red-500">*</span>
                            </label>
                            <input v-model.number="form.price_wch" required type="number" step="0.01"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Compare At Price (WCH)
                            </label>
                            <input v-model.number="form.compare_at_price" type="number" step="0.01"
                                placeholder="Original price (for sale items)"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Stock <span class="text-red-500">*</span>
                            </label>
                            <input v-model.number="form.stock" required type="number"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Low Stock Threshold
                            </label>
                            <input v-model.number="form.low_stock_threshold" type="number"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <label class="flex items-center gap-2">
                            <input type="checkbox" v-model="form.track_inventory"
                                class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="text-sm text-gray-700 dark:text-gray-300">Track Inventory</span>
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="checkbox" v-model="form.allow_backorder"
                                class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="text-sm text-gray-700 dark:text-gray-300">Allow Backorder</span>
                        </label>
                    </div>
                </div>

                <!-- Product Images -->
                <div class="space-y-4 border-t pt-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Product Images</h3>
                    <div class="space-y-2">
                        <div v-for="(img, index) in form.images" :key="index" class="flex gap-2">
                            <input v-model="form.images[index]" type="url" placeholder="https://..."
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

                <!-- Status & Visibility -->
                <div class="space-y-4 border-t pt-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Status & Visibility</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <select v-model="form.is_active"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                <option :value="true">Active</option>
                                <option :value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4">
                        <label class="flex items-center gap-2">
                            <input type="checkbox" v-model="form.is_featured"
                                class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="text-sm text-gray-700 dark:text-gray-300">⭐ Featured Product</span>
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="checkbox" v-model="form.is_new"
                                class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="text-sm text-gray-700 dark:text-gray-300">🆕 New Product</span>
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="checkbox" v-model="form.is_on_sale"
                                class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="text-sm text-gray-700 dark:text-gray-300">🔥 On Sale</span>
                        </label>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 pt-4 border-t sticky bottom-0 bg-white dark:bg-gray-800">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'
import { adminApi } from '../services/adminApi'
import type { Product } from '@/app/services/redemptionService'

const products = ref<Product[]>([])
const categories = ref<any[]>([]) // Add categories state
const showModal = ref(false)
const editingProduct = ref<Product | null>(null)
const filterType = ref<'all' | 'physical' | 'digital'>('all')
const filterStatus = ref<'all' | 'active' | 'inactive'>('all')

const form = ref({
    name: '',
    category_id: '', // Add category_id
    product_type: 'physical' as 'physical' | 'digital',
    weight_grams: null as number | null,
    purity: '',
    brand: '',
    dimensions: '',
    delivery_type: '',
    license_type: '',
    auto_fulfill: false,
    price_wch: 0,
    compare_at_price: null as number | null,
    image_url: '',
    images: [] as string[],
    stock: 0,
    low_stock_threshold: 5,
    track_inventory: true,
    allow_backorder: false,
    is_active: true,
    is_featured: false,
    is_new: false,
    is_on_sale: false,
    short_description: '',
    long_description: '',
    sku: ''
})

// Delete Confirmation Dialog
const deleteDialog = ref({
    show: false,
    product: null as Product | null,
    isDeleting: false
})

const filteredProducts = computed(() => {
    let filtered = products.value

    // Filter by type
    if (filterType.value !== 'all') {
        filtered = filtered.filter(p => p.product_type === filterType.value)
    }

    // Filter by status
    if (filterStatus.value === 'active') {
        filtered = filtered.filter(p => p.is_active)
    } else if (filterStatus.value === 'inactive') {
        filtered = filtered.filter(p => !p.is_active)
    }

    return filtered
})

const fetchProducts = async () => {
    try {
        products.value = await adminApi.getProducts()
    } catch (error) {
        console.error('Failed to fetch products:', error)
        toast.error('Failed to load products')
    }
}

const fetchCategories = async () => {
    try {
        categories.value = await adminApi.getCategories()
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

// Filter categories based on selected product type
const availableCategories = computed(() => {
    return categories.value.filter(cat => {
        // If categories don't have type field yet (e.g. before refresh), show all
        if (!cat.type) return true
        return cat.type === form.value.product_type
    })
})

// Watch product type change to reset category
import { watch } from 'vue'
watch(() => form.value.product_type, (newType) => {
    // Only reset if current category is not compatible
    const currentCat = categories.value.find(c => c.id === form.value.category_id)
    if (currentCat && currentCat.type && currentCat.type !== newType) {
        form.value.category_id = ''
    }
})

onMounted(() => {
    fetchProducts()
    fetchCategories()
    // startSlideInterval() // Removed: Function not defined
})

const openAddModal = () => {
    editingProduct.value = null
    form.value = {
        name: '',
        category_id: '',
        product_type: 'physical',
        weight_grams: null,
        purity: '',
        brand: '',
        dimensions: '',
        delivery_type: '',
        license_type: '',
        auto_fulfill: false,
        price_wch: 0,
        compare_at_price: null,
        image_url: '',
        images: [],
        stock: 0,
        low_stock_threshold: 5,
        track_inventory: true,
        allow_backorder: false,
        is_active: true,
        is_featured: false,
        is_new: false,
        is_on_sale: false,
        short_description: '',
        long_description: '',
        sku: ''
    }
    showModal.value = true
}

const editProduct = (product: Product) => {
    editingProduct.value = product
    const initialImages = (product.images && product.images.length > 0)
        ? [...product.images]
        : (product.image_url ? [product.image_url] : [''])

    form.value = {
        name: product.name,
        category_id: product.category_id || '',
        product_type: product.product_type || 'physical',
        weight_grams: product.weight_grams || null,
        purity: product.purity || '',
        brand: product.brand || '',
        dimensions: product.dimensions || '',
        delivery_type: product.delivery_type || '',
        license_type: product.license_type || '',
        auto_fulfill: product.auto_fulfill || false,
        price_wch: product.price_wch,
        compare_at_price: product.compare_at_price || null,
        image_url: product.image_url || '',
        images: initialImages,
        stock: product.stock,
        low_stock_threshold: product.low_stock_threshold || 5,
        track_inventory: product.track_inventory !== false,
        allow_backorder: product.allow_backorder || false,
        is_active: product.is_active,
        is_featured: product.is_featured || false,
        is_new: product.is_new || false,
        is_on_sale: product.is_on_sale || false,
        short_description: product.short_description || '',
        long_description: product.long_description || '',
        sku: product.sku || ''
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

        // Prepare payload - only include non-null/undefined values
        const payload: any = {}

        // Always include these fields
        payload.name = form.value.name
        payload.price_wch = form.value.price_wch
        payload.stock = form.value.stock
        payload.is_active = form.value.is_active
        payload.product_type = form.value.product_type
        payload.image_url = form.value.image_url
        payload.images = form.value.images

        if (form.value.category_id) {
            payload.category_id = form.value.category_id
        }

        // Optional basic fields
        if (form.value.short_description) payload.short_description = form.value.short_description
        if (form.value.long_description) payload.long_description = form.value.long_description
        if (form.value.sku) payload.sku = form.value.sku
        if (form.value.compare_at_price) payload.compare_at_price = form.value.compare_at_price
        if (form.value.low_stock_threshold !== undefined) payload.low_stock_threshold = form.value.low_stock_threshold

        // Inventory settings
        payload.track_inventory = form.value.track_inventory
        payload.allow_backorder = form.value.allow_backorder

        // Status badges
        payload.is_featured = form.value.is_featured
        payload.is_new = form.value.is_new
        payload.is_on_sale = form.value.is_on_sale

        // Physical product fields
        if (form.value.product_type === 'physical') {
            if (form.value.weight_grams) payload.weight_grams = form.value.weight_grams
            if (form.value.purity) payload.purity = form.value.purity
            if (form.value.brand) payload.brand = form.value.brand
            if (form.value.dimensions) payload.dimensions = form.value.dimensions
        }

        // Digital product fields
        if (form.value.product_type === 'digital') {
            if (form.value.delivery_type) payload.delivery_type = form.value.delivery_type
            if (form.value.license_type) payload.license_type = form.value.license_type
            payload.auto_fulfill = form.value.auto_fulfill
        }

        console.log('💾 Saving product:', editingProduct.value ? 'UPDATE' : 'CREATE')
        console.log('📦 Payload:', payload)

        if (editingProduct.value) {
            console.log('🔄 Updating product ID:', editingProduct.value.id)
            await adminApi.updateProduct(editingProduct.value.id, payload)
            toast.success('Product updated successfully')
        } else {
            console.log('✨ Creating new product')
            await adminApi.createProduct(payload)
            toast.success('Product created successfully')
        }
        closeModal()
        fetchProducts()
    } catch (error: any) {
        console.error('❌ Failed to save product:', error)
        console.error('Error details:', error.message)

        // Show more specific error message
        const errorMessage = error.message || 'Failed to save product'
        toast.error(errorMessage, {
            duration: 5000,
            description: editingProduct.value
                ? 'Make sure all required fields are filled correctly'
                : 'Check the form data and try again'
        })
    }
}

const toggleActive = async (product: Product) => {
    try {
        const newStatus = !product.is_active
        console.log(`🔄 Toggling product ${product.id} from ${product.is_active} to ${newStatus}`)
        console.log('📦 Product data:', product)

        // Send minimal required fields along with is_active
        // NOTE: Only send fields that exist in current database schema
        const updateData: any = {
            name: product.name,
            price_wch: product.price_wch,
            stock: product.stock,
            is_active: newStatus,
            description: product.description || ''
        }

        // Add legacy fields if they exist
        if (product.weight_grams) updateData.weight_grams = product.weight_grams
        if (product.purity) updateData.purity = product.purity
        if (product.image_url) updateData.image_url = product.image_url
        if (product.images) updateData.images = product.images

        console.log('📤 Sending update data:', updateData)
        await adminApi.updateProduct(product.id, updateData)

        // Show correct message based on NEW status
        toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`)

        fetchProducts()
    } catch (error: any) {
        console.error('❌ Failed to toggle product status:', error)
        const errorMessage = error.message || 'Failed to update product status'
        toast.error(errorMessage, {
            duration: 5000,
            description: 'Please try again or check console for details'
        })
    }
}

const confirmDelete = (product: Product) => {
    deleteDialog.value = {
        show: true,
        product: product,
        isDeleting: false
    }
}

const deleteProduct = async () => {
    if (!deleteDialog.value.product) return

    try {
        deleteDialog.value.isDeleting = true
        const productId = deleteDialog.value.product.id
        const productName = deleteDialog.value.product.name

        console.log('🗑️ Deleting product:', productId, productName)

        await adminApi.deleteProduct(productId)

        toast.success(`Product "${productName}" deleted successfully`, {
            description: 'The product has been permanently removed'
        })

        // Close dialog and refresh
        deleteDialog.value = { show: false, product: null, isDeleting: false }
        fetchProducts()
    } catch (error: any) {
        console.error('❌ Failed to delete product:', error)
        const errorMessage = error.message || 'Failed to delete product'
        toast.error(errorMessage, {
            duration: 5000,
            description: 'The product might be referenced in existing orders'
        })
        deleteDialog.value.isDeleting = false
    }
}

const cancelDelete = () => {
    deleteDialog.value = { show: false, product: null, isDeleting: false }
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
