<template>
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" :class="className">
        <circle cx="16" cy="16" r="16" fill="#F0B90B" />
        <path
            d="M16 10.5L12.75 13.75L16 17L19.25 13.75L16 10.5ZM16 21.5L12.75 18.25L16 15L19.25 18.25L16 21.5ZM8.5 13.75L11.75 10.5L14 12.75L10.75 16L14 19.25L11.75 21.5L8.5 18.25L5.25 15L8.5 13.75ZM23.5 13.75L26.75 15L23.5 18.25L20.25 21.5L18 19.25L21.25 16L18 12.75L20.25 10.5L23.5 13.75ZM16 7L18.25 9.25L16 11.5L13.75 9.25L16 7ZM16 25L13.75 22.75L16 20.5L18.25 22.75L16 25Z"
            fill="white" />
    </svg>
</template>

<script setup lang="ts">
defineProps<{
    className?: string
}>()
</script>
