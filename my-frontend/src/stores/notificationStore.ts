import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Notification {
    id: string
    title: string
    message: string
    isRead: boolean
    createdAt: Date
}

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref<Notification[]>([])

    // Dummy data initialization
    const initDummyData = () => {
        notifications.value = [
            {
                id: '1',
                title: 'Welcome',
                message: 'Welcome to Wancash Staking!',
                isRead: false,
                createdAt: new Date()
            },
            {
                id: '2',
                title: 'Reward Received',
                message: 'You have received 10 WCH rewards.',
                isRead: false,
                createdAt: new Date(Date.now() - 86400000)
            },
            // Generate more to test '99+' badge if needed, currently just 2 for visibility
        ]

        // Add more dummy notifications to test count > 99 if needed
        for (let i = 0; i < 100; i++) {
            notifications.value.push({
                id: `dummy-${i}`,
                title: `Notification ${i}`,
                message: `This is dummy notification ${i}`,
                isRead: false,
                createdAt: new Date()
            })
        }
    }

    const unreadCount = computed(() => {
        return notifications.value.filter(n => !n.isRead).length
    })

    const hasNotifications = computed(() => unreadCount.value > 0)

    const markAsRead = (id: string) => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) {
            notification.isRead = true
        }
    }

    const markAllAsRead = () => {
        notifications.value.forEach(n => n.isRead = true)
    }

    const deleteNotification = (id: string) => {
        notifications.value = notifications.value.filter(n => n.id !== id)
    }

    const clearAllNotifications = () => {
        notifications.value = []
    }

    // Initialize
    initDummyData()

    return {
        notifications,
        unreadCount,
        hasNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
    }
})
