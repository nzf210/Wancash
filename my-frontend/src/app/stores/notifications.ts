import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  interface Notification {
  read: boolean;
  // Add other properties as needed
}

const notifications = ref<Notification[]>([]);

  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.read).length
  )

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  return {
    notifications,
    unreadCount,
    markAllAsRead
  }
})
