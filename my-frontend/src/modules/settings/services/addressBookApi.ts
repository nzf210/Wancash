import { toast } from 'vue-sonner'

export interface AddressBookEntry {
    id: string
    user_wallet: string
    label: string
    wallet: string
    chain_id?: number
    created_at: string
    updated_at: string
}

export interface CreateAddressBookEntry {
    label: string
    wallet: string
    chain_id?: number
}

export interface UpdateAddressBookEntry {
    label?: string
    wallet?: string
    chain_id?: number
}

import { apiClient } from '@/utils/apiClient'

export const addressBookApi = {
    async getAddressBook(walletAddress: string, chainId?: number): Promise<AddressBookEntry[]> {
        let url = '/api/address-book'
        if (chainId) {
            url += `?chainId=${chainId}`
        }

        const response = await apiClient.fetch(url, {
            method: 'GET',
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to fetch address book')
        }

        const result = await response.json()
        return result.data
    },

    async createEntry(walletAddress: string, data: CreateAddressBookEntry): Promise<AddressBookEntry> {
        const response = await apiClient.fetch('/api/address-book', {
            method: 'POST',
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to add address')
        }

        const result = await response.json()
        toast.success('Address Added')
        return result.data
    },

    async updateEntry(walletAddress: string, id: string, data: UpdateAddressBookEntry): Promise<AddressBookEntry> {
        const response = await apiClient.fetch(`/api/address-book/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to update address')
        }

        const result = await response.json()
        toast.success('Address Updated')
        return result.data
    },

    async deleteEntry(walletAddress: string, id: string): Promise<void> {
        const response = await apiClient.fetch(`/api/address-book/${id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to delete address')
        }

        toast.success('Address Deleted')
    }
}
