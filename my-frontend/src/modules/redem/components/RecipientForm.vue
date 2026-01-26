<template>
    <div class="mb-8">
        <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div class="p-6">
                <div class="flex items-center gap-2 mb-6">
                    <div
                        class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recipient Data</h3>
                </div>

                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Phone -->
                        <div class="space-y-2">
                            <Label for="phone" class="text-sm font-medium text-gray-900 dark:text-white">
                                Phone Number <span class="text-red-500">*</span>
                            </Label>
                            <div class="relative">
                                <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                <Input id="phone" :model-value="form.phone"
                                    @update:model-value="updateField('phone', String($event))"
                                    placeholder="081234567890"
                                    class="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
                                    required />
                            </div>
                        </div>

                        <!-- Telegram -->
                        <div class="space-y-2">
                            <Label for="telegram" class="text-sm font-medium text-gray-900 dark:text-white">Telegram
                                Username</Label>
                            <div class="relative">
                                <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.289-.6.289-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                                </svg>
                                <Input id="telegram" :model-value="form.telegram"
                                    @update:model-value="updateField('telegram', String($event))"
                                    placeholder="@username"
                                    class="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl" />
                            </div>
                        </div>

                        <!-- WhatsApp -->
                        <div class="space-y-2">
                            <Label for="whatsapp" class="text-sm font-medium text-gray-900 dark:text-white">WhatsApp
                                Number</Label>
                            <div class="relative">
                                <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.437 9.88-9.885 9.88" />
                                </svg>
                                <Input id="whatsapp" :model-value="form.whatsapp"
                                    @update:model-value="updateField('whatsapp', String($event))"
                                    placeholder="081234567890"
                                    class="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl" />
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">If not filled, we will use the phone
                                number for WhatsApp</p>
                        </div>
                    </div>

                    <!-- Name -->
                    <div class="space-y-2">
                        <Label for="name" class="text-sm font-medium text-gray-900 dark:text-white">
                            Recipient Full Name <span class="text-red-500">*</span>
                        </Label>
                        <div class="relative">
                            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clip-rule="evenodd" />
                            </svg>
                            <Input id="name" :model-value="form.name"
                                @update:model-value="updateField('name', String($event))"
                                placeholder="Full name according to ID card"
                                class="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
                                required />
                        </div>
                    </div>

                    <!-- Address -->
                    <div class="space-y-2">
                        <Label for="address-detail" class="text-sm font-medium text-gray-900 dark:text-white">
                            Complete Shipping Address <span class="text-red-500">*</span>
                        </Label>
                        <div class="relative">
                            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <Textarea id="address-detail" :model-value="form.address"
                                @update:model-value="updateField('address', String($event))"
                                placeholder="Complete address including postal code"
                                class="pl-10 min-h-[100px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
                                required />
                        </div>
                    </div>
                </div>

                <!-- Save to Profile Checkbox -->
                <div class="flex items-start space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Checkbox :model-value="saveToProfile"
                        @update:model-value="$emit('update:saveToProfile', $event as boolean)" id="save-to-profile"
                        class="mt-1 h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400" />
                    <div class="grid gap-1.5">
                        <Label for="save-to-profile"
                            class="text-sm font-medium leading-none cursor-pointer text-gray-900 dark:text-white">
                            Save contact info to profile
                        </Label>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Save this phone number and address for future redemptions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export interface RecipientFormData {
    phone: string
    telegram: string
    whatsapp: string
    name: string
    address: string
}

const props = defineProps<{
    form: RecipientFormData
    saveToProfile: boolean
}>()

const emit = defineEmits<{
    'update:form': [value: RecipientFormData]
    'update:saveToProfile': [value: boolean]
}>()

const updateField = (field: keyof RecipientFormData, value: string) => {
    emit('update:form', { ...props.form, [field]: value })
}
</script>
