<template>
    <div class="category-filter bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Categories</h3>

        <div class="space-y-2">
            <!-- All Products -->
            <button @click="selectCategory(null)" :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all',
                selectedCategory === null
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            ]">
                <span class="text-2xl">🛍️</span>
                <span class="flex-1">All Products</span>
                <span class="text-sm bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
                    {{ totalProducts }}
                </span>
            </button>

            <!-- Category List -->
            <button v-for="category in categories" :key="category.id" @click="selectCategory(category.id)" :class="[
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all',
                selectedCategory === category.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            ]">
                <span class="text-2xl">{{ category.icon }}</span>
                <span class="flex-1">{{ category.name }}</span>
                <span v-if="category.product_count !== undefined"
                    class="text-sm bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
                    {{ category.product_count }}
                </span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ProductCategory } from '@/app/services/redemptionService'

const props = defineProps<{
    categories: ProductCategory[]
    totalProducts: number
    modelValue?: string | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string | null]
    'select': [categoryId: string | null]
}>()

const selectedCategory = ref<string | null>(props.modelValue || null)

const selectCategory = (id: string | null) => {
    selectedCategory.value = id
    emit('update:modelValue', id)
    emit('select', id)
}
</script>
