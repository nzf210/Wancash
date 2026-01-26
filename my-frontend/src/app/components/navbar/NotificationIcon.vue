<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()
const unreadCount = computed(() => notificationStore.unreadCount)
const hasNotifications = computed(() => notificationStore.hasNotifications)

defineProps<{
    isMobile?: boolean
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()

const handleClick = () => {
    emit('click')
}
</script>

<template>
    <Button variant="ghost" size="icon" :class="[
        'relative',
        isMobile ? 'h-9 w-9' : 'mr-4 mt-1'
    ]" @click="handleClick">
        <span class="sr-only">Notifications</span>
        <svg xmlns="http://www.w3.org/2000/svg" :width="isMobile ? 20 : 24" :height="isMobile ? 20 : 24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" :class="isMobile ? '' : 'h-5 w-5'">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        <Badge v-if="hasNotifications" variant="destructive" :class="[
            'absolute rounded-full p-0 flex items-center justify-center text-xs',
            isMobile ? '-right-1 -top-1 h-4 w-4' : '-right-1 -top-1 h-5 w-5'
        ]">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
        </Badge>
    </Button>
</template>
