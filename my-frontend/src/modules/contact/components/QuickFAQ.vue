<template>
    <Card class="border-2 border-purple-200 dark:border-blue-light">
        <CardHeader>
            <CardTitle class="text-xl font-bold text-gray-800 dark:text-white">Quick FAQ</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
            <router-link v-for="faq in QUICK_FAQS" :key="faq.id" to="/faq"
                class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-blue-800/30 transition-colors">
                <div class="flex items-center justify-between">
                    <span class="text-gray-700 dark:text-gray-300">{{ faq.question }}</span>
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </router-link>
        </CardContent>
    </Card>
</template>

<script lang="ts" setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QUICK_FAQS } from '../constants/contactData'
</script>
