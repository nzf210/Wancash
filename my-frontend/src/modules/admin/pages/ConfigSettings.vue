<template>
    <div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Shipping Settings</h2>

            <div class="space-y-6">
                <!-- Enable Shipping Toggle -->
                <div class="flex items-start justify-between p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div class="flex-1">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Show Shipping Cost
                            Upfront</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            When enabled, users will see the shipping cost immediately. When disabled, shipping cost
                            will be "Calculated Later" by admin after request submission.
                        </p>
                    </div>
                    <button @click="toggleShippingEnabled"
                        :class="config.shipping_enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
                        class="relative inline-flex h-10 w-20 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ml-6">
                        <span :class="config.shipping_enabled ? 'translate-x-10' : 'translate-x-0'"
                            class="inline-block h-10 w-10 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
                        </span>
                    </button>
                </div>

                <!-- Shipping Cost Input -->
                <div v-if="config.shipping_enabled"
                    class="p-6 bg-blue-50 dark:bg-blue-900 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                    <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">Flat Rate Shipping
                        Cost (WCH)</label>
                    <input v-model.number="config.shipping_cost_wch" type="number" step="0.01" min="0"
                        class="max-w-xs px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-blue-500" />
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">This flat rate will be added to all
                        redemption requests</p>
                </div>

                <div v-else
                    class="p-6 bg-amber-50 dark:bg-amber-900 rounded-lg border-2 border-amber-200 dark:border-amber-700">
                    <div class="flex items-start gap-3">
                        <svg class="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white mb-1">Shipping Cost: Calculated
                                Later</p>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                Users will submit requests without knowing exact shipping cost. You'll need to
                                update each request individually with the actual shipping cost before users can
                                proceed to payment.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Preview Section -->
                <div class="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                        User Preview</h3>
                    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Gold Subtotal:</span>
                                <span class="font-semibold text-gray-900 dark:text-white">95 WCH</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Shipping:</span>
                                <span v-if="config.shipping_enabled"
                                    class="font-semibold text-gray-900 dark:text-white">
                                    {{ formatNumber(config.shipping_cost_wch) }} WCH
                                </span>
                                <span v-else class="font-semibold text-amber-500">Calculated Later</span>
                            </div>
                            <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                            <div class="flex justify-between text-base font-bold">
                                <span class="text-gray-900 dark:text-white">Total:</span>
                                <span class="text-blue-600">
                                    {{ formatNumber(config.shipping_enabled ? 95 + config.shipping_cost_wch : 95) }}
                                    WCH
                                    {{ !config.shipping_enabled ? '+ Shipping' : '' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="flex gap-3 pt-4">
                    <button @click="saveConfig" :disabled="isSaving"
                        class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold">
                        {{ isSaving ? 'Saving...' : 'Save Changes' }}
                    </button>
                    <button @click="loadConfig"
                        class="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { adminApi } from '../services/adminApi'
import { redemptionService } from '@/app/services/redemptionService'

const config = ref({
    shipping_enabled: false,
    shipping_cost_wch: 0
})

const isSaving = ref(false)

const loadConfig = async () => {
    try {
        const settings = await redemptionService.getSettings()
        config.value = { ...settings }
    } catch (error) {
        console.error('Failed to load config:', error)
        toast.error('Failed to load configuration')
    }
}

const toggleShippingEnabled = () => {
    config.value.shipping_enabled = !config.value.shipping_enabled
    if (!config.value.shipping_enabled) {
        config.value.shipping_cost_wch = 0
    }
}

const saveConfig = async () => {
    isSaving.value = true
    try {
        await adminApi.updateConfig(config.value)
        toast.success('Configuration saved successfully')
    } catch (error) {
        console.error('Failed to save config:', error)
        toast.error('Failed to save configuration')
    } finally {
        isSaving.value = false
    }
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}

onMounted(() => {
    loadConfig()
})
</script>
