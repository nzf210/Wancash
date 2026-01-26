<template>
    <div :class="['flex items-center justify-center rounded-full overflow-hidden', className]">
        <img src="/wancash.png" alt="WCH" class="w-full h-full object-cover" />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    className?: string
}>()
</script>
