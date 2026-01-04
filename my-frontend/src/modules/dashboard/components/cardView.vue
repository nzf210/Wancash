<template>
  <div class="max-w-sm mx-auto">
    <Card
      class="w-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-2 border-purple-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl dark:shadow-gray-900">
      <CardHeader class="pb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              SK
            </div>
            <div>
              <CardTitle class="text-xl font-bold text-gray-800 dark:text-white">Wancash Token</CardTitle>
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
        <!-- Price Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Current Price</span>
            <span :class="priceChangeClass" class="text-sm font-medium">
              {{ priceChange > 0 ? '+' : '' }}{{ priceChange.toFixed(2) }}%
            </span>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            ${{ currentPrice.toLocaleString() }}
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
            <div class="font-semibold text-gray-900 dark:text-white">${{ marketCap.toLocaleString() }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Volume 24h</div>
            <div class="font-semibold text-gray-900 dark:text-white">${{ volume24h.toLocaleString() }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Supply</div>
            <div class="font-semibold text-gray-900 dark:text-white">{{ totalSupply.toLocaleString() }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border dark:border-gray-700">
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Circulating</div>
            <div class="font-semibold text-gray-900 dark:text-white">{{ circulatingSupply.toLocaleString() }}</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-2 pt-2">
          <Button @click="handleBuy"
            class="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            :disabled="loading">
            <span v-if="!loading">Buy Wancash</span>
            <span v-else class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </span>
          </Button>
          <Button @click="handleSell" variant="outline"
            class="flex-1 border-purple-200 dark:border-gray-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800"
            :disabled="loading">
            Sell
          </Button>
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
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Interface untuk tipe data token
// interface TokenData {
//   currentPrice: number
//   priceChange: number
//   marketCap: number
//   volume24h: number
//   totalSupply: number
//   circulatingSupply: number
// }

// Reactive state
const loading = ref<boolean>(false)
const currentPrice = ref<number>(0.00245)
const priceChange = ref<number>(12.45)
const marketCap = ref<number>(125000000)
const volume24h = ref<number>(8750000)
const totalSupply = ref<number>(1000000000)
const circulatingSupply = ref<number>(750000000)
const lastUpdated = ref<string>('')

// Computed properties
const priceChangeClass = computed(() => {
  return priceChange.value >= 0
    ? 'text-green-600'
    : 'text-red-600'
})

// Methods
const handleBuy = async (): Promise<void> => {
  loading.value = true
  try {
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Buy transaction initiated for Wancash token')
    // Di sini bisa ditambahkan logic untuk membuka modal atau redirect ke exchange
  } catch (error) {
    console.error('Buy transaction failed:', error)
  } finally {
    loading.value = false
  }
}

const handleSell = async (): Promise<void> => {
  loading.value = true
  try {
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Sell transaction initiated for Wancash token')
    // Di sini bisa ditambahkan logic untuk membuka modal atau redirect ke exchange
  } catch (error) {
    console.error('Sell transaction failed:', error)
  } finally {
    loading.value = false
  }
}

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
  // Simulasi update harga secara random
  const randomChange = (Math.random() - 0.5) * 0.1
  currentPrice.value += randomChange * currentPrice.value
  priceChange.value = (Math.random() - 0.5) * 20
  updateLastUpdated()
}

// Lifecycle hooks
onMounted(() => {
  updateLastUpdated()

  // Simulasi update data secara berkala
  const interval = setInterval(() => {
    simulatePriceUpdate()
  }, 5000)

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
</style>
