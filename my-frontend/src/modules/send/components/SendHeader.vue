<script lang="ts" setup>
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="mb-10">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <div
          class="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Token Transfer</h1>
          <p class="text-gray-600 dark:text-gray-300">Send tokens to another wallet address securely</p>
        </div>
      </div>
      <Button @click="$emit('go-to-portfolio')"
        class="hidden md:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        View Portfolio
      </Button>
    </div>
  </div>
</template>
