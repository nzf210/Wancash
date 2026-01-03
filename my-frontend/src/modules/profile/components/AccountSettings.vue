<template>
  <div class="space-y-6"> <!-- Language -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Language & Region Preferences</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div> <Label for="language" class="text-foreground">Language</Label> <Select v-model="localSettings.language">
            <SelectTrigger class="mt-1 bg-background border-input text-foreground">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent class="bg-popover border-border">
              <SelectItem value="id">Bahasa Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select> </div>
        <div>
          <Label for="timezone" class="text-foreground">Timezone</Label>
          <Select v-model="localSettings.timezone">
            <SelectTrigger class="mt-1 bg-background border-input text-foreground">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent class="bg-popover border-border">
              <SelectItem value="Asia/Jakarta">Jakarta (GMT+7)</SelectItem>
              <SelectItem value="Asia/Makassar">Makassar (GMT+8)</SelectItem>
              <SelectItem value="Asia/Jayapura">Jayapura (GMT+9)</SelectItem>
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
              <!-- Theme preview -->
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
            <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
            <SelectItem value="USD">US Dollar (USD)</SelectItem>
            <SelectItem value="EUR">Euro (EUR)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-border">
      <Button variant="outline" @click="resetSettings"
        class="border-input hover:bg-accent hover:text-accent-foreground">
        Reset
      </Button>
      <Button @click="saveSettings" class="bg-primary text-primary-foreground hover:bg-primary/90">
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

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:settings'])

// Data lokal
const localSettings = ref({ ...props.settings })

// Opsi tema
const themes = [
  {
    value: 'light',
    label: 'Terang',
    sidebar: 'bg-gray-100',
    content: 'bg-gray-200'
  },
  {
    value: 'dark',
    label: 'Gelap',
    sidebar: 'bg-gray-800',
    content: 'bg-gray-700'
  },
  {
    value: 'system',
    label: 'Sistem',
    sidebar: 'bg-gradient-to-r from-gray-100 to-gray-800',
    content: 'bg-gradient-to-r from-gray-200 to-gray-700'
  }
]

// Watch for prop changes
watch(() => props.settings, (newVal) => {
  localSettings.value = { ...newVal }
}, { deep: true })

// Methods
const saveSettings = () => {
  emit('update:settings', localSettings.value)
  alert('Pengaturan akun berhasil disimpan!')
}

const resetSettings = () => {
  localSettings.value = { ...props.settings }
}
</script>
