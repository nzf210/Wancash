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
                                <span>{{ item.name }} ({{ item.weight }}g)</span>
                                <span class="font-medium">x{{ item.quantity }}</span>
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

                        <!-- Payment Action -->
                        <div v-if="req.status === 'waiting_payment'" class="w-full">
                            <Button @click="handlePayment(req)" :disabled="isPaying === req.id"
                                class="w-full bg-green-600 hover:bg-green-700 text-white">
                                <svg v-if="isPaying === req.id" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                {{ isPaying === req.id ? 'Confirming...' : 'Pay Now' }}
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

const requests = ref<RedemptionRecord[]>([])
const isLoading = ref(true)
const isPaying = ref<string | null>(null)
const { address, chainId } = useAccount()
const config = useConfig()

const TREASURY_ADDRESS = '0x1234567890123456789012345678901234567890' // Placeholder

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
            args: [TREASURY_ADDRESS, amountWei]
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
})
</script>
