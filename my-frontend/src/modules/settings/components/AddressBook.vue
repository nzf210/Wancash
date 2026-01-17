<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Saved Addresses</h3>
            <Button @click="openDialog()" size="sm">
                Add New
            </Button>
        </div>

        <!-- List -->
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div v-if="loading && addresses.length === 0" class="p-8 text-center text-gray-500">
                Loading...
            </div>
            <div v-else-if="addresses.length === 0" class="p-8 text-center text-gray-500">
                No saved addresses yet.
            </div>
            <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
                <div v-for="entry in addresses" :key="entry.id"
                    class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <!-- Placeholder Icon -->
                            <span class="font-bold text-gray-500">{{ entry.label.charAt(0).toUpperCase() }}</span>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">{{ entry.label }}</p>
                            <p class="text-sm font-mono text-gray-500">{{ shortenAddress(entry.wallet) }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <Button variant="ghost" size="icon" @click="openDialog(entry)">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                </path>
                            </svg>
                        </Button>
                        <Button variant="ghost" size="icon" class="text-red-500 hover:text-red-700 hover:bg-red-50"
                            @click="confirmDelete(entry)">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                </path>
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dialog -->
        <Dialog :open="showDialog" @update:open="showDialog = $event">
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{{ editingId ? 'Edit Address' : 'Add New Address' }}</DialogTitle>
                </DialogHeader>
                <div class="grid gap-4 py-4">
                    <div class="grid gap-2">
                        <Label>Label</Label>
                        <Input v-model="form.label" placeholder="e.g. My Ledger" />
                    </div>
                    <div class="grid gap-2">
                        <Label>Wallet Address</Label>
                        <Input v-model="form.wallet" placeholder="0x..." />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showDialog = false">Cancel</Button>
                    <Button @click="saveAddress" :disabled="loading">
                        {{ loading ? 'Saving...' : 'Save' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useAddressBookStore } from '../store/addressBookStore'
import { storeToRefs } from 'pinia'
import { useConnection } from '@wagmi/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'vue-sonner'
import type { AddressBookEntry } from '../services/addressBookApi'

const store = useAddressBookStore()
const { addresses, loading } = storeToRefs(store)
const { address } = useConnection()

const showDialog = ref(false)
const editingId = ref<string | null>(null)
const form = ref({
    label: '',
    wallet: ''
})

onMounted(() => {
    if (address.value) {
        store.fetchAddresses(address.value)
    }
})

const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const openDialog = (entry?: AddressBookEntry) => {
    if (entry) {
        editingId.value = entry.id
        form.value = {
            label: entry.label,
            wallet: entry.wallet
        }
    } else {
        editingId.value = null
        form.value = { label: '', wallet: '' }
    }
    showDialog.value = true
}

const saveAddress = async () => {
    if (!address.value) return

    if (!form.value.label || !form.value.wallet) {
        toast.error('Please fill all fields')
        return
    }

    let success = false
    if (editingId.value) {
        success = await store.updateAddress(address.value, editingId.value, form.value)
    } else {
        success = await store.addAddress(address.value, form.value)
    }

    if (success) {
        showDialog.value = false
    }
}

const confirmDelete = async (entry: AddressBookEntry) => {
    if (!address.value) return
    if (confirm(`Delete ${entry.label}?`)) {
        await store.deleteAddress(address.value, entry.id)
    }
}
</script>
