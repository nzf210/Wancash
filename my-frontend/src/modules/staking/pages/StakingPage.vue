<!-- src/modules/staking/pages/StakingPage.vue -->
<template>
  <h1 class="text-xl font-bold mb-4">Staking</h1>
  <StakeForm />
  <StakeOverview class="mt-6" />
</template>

<script setup lang="ts">
import StakeForm from '../components/StakingForm.vue'
</script>
