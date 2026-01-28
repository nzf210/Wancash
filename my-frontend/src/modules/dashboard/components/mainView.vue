<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { pancakeSwapService, type SwapQuote } from '../services/pancakeSwapService'
import { toast } from 'vue-sonner'
import { useChainId, useConfig } from '@wagmi/vue'
import { usePriceStore } from '@/stores/priceStore'
import { storeToRefs } from 'pinia'
import WancashIcon from '@/components/icons/WancashIcon.vue'
import ChainIcon from '@/modules/bridge/components/ChainIcon.vue'
import { networks } from '@/app/components/config/wagmi'
import { wancashContractAddress } from '@/app/services/contracts'
import { SUPPORTED_CHAINS } from '@/app/composables/useChain'

// Blob element
const follower = ref<HTMLElement>()

// Hover state
const isHovering = ref(false)

const handleMouseMove = (e: MouseEvent) => {
  if (!follower.value) return

  const x = e.clientX
  const y = e.clientY

  // Smooth follow pakai lerp
  const updatePosition = () => {
    if (!follower.value) return
    const currentX = Number.parseFloat(follower.value.style.left || '0')
    const currentY = Number.parseFloat(follower.value.style.top || '0')

    const lerpX = currentX + (x - currentX) * 0.15
    const lerpY = currentY + (y - currentY) * 0.15

    follower.value.style.left = `${lerpX}px`
    follower.value.style.top = `${lerpY}px`

    requestAnimationFrame(updatePosition)
  }
  updatePosition()
}

// Efek hover
const handleMouseEnter = () => (isHovering.value = true)
const handleMouseLeave = () => (isHovering.value = false)

onMounted(() => {
  globalThis.addEventListener('mousemove', handleMouseMove)
  document.querySelectorAll('a, button, [role="button"], .cursor-pointer').forEach(el => {
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
  })
})

onBeforeUnmount(() => {
  globalThis.window.removeEventListener('mousemove', handleMouseMove)
})

// Price Store
const priceStore = usePriceStore()
const {
  wchPrice: currentPrice,
  marketCap,
  wchChange1h,
  wchChange24h
} = storeToRefs(priceStore)

// Reactive state
const selectedTimeframe = ref('1d')

const priceChange = computed(() => {
  const tf = selectedTimeframe.value
  if (tf === '1m' || tf === '5m' || tf === '1h') return wchChange1h.value
  return wchChange24h.value
})

const circulatingSupply = ref<number>(750000000)
const lastUpdated = ref<string>('')

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
const chainIdRef = useChainId()
const chainId = computed(() => chainIdRef.value)

const { open } = useAppKit()

const isSupportedChain = computed(() => {
  return chainId.value === 56 || chainId.value === 97
})

const activeChainForIcon = computed(() => {
  if (!chainId.value) return null
  const network = networks.find(n => n.id === chainId.value)
  return network ? {
    id: network.id,
    name: network.name,
    network: network.name.toLowerCase(),
    symbol: network.nativeCurrency?.symbol || '',
    currency: network.nativeCurrency?.symbol || '',
    type: 'evm',
    fee: 0,
    eid: 0
  } as any : null
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
import { getBalance } from '@wagmi/core'
import { useAppKit, useAppKitAccount } from '@reown/appkit/vue'


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

// Fetch Real Data
const fetchRealData = async () => {
  try {
    // Fetch from Backend using central price store
    await priceStore.fetchPrices()

    // Calculate implied supply based on Market Cap / Price if needed
    if (currentPrice.value > 0) {
      circulatingSupply.value = marketCap.value / currentPrice.value
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

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.success('Address copied to clipboard', {
    duration: 2000
  })
}

// Computed for displaying addresses
const chainContractAddresses = computed(() => {
  const addresses: { chain: any, address: string }[] = []

  SUPPORTED_CHAINS.forEach(chain => {
    const address = wancashContractAddress[chain.id]
    if (address) {
      addresses.push({
        chain,
        address
      })
    }
  })

  return addresses
})

// Get whitepaper URL from environment variable
const whitepaperUrl = computed(() => {
  return (import.meta.env as any).VITE_WHITEPAPER_URL || 'https://wancash.gitbook.io/wancash';
});

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

<template>
  <!-- Card Kedua (Kanan) - Moto & Profil -->
  <div class="col-span-4">
    <div class="md:ml-36 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/90 dark:to-gray-800/90
                  backdrop-blur-lg border border-gray-200 dark:border-gray-700/50
                  rounded-2xl shadow-xl dark:shadow-2xl p-8
                  hover:shadow-purple-200 dark:hover:shadow-purple-500/10
                  hover:border-purple-300 dark:hover:border-purple-500/30
                  transition-all duration-500" @mouseenter="isHovering = true" @mouseleave="isHovering = false">

      <!-- Header dengan Logo/Icon -->
      <div class="flex items-center mb-6">
        <div
          class="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl flex items-center justify-center mr-4">
          <WancashIcon class-name="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 class="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500
                     dark:from-purple-400 dark:to-blue-300 bg-clip-text text-transparent flex items-center gap-2">
            <span>🟢</span> WCH – Wancash Token
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Hybrid Multi-Chain Core Ecosystem Fuel</p>
        </div>
      </div>

      <!-- Moto Utama & Description -->
      <div
        class="mb-8 p-6 bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30">
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic mb-6">
          WCH (Wancash Token) is a hybrid multi-chain token designed as the core fuel of the Wancash ecosystem.
        </p>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          WCH is used as a gas fee for the arbitrage bot platform, staking utility, and a medium of exchange for
          products and merchandise, bridging DeFi activities with real digital and offline utility.
        </p>
      </div>

      <!-- Sustainability Model -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Sustainability Model</h2>
        <div
          class="relative p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <WancashIcon class-name="w-32 h-32" />
          </div>
          <p class="text-gray-300 text-sm mb-6 relative z-10 leading-relaxed">
            Ecosystem revenue is allocated in a sustainable manner:
            <span class="text-amber-400 font-bold">40%</span> to strengthen gold-backed reserves,
            <span class="text-blue-400 font-bold">40%</span> for operations and development, and
            <span class="text-green-400 font-bold">20%</span> for token buyback and liquidity enhancement, supporting
            long-term ecosystem stability.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            <div class="text-center group">
              <div class="text-3xl font-extrabold text-amber-400 mb-1 group-hover:scale-110 transition-transform">40%
              </div>
              <div class="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Gold-Backed Reserves</div>
            </div>
            <div class="text-center group">
              <div class="text-3xl font-extrabold text-blue-400 mb-1 group-hover:scale-110 transition-transform">40%
              </div>
              <div class="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Ops & Development</div>
            </div>
            <div class="text-center group">
              <div class="text-3xl font-extrabold text-green-400 mb-1 group-hover:scale-110 transition-transform">20%
              </div>
              <div class="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Buyback & Liquidity</div>
            </div>
          </div>
          <p class="mt-8 text-sm text-center text-gray-300 font-medium italic relative z-10">
            Designed for long-term growth through real utility, not pure speculation.
          </p>
        </div>
      </div>

      <!-- Featured Contract Addresses Section -->
      <div class="mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
        <h3 class="flex items-center text-sm font-semibold text-gray-900 dark:text-white mb-4">
          <span class="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          Supported Network Contracts
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div v-for="item in chainContractAddresses" :key="item.chain.id"
            class="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800 transition-all hover:shadow-sm"
            :class="{ 'ring-1 ring-blue-500/30 border-blue-400/50': item.chain.id === 42161 }">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                <ChainIcon :chain="item.chain" />
              </div>
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="text-[11px] font-bold text-gray-900 dark:text-white">{{ item.chain.name }}</span>
                  <span v-if="item.chain.id === 42161"
                    class="text-[9px] px-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded font-bold">CORE</span>
                </div>
                <span class="text-[10px] font-mono text-gray-500 dark:text-gray-400 truncate md:hidden">{{
                  item.address.slice(0, 10) }}...{{ item.address.slice(-8) }}</span>
                <span class="text-[10px] font-mono text-gray-500 dark:text-gray-400 truncate hidden md:block">{{
                  item.address.slice(0, 14) }}...{{ item.address.slice(-10) }}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" class="h-8 w-8 p-0 flex-shrink-0 ml-1"
              @click="copyToClipboard(item.address)">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8 pt-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button as-child
            class="h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20">
            <router-link to="/staking" class="flex flex-col items-center justify-center">
              <span class="font-bold">Stake WCH</span>
              <span class="text-[10px] opacity-80">Earn passive rewards</span>
            </router-link>
          </Button>
          <Button as-child variant="outline"
            class="h-14 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <a href="#" target="_blank" class="flex flex-col items-center justify-center">
              <span class="font-bold text-blue-600 dark:text-blue-400">Arbitrage Platform</span>
              <span class="text-[10px] text-gray-500">Explore Bot</span>
            </a>
          </Button>
          <Button as-child variant="ghost"
            class="h-14 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <a :href="whitepaperUrl" target="_blank" class="flex flex-col items-center justify-center">
              <span class="font-bold">Whitepaper</span>
              <span class="text-[10px] text-gray-500">Read Documentation</span>
            </a>
          </Button>
        </div>
      </div>

      <!-- Roadmap (Simplified) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 class="md:text-xl font-bold text-gray-900 dark:text-white mb-3">Community Links</h3>
          <div class="flex space-x-4">
            <a target="_blank" href="https://t.me/wancash_token" class="w-12 h-12 bg-blue-100 hover:bg-blue-200 dark:bg-blue-500/20
                     dark:hover:bg-blue-500/40 rounded-xl flex items-center justify-center
                     transition-colors cursor-pointer" title="Telegram">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.093.036.305.02.47z" />
              </svg>
            </a>
            <a target="_blank" href="https://twitter.com/Wancash_token" class="w-12 h-12 bg-sky-100 hover:bg-sky-200 dark:bg-sky-500/20
                     dark:hover:bg-sky-500/40 rounded-xl flex items-center justify-center
                     transition-colors cursor-pointer" title="Twitter">
              <svg class="w-6 h-6 text-sky-600 dark:text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="https://wancash.org" class="w-12 h-12 bg-purple-100 hover:bg-purple-200 dark:bg-purple-500/20
                     dark:hover:bg-purple-500/40 rounded-xl flex items-center justify-center
                     transition-colors cursor-pointer" title="Website">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </a>
          </div>
        </div>

        <div class="flex items-end justify-center md:justify-end">
          <div class="text-right">
            <h3 class="md:text-sm font-bold text-gray-400 mb-1">Ecosystem Status</h3>
            <div class="flex items-center gap-2 justify-end">
              <span class="text-xs text-gray-500">Mainnet v2.4</span>
              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Timestamp -->
      <div class="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700/50 text-center">
        <p class="text-gray-500 dark:text-gray-400 text-sm">Last updated: {{
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Efek hover halus untuk semua elemen interaktif */
a,
button,
[role="button"],
.cursor-pointer {
  transition: all 0.3s ease;
}

/* Gradien teks untuk judul */
.bg-gradient-to-r {
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* Memastikan teks tetap terlihat dengan baik di light mode */
@media (prefers-color-scheme: light) {
  .text-transparent {
    background-clip: text;
    -webkit-background-clip: text;
  }
}
</style>
