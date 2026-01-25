<script setup lang="ts">
import { ref } from 'vue'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import NotificationIcon from '../NotificationIcon.vue'
import NotificationList from './NotificationList.vue'

defineProps<{
    isMobile?: boolean
}>()

const isOpen = ref(false)
</script>

<template>
    <!-- Mobile View: Sheet -->
    <Sheet v-if="isMobile" v-model:open="isOpen">
        <SheetTrigger as-child>
            <NotificationIcon :is-mobile="true" />
        </SheetTrigger>
        <SheetContent side="bottom" class="h-[75vh] flex flex-col p-0 !rounded-t-[20px] bottom-5 sm:bottom-0">
            <SheetHeader class="px-4 pt-4 shrink-0">
                <SheetTitle class="text-left">
                    Notifications
                </SheetTitle>
            </SheetHeader>
            <div class="flex-1 overflow-hidden">
                <NotificationList />
            </div>
        </SheetContent>
    </Sheet>

    <!-- Desktop View: Popover -->
    <Popover v-else v-model:open="isOpen">
        <PopoverTrigger as-child>
            <NotificationIcon />
        </PopoverTrigger>
        <PopoverContent align="end" class="w-[370px] sm:w-[380px] p-0 mb-7 sm:mb-2 text-wrap break-all">
            <NotificationList />
        </PopoverContent>
    </Popover>
</template>
