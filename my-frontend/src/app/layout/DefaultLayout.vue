<script setup lang="ts">
import NavbarView from '../components/NavbarView.vue'
</script>

<template>
  <div
    class="min-h-screen border-b sticky top-0 z-50 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <header class="">
      <NavbarView />
    </header>
    <main class="py-6">
      <slot />
    </main>
  </div>
</template>
