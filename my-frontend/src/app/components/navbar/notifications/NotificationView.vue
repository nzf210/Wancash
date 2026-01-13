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
        <SheetContent side="bottom" class="h-[80vh] flex flex-col p-0">
            <SheetHeader class="px-4 pt-4">
                <SheetTitle class="text-left">
                    Notifications
                </SheetTitle>
            </SheetHeader>
            <NotificationList />
        </SheetContent>
    </Sheet>

    <!-- Desktop View: Popover -->
    <Popover v-else v-model:open="isOpen">
        <PopoverTrigger as-child>
            <NotificationIcon />
        </PopoverTrigger>
        <PopoverContent align="end" class="w-[380px] p-0">
            <NotificationList />
        </PopoverContent>
    </Popover>
</template>
