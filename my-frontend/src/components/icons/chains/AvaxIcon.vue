<template>
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" :class="className">
        <g fill="none" fill-rule="evenodd">
            <circle cx="16" cy="16" r="16" fill="#E84142" />
            <path
                d="M21.87 18.575l-2.074-2.193h-5.46l2.126-3.837L22.25 21H27L16.48 2.5 14.507 6l2.152 3.864 7.273 12.835-2.062-4.124zM6.903 21h8.736l-4.363-7.794L6.903 21z"
                fill="#FFF" />
        </g>
    </svg>
</template>

<script setup lang="ts">
defineProps<{
    className?: string
}>()
</script>
