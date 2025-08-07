<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1 p-4">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/NavbarView.vue'
import Footer from '../components/FooterView.vue'
</script>
