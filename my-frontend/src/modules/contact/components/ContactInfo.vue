<template>
    <Card class="border-2 border-purple-200 dark:border-blue-light">
        <CardHeader>
            <CardTitle class="text-xl font-bold text-gray-800 dark:text-white">Other Contacts</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
            <!-- Phone -->
            <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-blue-800/30">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </div>
                <div>
                    <div class="font-semibold text-gray-800 dark:text-white">Support Phone</div>
                    <div class="text-gray-600 dark:text-gray-400">{{ supportPhone }}</div>
                </div>
            </div>

            <!-- Email -->
            <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-blue-800/30">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <div class="font-semibold text-gray-800 dark:text-white">Email</div>
                    <div class="text-gray-600 dark:text-gray-400">{{ email }}</div>
                </div>
            </div>

            <!-- Live Chat -->
            <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-blue-800/30">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                </div>
                <div>
                    <div class="font-semibold text-gray-800 dark:text-white">Live Chat</div>
                    <div class="text-gray-600 dark:text-gray-400 flex items-center">
                        <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Available 24/7
                    </div>
                </div>
            </div>

            <!-- Social Media -->
            <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-blue-800/30">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <div>
                    <div class="font-semibold text-gray-800 dark:text-white">Social Media</div>
                    <div class="flex space-x-3 mt-2">
                        <a v-for="social in activeSocialMedia" :key="social.id" :href="social.url" target="_blank"
                            class="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-blue-400"
                            :title="social.name">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path :d="social.icon" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useContact } from '../composables/useContact'

const { supportPhone, email, activeSocialMedia } = useContact()
</script>
