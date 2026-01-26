<template>
  <div class="min-h-screen bg-gradient-to-b from-background to-card/50 p-4 md:p-6 transition-colors">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Profile & Settings</h1>
        <p class="text-muted-foreground mt-2">Manage your profile information and account preferences</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-destructive mb-4">{{ error }}</p>
        <Button @click="loadProfile">Try Again</Button>
      </div>

      <!-- Content -->
      <div v-else class="flex flex-col lg:flex-row gap-6">
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
              <ProfileForm :profile="profileStore.profile" :loading="profileStore.loading" @save="handleProfileSave" />
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
              <AccountSettingsComponent :settings="profileStore.settings" :loading="profileStore.loading"
                @save="handleSettingsSave" />
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
              <NotificationSettingsComponent :notifications="profileStore.notifications" :loading="profileStore.loading"
                @save="handleNotificationsSave" />
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
              <PrivacySettingsComponent :privacy="profileStore.privacy" :loading="profileStore.loading"
                @save="handlePrivacySave" @delete-account="handleDeleteAccount" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
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
import { useAuth } from '@/app/composables/useAuth'
import { useProfileStore } from '../store/profileStore'
import type { Profile, UserSettings, NotificationSettings as NotificationSettingsType, PrivacySettings as PrivacySettingsType } from '../services/profileApi'

// Components
import ProfileForm from '../components/ProfileForm.vue'
import AccountSettingsComponent from '../components/AccountSettings.vue'
import NotificationSettingsComponent from '../components/NotificationSettings.vue'
import PrivacySettingsComponent from '../components/PrivacySettings.vue'

// Composables & Store
const router = useRouter()
const { walletAddress, logout } = useAuth()
const profileStore = useProfileStore()

// State
const activeTab = ref('profile')

// Computed
const loading = computed(() => profileStore.loading)
const error = computed(() => profileStore.error)

// Tab navigation
const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield }
]

// Load profile on mount
onMounted(async () => {
  await loadProfile()
})

async function loadProfile() {
  if (walletAddress.value) {
    await profileStore.fetchProfile(walletAddress.value)
  }
}

// Event handlers
async function handleProfileSave(data: Partial<Profile>) {
  if (walletAddress.value) {
    await profileStore.updateProfile(walletAddress.value, data)
  }
}

async function handleSettingsSave(data: Partial<UserSettings>) {
  if (walletAddress.value) {
    await profileStore.updateSettings(walletAddress.value, data)
  }
}

async function handleNotificationsSave(data: Partial<NotificationSettingsType>) {
  if (walletAddress.value) {
    await profileStore.updateNotifications(walletAddress.value, data)
  }
}

async function handlePrivacySave(data: Partial<PrivacySettingsType>) {
  if (walletAddress.value) {
    await profileStore.updatePrivacy(walletAddress.value, data)
  }
}

async function handleDeleteAccount() {
  if (!walletAddress.value) return

  const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.')
  if (!confirmed) return

  const success = await profileStore.deleteAccount(walletAddress.value)
  if (success) {
    await logout()
    router.push('/')
  }
}
</script>

<style scoped>
/* Using custom properties from theme system */
:root {
  --shadow-soft: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.dark {
  --shadow-soft: 0 2px 10px rgba(0, 0, 0, 0.15);
}
</style>
