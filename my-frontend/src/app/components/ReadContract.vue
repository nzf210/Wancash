// src/app/components/ReadContract.vue
<script setup lang="ts">
import { useReadContract, useConnection } from '@wagmi/vue'
import { wagmiContractConfig } from '@/app/services/contracts'
import { computed } from 'vue'
import { formatUnits } from 'viem'

const { chainId, address: userAddress } = useConnection()

const contractAddress: Record<number, string> = {
  1: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF', // Ethereum Mainnet
  56: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF', // BSC Mainnet
  8453: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF', // Base
  43114: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF', // Avalanche
  42161: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF', // Arbitrum
  137: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF', // Polygon
  80002: '0x03A71968491d55603FFe1b11A9e23eF013f75bCF', // Amoy
  11155111: '0xcE9F3d7b1d4e5dAe4Ba9F9564d2008667ed59344', // Sepolia
  97: '0x30ca352E6931C5e1e87B7259BA3521BEb6E0013B', // BSC Testnet
  43113: '0x5241625774FB5b9F8e7b8F1fe8b861Af3F6D786b', // Fuji
}

const contract = computed<string>(() => contractAddress[chainId.value ?? 1] ?? '0x03A71968491d55603FFe1b11A9e23eF013f75bCF') // Fallback to Ethereum if chainId undefined

const { data: balance, isError, isLoading } = useReadContract({
  ...wagmiContractConfig,
  address: contract.value as `0x${string}`, // Override address if wagmiContractConfig has a default
  functionName: 'balanceOf',
  args: [userAddress.value as `0x${string}`], // Assumes querying contract's own balance; replace with user address if needed
})

const formattedBalance = computed(() => {
  if (balance.value !== undefined) {
    const balanceStr = formatUnits(balance.value, 18)
    const [integerPart, decimalPart = ''] = balanceStr.split('.')
    const formattedInteger = (integerPart as string).replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedDecimal = decimalPart.padEnd(2, '0').slice(0, 2)
    return `${formattedInteger}.${formattedDecimal}`
  }
  return 'N/A'
})
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Retry Conection...</div>
    <div v-else>{{ formattedBalance ?? 'N/A' }}</div>
  </div>
</template>
