<template>
    <div v-if="isSupportPage" class="fixed bottom-4 right-2 sm:right-4 z-50 flex flex-col items-end gap-4">
        <!-- Chat Window -->
        <div v-if="isOpen"
            class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl w-[342px] sm:w-[350px] flex flex-col border border-gray-200 dark:border-gray-800 h-[500px] overflow-hidden transition-all duration-300">

            <!-- Header -->
            <div class="bg-yellow-400 dark:bg-yellow-600 p-4 flex justify-between items-center text-white">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <h3 class="font-bold text-sm">Live Support</h3>
                </div>
                <button @click="isOpen = false" class="hover:bg-yellow-500 rounded p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-hidden flex flex-col relative">
                <!-- Not Logged In State -->
                <div v-if="!isAuthenticated"
                    class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-gray-900/90 z-10">
                    <div
                        class="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-4xl">
                        🔒
                    </div>
                    <h4 class="font-bold text-gray-900 dark:text-white mb-2">Login Required</h4>
                    <p class="text-sm text-gray-500 mb-4">Please log in to chat with our support team.</p>
                    <button @click="handleAuth" :disabled="isAuthorizing"
                        class="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
                        <span v-if="isAuthorizing" class="animate-spin text-xs">⏳</span>
                        {{ isAuthorizing ? 'Authorizing...' : 'Login Now' }}
                    </button>
                    <p v-if="!wagmiConnected" class="text-[10px] text-gray-400 mt-2 italic">Connect your wallet first
                    </p>
                    <p v-else-if="wagmiConnected && !isAuthenticated" class="text-[10px] text-orange-400 mt-2 italic">
                        Please
                        sign the message to login</p>
                </div>

                <!-- Chat Messages -->
                <div v-else ref="scrollArea" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950">
                    <div v-if="loading && messages.length === 0" class="flex justify-center py-4">
                        <span class="animate-spin text-xl">⏳</span>
                    </div>

                    <div v-else-if="messages.length === 0" class="text-center py-8 text-gray-400 text-sm">
                        <p>👋 Hello! How can we help you today?</p>
                        <p class="text-xs mt-1">Start a conversation with our support team.</p>
                    </div>

                    <div v-for="msg in messages" :key="msg.id" class="flex flex-col max-w-[85%]"
                        :class="msg.sender_role === 'user' ? 'self-end items-end' : 'self-start items-start'">

                        <div class="px-3 py-2 rounded-2xl text-sm"
                            :class="msg.sender_role === 'user'
                                ? 'bg-yellow-400 text-gray-900 rounded-br-none'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none shadow-sm'">
                            {{ msg.message }}
                        </div>
                        <span class="text-[10px] text-gray-400 mt-1 px-1">
                            {{ formatTime(msg.created_at) }}
                        </span>
                    </div>

                    <!-- Typing Indicator -->
                    <div v-if="isAdminTyping" class="flex flex-col max-w-[85%] self-start items-start animate-fade-in">
                        <div
                            class="px-3 py-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm flex items-center gap-1">
                            <span
                                class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span
                                class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                        <span class="text-[9px] text-gray-400 mt-1 px-1">Admin is typing...</span>
                    </div>
                </div>

                <!-- Input Area -->
                <form v-if="isAuthenticated" @submit.prevent="sendMessage"
                    class="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                    <input v-model="newMessage" @input="onUserTyping" type="text" placeholder="Type a message..."
                        class="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                        :disabled="sending" />
                    <button type="submit" :disabled="!newMessage.trim() || sending"
                        class="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <svg v-if="!sending" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-0.5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span v-else class="animate-spin text-xs">⏳</span>
                    </button>
                </form>
            </div>
        </div>

        <!-- Toggle Button -->
        <button @click="toggleChat"
            class="relative group flex items-center justify-center w-14 h-14 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg transition-all duration-300 hover:scale-105">
            <span v-if="!isOpen" class="text-2xl pt-1">💬</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>

            <!-- Notification Badge -->
            <span v-if="unreadCount > 0 && !isOpen"
                class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-bounce">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/app/composables/useAuth'
import { apiClient } from '@/utils/apiClient'
import { useChatStore } from '@/stores/chatStore'
import { storeToRefs } from 'pinia'
import { useConnection } from '@wagmi/vue'
import { appkit } from '@/app/components/config/appkit'
import { useAppKitAccount } from '@reown/appkit/vue'
import { toast } from 'vue-sonner'

const route = useRoute()
const { isAuthenticated, login } = useAuth()
const { isConnected: wagmiConnected, address: walletAddress, chainId } = useConnection()
const accountData = useAppKitAccount()
const chatStore = useChatStore()
const { isOpen, unreadCount } = storeToRefs(chatStore)

// Only show the widget (bubble + window) on the Support page
const isSupportPage = computed(() => route.path === '/support')

const messages = ref<any[]>([])
const newMessage = ref('')
const loading = ref(false)
const sending = ref(false)
const isAuthorizing = ref(false)
const isAdminTyping = ref(false)
const lastTypingSent = ref(0)
const scrollArea = ref<HTMLDivElement | null>(null)
let pollInterval: any = null

const handleAuth = async () => {
    isAuthorizing.value = true
    try {
        // 1. Connect Wallet if not connected
        if (!wagmiConnected.value) {
            await appkit.open()
            // Wait for connection to be reported
            let retries = 0
            while (!wagmiConnected.value && retries < 10) {
                await new Promise(r => setTimeout(r, 1000))
                retries++
            }
        }

        // 2. Sign In if connected but not authenticated
        if (wagmiConnected.value && !isAuthenticated.value) {
            if (!walletAddress.value || !chainId.value) {
                toast.error('Wallet not fully connected')
                return
            }
            await login(walletAddress.value, chainId.value)
        }
    } catch (error: any) {
        console.error('Auth failed:', error)
        toast.error(error.message || 'Login failed')
    } finally {
        isAuthorizing.value = false
    }
}

const onUserTyping = () => {
    const now = Date.now()
    // Throttling: only send typing event once every 4 seconds
    if (now - lastTypingSent.value > 4000) {
        lastTypingSent.value = now
        apiClient.fetch('/api/livechat/typing', { method: 'POST' }).catch(() => { })
    }
}



const toggleChat = () => {
    chatStore.toggleChat()
}

const scrollToBottom = () => {
    nextTick(() => {
        if (scrollArea.value) {
            scrollArea.value.scrollTop = scrollArea.value.scrollHeight
        }
    })
}

const fetchMessages = async () => {
    if (!isAuthenticated.value) return

    try {
        const response = await apiClient.fetch('/api/livechat/history')
        if (!response.ok) throw new Error('Failed to fetch chat history')

        const resData = await response.json()
        if (resData.success) {
            const newHistory = resData.data as any[]

            // Detect new admin messages for unread badge if chat is CLOSED
            if (!isOpen.value && messages.value.length > 0) {
                const newAdminMsgs = newHistory.filter(nm =>
                    nm.sender_role === 'admin' &&
                    !messages.value.some(om => om.id === nm.id)
                )
                if (newAdminMsgs.length > 0) {
                    chatStore.setUnreadCount(unreadCount.value + newAdminMsgs.length)
                }
            }

            // Sync message list
            if (newHistory.length !== messages.value.length) {
                messages.value = newHistory
                if (isOpen.value) {
                    isAdminTyping.value = false
                    scrollToBottom()
                }
            } else if (newHistory.length > 0) {
                const lastOld = messages.value[messages.value.length - 1]
                const lastNew = newHistory[newHistory.length - 1]
                if (lastOld?.id !== lastNew?.id) {
                    messages.value = newHistory
                    if (isOpen.value) {
                        isAdminTyping.value = false
                        scrollToBottom()
                    }
                }
            }
        }
    } catch (err) {
        console.error('Failed to fetch chat history', err)
    }
}

const sendMessage = async () => {
    if (!newMessage.value.trim()) return

    sending.value = true
    try {
        const msg = newMessage.value
        newMessage.value = '' // Optimistic clear

        // Optimistic append
        const tempId = Date.now()
        messages.value.push({
            id: tempId,
            sender_role: 'user',
            message: msg,
            created_at: new Date().toISOString()
        })
        scrollToBottom()

        const response = await apiClient.fetch('/api/livechat/send', {
            method: 'POST',
            body: JSON.stringify({ message: msg })
        })

        if (!response.ok) throw new Error('Failed to send message')

        const resData = await response.json()
        if (resData.success) {
            // Replace optimisitc? Or just refetch next poll.
            // Let's replace the last one to get real ID if needed, but polling handles it generally.
            // Simulation: show "Admin is typing" for 5 seconds after user sends a message
            isAdminTyping.value = true
            setTimeout(() => { isAdminTyping.value = false }, 5000)
        }
    } catch (err) {
        console.error('Failed to send message', err)
        // Remove optimistic message if failed? Or show error
    } finally {
        sending.value = false
        // Force immediate poll
        fetchMessages()
    }
}

const startPolling = (ms = 3000) => {
    if (pollInterval) clearInterval(pollInterval)
    pollInterval = setInterval(fetchMessages, ms)
}

const stopPolling = () => {
    if (pollInterval) clearInterval(pollInterval)
    pollInterval = null
}

const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

watch(isOpen, (val) => {
    if (val) {
        // Open: Fast polling
        fetchMessages()
        startPolling(3000)
    } else {
        // Closed: Slow polling in background
        startPolling(15000)
    }
}, { immediate: true })

onMounted(() => {
    // Initial fetch and start background polling if closed
    if (isAuthenticated.value) {
        fetchMessages()
        if (!isOpen.value) startPolling(15000)
    }
})

onUnmounted(() => {
    stopPolling()
})
</script>

<style scoped>
/* Scrollbar styling */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}
</style>
