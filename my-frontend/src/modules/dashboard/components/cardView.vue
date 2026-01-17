<template>
  <div class="max-w-sm mx-auto">
    <Card
      class="w-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-2 border-purple-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl dark:shadow-gray-900">
      <CardHeader class="pb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              WCH
            </div>
            <div>
              <CardTitle class="md:text-xl font-bold text-gray-800 dark:text-white">Wancash Token</CardTitle>
              <p class="text-sm text-gray-600 dark:text-gray-300">WCH</p>
            </div>
          </div>
          <Badge variant="secondary"
            class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800">
            Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <!-- Swap Mode Interface -->
        <div v-if="swapMode" class="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ isSellMode ? 'Sell WCH' : 'Buy Wancash' }}
            </h3>
            <Button variant="ghost" size="sm" @click="closeSwapMode" class="h-6 w-6 p-0">✕</Button>
          </div>

          <!-- State 1: Not Connected -->
          <div v-if="!isConnected" class="py-6 text-center space-y-3">
            <div class="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span class="text-2xl">🔗</span>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 px-2">
              Please connect your wallet to continue
            </div>
            <Button @click="() => open()" class="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Connect Wallet
            </Button>
          </div>

          <!-- State 2: Unsupported Chain -->
          <div v-else-if="!isSupportedChain" class="py-6 text-center space-y-3">
            <div class="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span class="text-2xl">⚠️</span>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 px-2">
              Not supported for now, just support in BSC, we will update soon for other chain
            </div>
          </div>

          <!-- State 3: Active Swap Interface -->
          <div v-else>
            <!-- Balances -->
            <div class="grid grid-cols-3 gap-2 text-xs bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg mb-3">
              <div class="flex flex-col items-center">
                <span class="text-gray-500">{{ nativeBalance?.symbol || 'Native' }}</span>
                <span class="font-medium text-gray-900 dark:text-gray-200">{{ formatBalance(nativeBalance) }}</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-gray-500">WCH</span>
                <span class="font-medium text-gray-900 dark:text-gray-200">{{ formatBalance(wchBalance, 'TOKEN')
                }}</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-gray-500">USDT</span>
                <span class="font-medium text-gray-900 dark:text-gray-200">{{ formatBalance(usdtBalance, 'TOKEN')
                }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <label class="text-xs text-gray-500">
                  {{ isSellMode ? 'You Pay (WCH)' : 'You Pay' }}
                </label>
                <div class="flex space-x-2">
                  <button @click="selectToken('BNB')"
                    :class="['text-xs px-2 py-0.5 rounded cursor-pointer border', selectedToken === 'BNB' ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700']">
                    BNB
                  </button>
                  <button @click="selectToken('USDT')"
                    :class="['text-xs px-2 py-0.5 rounded cursor-pointer border', selectedToken === 'USDT' ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700']">
                    USDT
                  </button>
                </div>
              </div>

              <div class="relative">
                <input v-model="inputAmount" type="number" placeholder="0.0"
                  class="w-full p-2 pr-16 rounded-md border dark:border-gray-600 bg-transparent" @input="handleInput" />
                <span class="absolute right-3 top-2.5 text-sm font-medium text-gray-500">
                  {{ isSellMode ? 'WCH' : selectedToken }}
                </span>
              </div>
            </div>

            <!-- Percentage Controls -->
            <div class="space-y-2 mt-2">
              <!-- Buttons -->
              <div class="flex justify-between gap-2">
                <button v-for="pct in [25, 50, 75, 100]" :key="pct" @click="setPercentage(pct)"
                  class="flex-1 text-xs py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors">
                  {{ pct === 100 ? 'Max' : pct + '%' }}
                </button>
              </div>
              <!-- Slider & Manual Input -->
              <div class="flex items-center gap-3">
                <input type="range" v-model.number="sliderPercentage" min="0" max="100" step="1"
                  @input="setPercentage(sliderPercentage)"
                  class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-500">
                <div class="relative w-16">
                  <input type="number" v-model.number="sliderPercentage" @input="setPercentage(sliderPercentage)"
                    class="w-full p-1 text-xs text-center border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white remove-arrow"
                    min="0" max="100">
                  <span class="absolute right-1 top-1 text-xs text-gray-500">%</span>
                </div>
              </div>
            </div>

            <!-- Slippage Controls -->
            <div class="mt-3">
              <div class="flex justify-between items-center mb-1">
                <label class="text-xs text-gray-500">Slippage Tolerance</label>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ slippageTolerance }}%</span>
              </div>
              <div class="flex justify-between gap-2">
                <button v-for="slip in [0.5, 1, 5]" :key="slip" @click="slippageTolerance = slip"
                  :class="['flex-1 text-xs py-1.5 rounded transition-colors', slippageTolerance === slip ? 'bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600']">
                  {{ slip }}%
                </button>
                <!-- Manual Input -->
                <div class="relative w-16">
                  <input type="number" v-model.number="slippageTolerance"
                    class="w-full p-1.5 text-xs text-center border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white remove-arrow"
                    step="0.1" min="0.1" max="50">
                  <span class="absolute right-1 top-1.5 text-xs text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div class="flex justify-center text-purple-500 my-1">
              ↓
            </div>

            <div class="space-y-1 mb-3">
              <label class="text-xs text-gray-500">
                You Receive ({{ isSellMode ? selectedToken : 'WCH' }})
              </label>
              <div class="p-2 rounded-md bg-gray-100 dark:bg-gray-900 min-h-[42px] flex items-center">
                <span v-if="quoteLoading" class="text-xs text-gray-400">Fetching best price...</span>
                <span v-else>{{ estimatedOutput }}</span>
              </div>
            </div>

            <Button v-if="needsApproval" @click="handleApprove"
              class="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
              :disabled="approvalLoading">
              <span v-if="approvalLoading" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Approving {{ approvalToken }}...
              </span>
              <span v-else>Approve {{ approvalToken }}</span>
            </Button>

            <Button v-else @click="executeSwap" class="w-full bg-gradient-to-r from-purple-500 to-blue-600"
              :disabled="!quote || swapLoading">
              <span v-if="swapLoading" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Swapping...
              </span>
              <span v-else>Swap Now</span>
            </Button>
          </div>
        </div>

        <!-- Standard View -->
        <div v-else class="space-y-4">
          <!-- Price Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">Current Price</span>
              <span :class="priceChangeClass" class="text-[13px] md:text-sm font-medium">
                {{ priceChange > 0 ? '+' : '' }}{{ priceChange.toFixed(2) }}%
              </span>
            </div>
            <div class="text-[13px] md:text-base font-bold text-gray-900 dark:text-white">
              ${{ currentPrice < 0.01 ? currentPrice.toFixed(8) : currentPrice.toLocaleString() }} </div>

                <!-- Chart Integration -->
                <div class="mt-4 h-[220px]">
                  <TokenPriceChart @timeframe-changed="handleTimeframeChange" />
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
                <div class="text-[13px] md:text-base font-semibold text-gray-900 dark:text-white">${{
                  marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })
                }}</div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Volume 24h</div>
                <div class="text-[13px] md:text-base font-semibold text-gray-900 dark:text-white">${{
                  volume24h.toLocaleString() }}</div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
                <div class="text-xs sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Total Supply</div>
                <div class="text-[13px] md:text-base font-semibold text-gray-900 dark:text-white">
                  {{ totalSupply.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Circulating</div>
                <div class="text-[13px] md:text-base font-semibold text-gray-900 dark:text-white">{{
                  circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2 pt-2">
              <Button @click="openSwapMode('BUY')"
                class="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                :disabled="loading">
                Buy Wancash
              </Button>
              <Button @click="openSwapMode('SELL')" variant="outline"
                class="flex-1 border-purple-200 dark:border-gray-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800"
                :disabled="loading">
                Sell
              </Button>
            </div>
          </div>

          <!-- Quick Info -->
          <div
            class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-gray-700">
            <span>Last updated: {{ lastUpdated }}</span>
            <span class="flex items-center">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
              Live
            </span>
          </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { pancakeSwapService, type SwapQuote } from '../services/pancakeSwapService'
import TokenPriceChart from './TokenPriceChart.vue'
import { toast } from 'vue-sonner'
import { useConnection, useChainId, useConfig } from '@wagmi/vue'
import { useAppKit, useAppKitAccount } from '@reown/appkit/vue'
import { dexScreenerService } from '../services/dexScreenerService'

// Reactive state
const loading = ref<boolean>(false)
const currentPrice = ref<number>(0.00245)
// const priceChange = ref<number>(12.45) // Replaced by computed
const priceChangeData = ref({ h1: 0, h6: 0, h24: 0 })
const selectedTimeframe = ref('1d')

const priceChange = computed(() => {
  const tf = selectedTimeframe.value
  if (tf === '1m' || tf === '5m' || tf === '1h') return priceChangeData.value.h1
  // if (tf === '1w') return priceChangeData.value.h6 // Optional: use 6h for 1w view if desired, but 24h is standard
  return priceChangeData.value.h24
})
const marketCap = ref<number>(125000000)
const volume24h = ref<number>(8750000)
const totalSupply = ref<number>(21000000000)
const circulatingSupply = ref<number>(750000000)
const lastUpdated = ref<string>('')
const pairAddress = ref<string | null>(null)

// Swap State
const swapMode = ref(false)
const isSellMode = ref(false)
const selectedToken = ref<'BNB' | 'USDT'>('BNB')
const inputAmount = ref('')
const quote = ref<SwapQuote | null>(null)
const quoteLoading = ref(false)
const swapLoading = ref(false)
const needsApproval = ref(false)
const approvalLoading = ref(false)
let debounceTimer: any = null
const sliderPercentage = ref(0) // 0-100
const slippageTolerance = ref(0.5) // Default 0.5%

// Balance computed for percentage calcs
const maxBalance = computed(() => {
  if (isSellMode.value) {
    // Sell WCH: use WCH balance
    return wchBalance.value ? parseFloat(wchBalance.value.formatted) : 0
  } else {
    // Buy WCH: use selected token balance
    if (selectedToken.value === 'BNB') {
      return nativeBalance.value ? parseFloat(nativeBalance.value.formatted) : 0
    }
    return usdtBalance.value ? parseFloat(usdtBalance.value.formatted) : 0
  }
})

const setPercentage = (percent: number) => {
  sliderPercentage.value = percent
  if (maxBalance.value > 0) {
    const amount = (maxBalance.value * percent) / 100
    // BN for precise calculation is ideal, but using float for UI helper
    // If Native (BNB), leave some for gas? Usually standard practice, but user asked for % value.
    // Let's us 4 decimals for Native/WCH generally or standard format logic
    // We'll use 6 decimals for precision in input
    inputAmount.value = amount.toFixed(6)
    // Remove trailing zeros
    inputAmount.value = parseFloat(inputAmount.value).toString()
    handleInput()
  }
}


// Chain & Auth State
const accountData = useAppKitAccount()
const address = computed(() => accountData.value.address as `0x${string}` | undefined)
const isConnected = computed(() => accountData.value.isConnected)
const chainIdRef = useChainId()
const chainId = computed(() => chainIdRef.value)

const { open } = useAppKit()

const isSupportedChain = computed(() => {
  return chainId.value === 56 || chainId.value === 97
})

// Format helpers
const formatBalance = (bal: any, type: 'NATIVE' | 'TOKEN' = 'NATIVE') => {
  if (!bal || !bal.formatted) return '0.00'
  const num = parseFloat(bal.formatted)

  if (type === 'TOKEN') {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  // Native: 4 decimals, keep as is (user said it's ok)
  return num.toFixed(4)
}

// Balance State
const nativeBalance = ref<any>(null) // Object with formatted, symbol, etc
const wchBalance = ref<any>(null)
const usdtBalance = ref<any>(null)
const config = useConfig()

// Helpers
import { getBalance, readContract } from '@wagmi/core'
import { wancashAbi } from '@/app/services/contracts'
import { formatUnits } from 'viem'

const fetchNativeBalance = async () => {
  if (!address.value || !chainId.value) return
  try {
    const bal = await getBalance(config, {
      address: address.value,
      chainId: chainId.value
    })
    nativeBalance.value = bal
  } catch (e) {
    console.error('Fetch Native Balance Error:', e)
    nativeBalance.value = null
  }
}

const fetchTokenBalance = async (tokenSymbol: 'WCH' | 'USDT') => {
  if (!address.value || !chainId.value) return
  const tokenAddress = pancakeSwapService.getTokenAddress(chainId.value, tokenSymbol)
  try {
    if (!tokenAddress) throw new Error(`${tokenSymbol} address not found`)

    // For WCH we can use wancashAbi if standard ERC20, or a generic ERC20 ABI
    // Using generic readContract for decimals and balance
    // Simplified: assuming 18 decimals for now or fetching it

    // Use wagmi's getBalance for tokens too is easier if supported
    const bal = await getBalance(config, {
      address: address.value,
      token: tokenAddress as `0x${string}`,
      chainId: chainId.value
    })
    if (tokenSymbol === 'WCH') wchBalance.value = bal
    if (tokenSymbol === 'USDT') usdtBalance.value = bal

  } catch (e) {
    console.error(`Fetch ${tokenSymbol} Balance Error:`, e)
    if (tokenSymbol === 'WCH') wchBalance.value = null
    if (tokenSymbol === 'USDT') usdtBalance.value = null
  }
}

const refreshBalances = () => {
  fetchNativeBalance()
  fetchTokenBalance('WCH')
  fetchTokenBalance('USDT')
}

// Initial fetch and watch for chain/address changes
watch([address, chainId], () => {
  refreshBalances()
}, { immediate: true })

// Polling
onMounted(() => {
  const interval = setInterval(refreshBalances, 10000)
  return () => clearInterval(interval)
})

// Reset generic when chain changes
watch(chainId, () => {
  if (swapMode.value) {
    quote.value = null
    inputAmount.value = ''
    needsApproval.value = false
  }
})

const estimatedOutput = computed(() => {
  if (!quote.value) return '0.0'
  return parseFloat(quote.value.amountOut).toFixed(6)
})

const approvalToken = computed(() => {
  return isSellMode.value ? 'WCH' : selectedToken.value
})

const openSwapMode = (mode: 'BUY' | 'SELL') => {
  // We open the modal regardless, but UI will show error if unsupported
  isSellMode.value = mode === 'SELL'
  swapMode.value = true
  quote.value = null
  inputAmount.value = ''
  needsApproval.value = false
}

const closeSwapMode = () => {
  swapMode.value = false
  quote.value = null
  inputAmount.value = ''
}

const selectToken = (token: 'BNB' | 'USDT') => {
  selectedToken.value = token
  quote.value = null
  needsApproval.value = false
  handleInput()
}

const handleInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  quote.value = null
  needsApproval.value = false

  if (!inputAmount.value || parseFloat(inputAmount.value) <= 0) return
  if (!isSupportedChain.value) return

  debounceTimer = setTimeout(async () => {
    quoteLoading.value = true
    try {
      const tokenIn = isSellMode.value ? 'WCH' : selectedToken.value
      const tokenOut = isSellMode.value ? selectedToken.value : 'WCH'

      const currentChainId = chainId.value
      if (!currentChainId) throw new Error("Chain ID not found")

      // 1. Get Quote
      quote.value = await pancakeSwapService.getQuote(currentChainId, inputAmount.value, tokenIn, tokenOut)

      // 2. Check Allowance
      const tokenToCheck = isSellMode.value ? 'WCH' : selectedToken.value

      if (tokenToCheck !== 'BNB' && quote.value) {
        const isApproved = await pancakeSwapService.checkAllowance(currentChainId, inputAmount.value, tokenToCheck)
        needsApproval.value = !isApproved
      }
    } catch (e) {
      console.error(e)
      toast.error("Failed to fetch price")
    } finally {
      quoteLoading.value = false
    }
  }, 500)
}

const handleApprove = async () => {
  if (!inputAmount.value) return
  if (!isSupportedChain.value || !chainId.value) return

  approvalLoading.value = true

  // Determine which token to approve
  const tokenToApprove = isSellMode.value ? 'WCH' : selectedToken.value

  try {
    const hash = await pancakeSwapService.approveToken(chainId.value, inputAmount.value, tokenToApprove)
    toast.success("Approval sent!", { description: `Hash: ${hash}` })
    needsApproval.value = false
  } catch (e: any) {
    console.error(e)
    toast.error("Approval failed", { description: e.message })
  } finally {
    approvalLoading.value = false
  }
}

const executeSwap = async () => {
  if (!quote.value) return
  if (!isSupportedChain.value || !chainId.value) return

  swapLoading.value = true
  try {
    const hash = await pancakeSwapService.executeSwap(chainId.value, quote.value, slippageTolerance.value)
    toast.success("Transaction sent!", {
      description: `Hash: ${hash}`
    })
    closeSwapMode()
  } catch (e: any) {
    console.error(e)
    toast.error("Swap failed", {
      description: e.message
    })
  } finally {
    swapLoading.value = false
  }
}


// Computed properties
const priceChangeClass = computed(() => {
  return priceChange.value >= 0
    ? 'text-green-600'
    : 'text-red-600'
})

// Methods
const updateLastUpdated = (): void => {
  const now = new Date()
  lastUpdated.value = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const simulatePriceUpdate = (): void => {
  // Deprecated: using fetchRealData
}

// Fetch Real Data
const fetchRealData = async () => {
  try {
    // Fetch from DexScreener (default returns WBNB data for now)
    const data = await dexScreenerService.getTokenData()

    if (data) {
      pairAddress.value = data.pairAddress
      currentPrice.value = parseFloat(data.priceUsd)
      // Store all timeframes
      priceChangeData.value = {
        h1: data.priceChange.h1,
        h6: data.priceChange.h6,
        h24: data.priceChange.h24
      }
      volume24h.value = data.volume.h24
      marketCap.value = data.marketCap

      // Calculate implied supply based on Market Cap / Price
      // This ensures Market Cap = Price * Supply in the UI
      if (currentPrice.value > 0) {
        circulatingSupply.value = data.marketCap / currentPrice.value
      }
    }
  } catch (error) {
    console.error("Failed to load real stats", error)
  } finally {
    updateLastUpdated()
  }
}

const handleTimeframeChange = (tf: string) => {
  selectedTimeframe.value = tf
}

// Lifecycle hooks
onMounted(() => {
  fetchRealData()

  // Poll for updates every 30s
  const interval = setInterval(() => {
    fetchRealData()
  }, 30000)

  // Cleanup interval saat component di-unmount
  return () => {
    clearInterval(interval)
  }
})
</script>

<style scoped>
/* Animasi kustom untuk efek loading */
@keyframes pulse-green {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Efek hover tambahan */
.card-hover-effect {
  transition: all 0.3s ease-in-out;
}

.card-hover-effect:hover {
  transform: translateY(-2px);
}

/* Hide number input arrows */
.remove-arrow::-webkit-inner-spin-button,
.remove-arrow::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.remove-arrow {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
