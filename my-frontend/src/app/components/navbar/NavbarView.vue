<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import NavbarDesktop from './NavbarDesktop.vue'
import NavbarMobile from './NavbarMobile.vue'
import type { NavbarProps, NavbarEmits } from './types'

const props = withDefaults(defineProps<NavbarProps>(), {
  showWalletConnect: true,
  showThemeToggle: true,
})

const emit = defineEmits<NavbarEmits>()

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
  <NavbarDesktop v-if="!isMobile" v-bind="props" @login="emit('login')" @logout="emit('logout')"
    @profile-click="emit('profileClick')" @settings-click="emit('settingsClick')"
    @notification-click="emit('notificationClick')" />
  <NavbarMobile v-else v-bind="props" @login="emit('login')" @logout="emit('logout')"
    @profile-click="emit('profileClick')" @settings-click="emit('settingsClick')"
    @notification-click="emit('notificationClick')" />
</template>
