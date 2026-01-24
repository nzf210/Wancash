<template>
    <div class="mt-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white text-center">
        <h3 class="text-2xl font-bold mb-4">Need Immediate Help?</h3>
        <p class="mb-6 max-w-2xl mx-auto">
            Our support team is ready to help 24/7. Contact us via live chat for instant response.
        </p>
        <Button @click="openLiveChat" class="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3">
            Open Live Chat
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        </Button>
    </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/stores/chatStore'

const chatStore = useChatStore()

const openLiveChat = () => {
    chatStore.openChat()
}
</script>
