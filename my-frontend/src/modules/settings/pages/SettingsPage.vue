<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center gap-3 mb-8">
                <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                        </path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p class="text-gray-500 dark:text-gray-400">Manage your profile and preferences</p>
                </div>
            </div>

            <Tabs default-value="profile" class="space-y-6">
                <TabsList class="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="profile">Profile Data</TabsTrigger>
                    <TabsTrigger value="address-book">Address Book</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" class="space-y-6">
                    <ProfileSettings />
                </TabsContent>

                <TabsContent value="address-book" class="space-y-6">
                    <AddressBook />
                </TabsContent>
            </Tabs>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileSettings from '../components/ProfileSettings.vue'
import AddressBook from '../components/AddressBook.vue'
</script>
