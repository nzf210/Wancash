<script lang="ts" setup>
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

defineProps<{ amount: string; minimumTransfer: number; maxTransferable: number; amountError: string; equivalentValue: number }>()

defineEmits<{ 'update:amount': [string]; 'validate-amount': []; 'set-max-amount': [] }>()

const formatNumber = (num: number) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
const formatCurrency = (num: number) => new Intl.NumberFormat('id-ID').format(Math.round(num))
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <Label for="amount" class="text-sm font-medium text-gray-900 dark:text-white">Token Amount *</Label>
      <Button type="button" @click="$emit('set-max-amount')">
        Use Max: {{ formatNumber(maxTransferable) }} WCH
      </Button>
    </div>
    <div class="relative">
      <svg class="absolute left-4 top-2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
          clip-rule="evenodd" />
      </svg>
      <Input id="amount" :value="amount" type="number" :min="minimumTransfer" :max="maxTransferable" placeholder="0.00"
        class="pl-12 text-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
        :class="{ 'border-red-300 dark:border-red-500': amountError }"
        @input="$emit('update:amount', $event.target.value); $emit('validate-amount')" />
      <span class="absolute right-4 top-2 pr-4 text-gray-500 dark:text-gray-400 font-medium">WCH</span>
    </div>
    <div v-if="amountError" class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      {{ amountError }}
    </div>
    <div class="text-sm text-gray-600 dark:text-gray-400">
      Equivalent to: <span class="font-semibold text-blue-600 dark:text-blue-400">USD {{ formatCurrency(equivalentValue)
      }}</span>
    </div>
  </div>
</template>
