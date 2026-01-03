<template>
  <div class="space-y-6"> <!-- Profile Visibility -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Profile Visibility</h3>
      <div> <Label for="profileVisibility" class="text-foreground">Who can see your profile?</Label> <Select
          v-model="localPrivacy.profileVisibility">
          <SelectTrigger class="mt-1 bg-background border-input text-foreground">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent class="bg-popover border-border">
            <SelectItem value="public">Public (Everyone)</SelectItem>
            <SelectItem value="followers">Followers Only</SelectItem>
            <SelectItem value="private">Private (Only You)</SelectItem>
          </SelectContent>
        </Select> </div>
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
          <Switch v-model:checked="localPrivacy.showOnlineStatus" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Allow Tagging</h4>
            <p class="text-sm text-muted-foreground">Allow others to tag you in posts</p>
          </div>
          <Switch v-model:checked="localPrivacy.allowTagging" class="data-[state=checked]:bg-primary" />
        </div>

        <div
          class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-border hover:bg-accent/50 transition-colors">
          <div>
            <h4 class="font-medium text-foreground">Allow Search Engines</h4>
            <p class="text-sm text-muted-foreground">Allow search engines to index your profile</p>
          </div>
          <Switch v-model:checked="localPrivacy.searchEngineIndex" class="data-[state=checked]:bg-primary" />
        </div>
      </div>
    </div>

    <!-- Security -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground">Account Security</h3>
      <div class="space-y-3">
        <Button variant="outline" class="w-full justify-start border-input hover:bg-accent hover:text-accent-foreground"
          @click="changePassword">
          <Lock class="mr-2 h-4 w-4 text-muted-foreground" />
          Change Password
        </Button>

        <Button variant="outline"
          class="w-full justify-start text-warning border-input hover:bg-warning/10 hover:text-warning"
          @click="manageSessions">
          <Shield class="mr-2 h-4 w-4" />
          Manage Login Sessions
        </Button>

        <Button variant="outline"
          class="w-full justify-start text-destructive border-input hover:bg-destructive/10 hover:text-destructive"
          @click="deleteAccount">
          <Trash2 class="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-border">
      <Button variant="outline" @click="resetPrivacy" class="border-input hover:bg-accent hover:text-accent-foreground">
        Reset
      </Button>
      <Button @click="savePrivacy" class="bg-primary text-primary-foreground hover:bg-primary/90">
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
import { Lock, Shield, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  privacy: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:privacy'])

// Data lokal
const localPrivacy = ref({ ...props.privacy })
const showSessions = ref(false)

const manageSessions = () => {
  showSessions.value = true
}
// Watch for prop changes
watch(() => props.privacy, (newVal) => {
  localPrivacy.value = { ...newVal }
}, { deep: true })

// Methods
const savePrivacy = () => {
  emit('update:privacy', localPrivacy.value)
  alert('Pengaturan privasi berhasil disimpan!')
}

const resetPrivacy = () => {
  localPrivacy.value = { ...props.privacy }
}

const changePassword = () => {
  alert('Fungsi ubah kata sandi akan diimplementasikan di sini')
}

const deleteAccount = () => {
  if (confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) {
    alert('Fungsi hapus akun akan diimplementasikan di sini')
  }
}
</script>
