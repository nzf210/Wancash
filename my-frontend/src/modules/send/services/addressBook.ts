export interface Contact {
    id?: number;
    user_wallet?: string;
    label?: string;
    wallet?: string;
    chain_id?: number;
    created_at?: string;
    updated_at?: string;
    // Frontend helpers
    name: string;
    address: string;
}

export const addressBookService = {
    async getContacts(walletAddress: string, chainId?: number): Promise<Contact[]> {
        const params = new URLSearchParams()
        if (chainId) params.append('chainId', chainId.toString())

        const response = await fetch(`/api/address-book?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Wallet-Address': walletAddress
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch address book')
        }

        const result = await response.json()
        return result.data.map((item: any) => ({
            ...item,
            name: item.label,
            address: item.wallet
        }))
    },

    async addContact(walletAddress: string, contact: { label: string; wallet: string; chain_id: number }): Promise<Contact> {
        const response = await fetch('/api/address-book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Wallet-Address': walletAddress
            },
            body: JSON.stringify(contact)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to add contact')
        }

        const result = await response.json()
        return {
            ...result.data,
            name: result.data.label,
            address: result.data.wallet
        }
    }
}
