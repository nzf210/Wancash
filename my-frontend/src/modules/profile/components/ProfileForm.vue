<template>
  <div class="space-y-6"> <!-- Profile Picture -->
    <div
      class="flex flex-col items-center md:flex-row md:items-start gap-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-border">
      <div class="relative"> <img :src="localUser.avatar" alt="Profile-img"
          class="h-32 w-32 rounded-full border-4 border-background shadow-lg ring-2 ring-primary/20"> <Button size="sm"
          variant="outline"
          class="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-background border-border hover:bg-accent"
          @click="changeAvatar">
          <Pen class="h-4 w-4 text-muted-foreground" />
        </Button> </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-foreground">{{ localUser.name }}</h3>
        <p class="text-muted-foreground">@{{ localUser.username }}</p>
        <p class="text-muted-foreground mt-2">{{ localUser.bio }}</p>
        <p class="text-sm text-muted-foreground/70 mt-1">Joined {{ localUser.joinDate }}</p>
      </div>
    </div>

    <!-- Profile Data Form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <Label for="name" class="text-foreground">Full Name</Label>
          <Input id="name" v-model="localUser.name"
            class="mt-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
            placeholder="Enter full name" />
        </div>

        <div>
          <Label for="username" class="text-foreground">Username</Label>
          <Input id="username" v-model="localUser.username"
            class="mt-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
            placeholder="Enter username" />
        </div>

        <div>
          <Label for="email" class="text-foreground">Email</Label>
          <Input id="email" v-model="localUser.email" type="email"
            class="mt-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
            placeholder="Enter email" />
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <Label for="bio" class="text-foreground">Bio</Label>
          <Textarea id="bio" v-model="localUser.bio"
            class="mt-1 bg-background border-input text-foreground placeholder:text-muted-foreground resize-none"
            placeholder="Tell a little about yourself" rows="4" :maxlength="200" />
          <p class="text-xs text-muted-foreground mt-1">
            {{ localUser.bio.length }}/200 characters
          </p>
        </div>

        <div>
          <Label for="role" class="text-foreground">Role</Label>
          <Select v-model="localUser.role">
            <SelectTrigger class="mt-1 bg-background border-input text-foreground">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent class="bg-popover border-border">
              <SelectItem value="Basic User">Basic User</SelectItem>
              <SelectItem value="Premium User">Premium User</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-border">
      <Button variant="outline" @click="resetForm" class="border-input hover:bg-accent hover:text-accent-foreground">
        Reset
      </Button>
      <Button @click="saveChanges" class="bg-primary text-primary-foreground hover:bg-primary/90">
        Save Changes
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select/'
import { Button } from '@/components/ui/button'
import { Pen } from 'lucide-vue-next'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:user'])

// Data lokal untuk form
const localUser = ref({ ...props.user })

// Watch for prop changes
watch(() => props.user, (newVal) => {
  localUser.value = { ...newVal }
}, { deep: true })

// Methods
const changeAvatar = () => {
  // Implementasi upload avatar
  alert('Fungsi upload avatar akan diimplementasikan di sini')
}

const saveChanges = () => {
  emit('update:user', localUser.value)
  alert('Perubahan profil berhasil disimpan!')
}

const resetForm = () => {
  localUser.value = { ...props.user }
}
</script>
