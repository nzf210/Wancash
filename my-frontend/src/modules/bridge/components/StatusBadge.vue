<template>
  <span :class="badgeClass" class="text-xs px-2 py-1 rounded-full">
    {{ statusText }}
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { BridgeHistory } from '../types/bridge.types'

const props = defineProps<{
  status: BridgeHistory['status']
}>()

const statusText = computed(() => {
  const map: Record<BridgeHistory['status'], string> = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed'
  }
  return map[props.status]
})

const badgeClass = computed(() => {
  const classes: Record<BridgeHistory['status'], string> = {
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    failed: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  return classes[props.status]
})
</script>
