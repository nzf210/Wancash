import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
    const isOpen = ref(false)
    const unreadCount = ref(0) // Track new messages from admin

    function toggleChat() {
        isOpen.value = !isOpen.value
        if (isOpen.value) unreadCount.value = 0
    }

    function openChat() {
        isOpen.value = true
        unreadCount.value = 0
    }

    function closeChat() {
        isOpen.value = false
    }

    function setUnreadCount(count: number) {
        unreadCount.value = count
    }

    function incrementUnread() {
        unreadCount.value++
    }

    return { isOpen, unreadCount, toggleChat, openChat, closeChat, setUnreadCount, incrementUnread }
})
