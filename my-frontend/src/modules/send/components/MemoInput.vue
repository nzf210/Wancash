<script lang="ts" setup>
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

defineProps<{ memo: string }>()
defineEmits<{ 'update:memo': [string] }>()
</script>

<template>
  <div class="space-y-3">
    <Label for="memo" class="text-sm font-medium text-gray-900 dark:text-white">Note (Optional)</Label>
    <Textarea id="memo" :value="memo" placeholder="Add a note for this transaction"
      class="min-h-[100px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
      maxlength="200" @input="$emit('update:memo', $event.target.value)" />
    <div class="text-xs text-gray-500 dark:text-gray-400 text-right">
      {{ memo.length }}/200 characters
    </div>
  </div>
</template>
