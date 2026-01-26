<template>
  <div class="space-y-6">
    <!-- Email Notifications -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Email Notifications</h3>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Promotions & Offers</h4>
            <p class="text-sm text-muted-foreground">Receive information about promotions and special offers</p>
          </div>
          <Switch v-model:checked="localNotifications.email_promotions" class="data-[state=checked]:bg-primary" />
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Security Updates</h4>
            <p class="text-sm text-muted-foreground">Notifications about suspicious account activity</p>
          </div>
          <Switch v-model:checked="localNotifications.email_security" class="data-[state=checked]:bg-primary" />
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Weekly Newsletter</h4>
            <p class="text-sm text-muted-foreground">Summary of activities and latest content</p>
          </div>
          <Switch v-model:checked="localNotifications.email_newsletter" class="data-[state=checked]:bg-primary" />
        </div>
      </div>
    </div>

    <!-- Push Notifications -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">App Notifications</h3>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Someone Mentions You</h4>
            <p class="text-sm text-muted-foreground">When someone mentions you in a comment or post</p>
          </div>
          <Switch v-model:checked="localNotifications.push_mentions" class="data-[state=checked]:bg-primary" />
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">New Comments</h4>
            <p class="text-sm text-muted-foreground">Notifications for new comments on your posts</p>
          </div>
          <Switch v-model:checked="localNotifications.push_comments" class="data-[state=checked]:bg-primary" />
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">System Updates</h4>
            <p class="text-sm text-muted-foreground">Information about system updates and maintenance</p>
          </div>
          <Switch v-model:checked="localNotifications.push_updates" class="data-[state=checked]:bg-primary" />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-border">
      <Button variant="outline" @click="resetNotifications" :disabled="loading"
        class="border-input hover:bg-accent hover:text-accent-foreground">
        Reset
      </Button>
      <Button @click="saveNotifications" :disabled="loading"
        class="bg-primary text-primary-foreground hover:bg-primary/90">
        <span v-if="loading" class="mr-2 animate-spin">⏳</span>
        Save Preferences
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import type { NotificationSettings as NotificationSettingsType } from '../services/profileApi'

const props = defineProps<{
  notifications: NotificationSettingsType | null
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [data: Partial<NotificationSettingsType>]
}>()

// Local state
const localNotifications = ref({
  email_promotions: false,
  email_security: true,
  email_newsletter: false,
  push_mentions: true,
  push_comments: true,
  push_updates: false
})

// Watch for prop changes
watch(() => props.notifications, (newVal) => {
  if (newVal) {
    localNotifications.value = {
      email_promotions: newVal.email_promotions ?? false,
      email_security: newVal.email_security ?? true,
      email_newsletter: newVal.email_newsletter ?? false,
      push_mentions: newVal.push_mentions ?? true,
      push_comments: newVal.push_comments ?? true,
      push_updates: newVal.push_updates ?? false
    }
  }
}, { immediate: true, deep: true })

// Methods
const saveNotifications = () => {
  emit('save', localNotifications.value)
}

const resetNotifications = () => {
  if (props.notifications) {
    localNotifications.value = {
      email_promotions: props.notifications.email_promotions ?? false,
      email_security: props.notifications.email_security ?? true,
      email_newsletter: props.notifications.email_newsletter ?? false,
      push_mentions: props.notifications.push_mentions ?? true,
      push_comments: props.notifications.push_comments ?? true,
      push_updates: props.notifications.push_updates ?? false
    }
  }
}
</script>
