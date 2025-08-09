<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Staking</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <RewardsCard />
      <StakeForm />
      <UnstakeForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import RewardsCard from '@/modules/staking/components/RewardsCard.vue'
import StakeForm from '@/modules/staking/components/StakeForm.vue'
import UnstakeForm from '@/modules/staking/components/UnstakeForm.vue'
</script>
