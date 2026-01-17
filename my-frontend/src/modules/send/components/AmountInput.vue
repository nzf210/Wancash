<script lang="ts" setup>
import { computed } from 'vue'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const props = defineProps<{ amount: string; minimumTransfer: number; maxTransferable: number; amountError: string; equivalentValue: number }>()

const emit = defineEmits<{ 'update:amount': [string]; 'validate-amount': []; 'set-max-amount': [] }>()

const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
const formatCurrency = (num: number) => new Intl.NumberFormat('en-US').format(Math.round(num))

const displayAmount = computed({
  get: () => {
    if (!props.amount) return ''
    // Check if it ends with a dot or has trailing zeros after dot to preserve user typing
    if (props.amount.endsWith('.') || (props.amount.includes('.') && props.amount.endsWith('0'))) {
      const parts = props.amount.split('.')
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return `${integerPart}.${parts[1]}`
    }
    const parts = props.amount.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts.join('.')
  },
  set: (val) => {
    // Remove commas for the raw numeric value
    const raw = val.replace(/,/g, '')
    // Allow numbers and one dot
    if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
      emit('update:amount', raw)
      emit('validate-amount')
    }
  }
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <Label for="amount" class="text-xs md:text-sm font-medium text-gray-900 dark:text-white">Token Amount *</Label>
      <Button type="button" @click="$emit('set-max-amount')">
        <span class="hidden md:inline">Use Max: {{ formatNumber(maxTransferable) }} WCH</span>
        <span class="md:hidden">Max: {{ formatNumber(maxTransferable) }}</span>
      </Button>
    </div>

    <div
      class="relative p-2 md:p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 transition-colors focus-within:border-blue-500 dark:focus-within:border-blue-500"
      :class="{ '!border-red-300 dark:!border-red-500': amountError }">
      <div class="flex items-center">
        <div class="mr-3 flex-shrink-0">
          <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
              clip-rule="evenodd" />
          </svg>
        </div>

        <div class="relative flex-grow">
          <input id="amount" v-model="displayAmount" type="text" placeholder="0.00"
            class="w-full text-xl md:text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500 outline-none p-0 pr-12" />

          <div class="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none">
            <span class="text-gray-500 dark:text-gray-400 font-medium text-lg">WCH</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="amountError" class="text-xs md:text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      {{ amountError }}
    </div>
    <div class="text-xs md:text-sm text-gray-600 dark:text-gray-400">
      Equivalent to: <span class="font-semibold text-blue-600 dark:text-blue-400">USD {{ formatCurrency(equivalentValue)
        }}</span>
    </div>
  </div>
</template>
