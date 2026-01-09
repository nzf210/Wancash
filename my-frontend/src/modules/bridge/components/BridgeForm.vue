<template>
    <div class="p-8">
        <div class="grid lg:grid-cols-2 gap-8">
            <!-- From Section -->
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">From</h3>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        Balance: <span class="font-semibold text-gray-900 dark:text-white">{{ formattedBalance }} {{
                            fromToken?.symbol }}</span>
                    </div>
                </div>

                <!-- Chain Selection -->
                <div ref="fromChainDropdownRef" class="relative group">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Network</label>
                    <div @click="toggleFromChains($event)"
                        class="relative cursor-pointer p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div
                                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                    <ChainIcon :chain="fromChain" class="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div class="font-semibold text-gray-900 dark:text-white">{{ fromChain?.name ||
                                        'Select Chain' }}
                                    </div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ fromChain?.type ||
                                        'Network' }}</div>
                                </div>
                            </div>
                            <ChevronDownIcon class="w-5 h-5 text-gray-400 transition-transform duration-300"
                                :class="{ 'rotate-180': showFromChains }" />
                        </div>
                    </div>

                    <!-- Chain Dropdown -->
                    <Transition name="slide-down">
                        <div v-if="showFromChains"
                            class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                            <div class="max-h-64 overflow-y-auto">
                                <div v-for="chain in filteredSourceChains" :key="chain.id"
                                    @click="selectFromChain(chain, $event)"
                                    class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                    <div
                                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                        <ChainIcon :chain="chain" class="w-5 h-5 text-white" />
                                    </div>
                                    <div class="flex-1">
                                        <div class="font-medium text-gray-900 dark:text-white">{{ chain.name }}</div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ chain.type }}</div>
                                    </div>
                                    <div v-if="chain.fee" class="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {{ chain.fee }}%
                                    </div>
                                </div>
                                <div v-if="filteredSourceChains.length === 0"
                                    class="p-4 text-center text-gray-500 dark:text-gray-400">
                                    No available chains
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- Token Selection -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Token</label>
                    <div
                        class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center space-x-3">
                                <div
                                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <TokenIcon :token="fromToken" class="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div class="font-semibold text-gray-900 dark:text-white">{{ fromToken?.name ||
                                        'Select Token' }}
                                    </div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ fromToken?.symbol || '' }}
                                    </div>
                                </div>
                            </div>
                            <select :value="fromToken?.symbol"
                                class="bg-transparent border-none focus:ring-0 text-right font-medium text-gray-900 dark:text-white"
                                @change="onFromTokenChange">
                                <option :value="null" disabled
                                    class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Select Token
                                </option>
                                <option v-for="token in availableTokens" :key="token.address" :value="token.symbol"
                                    class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                    {{ token.symbol }}
                                </option>
                            </select>
                        </div>
                        <div class="flex space-x-2 mb-3">
                            <button v-for="percent in [25, 50, 75, 100]" :key="percent"
                                @click="setAmountPercentage(percent)"
                                class="flex-1 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors">
                                {{ percent }}%
                            </button>
                        </div>
                        <div class="relative">
                            <input v-model="amountModel" type="number" placeholder="0.00" step="0.0001" min="0"
                                class="w-full p-3 text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500 outline-none" />
                            <div class="absolute right-0 top-0 bottom-0 flex items-center pr-3">
                                <span class="text-gray-500 dark:text-gray-400">{{ fromToken?.symbol || '' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- To Section -->
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">To</h3>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        Estimated: <span class="font-semibold text-gray-900 dark:text-white">{{
                            formatNumber(estimatedAmount) }} {{
                                toToken?.symbol }}</span>
                    </div>
                </div>

                <!-- Chain Selection -->
                <div ref="toChainDropdownRef" class="relative group">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination
                        Network</label>
                    <div @click="toggleToChains($event)"
                        class="relative cursor-pointer p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 dark:hover:border-green-500 transition-all duration-300">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div
                                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                                    <ChainIcon :chain="toChain" class="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div class="font-semibold text-gray-900 dark:text-white">{{ toChain?.name ||
                                        'SelectChain' }}
                                    </div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ toChain?.type || 'Network'
                                    }}</div>
                                </div>
                            </div>
                            <ChevronDownIcon class="w-5 h-5 text-gray-400 transition-transform duration-300"
                                :class="{ 'rotate-180': showToChains }" />
                        </div>
                    </div>

                    <!-- Chain Dropdown -->
                    <Transition name="slide-down">
                        <div v-if="showToChains"
                            class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                            <div class="max-h-64 overflow-y-auto">
                                <div v-for="chain in filteredDestChains" :key="chain.id"
                                    @click="selectToChain(chain, $event)"
                                    class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                    <div
                                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                                        <ChainIcon :chain="chain" class="w-5 h-5 text-white" />
                                    </div>
                                    <div class="flex-1">
                                        <div class="font-medium text-gray-900 dark:text-white">{{ chain.name }}</div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ chain.type }}</div>
                                    </div>
                                    <div v-if="chain.fee" class="text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {{ chain.fee }}%
                                    </div>
                                </div>
                                <div v-if="filteredDestChains.length === 0"
                                    class="p-4 text-center text-gray-500 dark:text-gray-400">
                                    No available chains
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- Receiving Token -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Receive</label>
                    <div
                        class="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-green-100 dark:border-green-900/50">
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center space-x-3">
                                <div
                                    class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                                    <TokenIcon :token="toToken" class="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div class="font-semibold text-gray-900 dark:text-white">{{ toToken?.name ||
                                        'SelectToken' }}
                                    </div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ toToken?.symbol || '' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {{ formatNumber(estimatedAmount) || '0.00' }}
                            </div>
                            <div class="text-gray-500 dark:text-gray-400">{{ toToken?.symbol || '' }}</div>
                        </div>
                    </div>
                </div>

                <!-- Bridge Details -->
                <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                        <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <RocketIcon class="w-4 h-4" />
                            <span>Bridge Fee</span>
                        </div>
                        <span class="font-medium text-gray-900 dark:text-white">{{ bridgeFee }} {{ fromToken?.symbol ||
                            ''
                            }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                        <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <TimerIcon class="w-4 h-4" />
                            <span>Estimated Time</span>
                        </div>
                        <span class="font-medium text-gray-900 dark:text-white">{{ timeEstimate }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                        <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <MinusCircledIcon class="w-4 h-4" />
                            <span>Minimum Amount</span>
                        </div>
                        <span class="font-medium text-gray-900 dark:text-white">{{ formatNumber(21000) }} {{
                            fromToken?.symbol || ''
                            }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bridge Button -->
        <div class="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
            <button @click="initiateBridge" :disabled="!canBridge || loading" :class="[
                'w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]',
                canBridge && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            ]">
                <div class="flex items-center justify-center space-x-3">
                    <div v-if="loading" class="animate-spin">
                        <LoopIcon class="w-5 h-5" />
                    </div>
                    <ArrowRightIcon v-else class="w-5 h-5" />
                    <span>{{ loading ? 'Processing Bridge...' : 'Bridge Tokens' }}</span>
                </div>
            </button>

            <div v-if="canBridge" class="mt-4 text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    You will receive approximately
                    <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(estimatedAmount) }} {{
                        toToken?.symbol
                        }}</span>
                    on {{ toChain?.name }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useBridgeStore } from '@/modules/bridge/store/bridgeStore'
import { useBridgeBalance } from '@/modules/bridge/composables/useBridgeBalance'
import type { Chain } from '@/modules/bridge/types/bridge.types'

import {
    ChevronDownIcon,
    RocketIcon,
    TimerIcon,
    MinusCircledIcon,
    LoopIcon,
    ArrowRightIcon
} from '@radix-icons/vue'
import ChainIcon from './ChainIcon.vue'
import TokenIcon from './TokenIcon.vue'

// Store
const bridgeStore = useBridgeStore()

// State (use storeToRefs for reactive state only)
const {
    fromChain,
    toChain,
    fromToken,
    toToken,
    amount,
    bridgeFee,
    estimatedAmount,
    isLoading: loading,
    availableTokens
} = storeToRefs(bridgeStore)

// Getters (accessed directly on store, they're already computed)
const canBridge = computed(() => bridgeStore.canBridge)
const filteredSourceChains = computed(() => bridgeStore.filteredSourceChains)
const filteredDestChains = computed(() => bridgeStore.filteredDestChains)

// Actions (direct destructuring from store)
const { setFromChain, setToChain, setFromToken, setAmount, initiateBridge: bridgeAction } = bridgeStore

// Balance composable with reactive updates
const { walletBalance, formattedBalance, balanceLoading, balanceError, refreshBalance } = useBridgeBalance(
    () => fromChain.value?.id,
    () => fromToken.value
)

// Local state for UI
const showFromChains = ref(false)
const showToChains = ref(false)
const fromChainDropdownRef = ref<HTMLElement | null>(null)
const toChainDropdownRef = ref<HTMLElement | null>(null)

// Two-way binding helper for amount
const amountModel = computed({
    get: () => amount.value,
    set: (val) => bridgeStore.setAmount(val ? val.toString() : '')
})

// Click outside
onClickOutside(fromChainDropdownRef, () => showFromChains.value = false)
onClickOutside(toChainDropdownRef, () => showToChains.value = false)

// Methods
const toggleFromChains = (e: MouseEvent) => {
    e.stopPropagation()
    showFromChains.value = !showFromChains.value
    if (showFromChains.value) showToChains.value = false
}

const toggleToChains = (e: MouseEvent) => {
    e.stopPropagation()
    showToChains.value = !showToChains.value
    if (showToChains.value) showFromChains.value = false
}

const selectFromChain = (chain: Chain, e: MouseEvent) => {
    e.stopPropagation()
    bridgeStore.setFromChain(chain)
    showFromChains.value = false
}

const selectToChain = (chain: Chain, e: MouseEvent) => {
    e.stopPropagation()
    bridgeStore.setToChain(chain)
    showToChains.value = false
}

const onFromTokenChange = (e: Event) => {
    const target = e.target as HTMLSelectElement
    const token = availableTokens.value.find(t => t.symbol === target.value)
    if (token) bridgeStore.setFromToken(token)
}

const setAmountPercentage = (percent: number) => {
    const bal = walletBalance.value
    if (bal && !Number.isNaN(bal)) {
        amountModel.value = ((bal * percent) / 100).toFixed(4)
    }
}

const timeEstimate = computed(() => {
    if (!fromChain.value || !toChain.value) return '2-5 minutes'
    if (fromChain.value.id === toChain.value.id) return 'Instant'
    return fromChain.value.type === 'Layer 2' || toChain.value.type === 'Layer 2' ? '1-3 minutes' : '2-5 minutes'
})

const initiateBridge = async () => {
    await bridgeAction()
}
const formatNumber = (num: string | number) => {
    if (!num) return '0.00'
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(Number(num))
}
</script>
