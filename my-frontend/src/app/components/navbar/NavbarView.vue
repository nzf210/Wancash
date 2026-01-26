<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import NavbarDesktop from './NavbarDesktop.vue'
import NavbarMobile from './NavbarMobile.vue'
// Responsive state
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <NavbarDesktop v-if="!isMobile" :show-theme-toggle="true" />
  <NavbarMobile v-else :show-theme-toggle="true" />
</template>
