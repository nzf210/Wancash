<script setup lang="ts">
import { computed } from 'vue'
import { MoreHorizontal, Trash2, CheckCircle } from 'lucide-vue-next'
import type { Notification } from '@/stores/notificationStore'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const props = defineProps<{
    notification: Notification
}>()

const emit = defineEmits<{
    (e: 'read', id: string): void
    (e: 'delete', id: string): void
}>()

const timeAgo = computed(() => {
    const date = new Date(props.notification.createdAt)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return date.toLocaleDateString()
})
</script>

<template>
    <div class="flex flex-col gap-1 p-4 transition-colors hover:bg-muted/50 group"
        :class="{ 'bg-muted/20': !notification.isRead }">
        <div class="flex items-start justify-between gap-2">
            <div class="space-y-1">
                <p class="text-sm font-medium leading-none">
                    {{ notification.title }}
                </p>
                <p class="text-sm text-muted-foreground">
                    {{ notification.message }}
                </p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon"
                        class="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 data-[state=open]:opacity-100">
                        <span class="sr-only">Options</span>
                        <MoreHorizontal class="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem v-if="!notification.isRead" @click="emit('read', notification.id)">
                        <CheckCircle class="mr-2 h-4 w-4" />
                        <span>Mark as read</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem class="text-destructive focus:text-destructive"
                        @click="emit('delete', notification.id)">
                        <Trash2 class="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div class="text-xs text-muted-foreground">
            {{ timeAgo }}
        </div>
    </div>
</template>
