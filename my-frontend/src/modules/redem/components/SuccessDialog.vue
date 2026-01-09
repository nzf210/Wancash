<template>
    <Dialog :open="open">
        <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <DialogHeader>
                <DialogTitle class="text-center text-gray-900 dark:text-white">Redemption Successful!</DialogTitle>
            </DialogHeader>
            <div class="flex flex-col items-center justify-center py-4">
                <div
                    class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 border border-green-200 dark:border-green-800">
                    <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <p class="text-center text-gray-700 dark:text-gray-300 mb-2">Your token redemption request has been
                    successfully submitted.</p>
                <p class="text-center text-gray-600 dark:text-gray-400 text-sm">Physical gold will be shipped to the
                    address
                    you provided shortly.</p>
                <p class="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">You will receive notifications via
                    WhatsApp/Telegram regarding the shipping status.</p>
            </div>
            <DialogFooter class="flex flex-col sm:flex-row gap-2">
                <Button @click="$emit('close')"
                    class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
                    Close
                </Button>
                <Button @click="$emit('dashboard')"
                    class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Dashboard
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

defineProps<{
    open: boolean
}>()

defineEmits<{
    close: []
    dashboard: []
}>()
</script>
