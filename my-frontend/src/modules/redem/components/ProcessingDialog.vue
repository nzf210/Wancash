<template>
    <Dialog :open="open">
        <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <DialogHeader>
                <DialogTitle class="text-gray-900 dark:text-white">Processing Redemption</DialogTitle>
            </DialogHeader>
            <div class="flex flex-col items-center justify-center py-8">
                <div
                    class="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4">
                </div>
                <p class="text-center text-gray-600 dark:text-gray-400">Please wait a moment, we are processing your
                    request...</p>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

defineProps<{
    open: boolean
}>()
</script>
