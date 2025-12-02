<script setup lang="ts">
import CardView from '../components/cardView.vue';

</script>

<template>
  <div class="grid md:grid-cols-6 gap-1 py-5">
    <div class="col-span-2">
      <CardView class="md:mr-3" />
    </div>
    <div class="col-span-4">
      <CardView class="md:ml-36" />
    </div>
    <!-- <CardView /> -->
  </div>
</template>
