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

                <!-- Wallet Info Section -->
                <div v-if="walletAddress"
                    class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <Label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Wallet Address for Receiving Token
                    </Label>
                    <div class="flex items-center gap-3">
                        <div v-if="chainInfo" class="flex-shrink-0" :title="chainInfo.name">
                            <img :src="chainInfo.icon" :alt="chainInfo.name"
                                class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 bg-white" />
                        </div>
                        <div
                            class="flex-grow font-mono text-sm bg-white dark:bg-gray-800 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 select-all">
                            {{ walletAddress }}
                        </div>
                        <div v-if="chainInfo"
                            class="text-xs font-semibold px-2 py-1 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
                            {{ chainInfo.name }}
                        </div>
                    </div>

                    <!-- Native Coin Balance Display -->
                    <div v-if="nativeBalance !== undefined" class="mt-3 flex items-center gap-2">
                        <div
                            class="w-6 h-6 rounded-md bg-gradient-to-r from-yellow-500 to-orange-400 flex items-center justify-center">
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472a4.265 4.265 0 01.264-.521z" />
                            </svg>
                        </div>
                        <span class="text-sm text-gray-600 dark:text-gray-400">Native Balance:</span>
                        <span class="font-semibold text-yellow-600 dark:text-yellow-400">
                            {{ formatNumber(nativeBalance) }} {{ nativeCurrencySymbol }}
                        </span>
                    </div>

                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        *Address is read-only based on your connected wallet
                    </p>
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
                    <Checkbox :model-value="useProfileData"
                        @update:model-value="$emit('update:useProfileData', $event as boolean)" id="use-profile-data"
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

export interface ChainInfo {
    name: string
    icon: string
}

defineProps<{
    profile: UserProfile | null
    useProfileData: boolean
    walletAddress?: string
    chainInfo?: ChainInfo
    nativeBalance?: number
    nativeCurrencySymbol?: string
}>()

defineEmits<{
    'update:useProfileData': [value: boolean]
}>()

const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
</script>
