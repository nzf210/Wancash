<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
                <p class="text-gray-600 dark:text-gray-400">Manage redemptions, products, and system configuration</p>
            </div>

            <!-- Tabs -->
            <Tabs v-model="activeTab" class="w-full">
                <TabsList
                    class="grid w-full grid-cols-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                    <TabsTrigger value="redemption"
                        class="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Redemption Requests
                    </TabsTrigger>
                    <TabsTrigger value="products"
                        class="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Product Management
                    </TabsTrigger>
                    <TabsTrigger value="config" class="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Configuration
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="redemption" class="mt-6">
                    <RedemptionDashboard />
                </TabsContent>

                <TabsContent value="products" class="mt-6">
                    <ProductManagement />
                </TabsContent>

                <TabsContent value="config" class="mt-6">
                    <ConfigSettings />
                </TabsContent>
            </Tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Import admin page components
import RedemptionDashboard from './RedemptionDashboard.vue'
import ProductManagement from './ProductManagement.vue'
import ConfigSettings from './ConfigSettings.vue'

const route = useRoute()
const router = useRouter()

// Initialize active tab from URL query param or default to 'redemption'
const activeTab = ref<string>((route.query.tab as string) || 'redemption')

// Watch for tab changes and update URL
watch(activeTab, (newTab) => {
    router.replace({ query: { tab: newTab } })
})

// Watch for URL changes (e.g., browser back/forward)
watch(() => route.query.tab, (newTab) => {
    if (newTab && typeof newTab === 'string') {
        activeTab.value = newTab
    }
})
</script>
