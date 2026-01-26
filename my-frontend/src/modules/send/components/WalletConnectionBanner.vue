<script lang="ts" setup>
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="mb-8">
    <div
      class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
      <div class="p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">Wallet not connected</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Connect wallet to make transfers</p>
          </div>
        </div>
        <Button @click="$emit('connect-wallet')"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6">
          Connect Wallet
        </Button>
      </div>
    </div>
  </div>
</template>
