<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from '@/components/ui/dialog'
import NotificationItem from './NotificationItem.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const props = defineProps<{
    isPage?: boolean
}>()

const store = useNotificationStore()
const notifications = computed(() => store.notifications)
const hasNotifications = computed(() => store.notifications.length > 0)
const hasUnread = computed(() => store.unreadCount > 0)

const isDeleteDialogOpen = ref(false)

const handleClearAll = () => {
    store.clearAllNotifications()
    isDeleteDialogOpen.value = false
}
</script>

<template>
    <div class="flex flex-col h-full w-full" :class="{ 'max-h-[80vh] sm:max-h-[500px]': !isPage }">
        <div class="flex items-center justify-between p-4 border-b">
            <h4 class="text-sm font-semibold">Notifications</h4>
            <div class="flex gap-2">
                <Button v-if="hasUnread" variant="ghost" size="sm" class="h-auto px-2 text-xs"
                    @click="store.markAllAsRead()">
                    Read all
                </Button>
                <Dialog v-model:open="isDeleteDialogOpen">
                    <DialogTrigger as-child>
                        <Button v-if="hasNotifications" variant="ghost" size="sm"
                            class="h-auto px-2 text-xs text-destructive hover:text-destructive">
                            Delete all
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete all notifications?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete all your notifications.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose as-child>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" @click="handleClearAll">Delete All</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <div v-if="notifications.length === 0"
            class="flex flex-col items-center justify-center flex-1 p-8 text-center text-muted-foreground min-h-[200px]">
            <p class="text-sm">No notifications</p>
        </div>

        <div v-else class="flex-1 overflow-y-auto">
            <NotificationItem v-for="notification in notifications" :key="notification.id" :notification="notification"
                @read="store.markAsRead" @delete="store.deleteNotification" />
        </div>

        <div v-if="!isPage && hasNotifications" class="p-2 border-t text-center">
            <RouterLink to="/notifications" class="text-xs text-primary hover:underline block w-full py-1">
                View all notifications
            </RouterLink>
        </div>
    </div>
</template>
