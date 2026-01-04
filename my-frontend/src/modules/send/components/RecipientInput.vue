<script lang="ts" setup>
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

defineProps<{ recipientAddress: string; addressError: string; recipientName: string }>()
defineEmits<{ 'update:recipient-address': [string]; 'validate-address': []; 'show-address-book': [] }>()
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <Label for="recipient" class="text-sm font-medium text-gray-900 dark:text-white">Recipient Wallet Address
        *</Label>
      <Button type="button" @click="$emit('show-address-book')">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Address Book
      </Button>
    </div>
    <div class="relative">
      <svg class="absolute left-4 top-2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
      <Input id="recipient" :value="recipientAddress" placeholder="0x..."
        class="pl-12 font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
        :class="{ 'border-red-300 dark:border-red-500': addressError }"
        @input="$emit('update:recipient-address', $event.target.value); $emit('validate-address')" />
    </div>
    <div v-if="addressError" class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      {{ addressError }}
    </div>
    <div v-if="recipientName" class="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd" />
      </svg>
      Registered as: {{ recipientName }}
    </div>
  </div>
</template>
