<template>
  <div class="min-h-screen bg-gradient-to-b from-background to-card/50 p-4 md:p-6 transition-colors">
    <div class="max-w-6xl mx-auto"> <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Profile & Settings</h1>
        <p class="text-muted-foreground mt-2">Manage your profile information and account preferences</p>
      </div>
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Navigation Sidebar -->
        <div class="lg:w-1/4">
          <Card class="sticky top-6 border-border bg-card shadow-soft">
            <CardContent class="p-4">
              <div class="space-y-2">
                <Button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" variant="ghost"
                  class="w-full justify-start transition-all duration-200 group" :class="activeTab === tab.id
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'">
                  <component :is="tab.icon" class="mr-3 h-5 w-5 transition-colors" :class="activeTab === tab.id
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-primary'" />
                  {{ tab.label }}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Main Content -->
        <div class="lg:w-3/4">
          <!-- Profile Tab -->
          <Card v-if="activeTab === 'profile'" class="mb-6 border-border bg-card shadow-soft card-glow">
            <CardHeader class="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border pb-0">
              <CardTitle class="flex items-center text-foreground translate-y-3">
                <User class="mr-2 h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription class="text-muted-foreground translate-y-3">
                Your personal information and how you appear on the platform
              </CardDescription>
            </CardHeader>
            <CardContent class="pt-2">
              <ProfileForm :user="user" @update:user="handleUserUpdate" />
            </CardContent>
          </Card>

          <!-- Account Settings Tab -->
          <Card v-if="activeTab === 'account'" class="mb-6 border-border bg-card shadow-soft card-glow">
            <CardHeader class="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border pb-4">
              <CardTitle class="flex items-center text-foreground translate-y-3">
                <Settings class="mr-2 h-5 w-5 text-primary" />
                Account Settings
              </CardTitle>
              <CardDescription class="text-muted-foreground translate-y-3">
                Manage your account preferences and security
              </CardDescription>
            </CardHeader>
            <CardContent class="pt-6">
              <AccountSettings :settings="user.settings" @update:settings="handleSettingsUpdate" />
            </CardContent>
          </Card>

          <!-- Notifications Tab -->
          <Card v-if="activeTab === 'notifications'" class="mb-6 border-border bg-card shadow-soft card-glow">
            <CardHeader class="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border pb-4">
              <CardTitle class="flex items-center text-foreground translate-y-3">
                <Bell class="mr-2 h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription class="text-muted-foreground translate-y-3">
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent class="pt-6">
              <NotificationSettings :notifications="user.notifications"
                @update:notifications="handleNotificationsUpdate" />
            </CardContent>
          </Card>

          <!-- Privacy Tab -->
          <Card v-if="activeTab === 'privacy'" class="mb-6 border-border bg-card shadow-soft card-glow">
            <CardHeader class="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border pb-4">
              <CardTitle class="flex items-center text-foreground translate-y-3">
                <Shield class="mr-2 h-5 w-5 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription class="text-muted-foreground translate-y-3">
                Manage your account privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent class="pt-6">
              <PrivacySettings :privacy="user.privacy" @update:privacy="handlePrivacyUpdate" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  User,
  Settings,
  Bell,
  Shield,
} from 'lucide-vue-next'

// Komponen anak
import ProfileForm from '../components/ProfileForm.vue'
import AccountSettings from '../components/AccountSettings.vue'
import NotificationSettings from '../components/NotificationSettings.vue'
import PrivacySettings from '../components/PrivacySettings.vue'

// State
const activeTab = ref('profile')

// Data pengguna
const user = reactive({
  name: 'Ahmad Fauzi',
  email: 'ahmad.fauzi@example.com',
  username: 'ahmadfauzi',
  bio: 'Frontend Developer dengan spesialisasi Vue.js dan Tailwind CSS',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad',
  role: 'Premium User',
  joinDate: '15 Maret 2023',

  // Pengaturan akun
  settings: {
    language: 'id',
    theme: 'light',
    timezone: 'Asia/Jakarta',
    currency: 'IDR'
  },

  // Pengaturan notifikasi
  notifications: {
    email: {
      promotions: true,
      security: true,
      newsletter: false
    },
    push: {
      mentions: true,
      comments: true,
      updates: false
    }
  },

  // Pengaturan privasi
  privacy: {
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowTagging: true,
    searchEngineIndex: false
  }
})

// Tab navigasi
const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'account', label: 'Akun', icon: Settings },
  { id: 'notifications', label: 'Notifikasi', icon: Bell },
  { id: 'privacy', label: 'Privasi', icon: Shield }
]

// Event handlers
const handleUserUpdate = (updatedUser: Partial<unknown>) => {
  Object.assign(user, updatedUser)
}

const handleSettingsUpdate = (settings: Partial<unknown>) => {
  user.settings = { ...user.settings, ...settings }
}

const handleNotificationsUpdate = (notifications: Partial<unknown>) => {
  user.notifications = { ...user.notifications, ...notifications }
}

const handlePrivacyUpdate = (privacy: Partial<unknown>) => {
  user.privacy = { ...user.privacy, ...privacy }
}
</script>

<style scoped>
/* Menggunakan custom properties dari theme system */
:root {
  --shadow-soft: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.dark {
  --shadow-soft: 0 2px 10px rgba(0, 0, 0, 0.15);
}
</style>
