<template>
  <div class="space-y-6">
    <!-- Profile Picture -->
    <div
      class="flex flex-col items-center md:flex-row md:items-start gap-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-border">
      <div class="relative">
        <img :src="avatarUrl" alt="Profile-img"
          class="h-32 w-32 rounded-full border-4 border-background shadow-lg ring-2 ring-primary/20">
        <Button size="sm" variant="outline"
          class="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-background border-border hover:bg-accent"
          @click="changeAvatar">
          <Pen class="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-foreground">{{ displayName }}</h3>
        <p class="text-muted-foreground">@{{ localProfile.username || 'username' }}</p>
        <p class="text-muted-foreground mt-2">{{ localProfile.bio || 'No bio yet' }}</p>
        <p class="text-sm text-muted-foreground/70 mt-1">
          {{ profile?.wallet_address ? shortenAddress(profile.wallet_address) : '' }}
        </p>
      </div>
    </div>

    <!-- Profile Data Form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <Label for="display_name" class="text-foreground">Display Name</Label>
          <Input id="display_name" v-model="localProfile.display_name"
            class="mt-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
            placeholder="Enter display name" />
        </div>

        <div>
          <Label for="username" class="text-foreground">Username</Label>
          <Input id="username" v-model="localProfile.username"
            class="mt-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
            :class="{ 'border-destructive': usernameError }" placeholder="Enter username (no spaces)"
            @input="validateUsername" />
          <p v-if="usernameError" class="text-xs text-destructive mt-1">{{ usernameError }}</p>
        </div>

        <div>
          <Label for="email" class="text-foreground">Email</Label>
          <Input id="email" v-model="localProfile.email" type="email"
            class="mt-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
            placeholder="Enter email (optional)" />
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <Label for="bio" class="text-foreground">Bio</Label>
          <Textarea id="bio" v-model="localProfile.bio"
            class="mt-1 bg-background border-input text-foreground placeholder:text-muted-foreground resize-none"
            placeholder="Tell a little about yourself" rows="4" :maxlength="500" />
          <p class="text-xs text-muted-foreground mt-1">
            {{ (localProfile.bio || '').length }}/500 characters
          </p>
        </div>

        <div>
          <Label class="text-foreground">Role</Label>
          <div class="mt-1 px-3 py-2 bg-muted/50 rounded-md text-muted-foreground">
            {{ profile?.role || 'Basic User' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-border">
      <Button variant="outline" @click="resetForm" :disabled="loading"
        class="border-input hover:bg-accent hover:text-accent-foreground">
        Reset
      </Button>
      <Button @click="saveChanges" :disabled="loading || !!usernameError"
        class="bg-primary text-primary-foreground hover:bg-primary/90">
        <span v-if="loading" class="mr-2 animate-spin">⏳</span>
        Save Changes
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { Button } from '@/components/ui/button'
import { Pen } from 'lucide-vue-next'
import type { Profile } from '../services/profileApi'

const props = defineProps<{
  profile: Profile | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [data: Partial<Profile>]
}>()

// Local state for form
const localProfile = ref({
  display_name: '',
  username: '',
  email: '',
  bio: '',
  avatar_url: ''
})

// Computed
const displayName = computed(() =>
  localProfile.value.display_name ||
  localProfile.value.username ||
  'User'
)

const avatarUrl = computed(() =>
  localProfile.value.avatar_url ||
  `https://api.dicebear.com/7.x/identicon/svg?seed=${props.profile?.wallet_address || 'default'}`
)

// Helper
function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Watch for prop changes
watch(() => props.profile, (newVal) => {
  if (newVal) {
    localProfile.value = {
      display_name: newVal.display_name || '',
      username: newVal.username || '',
      email: newVal.email || '',
      bio: newVal.bio || '',
      avatar_url: newVal.avatar_url || ''
    }
  }
}, { immediate: true, deep: true })

// Methods
const changeAvatar = () => {
  // TODO: Implement avatar upload
  alert('Avatar upload will be implemented later')
}

const saveChanges = () => {
  emit('save', {
    display_name: localProfile.value.display_name || null,
    username: localProfile.value.username || null,
    email: localProfile.value.email || null,
    bio: localProfile.value.bio || null,
    avatar_url: localProfile.value.avatar_url || null
  })
}

const resetForm = () => {
  if (props.profile) {
    localProfile.value = {
      display_name: props.profile.display_name || '',
      username: props.profile.username || '',
      email: props.profile.email || '',
      bio: props.profile.bio || '',
      avatar_url: props.profile.avatar_url || ''
    }
  }
}

// Username validation
const usernameError = ref('')

const validateUsername = () => {
  const username = localProfile.value.username
  if (!username) {
    usernameError.value = ''
    return
  }
  if (/\s/.test(username)) {
    usernameError.value = 'Username cannot contain spaces'
    // Auto-remove spaces
    localProfile.value.username = username.replace(/\s/g, '')
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    usernameError.value = 'Username can only contain letters, numbers, and underscores'
  } else if (username.length < 3) {
    usernameError.value = 'Username must be at least 3 characters'
  } else if (username.length > 30) {
    usernameError.value = 'Username must be at most 30 characters'
  } else {
    usernameError.value = ''
  }
}
</script>
