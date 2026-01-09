<template>
  <div class="space-y-6">
    <!-- Profile Visibility -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Profile Visibility</h3>
      <div>
        <Label for="profileVisibility" class="text-foreground">Who can see your profile?</Label>
        <Select v-model="localPrivacy.profile_visibility">
          <SelectTrigger class="mt-1 bg-background border-input text-foreground">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent class="bg-popover border-border">
            <SelectItem value="public">Public (Everyone)</SelectItem>
            <SelectItem value="followers">Followers Only</SelectItem>
            <SelectItem value="private">Private (Only You)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Privacy Settings -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Privacy Settings</h3>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Show Online Status</h4>
            <p class="text-sm text-muted-foreground">Allow others to see when you are online</p>
          </div>
          <Switch v-model:checked="localPrivacy.show_online_status" class="data-[state=checked]:bg-primary" />
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Allow Tagging</h4>
            <p class="text-sm text-muted-foreground">Allow others to tag you in posts</p>
          </div>
          <Switch v-model:checked="localPrivacy.allow_tagging" class="data-[state=checked]:bg-primary" />
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Allow Search Engines</h4>
            <p class="text-sm text-muted-foreground">Allow search engines to index your profile</p>
          </div>
          <Switch v-model:checked="localPrivacy.search_engine_index" class="data-[state=checked]:bg-primary" />
        </div>
      </div>
    </div>

    <!-- Security -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Account Security</h3>
      <div class="space-y-3">
        <Button variant="outline"
          class="w-full justify-start text-destructive border-input hover:bg-destructive/10 hover:text-destructive"
          @click="handleDeleteAccount">
          <Trash2 class="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-border">
      <Button variant="outline" @click="resetPrivacy" :disabled="loading"
        class="border-input hover:bg-accent hover:text-accent-foreground">
        Reset
      </Button>
      <Button @click="savePrivacy" :disabled="loading" class="bg-primary text-primary-foreground hover:bg-primary/90">
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
import Switch from '@/components/ui/switch/Switch.vue'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-vue-next'
import type { PrivacySettings as PrivacySettingsType } from '../services/profileApi'

const props = defineProps<{
  privacy: PrivacySettingsType | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [data: Partial<PrivacySettingsType>]
  deleteAccount: []
}>()

// Local state
const localPrivacy = ref({
  profile_visibility: 'public' as 'public' | 'followers' | 'private',
  show_online_status: true,
  allow_tagging: true,
  search_engine_index: false
})

// Watch for prop changes
watch(() => props.privacy, (newVal) => {
  if (newVal) {
    localPrivacy.value = {
      profile_visibility: newVal.profile_visibility || 'public',
      show_online_status: newVal.show_online_status ?? true,
      allow_tagging: newVal.allow_tagging ?? true,
      search_engine_index: newVal.search_engine_index ?? false
    }
  }
}, { immediate: true, deep: true })

// Methods
const savePrivacy = () => {
  emit('save', localPrivacy.value)
}

const resetPrivacy = () => {
  if (props.privacy) {
    localPrivacy.value = {
      profile_visibility: props.privacy.profile_visibility || 'public',
      show_online_status: props.privacy.show_online_status ?? true,
      allow_tagging: props.privacy.allow_tagging ?? true,
      search_engine_index: props.privacy.search_engine_index ?? false
    }
  }
}

const handleDeleteAccount = () => {
  emit('deleteAccount')
}
</script>
