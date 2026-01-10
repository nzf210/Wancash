<template>
    <div class="mb-6 md:mb-10 text-center">
        <div
            class="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3 md:mb-4">
            <ArrowRightIcon class="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
            Cross-Chain Bridge
        </h1>
        <p class="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Enterprise-grade token bridging between multiple blockchain networks
        </p>

        <!-- Active Network Indicator -->
        <div v-if="chainInfo"
            class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            <div class="w-5 h-5 rounded-full flex items-center justify-center">
                <img v-if="chainInfo.icon" :src="chainInfo.icon" :alt="chainInfo.name" class="w-5 h-5 rounded-full" />
                <div v-else class="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
            </div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ chainInfo.name }}
            </span>
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useConnection } from '@wagmi/vue'
import { useChain } from '@/app/composables/useChain'
import { ArrowRightIcon } from '@radix-icons/vue'

const { chainId } = useConnection()
const { getChainInfo } = useChain()

const chainInfo = computed(() => {
    if (!chainId.value) return null
    return getChainInfo(chainId.value)
})
</script>
