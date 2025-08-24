<!-- src/modules/buy-token/pages/BuyTokenPage.vue -->
<template>
  <div class="container mx-auto w-full">
    <h1 class="text-xl font-bold my-4 bg-red-200 mx-auto w-fit">Buy Wancash</h1>
  </div>
  <TokenInfo />
  <BuyForm class="mt-6" />
</template>

<script setup lang="ts">
import BuyForm from '../components/buyToken.vue'
</script>
