<script lang="ts" setup>
import { ref } from 'vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

defineProps<{ open: boolean }>()

const emit = defineEmits<{ 'update:open': [boolean]; 'save-contact': [{ name: string; address: string }] }>()

const localNewContact = ref({ name: '', address: '' })

const handleSave = () => {
  emit('save-contact', { ...localNewContact.value })
  localNewContact.value = { name: '', address: '' }
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <DialogHeader>
        <DialogTitle class="text-gray-900 dark:text-white">Add New Contact</DialogTitle>
      </DialogHeader>
      <div class="space-y-6 py-4">
        <div class="space-y-3">
          <Label for="contact-name" class="text-sm font-medium text-gray-900 dark:text-white">Contact Name</Label>
          <Input id="contact-name" v-model="localNewContact.name" placeholder="Enter contact name"
            class="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl" />
        </div>
        <div class="space-y-3">
          <Label for="contact-address" class="text-sm font-medium text-gray-900 dark:text-white">Wallet Address</Label>
          <Input id="contact-address" v-model="localNewContact.address" placeholder="0x..."
            class="font-mono bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl" />
        </div>
      </div>
      <DialogFooter class="flex-col sm:flex-row gap-2">
        <Button @click="$emit('update:open', false)"
          class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">Cancel</Button>
        <Button @click="handleSave" :disabled="!localNewContact.name || !localNewContact.address"
          class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
