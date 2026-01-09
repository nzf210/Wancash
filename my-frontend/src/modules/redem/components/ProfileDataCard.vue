<template>
    <div v-if="profile" class="mb-8">
        <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div class="p-6">
                <div class="flex items-center gap-2 mb-4">
                    <div
                        class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Profile Data Available</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="profile-name">Full
                            Name</Label>
                        <p class="font-medium text-gray-900 dark:text-white" id="profile-name">{{ profile.name }}</p>
                    </div>
                    <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            for="phone-number">Phone
                            Number</Label>
                        <p class="font-medium text-gray-900 dark:text-white" id="phone-number">{{ profile.phone }}</p>
                    </div>
                    <div class="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            for="address">Address</Label>
                        <p class="font-medium text-gray-900 dark:text-white" id="address">{{ profile.address }}</p>
                    </div>
                </div>

                <div class="flex items-start space-x-3">
                    <Checkbox :checked="useProfileData" @update:checked="$emit('update:useProfileData', $event)"
                        id="use-profile-data"
                        class="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400" />
                    <div class="grid gap-1.5">
                        <Label for="use-profile-data"
                            class="text-sm font-medium leading-none cursor-pointer text-gray-900 dark:text-white">
                            Use profile data for shipping
                        </Label>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Data will be automatically filled into the form below
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export interface UserProfile {
    name: string
    phone: string
    address: string
    telegram?: string
    whatsapp?: string
}

defineProps<{
    profile: UserProfile | null
    useProfileData: boolean
}>()

defineEmits<{
    'update:useProfileData': [value: boolean]
}>()
</script>
