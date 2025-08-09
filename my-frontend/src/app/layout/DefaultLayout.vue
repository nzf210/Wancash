<script setup lang="ts">
import NavbarView from '../components/NavbarView.vue';

</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <NavbarView />
    <main class="py-6">
      <slot />
    </main>
  </div>
</template>
