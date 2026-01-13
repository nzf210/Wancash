<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DynamicNavbar from '@/app/components/navbar/NavbarView.vue'
import FooterView from '@/app/components/FooterView.vue'
import { useAuth } from '@/app/composables/useAuth'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()
const { isAuthenticated, logout, user } = useAuth()
const notificationStore = useNotificationStore()

// Reactive user data
const currentUser = ref({
  name: 'Wancash User',
  email: 'support@wancash.com',
  avatar: 'https://avatars.githubusercontent.com/u/124599?v=4',
  initials: 'WCH'
})

// Event handlers
const handleLogin = () => {
  router.push('/login')
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const handleProfileClick = () => {
  router.push('/profile')
}

const handleSettingsClick = () => {
  router.push('/settings')
}

const handleNotificationClick = () => {
  router.push('/notifications')
  // Mark notifications as read
  notificationStore.markAllAsRead()
}
</script>

<template>

  <div id="app" class="min-h-screen flex flex-col">
    <!-- Dynamic Navbar with fallback listeners -->
    <DynamicNavbar @login="handleLogin" @logout="handleLogout" @profile-click="handleProfileClick"
      @settings-click="handleSettingsClick" @notification-click="handleNotificationClick" />
    <!-- Main content -->
    <main class="container mx-auto p-4">
      <RouterView />
    </main>
    <FooterView class="mt-auto h-20" />
  </div>
</template>
