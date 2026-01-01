<script setup lang="ts">
import WalletAuthButton from './WalletAuthButton.vue'
defineProps<{
  isMobile: boolean
}>()

</script>

<template>
  <div class="wallet-actions">
    <WalletAuthButton :is-mobile="isMobile" />
  </div>
</template>

<style scoped>
.wallet-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
