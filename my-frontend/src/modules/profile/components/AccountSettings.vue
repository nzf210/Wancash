<template>
  <div class="space-y-6">
    <!-- Language & Region -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Language & Region Preferences</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label for="language" class="text-foreground">Language</Label>
          <Select v-model="localSettings.language">
            <SelectTrigger class="mt-1 bg-background border-input text-foreground">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent class="bg-popover border-border">
              <SelectItem value="id">Bahasa Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label for="timezone" class="text-foreground">Timezone</Label>
          <Select v-model="localSettings.timezone">
            <SelectTrigger class="mt-1 bg-background border-input text-foreground">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent class="bg-popover border-border">
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="Asia/Jakarta">Jakarta (GMT+7)</SelectItem>
              <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
              <SelectItem value="America/New_York">New York (EST)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <!-- Theme -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Theme</h3>
      <div class="flex flex-wrap gap-4">
        <div v-for="themeOption in themes" :key="themeOption.value"
          class="cursor-pointer transition-transform hover:scale-[1.02]"
          @click="localSettings.theme = themeOption.value">
          <div class="h-20 w-32 rounded-lg border-2 p-2 transition-all duration-200" :class="[
            localSettings.theme === themeOption.value
              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          ]">
            <div class="flex h-full">
              <div class="w-1/3 border-r" :class="themeOption.sidebar"></div>
              <div class="w-2/3 p-1">
                <div class="h-2 w-full mb-1 rounded" :class="themeOption.content"></div>
                <div class="h-2 w-3/4 mb-1 rounded" :class="themeOption.content"></div>
              </div>
            </div>
          </div>
          <p class="text-center mt-2 text-sm text-foreground">{{ themeOption.label }}</p>
        </div>
      </div>
    </div>

    <!-- Currency -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Currency</h3>
      <div>
        <Label for="currency" class="text-foreground">Default Currency</Label>
        <Select v-model="localSettings.currency">
          <SelectTrigger class="mt-1 bg-background border-input text-foreground">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent class="bg-popover border-border">
            <SelectItem value="USD">US Dollar (USD)</SelectItem>
            <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
            <SelectItem value="EUR">Euro (EUR)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-border">
      <Button variant="outline" @click="resetSettings" :disabled="loading"
        class="border-input hover:bg-accent hover:text-accent-foreground">
        Reset
      </Button>
      <Button @click="saveSettings" :disabled="loading" class="bg-primary text-primary-foreground hover:bg-primary/90">
        <span v-if="loading" class="mr-2 animate-spin">⏳</span>
        Save Settings
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select/'
import Label from '@/components/ui/label/Label.vue'
import { Button } from '@/components/ui/button'
import type { UserSettings } from '../services/profileApi'

const props = defineProps<{
  settings: UserSettings | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [data: Partial<UserSettings>]
}>()

// Local state
const localSettings = ref({
  language: 'en' as 'en' | 'id',
  theme: 'system' as 'light' | 'dark' | 'system',
  timezone: 'UTC',
  currency: 'USD' as 'USD' | 'IDR' | 'EUR'
})

// Theme options
const themes = [
  { value: 'light' as const, label: 'Light', sidebar: 'bg-gray-100', content: 'bg-gray-200' },
  { value: 'dark' as const, label: 'Dark', sidebar: 'bg-gray-800', content: 'bg-gray-700' },
  { value: 'system' as const, label: 'System', sidebar: 'bg-gradient-to-r from-gray-100 to-gray-800', content: 'bg-gradient-to-r from-gray-200 to-gray-700' }
]

// Watch for prop changes
watch(() => props.settings, (newVal) => {
  if (newVal) {
    localSettings.value = {
      language: newVal.language || 'en',
      theme: newVal.theme || 'system',
      timezone: newVal.timezone || 'UTC',
      currency: newVal.currency || 'USD'
    }
  }
}, { immediate: true, deep: true })

// Methods
const saveSettings = () => {
  emit('save', localSettings.value)
}

const resetSettings = () => {
  if (props.settings) {
    localSettings.value = {
      language: props.settings.language || 'en',
      theme: props.settings.theme || 'system',
      timezone: props.settings.timezone || 'UTC',
      currency: props.settings.currency || 'USD'
    }
  }
}
</script>
