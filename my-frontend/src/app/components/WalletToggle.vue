<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  // WalletIcon,
  ChevronDownIcon
} from '@radix-icons/vue'
const isConnected = ref(false)
const showDropdown = ref(false)

// Mock function untuk connect wallet
const connectWallet = async () => {
  // Implementasi asli akan tergantung library wallet yang digunakan (MetaMask, WalletConnect, dll)
  isConnected.value = true
  showDropdown.value = false
}

const disconnectWallet = () => {
  isConnected.value = false
}
</script>

<template>
  <div class="relative">
    <Button @click="isConnected ? showDropdown = !showDropdown : connectWallet()" :class="[
      'transition-all duration-200 background border',

    ]">
      <!-- isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200' -->
      <WalletIcon class="h-4 w-4 mr-2" />
      <span>{{ isConnected ? '0x7f...3a4b' : 'Connect Wallet' }}</span>
      <ChevronDownIcon v-if="isConnected" class="h-4 w-4 ml-2 transition-transform" :class="{
        'rotate-180': showDropdown
      }" />
    </Button>

    <!-- Dropdown Menu -->
    <div v-if="isConnected && showDropdown" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50" :class="[
      'background border',
    ]">
      <div class="px-4 py-2 text-sm text-primary">
        Connected as 0x7f...3a4b
      </div>
      <button @click="disconnectWallet"
        class="w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white text-primary">
        Disconnect
      </button>
    </div>
  </div>
</template>
