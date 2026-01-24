<template>
    <div>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.total_requests }}
                        </p>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                        <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{{
                            stats.pending_requests }}</p>
                    </div>
                    <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Waiting Payment</p>
                        <p class="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{{
                            stats.waiting_payment }}</p>
                    </div>
                    <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Processing</p>
                        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{{ stats.processing
                            }}</p>
                    </div>
                    <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Shipped</p>
                        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ stats.shipped }}</p>
                    </div>
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                        <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{{ stats.completed }}
                        </p>
                    </div>
                    <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select v-model="filters.status"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                        <option value="" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">All Status
                        </option>
                        <option value="pending" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Pending
                        </option>
                        <option value="waiting_payment" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            Waiting Payment</option>
                        <option value="processing" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            Processing</option>
                        <option value="shipped" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Shipped
                        </option>
                        <option value="completed" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            Completed</option>
                        <option value="rejected" class="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            Rejected</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Wallet
                        Address</label>
                    <input v-model="filters.wallet_address" type="text" placeholder="Search by wallet..."
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start
                        Date</label>
                    <input v-model="filters.start_date" type="date"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                    <input v-model="filters.end_date" type="date"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>

            <div class="mt-4 flex gap-3">
                <button @click="applyFilters"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Filters
                </button>
                <button @click="resetFilters"
                    class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Reset
                </button>
            </div>
        </div>

        <!-- Requests Table -->
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Request ID</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                User</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Items</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Amount</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date</th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="request in requests" :key="request.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-mono text-gray-900 dark:text-white">{{
                                    request.id.substring(0, 8) }}...</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white">{{ request.recipient_name }}
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{
                                    request.wallet_address.substring(0, 10) }}...</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-900 dark:text-white">{{ request.gold_amount_grams }}g
                                </div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">{{ request.items?.length ||
                                    0 }} items</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-semibold text-gray-900 dark:text-white">{{
                                    formatNumber(request.total_token_amount) }} WCH</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusClass(request.status)">{{ request.status }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(request.created_at)
                                    }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <button @click="viewRequest(request)"
                                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                                    View Details
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="requests.length === 0" class="p-12 text-center">
                <div class="text-gray-400 dark:text-gray-600 mb-2">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p class="text-gray-500 dark:text-gray-400">No redemption requests found</p>
            </div>
        </div>

        <!-- Request Detail Dialog -->
        <RedemptionDetailDialog v-model:open="showDetailDialog" :request="selectedRequest"
            @updated="handleRequestUpdated" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { adminApi } from '../services/adminApi'
import type { AdminRedemptionRequest, DashboardStats } from '../types/admin.types'
import RedemptionDetailDialog from '../components/RedemptionDetailDialog.vue'

const requests = ref<AdminRedemptionRequest[]>([])
const stats = ref<DashboardStats>({
    total_requests: 0,
    pending_requests: 0,
    waiting_payment: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
    total_revenue: 0
})

const showDetailDialog = ref(false)
const selectedRequest = ref<AdminRedemptionRequest | null>(null)

const filters = ref({
    status: '',
    wallet_address: '',
    start_date: '',
    end_date: ''
})

const fetchRequests = async () => {
    try {
        requests.value = await adminApi.getAllRequests(filters.value)
    } catch (error) {
        console.error('Failed to fetch requests:', error)
        toast.error('Failed to load redemption requests')
    }
}

const fetchStats = async () => {
    try {
        stats.value = await adminApi.getStats()
    } catch (error) {
        console.error('Failed to fetch stats:', error)
    }
}

const applyFilters = () => {
    fetchRequests()
}

const resetFilters = () => {
    filters.value = {
        status: '',
        wallet_address: '',
        start_date: '',
        end_date: ''
    }
    fetchRequests()
}

const viewRequest = (request: AdminRedemptionRequest) => {
    selectedRequest.value = request
    showDetailDialog.value = true
}

const handleRequestUpdated = () => {
    // Refresh requests and stats after update
    fetchRequests()
    fetchStats()
}

const getStatusClass = (status: string) => {
    const classes = 'px-3 py-1 text-xs font-semibold rounded-full '
    switch (status) {
        case 'pending':
            return classes + 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300'
        case 'waiting_payment':
            return classes + 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300'
        case 'processing':
            return classes + 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300'
        case 'shipped':
            return classes + 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'
        case 'completed':
            return classes + 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300'
        case 'rejected':
            return classes + 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'
        default:
            return classes + 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300'
    }
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

onMounted(() => {
    fetchRequests()
    fetchStats()
})
</script>
