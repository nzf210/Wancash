<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Redemption Request Details</DialogTitle>
                <DialogDescription>
                    Request ID: {{ request?.id?.substring(0, 16) }}...
                </DialogDescription>
            </DialogHeader>

            <div v-if="request" class="space-y-6">
                <!-- Status Badge -->
                <div class="flex items-center justify-between">
                    <span :class="getStatusClass(request.status)" class="px-4 py-2 rounded-full text-sm font-semibold">
                        {{ getStatusLabel(request.status) }}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        {{ formatDate(request.created_at) }}
                    </span>
                </div>

                <!-- Recipient Information -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Recipient Information</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-500 dark:text-gray-400">Name</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ request.recipient_name }}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 dark:text-gray-400">Phone</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ request.phone_number }}</p>
                        </div>
                        <div v-if="request.whatsapp_number">
                            <p class="text-gray-500 dark:text-gray-400">WhatsApp</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ request.whatsapp_number }}</p>
                        </div>
                        <div v-if="request.telegram_username">
                            <p class="text-gray-500 dark:text-gray-400">Telegram</p>
                            <p class="font-medium text-gray-900 dark:text-white">@{{ request.telegram_username }}</p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-gray-500 dark:text-gray-400">Shipping Address</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ request.shipping_address }}</p>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Order Items</h3>
                    <div v-if="request.items && request.items.length > 0" class="space-y-2">
                        <div v-for="(item, index) in request.items" :key="index"
                            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div class="flex items-center gap-3">
                                <div v-if="item.snapshot_weight > 0"
                                    class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center text-white font-bold text-xs">
                                    {{ item.snapshot_weight }}g
                                </div>
                                <div v-else
                                    class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-lg">
                                    💾
                                </div>
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">{{ item.snapshot_name }}</p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">
                                        <span v-if="item.snapshot_weight > 0">{{ item.snapshot_weight }}g × </span>
                                        {{ item.quantity }} pcs
                                    </p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold text-gray-900 dark:text-white">{{
                                    formatNumber(item.snapshot_price * item.quantity) }} WCH</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">@ {{
                                    formatNumber(item.snapshot_price) }} WCH</p>
                            </div>
                        </div>
                    </div>
                    <div v-else class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p class="text-gray-700 dark:text-gray-300">
                            <span v-if="request.gold_amount_grams > 0">{{ request.gold_amount_grams }}g </span>
                            Gold (Legacy format)
                        </p>
                    </div>
                </div>

                <!-- Pricing Summary -->
                <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 dark:text-gray-400">Gold Total</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{
                                formatNumber(request.token_amount_gold) }} WCH</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600 dark:text-gray-400">Shipping Cost</span>
                            <span class="font-medium text-gray-900 dark:text-white">
                                {{ request.shipping_cost_token > 0 ? formatNumber(request.shipping_cost_token) + ' WCH'
                                    : 'To be calculated' }}
                            </span>
                        </div>
                        <div
                            class="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span class="text-gray-900 dark:text-white">Total Amount</span>
                            <span class="text-blue-600 dark:text-blue-400">{{ formatNumber(request.total_token_amount)
                            }} WCH</span>
                        </div>
                    </div>
                </div>

                <!-- Tracking Info (if shipped) -->
                <div v-if="request.tracking_number" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Tracking Information</h3>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        Tracking Number: <span class="font-mono font-semibold">{{ request.tracking_number }}</span>
                    </p>
                </div>

                <!-- Transaction Hash (if paid) -->
                <div v-if="request.transaction_hash" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Payment Transaction</h3>
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                        <p
                            class="text-sm text-gray-700 dark:text-gray-300 font-mono break-all line-clamp-2 sm:line-clamp-none">
                            {{ request.transaction_hash }}
                        </p>
                        <div class="flex items-center gap-2 mt-2 sm:mt-0 min-w-fit">
                            <span
                                class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                                {{ getChainName(request.chain_id) }}
                            </span>
                            <a :href="getChainExplorerUrl(request.chain_id, request.transaction_hash)" target="_blank"
                                class="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs whitespace-nowrap">
                                View on Explorer ↗
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Admin Notes (if any) -->
                <div v-if="request.admin_notes" :class="[
                    'rounded-lg p-4',
                    request.status === 'rejected'
                        ? 'bg-red-50 dark:bg-red-900/20'
                        : 'bg-blue-50 dark:bg-blue-900/20'
                ]">
                    <h3 :class="[
                        'font-semibold mb-2',
                        request.status === 'rejected'
                            ? 'text-red-800 dark:text-red-300'
                            : 'text-blue-800 dark:text-blue-300'
                    ]">
                        {{ request.status === 'rejected' ? 'Rejection Reason' : 'Admin Notes' }}
                    </h3>
                    <p :class="[
                        'text-sm',
                        request.status === 'rejected'
                            ? 'text-red-700 dark:text-red-400'
                            : 'text-blue-700 dark:text-blue-400'
                    ]">
                        {{ request.admin_notes }}
                    </p>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" @click="$emit('update:open', false)">
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { RedemptionRecord } from '@/app/services/redemptionService'
import { getChainExplorerUrl, getChainName } from '@/app/composables/useChain'

defineProps<{
    open: boolean
    request: RedemptionRecord | null
}>()

defineEmits<{
    'update:open': [value: boolean]
}>()

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'waiting_payment': return 'Waiting for Payment'
        case 'pending': return 'Pending Admin Review'
        case 'processing': return 'Processing'
        case 'shipped': return 'Shipped'
        case 'completed': return 'Completed'
        case 'rejected': return 'Rejected'
        default: return status
    }
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
        case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        case 'waiting_payment': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
        case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}
</script>
