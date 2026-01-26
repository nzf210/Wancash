<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <DialogHeader>
        <DialogTitle class="text-gray-900 dark:text-white">Address Book</DialogTitle>
        <DialogDescription class="text-gray-600 dark:text-gray-400">Select from contacts you've sent to before
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4 py-4">
        <Input placeholder="Search name or address..." :value="addressBookSearch"
          class="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
          @input="$emit('update:address-book-search', $event.target.value)" />
        <div v-if="filteredAddressBook.length === 0" class="text-center py-6">
          <p class="text-gray-500 dark:text-gray-400">No contacts found</p>
        </div>
        <div v-else class="space-y-2 max-h-60 overflow-y-auto">
          <div v-for="contact in filteredAddressBook" :key="contact.address"
            class="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors"
            @click="$emit('select-contact', contact)">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ contact.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-mono">{{ shortenAddress(contact.address) }}</p>
            </div>
            <Button
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-4">Select</Button>
          </div>
        </div>
      </div>
      <DialogFooter class="flex-col sm:flex-row gap-2">
        <Button @click="$emit('update:open', false)"
          class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">Close</Button>
        <Button @click="$emit('show-add-contact')"
          class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">Add
          New Contact</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const props = defineProps<{ open: boolean; addressBook: Array<{ name: string; address: string }>; addressBookSearch: string }>()

defineEmits<{ 'update:open': [boolean]; 'update:address-book-search': [string]; 'select-contact': [{ name: string; address: string }]; 'show-add-contact': [] }>()

const filteredAddressBook = computed(() => {
  if (!props.addressBookSearch) return props.addressBook
  const searchTerm = props.addressBookSearch.toLowerCase()
  return props.addressBook.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm) ||
    contact.address.toLowerCase().includes(searchTerm)
  )
})

const shortenAddress = (address: string) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
</script>
