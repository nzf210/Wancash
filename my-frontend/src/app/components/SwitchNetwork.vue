<script setup lang="ts">
import { useAppKitNetwork } from '@reown/appkit/vue'
import { polygon, arbitrum } from '@reown/appkit/networks'

const { value: { chainId, caipNetwork, switchNetwork } } = useAppKitNetwork()

async function switchToPolygon() {
  await switchNetwork(polygon) // Ganti dengan chain object yang diinginkan
}

async function switchToArbitrum() {
  await switchNetwork(arbitrum)
}
</script>

<template>
  <div>
    <p>Current Chain ID: {{ chainId }}</p>
    <p>Current Network: {{ caipNetwork?.name }}</p>

    <button @click="switchToPolygon">Switch to Polygon</button>
    <button @click="switchToArbitrum">Switch to Arbitrum</button>
  </div>
</template>
