<template>
  <Portfolio :token="token" class="mt-6" />
</template>

<script setup lang="ts">
import Portfolio from '@/modules/portfolio/components/PortfolioUser.vue'

const token = {
  name: 'Wancash',
  symbol: 'WAN',
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  decimals: 18
}

</script>
