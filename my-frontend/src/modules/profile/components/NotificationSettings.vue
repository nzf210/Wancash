<template>
  <div class="space-y-6"> <!-- Email Notifications -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Email Notifications</h3>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Promotions & Offers</h4>
            <p class="text-sm text-muted-foreground">Receive information about promotions and special offers</p>
          </div>
          <Switch v-model:checked="localNotifications.email.promotions" class="data-[state=checked]:bg-primary" />
        </div>
        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Security Updates</h4>
            <p class="text-sm text-muted-foreground">Notifications about suspicious account activity</p>
          </div>
          <Switch v-model:checked="localNotifications.email.security" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Weekly Newsletter</h4>
            <p class="text-sm text-muted-foreground">Summary of activities and latest content</p>
          </div>
          <Switch v-model:checked="localNotifications.email.newsletter" class="data-[state=checked]:bg-primary" />
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
          <Switch v-model:checked="localNotifications.push.mentions" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">New Comments</h4>
            <p class="text-sm text-muted-foreground">Notifications for new comments on your posts</p>
          </div>
          <Switch v-model:checked="localNotifications.push.comments" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">System Updates</h4>
            <p class="text-sm text-muted-foreground">Information about system updates and maintenance</p>
          </div>
          <Switch v-model:checked="localNotifications.push.updates" class="data-[state=checked]:bg-primary" />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-border">
      <Button variant="outline" @click="resetNotifications"
        class="border-input hover:bg-accent hover:text-accent-foreground">
        Reset
      </Button>
      <Button @click="saveNotifications" class="bg-primary text-primary-foreground hover:bg-primary/90">
        Save Preferences
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

const props = defineProps({
  notifications: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:notifications'])

// Data lokal
const localNotifications = ref(structuredClone(props.notifications))

// Watch for prop changes
watch(() => props.notifications, (newVal) => {
  localNotifications.value = structuredClone(newVal)
}, { deep: true })

// Methods
const saveNotifications = () => {
  emit('update:notifications', localNotifications.value)
  alert('Preferensi notifikasi berhasil disimpan!')
}

const resetNotifications = () => {
  localNotifications.value = structuredClone(props.notifications)
}
</script>
