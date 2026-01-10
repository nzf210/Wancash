<template>
    <div class="mb-8">
        <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div class="p-6">
                <div class="flex items-center gap-2 mb-6">
                    <div
                        class="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Redemption Summary</h3>
                </div>

                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Gold to be shipped</p>
                            <p class="font-semibold text-gray-900 dark:text-white">5 grams (24 karat)</p>
                        </div>
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Estimated value</p>
                            <p class="font-semibold text-gray-900 dark:text-white">Rp 5,000,000</p>
                        </div>
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Shipping method</p>
                            <p class="font-semibold text-gray-900 dark:text-white">Special courier (3-5 business days)
                            </p>
                        </div>
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Shipping insurance</p>
                            <p class="font-semibold text-gray-900 dark:text-white">Included</p>
                        </div>
                    </div>

                    <div
                        class="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <span class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Total
                                Tokens:</span>
                            <span class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{{ totalToken
                                }}
                                Tokens</span>
                        </div>
                    </div>

                    <div class="flex items-start space-x-3 pt-4">
                        <Checkbox :model-value="agreeTerms"
                            @update:model-value="$emit('update:agreeTerms', $event as boolean)" id="terms"
                            class="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400" />
                        <div class="grid gap-1.5">
                            <Label for="terms"
                                class="text-sm font-medium leading-none cursor-pointer text-gray-900 dark:text-white">
                                I agree to the applicable terms and conditions
                            </Label>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                By checking this, you agree to all terms and conditions for token redemption with gold.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

defineProps<{
    totalToken: number
    agreeTerms: boolean
}>()

defineEmits<{
    'update:agreeTerms': [value: boolean]
}>()
</script>
