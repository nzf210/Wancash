import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/utils/apiClient'

export interface Notification {
    id: string
    user_id: string
    type: string
    title: string
    message: string
    is_read: boolean
    data: any
    created_at: string
}

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref<Notification[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)


    let pollingInterval: ReturnType<typeof setInterval> | null = null

    const fetchNotifications = async () => {
        // Don't set loading to true for background polling to avoid flicker
        if (!notifications.value.length) loading.value = true

        console.log('[FE-NOTIF] Fetching notifications...')
        error.value = null
        try {
            const response = await apiClient.fetch('/api/notifications', {
                method: 'GET'
            })

            console.log('[FE-NOTIF] Response status:', response.status)
            if (!response.ok) throw new Error('Failed to fetch notifications')

            const result = await response.json()
            console.log('[FE-NOTIF] Response data:', result)

            if (result.success) {
                // If we get new data, update. Ideally diffing, but full replace is fine for now.
                notifications.value = result.data
                console.log('[FE-NOTIF] Store updated with', result.data.length, 'items')
            }
        } catch (err: any) {
            console.error('Fetch notifications error:', err)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    const startPolling = () => {
        if (pollingInterval) return
        fetchNotifications()
        pollingInterval = setInterval(fetchNotifications, 30000) // Poll every 30s for responsiveness 
    }

    const stopPolling = () => {
        if (pollingInterval) {
            clearInterval(pollingInterval)
            pollingInterval = null
        }
    }

    const unreadCount = computed(() => {
        // Backend returns `is_read` (boolean).
        return notifications.value.filter(n => !n.is_read).length
    })

    const hasNotifications = computed(() => unreadCount.value > 0)

    // Check if there are ANY notifications (read or unread)
    const hasAnyNotifications = computed(() => notifications.value.length > 0)

    const markAsRead = async (id: string) => {
        // Optimistic update
        const notification = notifications.value.find(n => n.id === id)
        if (notification && !notification.is_read) {
            notification.is_read = true
            try {
                await apiClient.fetch(`/api/notifications/${id}/read`, {
                    method: 'PATCH'
                })
            } catch (err) {
                // Revert if failed? For read status it's usually fine to ignore
                console.error('Mark read error:', err)
            }
        }
    }

    const markAllAsRead = async () => {
        // Optimistic update
        notifications.value.forEach(n => n.is_read = true)
        try {
            await apiClient.fetch('/api/notifications/read-all', {
                method: 'PATCH'
            })
        } catch (err) {
            console.error('Mark all read error:', err)
        }
    }

    const deleteNotification = async (id: string) => {
        // Optimistic update
        const original = [...notifications.value]
        notifications.value = notifications.value.filter(n => n.id !== id)

        try {
            await apiClient.fetch(`/api/notifications/${id}`, {
                method: 'DELETE'
            })
        } catch (err) {
            console.error('Delete notification error:', err)
            notifications.value = original // Revert
        }
    }

    const clearAllNotifications = async () => {
        // Optimistic
        const original = [...notifications.value]
        notifications.value = []

        try {
            await apiClient.fetch('/api/notifications/all', {
                method: 'DELETE'
            })
        } catch (err) {
            console.error('Clear all notifications error:', err)
            notifications.value = original
        }
    }

    return {
        notifications,
        loading,
        error,
        unreadCount,
        hasNotifications,
        hasAnyNotifications,
        fetchNotifications,
        startPolling,
        stopPolling,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
    }
})
