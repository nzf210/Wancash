<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header Enterprise -->
    <div class="mb-10 text-center">
      <div
        class="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
        <ArrowRightIcon class="w-8 h-8 text-white" />
      </div>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
        Cross-Chain Bridge
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Enterprise-grade token bridging between multiple blockchain networks
      </p>
    </div>

    <!-- Main Bridge Card -->
    <div class="relative">
      <!-- Background Gradient Effect -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-3xl">
      </div>

      <div
        class="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        <!-- Card Header with Stats -->
        <div
          class="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Token Bridge</h2>
              <p class="text-gray-600 dark:text-gray-400">Secure cross-chain transfers</p>
            </div>
            <div class="flex items-center space-x-6">
              <div class="text-right">
                <div class="text-sm text-gray-500 dark:text-gray-400">Total Volume</div>
                <div class="text-xl font-bold text-gray-900 dark:text-white">$4.2B+</div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-500 dark:text-gray-400">Successful Bridges</div>
                <div class="text-xl font-bold text-gray-900 dark:text-white">128K+</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bridge Interface -->
        <div class="p-8">
          <div class="grid lg:grid-cols-2 gap-8">
            <!-- From Section -->
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">From</h3>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Balance: <span class="font-semibold text-gray-900 dark:text-white">{{ fromBalance }} {{
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
                        <div class="font-semibold text-gray-900 dark:text-white">{{ fromChain?.name || 'Select Chain' }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ fromChain?.type || 'Network' }}</div>
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
                      <div v-for="chain in filteredSourceChains" :key="chain.id" @click="selectFromChain(chain, $event)"
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
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <TokenIcon :token="fromToken" class="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div class="font-semibold text-gray-900 dark:text-white">{{ fromToken?.name || 'Select Token' }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ fromToken?.symbol || '' }}</div>
                      </div>
                    </div>
                    <select v-model="fromToken"
                      class="bg-transparent border-none focus:ring-0 text-right font-medium text-gray-900 dark:text-white"
                      @change="onFromTokenChange">
                      <option :value="null" disabled>Select Token</option>
                      <option v-for="token in availableTokens" :key="token.address" :value="token">
                        {{ token.symbol }}
                      </option>
                    </select>
                  </div>
                  <div class="flex space-x-2 mb-3">
                    <button v-for="percent in [25, 50, 75, 100]" :key="percent" @click="setAmountPercentage(percent)"
                      class="flex-1 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors">
                      {{ percent }}%
                    </button>
                  </div>
                  <div class="relative">
                    <input v-model="amount" type="number" placeholder="0.00" step="0.0001" min="0"
                      @input="onAmountChange"
                      class="w-full p-3 text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500" />
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
                  Estimated: <span class="font-semibold text-gray-900 dark:text-white">{{ estimatedAmount }} {{
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
                        <div class="font-semibold text-gray-900 dark:text-white">{{ toChain?.name || 'Select Chain' }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ toChain?.type || 'Network' }}</div>
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
                      <div v-for="chain in filteredDestChains" :key="chain.id" @click="selectToChain(chain, $event)"
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
                        <div class="font-semibold text-gray-900 dark:text-white">{{ toToken?.name || 'Select Token' }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ toToken?.symbol || '' }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {{ estimatedAmount || '0.00' }}
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
                  <span class="font-medium text-gray-900 dark:text-white">{{ bridgeFee }} {{ fromToken?.symbol || ''
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
                  <span class="font-medium text-gray-900 dark:text-white">10 {{ fromToken?.symbol || '' }}</span>
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
                <span class="font-semibold text-gray-900 dark:text-white">{{ estimatedAmount }} {{ toToken?.symbol
                }}</span>
                on {{ toChain?.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer with Security Badges -->
        <div class="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center space-x-6">
              <div class="flex items-center space-x-2">
                <LoopIcon class="w-5 h-5 text-green-500" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Secure Bridge</span>
              </div>
              <div class="flex items-center space-x-2">
                <LightningBoltIcon class="w-5 h-5 text-yellow-500" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Fast Transactions</span>
              </div>
              <div class="flex items-center space-x-2">
                <CardStackIcon class="w-5 h-5 text-blue-500" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Low Fees</span>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-xs text-gray-500 dark:text-gray-400">Network Status</div>
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bridges -->
      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Recent Bridges</h3>
          <button class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1">
            <span>View All</span>
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="bridge in recentBridges" :key="bridge.id"
            class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <div
                  class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <span class="text-white text-xs font-bold">{{ bridge.fromChain.charAt(0) }}</span>
                </div>
                <ArrowRightIcon class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <div
                  class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                  <span class="text-white text-xs font-bold">{{ bridge.toChain.charAt(0) }}</span>
                </div>
              </div>
              <StatusBadge :status="bridge.status" />
            </div>
            <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {{ bridge.amount }} {{ bridge.token }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <ClockIcon class="w-3 h-3 mr-1" />
              {{ formatTime(bridge.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { Chain, Token, BridgeHistory } from '@/modules/bridge/types/bridge.types'

// Import Radix UI Icons
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LightningBoltIcon,
  CardStackIcon,
  RocketIcon,
  TimerIcon,
  MinusCircledIcon,
  LoopIcon,
  ClockIcon
} from '@radix-icons/vue'

// Components
import ChainIcon from '@/modules/bridge/components/ChainIcon.vue'
import TokenIcon from '@/modules/bridge/components/TokenIcon.vue'
import StatusBadge from '@/modules/bridge/components/StatusBadge.vue'

// State
const fromChain = ref<Chain | null>(null)
const toChain = ref<Chain | null>(null)
const fromToken = ref<Token | null>(null)
const toToken = ref<Token | null>(null)
const amount = ref<string>('')
const showFromChains = ref<boolean>(false)
const showToChains = ref<boolean>(false)
const loading = ref<boolean>(false)

// Refs untuk dropdown container
const fromChainDropdownRef = ref<HTMLElement | null>(null)
const toChainDropdownRef = ref<HTMLElement | null>(null)

// Click outside untuk menutup dropdown
onClickOutside(fromChainDropdownRef, () => {
  showFromChains.value = false
})

onClickOutside(toChainDropdownRef, () => {
  showToChains.value = false
})

// Mock Data - Sesuaikan dengan tipe yang benar
const sourceChains = ref<Chain[]>([
  { id: 1, name: 'WANChain', symbol: 'WAN', type: 'Mainnet', fee: 0.1, network: 'wanchain' },
  { id: 2, name: 'Ethereum', symbol: 'ETH', type: 'Mainnet', fee: 0.3, network: 'ethereum' },
  { id: 3, name: 'Binance Smart Chain', symbol: 'BSC', type: 'Mainnet', fee: 0.15, network: 'bsc' },
  { id: 4, name: 'Polygon', symbol: 'MATIC', type: 'Mainnet', fee: 0.1, network: 'polygon' },
  { id: 5, name: 'Avalanche', symbol: 'AVAX', type: 'Mainnet', fee: 0.2, network: 'avalanche' },
  { id: 6, name: 'Arbitrum', symbol: 'ARB', type: 'Layer 2', fee: 0.12, network: 'arbitrum' },
  { id: 7, name: 'Optimism', symbol: 'OP', type: 'Layer 2', fee: 0.12, network: 'optimism' },
])

const destChains = ref<Chain[]>([
  { id: 1, name: 'WANChain', symbol: 'WAN', type: 'Mainnet', fee: 0.1, network: 'wanchain' },
  { id: 2, name: 'Ethereum', symbol: 'ETH', type: 'Mainnet', fee: 0.3, network: 'ethereum' },
  { id: 3, name: 'Binance Smart Chain', symbol: 'BSC', type: 'Mainnet', fee: 0.15, network: 'bsc' },
  { id: 4, name: 'Polygon', symbol: 'MATIC', type: 'Mainnet', fee: 0.1, network: 'polygon' },
  { id: 5, name: 'Avalanche', symbol: 'AVAX', type: 'Mainnet', fee: 0.2, network: 'avalanche' },
  { id: 6, name: 'Arbitrum', symbol: 'ARB', type: 'Layer 2', fee: 0.12, network: 'arbitrum' },
  { id: 7, name: 'Optimism', symbol: 'OP', type: 'Layer 2', fee: 0.12, network: 'optimism' },
])

const availableTokens = ref<Token[]>([
  { name: 'WAN Token', symbol: 'WAN', address: '0x...', decimals: 18 },
  { name: 'Ethereum', symbol: 'ETH', address: '0x...', decimals: 18 },
  { name: 'Wrapped BTC', symbol: 'WBTC', address: '0x...', decimals: 8 },
  { name: 'USD Coin', symbol: 'USDC', address: '0x...', decimals: 6 },
  { name: 'Tether', symbol: 'USDT', address: '0x...', decimals: 6 },
  { name: 'Dai Stablecoin', symbol: 'DAI', address: '0x...', decimals: 18 },
])

const fromBalance = ref<string>('12450.75')

// Computed untuk filtered chains
const filteredSourceChains = computed<Chain[]>(() => {
  return sourceChains.value.filter(chain => {
    // Jangan tampilkan chain yang sudah dipilih di "To"
    return !toChain.value || chain.id !== toChain.value.id
  })
})

const filteredDestChains = computed<Chain[]>(() => {
  return destChains.value.filter(chain => {
    // Jangan tampilkan chain yang sudah dipilih di "From"
    return !fromChain.value || chain.id !== fromChain.value.id
  })
})

const bridgeFee = computed<string>(() => {
  if (!amount.value || !fromChain.value) return '0.00'
  const feePercent = fromChain.value.fee || 0.1
  const fee = (parseFloat(amount.value) * feePercent) / 100
  return fee.toFixed(4)
})

const estimatedAmount = computed<string>(() => {
  if (!amount.value) return '0.00'
  const fee = parseFloat(bridgeFee.value)
  const estimated = parseFloat(amount.value) - fee
  return estimated > 0 ? estimated.toFixed(4) : '0.00'
})

const timeEstimate = computed<string>(() => {
  if (!fromChain.value || !toChain.value) return '2-5 minutes'
  if (fromChain.value.id === toChain.value.id) return 'Instant'

  // Estimate based on chain types
  if (fromChain.value.type === 'Layer 2' || toChain.value.type === 'Layer 2') {
    return '1-3 minutes'
  }
  return '2-5 minutes'
})

const canBridge = computed<boolean>(() => {
  return !!(
    fromChain.value &&
    toChain.value &&
    fromToken.value &&
    toToken.value &&
    amount.value &&
    parseFloat(amount.value) > 0 &&
    parseFloat(amount.value) >= 10 &&
    fromChain.value.id !== toChain.value.id
  )
})

const recentBridges = ref<BridgeHistory[]>([
  { id: 1, fromChain: 'ETH', toChain: 'WAN', token: 'ETH', amount: '2.5', timestamp: Date.now() - 300000, status: 'completed' },
  { id: 2, fromChain: 'WAN', toChain: 'BSC', token: 'WAN', amount: '1500', timestamp: Date.now() - 600000, status: 'completed' },
  { id: 3, fromChain: 'BSC', toChain: 'WAN', token: 'USDT', amount: '5000', timestamp: Date.now() - 900000, status: 'completed' },
  { id: 4, fromChain: 'MATIC', toChain: 'WAN', token: 'USDC', amount: '750', timestamp: Date.now() - 1200000, status: 'pending' },
  { id: 5, fromChain: 'WAN', toChain: 'AVAX', token: 'WBTC', amount: '0.15', timestamp: Date.now() - 1500000, status: 'completed' },
  { id: 6, fromChain: 'ARB', toChain: 'WAN', token: 'DAI', amount: '2500', timestamp: Date.now() - 1800000, status: 'failed' },
])

// Toggle methods yang lebih aman
const toggleFromChains = (event: MouseEvent) => {
  event.stopPropagation()
  showFromChains.value = !showFromChains.value
  // Pastikan hanya satu dropdown terbuka
  if (showFromChains.value) {
    showToChains.value = false
  }
}

const toggleToChains = (event: MouseEvent) => {
  event.stopPropagation()
  showToChains.value = !showToChains.value
  // Pastikan hanya satu dropdown terbuka
  if (showToChains.value) {
    showFromChains.value = false
  }
}

// Methods
const selectFromChain = (chain: Chain, event: MouseEvent): void => {
  event.stopPropagation() // Mencegah event bubble ke parent
  fromChain.value = chain
  showFromChains.value = false
  // Reset token selection jika chain berubah
  fromToken.value = null

  // Jika chain yang sama dipilih di "To", reset "To"
  if (toChain.value?.id === chain.id) {
    toChain.value = null
  }
}

const selectToChain = (chain: Chain, event: MouseEvent): void => {
  event.stopPropagation() // Mencegah event bubble ke parent
  toChain.value = chain
  showToChains.value = false
  // Reset token selection jika chain berubah
  toToken.value = null

  // Jika chain yang sama dipilih di "From", reset "From"
  if (fromChain.value?.id === chain.id) {
    fromChain.value = null
  }
}

const setAmountPercentage = (percent: number): void => {
  const balance = parseFloat(fromBalance.value)
  if (isNaN(balance)) return

  amount.value = ((balance * percent) / 100).toFixed(4)
}

const onFromTokenChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  const token = availableTokens.value.find(t => t.symbol === target.value)
  if (token) {
    fromToken.value = token
  }
}

const onAmountChange = (): void => {
  // Validasi input
  const value = parseFloat(amount.value)
  if (value < 0) {
    amount.value = '0'
  }
}

const initiateBridge = async (): Promise<void> => {
  if (!canBridge.value || loading.value) return

  loading.value = true

  try {
    // Add to recent bridges
    const newBridge: BridgeHistory = {
      id: Date.now(),
      fromChain: fromChain.value!.symbol,
      toChain: toChain.value!.symbol,
      token: fromToken.value!.symbol,
      amount: amount.value,
      timestamp: Date.now(),
      status: 'pending',
      txHash: `0x${Math.random().toString(16).slice(2)}`
    }

    recentBridges.value.unshift(newBridge)

    // Keep only last 6 bridges
    if (recentBridges.value.length > 6) {
      recentBridges.value = recentBridges.value.slice(0, 6)
    }

    // Show success message
    alert(`Bridge initiated! You will receive ${estimatedAmount.value} ${toToken.value!.symbol} on ${toChain.value!.name}`)

    // Reset form
    amount.value = ''
  } catch (error) {
    console.error('Bridge failed:', error)
    alert('Bridge failed. Please try again.')
  } finally {
    loading.value = false
  }
}

const formatTime = (timestamp: number): string => {
  const minutes = Math.floor((Date.now() - timestamp) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

watch([fromChain, toChain], () => {
  if (fromChain.value && toChain.value) {
    console.log(`Bridge from ${fromChain.value.name} to ${toChain.value.name}`)
  }
})

watch(amount, (newAmount) => {
  if (parseFloat(newAmount) > parseFloat(fromBalance.value)) {
    amount.value = fromBalance.value
  }
})

// Initialize
onMounted(() => {
  fromChain.value = sourceChains.value[0]
  toChain.value = destChains.value[1]
  fromToken.value = availableTokens.value[0]
  toToken.value = availableTokens.value[0]
})
</script>
