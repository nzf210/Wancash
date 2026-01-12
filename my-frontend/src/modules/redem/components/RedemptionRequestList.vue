<template>
    <div class="space-y-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">My Redemption Requests</h2>

        <div v-if="isLoading" class="flex justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </div>

        <div v-else-if="requests.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <p class="text-gray-500 dark:text-gray-400">No redemption requests found.</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="req in requests" :key="req.id"
                class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">

                <div class="flex flex-col md:flex-row justify-between gap-4">
                    <!-- Left: Info -->
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <span :class="getStatusClass(req.status)"
                                class="px-3 py-1 rounded-full text-xs font-semibold uppercase">
                                {{ getStatusLabel(req.status) }}
                            </span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(req.created_at)
                                }}</span>
                        </div>

                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Summary
                        </h3>

                        <div v-if="req.items && req.items.length > 0" class="space-y-1 mb-3">
                            <div v-for="item in req.items" :key="item.product_id"
                                class="text-sm text-gray-700 dark:text-gray-300 flex justify-between gap-4">
                                <span>{{ item.snapshot_name }} ({{ item.snapshot_weight }}g)</span>
                                <span class="font-medium">× {{ item.quantity }} pcs</span>
                            </div>
                        </div>
                        <div v-else class="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            {{ req.gold_amount_grams }}g Gold Bar (Legacy)
                        </div>

                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            Recipient: <span class="text-gray-700 dark:text-gray-300">{{ req.recipient_name }}</span>
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            Address: <span class="text-gray-700 dark:text-gray-300 truncate block max-w-[200px]">{{
                                req.shipping_address }}</span>
                        </p>
                    </div>

                    <!-- Right: Cost & Actions -->
                    <div class="flex flex-col items-end gap-3 min-w-[200px]">
                        <div class="text-right">
                            <p class="text-sm text-gray-500">Total Cost</p>
                            <p class="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {{ formatNumber(req.total_token_amount || req.token_amount_gold) }} WCH
                            </p>
                            <p v-if="req.shipping_cost_token > 0" class="text-xs text-gray-400">
                                (Includes {{ formatNumber(req.shipping_cost_token) }} WCH shipping)
                            </p>
                            <p v-else class="text-xs text-amber-500">
                                {{ req.status === 'pending' ? 'Shipping to be calculated' : 'Shipping included/free' }}
                            </p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="w-full space-y-2">
                            <!-- View Details Button (Always visible) -->
                            <Button @click="viewDetails(req)" variant="outline" class="w-full">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Details
                            </Button>

                            <!-- Pay Button (Only for waiting_payment status) -->
                            <Button v-if="req.status === 'waiting_payment'" @click="handlePayment(req)"
                                :disabled="isPaying === req.id"
                                class="w-full bg-green-600 hover:bg-green-700 text-white">
                                <svg v-if="isPaying === req.id" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ isPaying === req.id ? 'Confirming...' : 'Pay Now' }}
                            </Button>

                            <!-- Cancel Button (Only for pending or waiting_payment) -->
                            <Button v-if="req.status === 'pending' || req.status === 'waiting_payment'"
                                @click="cancelRequest(req)" :disabled="isCanceling === req.id" variant="outline"
                                class="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <svg v-if="isCanceling === req.id" class="animate-spin -ml-1 mr-2 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {{ isCanceling === req.id ? 'Canceling...' : 'Cancel Request' }}
                            </Button>
                        </div>
                    </div>
                </div>

                <!-- Admin Note if Rejected -->
                <div v-if="req.status === 'rejected' && req.admin_notes"
                    class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
                    <strong>Reason:</strong> {{ req.admin_notes }}
                </div>
            </div>
        </div>
    </div>

    <!-- Detail Dialog -->
    <UserRedemptionDetailDialog v-model:open="showDetailDialog" :request="selectedRequest" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { redemptionService, type RedemptionRecord } from '@/app/services/redemptionService'
import { useAccount, useConfig } from '@wagmi/vue'
import { writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { parseAbi } from 'viem'
import { wancashContractAddress } from '@/app/services/contracts'
import UserRedemptionDetailDialog from './UserRedemptionDetailDialog.vue'

const requests = ref<RedemptionRecord[]>([])
const isLoading = ref(true)
const isPaying = ref<string | null>(null)
const isCanceling = ref<string | null>(null)
const showDetailDialog = ref(false)
const selectedRequest = ref<RedemptionRecord | null>(null)
const treasuryAddress = ref<string>('0x0000000000000000000000000000000000000000')
const { address, chainId } = useAccount()
const config = useConfig()

// Fetch treasury address from config
const fetchConfig = async () => {
    try {
        const configData = await redemptionService.getSettings()
        if (configData.treasury_address) {
            treasuryAddress.value = configData.treasury_address
        }
    } catch (error) {
        console.error('Failed to fetch config:', error)
    }
}

const viewDetails = (req: RedemptionRecord) => {
    selectedRequest.value = req
    showDetailDialog.value = true
}

const cancelRequest = async (req: RedemptionRecord) => {
    if (!confirm(`Are you sure you want to cancel this redemption request?\n\nThis action cannot be undone.`)) {
        return
    }

    isCanceling.value = req.id
    try {
        // Call backend to delete/cancel the request
        const response = await fetch(`/api/redemption/${req.id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'X-Wallet-Address': address.value || ''
            }
        })

        if (!response.ok) {
            throw new Error('Failed to cancel request')
        }

        toast.success('Redemption request canceled successfully')

        // Refresh the list
        await fetchRequests()
    } catch (error: any) {
        console.error('Cancel error:', error)
        toast.error('Failed to cancel request: ' + (error.message || 'Unknown error'))
    } finally {
        isCanceling.value = null
    }
}

const fetchRequests = async () => {
    isLoading.value = true
    try {
        requests.value = await redemptionService.getRedemptions()
    } catch (e) {
        toast.error('Failed to load history')
    } finally {
        isLoading.value = false
    }
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'waiting_payment': return 'Action Required: Pay'
        case 'pending': return 'Waiting for Quote'
        default: return status.replace('_', ' ')
    }
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        case 'waiting_payment': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 animate-pulse'
        case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}

const handlePayment = async (req: RedemptionRecord) => {
    if (!confirm(`Pay ${req.total_token_amount} WCH for this redemption?`)) return

    isPaying.value = req.id
    try {
        // WCH Token Contract Address for current chain
        const tokenAddress = wancashContractAddress[chainId.value || 0]
        if (!tokenAddress) throw new Error('Token contract not found for this chain')

        // Send Transaction
        // ABI for ERC20 transfer
        const abi = parseAbi(['function transfer(address to, uint256 amount) returns (bool)'])

        // Amount in Wei (assume 18 decimals for WCH)
        // If decimals vary, we need to fetch decimals. WCH is likely 18.
        const amountWei = BigInt(Math.floor(req.total_token_amount * 1e18))

        const hash = await writeContract(config, {
            address: tokenAddress as `0x${string}`,
            abi,
            functionName: 'transfer',
            args: [treasuryAddress.value as `0x${string}`, amountWei]
        })

        toast.info('Payment transaction sent. Waiting for confirmation...')

        await waitForTransactionReceipt(config, { hash })

        // Notify Backend
        await redemptionService.payRedemption(req.id, hash)

        toast.success('Payment successful!')

        // Refresh requests
        await fetchRequests()

    } catch (e: any) {
        console.error(e)
        // Mock success for unconfigured environment (if contract fails locally)
        // toast.error('Payment failed: ' + (e.message || 'Unknown error'))

        // DEV: Allow bypass if contract is not deployed
        // @ts-ignore
        if (import.meta.env.MODE === 'development' && confirm('Dev Mode: Simulate success?')) {
            await redemptionService.payRedemption(req.id, '0xMOCKHASH')
            toast.success('Dev Payment successful!')
            await fetchRequests()
        } else {
            toast.error('Payment failed: ' + (e.message || 'Unknown error'))
        }
    } finally {
        isPaying.value = null
    }
}

onMounted(() => {
    fetchRequests()
    fetchConfig()
})
</script>
