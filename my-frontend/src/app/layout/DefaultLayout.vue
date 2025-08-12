<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DynamicNavbar from '@/app/components/NavbarView.vue'
import { useAuthStore } from '@/app/stores/auth'
import { useNotificationStore } from '@/app/stores/notifications'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Reactive user data
const currentUser = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://avatars.githubusercontent.com/u/124599?v=4',
  initials: 'JD'
})

// Event handlers
const handleLogin = () => {
  router.push('/login')
}

const handleLogout = async () => {
  try {
    await authStore.logout()
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
  <div id="app">
    <!-- Dynamic Navbar with all props -->
    <DynamicNavbar :user="authStore.isAuthenticated ? currentUser : undefined"
      :notification-count="notificationStore.unreadCount" :is-authenticated="authStore.isAuthenticated"
      :show-wallet-connect="true" :show-theme-toggle="true" @login="handleLogin" @logout="handleLogout"
      @profile-click="handleProfileClick" @settings-click="handleSettingsClick"
      @notification-click="handleNotificationClick" />

    <!-- Main content -->
    <main>
      <RouterView />
    </main>
  </div>
</template>
