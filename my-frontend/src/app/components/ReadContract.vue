// src/app/components/ReadContract.vue
<script setup lang="ts">
import { useReadContract, useConnection } from '@wagmi/vue'
import { wancashAbi, wancashContractAddress } from '@/app/services/contracts'
import { computed } from 'vue'
import { formatUnits } from 'viem'

const { chainId, address: userAddress } = useConnection()

const contract = computed<string>(() => wancashContractAddress[chainId.value ?? 1] ?? '0x00000000000055603FFe1b11A9e0000000000000') // Fallback to Ethereum if chainId undefined

const { data: balance, isError, isLoading } = useReadContract({
  ...wancashAbi,
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
  <div class="text-foreground">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="isError">Retry Connection...</div>
    <div v-else>{{ formattedBalance ?? 'N/A' }}</div>
  </div>
</template>
