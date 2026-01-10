<template>
    <Card
        class="card-glow border-2 border-purple-200 dark:border-blue-light transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl">
        <CardHeader>
            <CardTitle class="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Message to Support Team
            </CardTitle>
            <CardDescription class="text-gray-600 dark:text-gray-300">
                Fill out the form below and we will respond within 1 hour
            </CardDescription>
        </CardHeader>

        <CardContent>
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Token Info -->
                <div class="bg-blue-elevated rounded-lg p-4 mb-6">
                    <div class="flex items-center space-x-3">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                            {{ CONTACT_INFO.tokenSymbol }}
                        </div>
                        <div>
                            <div class="font-semibold text-white">{{ CONTACT_INFO.tokenName }} ({{
                                CONTACT_INFO.tokenSymbol }})</div>
                            <div class="text-sm text-blue-muted">Current Price: ${{ store.currentPrice.toLocaleString()
                                }}</div>
                        </div>
                    </div>
                </div>

                <!-- Contact Type -->
                <div class="space-y-2">
                    <Label class="text-gray-700 dark:text-gray-300 font-medium" for="type">Issue Type</Label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button v-for="type in CONTACT_TYPES" :key="type.id" type="button"
                            @click="store.selectedType = type.id" :class="[
                                'p-4 rounded-lg border-2 transition-all duration-200',
                                store.selectedType === type.id
                                    ? 'border-purple-500 bg-purple-50 dark:bg-blue-900/30 dark:border-blue-500'
                                    : 'border-gray-200 dark:border-blue-light hover:border-purple-300 dark:hover:border-blue-400'
                            ]">
                            <div class="flex items-center">
                                <div :class="[
                                    'w-8 h-8 rounded-full mr-3 flex items-center justify-center',
                                    store.selectedType === type.id
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 dark:bg-blue-800 text-gray-600 dark:text-gray-300'
                                ]">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" :d="type.icon" />
                                    </svg>
                                </div>
                                <div class="text-left">
                                    <div class="font-medium text-gray-800 dark:text-white">{{ type.name }}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ type.desc }}</div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Form Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <Label for="name" class="text-gray-700 dark:text-gray-300">Full Name</Label>
                        <Input id="name" v-model="store.form.name" placeholder="Enter your name"
                            class="dark:bg-blue-elevated dark:border-blue-light dark:text-white" required />
                    </div>

                    <div class="space-y-2">
                        <Label for="email" class="text-gray-700 dark:text-gray-300">Email</Label>
                        <Input id="email" v-model="store.form.email" type="email" placeholder="name@email.com"
                            class="dark:bg-blue-elevated dark:border-blue-light dark:text-white" required />
                    </div>
                </div>

                <div class="space-y-2">
                    <Label for="wallet" class="text-gray-700 dark:text-gray-300">Wallet Address</Label>
                    <Input id="wallet" v-model="store.form.wallet" placeholder="0x..."
                        class="font-mono dark:bg-blue-elevated dark:border-blue-light dark:text-white" />
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        *Optional, only required for technical issues related to transactions
                    </p>
                </div>

                <div class="space-y-2">
                    <Label for="subject" class="text-gray-700 dark:text-gray-300">Subject</Label>
                    <Input id="subject" v-model="store.form.subject"
                        placeholder="e.g., Staking Issue, Token Question, etc."
                        class="dark:bg-blue-elevated dark:border-blue-light dark:text-white" required />
                </div>

                <div class="space-y-2">
                    <Label for="message" class="text-gray-700 dark:text-gray-300">Issue Details</Label>
                    <textarea id="message" v-model="store.form.message" rows="6"
                        placeholder="Describe your issue or question in detail..."
                        class="w-full rounded-lg border-2 border-gray-200 dark:border-blue-light bg-white dark:bg-blue-elevated text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-blue-500 focus:border-transparent transition-all"
                        required></textarea>
                </div>

                <div class="flex items-center space-x-2">
                    <Checkbox id="urgent" v-model:checked="store.form.urgent"
                        class="border-gray-300 dark:border-blue-light" />
                    <Label for="urgent" class="text-gray-700 dark:text-gray-300 text-sm cursor-pointer">
                        Mark as urgent (high priority)
                    </Label>
                </div>

                <!-- Attachments -->
                <div class="space-y-2">
                    <Label class="text-gray-700 dark:text-gray-300" for="file-upload">Attachments (Optional)</Label>
                    <div
                        class="border-2 border-dashed border-gray-300 dark:border-blue-light rounded-lg p-6 text-center">
                        <input type="file" @change="handleFileUpload" class="hidden" id="file-upload" multiple />
                        <label for="file-upload" class="cursor-pointer">
                            <svg class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p class="text-gray-600 dark:text-gray-400">Click to upload screenshots or documents</p>
                            <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Max. 5MB per file</p>
                        </label>
                    </div>

                    <div v-if="store.attachments.length > 0" class="mt-4">
                        <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Attached files:</div>
                        <div class="space-y-2">
                            <div v-for="(file, index) in store.attachments" :key="index"
                                class="flex items-center justify-between bg-gray-50 dark:bg-blue-800/50 rounded-lg p-3">
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span class="text-gray-700 dark:text-gray-300 truncate max-w-xs">{{ file.name
                                        }}</span>
                                </div>
                                <button @click="store.removeAttachment(index)" type="button"
                                    class="text-red-500 hover:text-red-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <Button type="submit" :disabled="store.loading"
                    class="w-full btn-blue-gradient py-6 text-lg font-semibold">
                    <span v-if="!store.loading">Send Message</span>
                    <span v-else class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending...
                    </span>
                </Button>
            </form>
        </CardContent>
    </Card>
</template>

<script lang="ts" setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useContactStore } from '../store/contactStore'
import { CONTACT_TYPES, CONTACT_INFO } from '../constants/contactData'

const store = useContactStore()

const handleFileUpload = (event: Event) => {
    const files = (event.target as HTMLInputElement).files
    if (files) {
        for (const file of Array.from(files)) {
            const success = store.addAttachment(file)
            if (!success) {
                alert(`File ${file.name} exceeds the maximum size of 5MB`)
            }
        }
    }
}

const handleSubmit = async () => {
    const result = await store.submitForm()
    alert(result.message)
}
</script>

<style scoped>
.card-glow {
    box-shadow:
        0 0 0 1px oklch(0.75 0.18 240 / 0.15),
        0 4px 6px -1px oklch(0.22 0.03 240 / 0.15),
        0 2px 4px -1px oklch(0.22 0.03 240 / 0.1);
}

.btn-blue-gradient {
    background: linear-gradient(135deg,
            oklch(0.75 0.18 240) 0%,
            oklch(0.7 0.22 235) 100%);
    color: white;
}

.btn-blue-gradient:hover {
    background: linear-gradient(135deg,
            oklch(0.8 0.18 240) 0%,
            oklch(0.75 0.22 235) 100%);
}

.bg-blue-elevated {
    background-color: oklch(0.28 0.03 240);
}

.text-blue-muted {
    color: oklch(0.78 0.05 240);
}

.border-blue-light {
    border-color: oklch(0.36 0.04 240);
}
</style>
