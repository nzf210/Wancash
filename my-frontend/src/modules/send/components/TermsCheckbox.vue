<script lang="ts" setup>
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

defineProps<{ agreeTerms: boolean }>()
defineEmits<{ 'update:agree-terms': [boolean] }>()

</script>

<template>
  <div class="flex items-start space-x-3 pt-6">
    <Checkbox :model-value="agreeTerms" id="transfer-terms" :default-value="false"
      class="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400"
      @update:model-value="($event: any) => $emit('update:agree-terms', $event)" />
    <div class="grid gap-1.5">
      <Label for="transfer-terms"
        class="text-xs md:text-sm font-medium leading-none cursor-pointer text-gray-900 dark:text-white">
        I have verified the recipient address and transfer amount
      </Label>
      <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">
        Ensure the destination address is correct as transactions cannot be cancelled.
      </p>
    </div>
  </div>
</template>
