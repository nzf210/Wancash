<script setup lang="ts">
import { ref } from 'vue'
import TokenPanel from '../components/TokenPanel.vue'

interface Token {
  symbol: string
  icon: string
}

interface Network {
  name: string
  icon: string
}

// Contoh token & network dummy
const tokenList = [
  { symbol: 'USDC', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=024' },
  { symbol: 'ETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=024' },
  { symbol: 'BTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=024' }
]

const networkList = [
  { name: 'Arbitrum', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=024' },
  { name: 'Avalanche', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=024' },
  { name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=024' }
]

// State
const fromToken = ref<Token>(tokenList[0])
const toToken = ref<Token>(tokenList[0])

const fromNetwork = ref<Network>(networkList[0])
const toNetwork = ref<Network>(networkList[1])

const fromAmount = ref<number | null>(null)
const toAmount = ref<number | null>(null)

const customAddress = ref(false)
const isSimpleTransfer = ref(true)

// Swap token/network on click
function swapTokens() {
  const tmpToken = fromToken.value
  fromToken.value = toToken.value
  toToken.value = tmpToken

  const tmpNetwork = fromNetwork.value
  fromNetwork.value = toNetwork.value
  toNetwork.value = tmpNetwork

  const tmpAmount = fromAmount.value
  fromAmount.value = toAmount.value
  toAmount.value = tmpAmount
}

// Dummy connect wallet
function connectWallet() {
  alert('Connect wallet clicked')
}

/**
 *
  interface TokenPanelProps {
  title: string
  token: Token
  network: Network
  amount: number | null
  showMax?: boolean
  customAddress?: boolean
  // Events
  'update:amount'?: (val: number | null) => void
  selectToken?: (token: Token) => void
  selectNetwork?: (network: Network) => void
  toggleCustomAddress?: (val: boolean) => void
}
*/
</script>

<template>
  <div
    class="bg-black bg-[url('/stars.png')] bg-no-repeat bg-center bg-cover flex flex-col justify-center items-center px-4">
    <!-- Container utama -->
    <div class="bg-gray-900 bg-opacity-80 rounded-xl p-6 max-w-md w-full space-y-6 text-white">
      <!-- Panel atas -->
      <TokenPanel title="Connect EVM Wallet" :token="fromToken" :network="fromNetwork" :amount="Number(fromAmount)"
        :showMax="true" @update:amount="val => fromAmount = val" @selectToken="token => fromToken = token"
        @selectNetwork="network => fromNetwork = network" />

      <!-- Divider -->
      <div class="flex justify-center">
        <div class="border border-gray-600 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
          @click="swapTokens">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      <!-- Panel bawah -->
      <TokenPanel title="Connect EVM Wallet" :token="toToken" :network="toNetwork" :amount="Number(toAmount)"
        :customAddress="customAddress" @update:amount="val => toAmount = val" @selectToken="token => toToken = token"
        @selectNetwork="network => toNetwork = network" @toggleCustomAddress="val => customAddress = val" />

      <!-- Tombol Connect Wallet -->
      <button class="mt-6 w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-300 transition"
        @click="connectWallet">
        Connect Wallet
      </button>

      <!-- Transfer Mode -->
      <div class="mt-6 flex justify-center gap-4 text-sm text-gray-400 select-none">
        <button
          :class="['px-3 py-1 rounded-full', isSimpleTransfer ? 'bg-green-700 text-green-300' : 'hover:bg-gray-700']"
          @click="isSimpleTransfer = true">
          Simple Transfer
        </button>
        <button :class="['px-3 py-1 rounded-full', !isSimpleTransfer ? 'bg-gray-700 text-white' : 'hover:bg-gray-700']"
          @click="isSimpleTransfer = false">
          Advanced Transfer
        </button>
      </div>

      <div class="mt-2 text-xs text-gray-500">
        NEW <a href="#" class="underline text-blue-400 hover:text-blue-600">Learn more</a> about new update
      </div>
    </div>
  </div>
</template>
