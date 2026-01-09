import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addressBookApi, type AddressBookEntry, type CreateAddressBookEntry, type UpdateAddressBookEntry } from '../services/addressBookApi'

export const useAddressBookStore = defineStore('addressBook', () => {
    const addresses = ref<AddressBookEntry[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAddresses(walletAddress: string, chainId?: number) {
        loading.value = true
        error.value = null
        try {
            addresses.value = await addressBookApi.getAddressBook(walletAddress, chainId)
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to fetch addresses'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    async function addAddress(walletAddress: string, data: CreateAddressBookEntry) {
        loading.value = true
        error.value = null
        try {
            const newEntry = await addressBookApi.createEntry(walletAddress, data)
            addresses.value.unshift(newEntry)
            return true
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to add address'
            return false
        } finally {
            loading.value = false
        }
    }

    async function updateAddress(walletAddress: string, id: string, data: UpdateAddressBookEntry) {
        loading.value = true
        error.value = null
        try {
            const updatedEntry = await addressBookApi.updateEntry(walletAddress, id, data)
            const index = addresses.value.findIndex(a => a.id === id)
            if (index !== -1) {
                addresses.value[index] = updatedEntry
            }
            return true
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to update address'
            return false
        } finally {
            loading.value = false
        }
    }

    async function deleteAddress(walletAddress: string, id: string) {
        loading.value = true
        error.value = null
        try {
            await addressBookApi.deleteEntry(walletAddress, id)
            addresses.value = addresses.value.filter(a => a.id !== id)
            return true
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to delete address'
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        addresses,
        loading,
        error,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress
    }
})
