<template>
    <div class="mb-12 text-center">
        <div class="flex items-center justify-center mb-6">
            <div
                class="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                CT
            </div>
            <div class="ml-4">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Client Token Support</h1>
                <p class="text-lg text-gray-600 dark:text-gray-300 mt-2">Contact us for token and staking support</p>
            </div>
        </div>

        <!-- Stats Bar -->
        <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div v-for="stat in stats" :key="stat.label" class="glass-blue rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-white mb-2">{{ stat.value }}</div>
                <div class="text-blue-light">{{ stat.label }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { SUPPORT_STATS } from '../constants/contactData'

const stats = SUPPORT_STATS
</script>

<style scoped>
.glass-blue {
    background: linear-gradient(135deg,
            oklch(0.26 0.03 240 / 0.8) 0%,
            oklch(0.28 0.03 240 / 0.6) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid oklch(0.32 0.03 240);
}

.text-blue-light {
    color: oklch(0.78 0.05 240);
}
</style>
