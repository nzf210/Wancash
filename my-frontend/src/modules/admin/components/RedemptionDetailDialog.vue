<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Redemption Request Details</DialogTitle>
                <DialogDescription>
                    Request ID: {{ request?.id?.substring(0, 16) }}...
                </DialogDescription>
            </DialogHeader>

            <div v-if="request" class="space-y-6">
                <!-- Customer Information -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-500 dark:text-gray-400">Name</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ request.recipient_name }}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 dark:text-gray-400">Phone</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ request.phone_number }}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 dark:text-gray-400">Wallet Address</p>
                            <p class="font-mono text-xs text-gray-900 dark:text-white">{{ request.wallet_address }}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 dark:text-gray-400">WhatsApp</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ request.whatsapp_number || '-' }}
                            </p>
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
                    <div class="space-y-2">
                        <div v-for="(item, index) in request.items" :key="index"
                            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center text-white font-bold text-xs">
                                    {{ item.snapshot_weight }}g
                                </div>
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">{{ item.snapshot_name }}</p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.snapshot_weight }}g × {{
                                        item.quantity }}</p>
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
                            <span class="text-gray-600 dark:text-gray-400">Total Weight</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{ request.gold_amount_grams
                            }}g</span>
                        </div>

                        <!-- Shipping Cost Editor -->
                        <div
                            class="flex justify-between items-center text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <span class="text-gray-600 dark:text-gray-400">Shipping Cost</span>
                            <div class="flex items-center gap-2">
                                <input v-if="editingShipping" v-model.number="editedShippingCost" type="number"
                                    step="0.01"
                                    class="w-24 px-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                                <span v-else class="font-medium text-gray-900 dark:text-white">
                                    {{ formatNumber(request.shipping_cost_token) }} WCH
                                </span>
                                <button v-if="!editingShipping" @click="startEditShipping"
                                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs font-medium">
                                    Edit
                                </button>
                                <div v-else class="flex gap-1">
                                    <button @click="saveShippingCost"
                                        class="text-green-600 hover:text-green-700 dark:text-green-400 text-xs font-medium">
                                        Save
                                    </button>
                                    <button @click="cancelEditShipping"
                                        class="text-gray-600 hover:text-gray-700 dark:text-gray-400 text-xs font-medium">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            class="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span class="text-gray-900 dark:text-white">Total Amount</span>
                            <span class="text-blue-600 dark:text-blue-400">{{ formatNumber(request.total_token_amount)
                            }} WCH</span>
                        </div>
                    </div>
                </div>

                <!-- Status & Tracking -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Status & Tracking</h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-500 dark:text-gray-400">Status</p>
                            <span :class="getStatusClass(request.status)">{{ request.status }}</span>
                        </div>
                        <div>
                            <p class="text-gray-500 dark:text-gray-400">Tracking Number</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ request.tracking_number || '-' }}
                            </p>
                        </div>
                        <div v-if="request.transaction_hash" class="col-span-2">
                            <p class="text-gray-500 dark:text-gray-400 mb-1">Payment Transaction</p>
                            <div class="flex items-center gap-2">
                                <p class="font-mono text-xs text-gray-900 dark:text-white break-all">
                                    {{ request.transaction_hash }}
                                </p>
                                <a :href="`https://sepolia.etherscan.io/tx/${request.transaction_hash}`" target="_blank"
                                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-xs whitespace-nowrap">
                                    Explorer ↗
                                </a>
                            </div>
                        </div>
                        <div class="col-span-2">
                            <p class="text-gray-500 dark:text-gray-400">Admin Notes</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ request.admin_notes || '-' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Dates -->
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Created At</p>
                        <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(request.created_at) }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500 dark:text-gray-400">Updated At</p>
                        <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(request.updated_at ||
                            request.created_at) }}</p>
                    </div>
                </div>
                <!-- Update Status Section -->
                <div v-if="canUpdateStatus" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Update Status</h3>

                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New
                                Status</label>
                            <select v-model="newStatus"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                <option value="">Select status...</option>
                                <option v-for="status in allowedNextStatuses" :key="status.value" :value="status.value">
                                    {{ status.label }}
                                </option>
                            </select>
                        </div>

                        <div v-if="newStatus === 'shipped'">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tracking
                                Number</label>
                            <input v-model="trackingNumber" type="text"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Enter tracking number" />
                        </div>

                        <div v-if="newStatus === 'rejected' || newStatus">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Notes
                                <span v-if="newStatus === 'rejected'" class="text-red-500">*</span>
                            </label>
                            <textarea v-model="adminNotes" rows="3"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                :placeholder="newStatus === 'rejected' ? 'Required: Reason for rejection' : 'Optional notes for this status change'"></textarea>
                        </div>

                        <Button @click="updateStatus"
                            :disabled="!newStatus || isUpdating || (newStatus === 'rejected' && !adminNotes)"
                            class="w-full">
                            {{ isUpdating ? 'Updating...' : 'Update Status' }}
                        </Button>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" @click="$emit('update:open', false)">
                    Close
                </Button>
                <Button @click="updateStatus"
                    :disabled="!canUpdateStatus || !newStatus || isUpdating || (newStatus === 'rejected' && !adminNotes)"
                    class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ isUpdating ? 'Updating...' : 'Update Status' }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { adminApi } from '../services/adminApi'
import type { AdminRedemptionRequest } from '../types/admin.types'

const props = defineProps<{
    open: boolean
    request: AdminRedemptionRequest | null
}>()

const emit = defineEmits<{
    'update:open': [value: boolean]
    'updated': []
}>()

const editingShipping = ref(false)
const editedShippingCost = ref(0)
const newStatus = ref('')
const trackingNumber = ref('')
const adminNotes = ref('')
const isUpdating = ref(false)

const canUpdateStatus = computed(() => {
    // Can update status if shipping cost has been set (> 0)
    return props.request && props.request.shipping_cost_token > 0
})

// Define allowed status transitions based on current status
const allowedNextStatuses = computed(() => {
    if (!props.request) return []

    const currentStatus = props.request.status

    // Status workflow:
    // pending → waiting_payment (after shipping cost set)
    // waiting_payment → processing (after payment) OR rejected
    // processing → shipped OR rejected
    // shipped → completed
    // rejected/completed → (final states, no transitions)

    const transitions: Record<string, { value: string; label: string }[]> = {
        'pending': [
            { value: 'waiting_payment', label: 'Waiting Payment' },
            { value: 'rejected', label: 'Rejected' }
        ],
        'waiting_payment': [
            { value: 'processing', label: 'Processing' },
            { value: 'rejected', label: 'Rejected' }
        ],
        'processing': [
            { value: 'shipped', label: 'Shipped' },
            { value: 'rejected', label: 'Rejected' }
        ],
        'shipped': [
            { value: 'completed', label: 'Completed' }
        ],
        'completed': [],
        'rejected': []
    }

    return transitions[currentStatus] || []
})

const startEditShipping = () => {
    if (props.request) {
        editedShippingCost.value = props.request.shipping_cost_token
        editingShipping.value = true
    }
}

const cancelEditShipping = () => {
    editingShipping.value = false
    editedShippingCost.value = 0
}

const saveShippingCost = async () => {
    if (!props.request) return

    try {
        const updatedRequest = await adminApi.updateRequestStatus(props.request.id, {
            status: props.request.status,
            shipping_cost_token: editedShippingCost.value
        })

        toast.success('Shipping cost updated successfully')
        editingShipping.value = false

        // Update local request data with fresh data from backend
        Object.assign(props.request, updatedRequest)

        emit('updated')
    } catch (error) {
        console.error('Failed to update shipping cost:', error)
        toast.error('Failed to update shipping cost')
    }
}

const updateStatus = async () => {
    if (!props.request || !newStatus.value) return

    // Validate required fields
    if (newStatus.value === 'rejected' && !adminNotes.value) {
        toast.error('Admin notes are required for rejection')
        return
    }

    isUpdating.value = true
    try {
        const updateData: any = {
            status: newStatus.value
        }

        // Add tracking number if status is shipped
        if (newStatus.value === 'shipped' && trackingNumber.value) {
            updateData.tracking_number = trackingNumber.value
        }

        // Add admin notes if provided (required for rejected, optional for others)
        if (adminNotes.value) {
            updateData.admin_notes = adminNotes.value
        }

        const updatedRequest = await adminApi.updateRequestStatus(props.request.id, updateData)

        toast.success(`Status updated to ${newStatus.value}`)

        // Update local request data with fresh data from backend
        Object.assign(props.request, updatedRequest)

        // Reset form
        newStatus.value = ''
        trackingNumber.value = ''
        adminNotes.value = ''

        emit('updated')
    } catch (error) {
        console.error('Failed to update status:', error)
        toast.error('Failed to update status')
    } finally {
        isUpdating.value = false
    }
}

const getStatusClass = (status: string) => {
    const classes = 'px-3 py-1 text-xs font-semibold rounded-full inline-block '
    switch (status) {
        case 'pending':
            return classes + 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        case 'waiting_payment':
            return classes + 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        case 'processing':
            return classes + 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        case 'shipped':
            return classes + 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        case 'completed':
            return classes + 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        case 'rejected':
            return classes + 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        default:
            return classes + 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Reset editing state when dialog closes
watch(() => props.open, (newVal) => {
    if (!newVal) {
        editingShipping.value = false
        editedShippingCost.value = 0
        newStatus.value = ''
        trackingNumber.value = ''
        adminNotes.value = ''
    }
})
</script>
```
