<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const evmWallets = [
  { name: 'Coinbase Smart Wallet', action: 'Connect', icon: 'https://cryptologos.cc/logos/coinbase-coinbase-logo.svg?v=024' },
  { name: 'MetaMask', action: 'Connect', icon: 'https://cryptologos.cc/logos/metamask-metamask-logo.svg?v=024' },
  { name: 'Brave Wallet', action: 'Connect', icon: 'https://cryptologos.cc/logos/brave-brave-logo.svg?v=024' },
  { name: 'WalletConnect', action: 'Connect', icon: 'https://cryptologos.cc/logos/walletconnect-walletconnect-logo.svg?v=024' },
  { name: 'Taho', action: 'Get', icon: 'https://cryptologos.cc/logos/taho-taho-logo.svg?v=024' },
  { name: 'Abstract Global Wallet', action: 'Connect', icon: 'https://cryptologos.cc/logos/abstract-abstract-logo.svg?v=024' },
  { name: 'SafeWallet', action: 'Get', icon: 'https://cryptologos.cc/logos/safewallet-safewallet-logo.svg?v=024' },
]

const solanaWallets = [
  { name: 'Phantom', action: 'Connect', icon: 'https://cryptologos.cc/logos/phantom-phantom-logo.svg?v=024' },
  { name: 'Solflare', action: 'Connect', icon: 'https://cryptologos.cc/logos/solflare-solflare-logo.svg?v=024' },
  { name: 'Slope', action: 'Connect', icon: 'https://cryptologos.cc/logos/slope-slope-logo.svg?v=024' },
]

const aptosWallets = [
  { name: 'Pontem', action: 'Connect', icon: 'https://cryptologos.cc/logos/pontem-pontem-logo.svg?v=024' },
  { name: 'Martian', action: 'Connect', icon: 'https://cryptologos.cc/logos/martian-martian-logo.svg?v=024' },
  { name: 'Petra', action: 'Connect', icon: 'https://cryptologos.cc/logos/petra-petra-logo.svg?v=024' },
  { name: 'Fewcha', action: 'Connect', icon: 'https://cryptologos.cc/logos/fewcha-fewcha-logo.svg?v=024' },
]

const tronWallets = [
  { name: 'TronLink', action: 'Connect', icon: 'https://cryptologos.cc/logos/tron-tron-logo.svg?v=024' },
]

const tonWallets = [
  { name: 'Tonkeeper', action: 'Connect', icon: 'https://cryptologos.cc/logos/ton-ton-logo.svg?v=024' },
]

const emit = defineEmits(['close'])

</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
    <div class="bg-gray-900 text-white w-80 p-6 flex flex-col h-full shadow-lg">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold">Connect Wallet</h2>
        <button @click="$emit('close')" aria-label="Close" class="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <p class="text-sm mb-4 text-gray-400">
        You can only connect one wallet per environment.
      </p>

      <!-- Chain Sections -->
      <div>
        <ChainSection title="EVM" :wallets="evmWallets" />
        <ChainSection title="SOLANA" :wallets="solanaWallets" />
        <ChainSection title="APTOS" :wallets="aptosWallets" />
        <ChainSection title="TRON" :wallets="tronWallets" />
        <ChainSection title="TON" :wallets="tonWallets" />
      </div>
    </div>
  </div>
</template>
