// Redemption API Service
import { toast } from 'vue-sonner'

export interface CreateRedemptionRequest {
    wallet_address: string
    chain_id?: number
    recipient_name: string
    phone_number: string
    whatsapp_number?: string
    telegram_username?: string
    shipping_address: string
    shipping_option: 'included' | 'separate'
    gold_amount_grams: number
    token_amount_gold: number
    shipping_cost_token: number
    total_token_amount: number
    save_to_profile: boolean
}

export interface RedemptionRequest {
    id: string
    user_id: string
    wallet_address: string
    chain_id?: number
    recipient_name: string
    phone_number: string
    whatsapp_number?: string
    telegram_username?: string
    shipping_address: string
    gold_amount_grams: number
    token_amount_gold: number
    shipping_cost_token: number
    total_token_amount: number
    shipping_option: 'included' | 'separate'
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'rejected'
    tracking_number?: string
    admin_notes?: string
    created_at: string
}

const getHeaders = (walletAddress?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    }
    if (walletAddress) {
        headers['X-Wallet-Address'] = walletAddress
    }
    return headers
}

export const redemptionApi = {
    async createRedemption(data: CreateRedemptionRequest): Promise<RedemptionRequest> {
        const response = await fetch('/api/redemption', {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(data.wallet_address),
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to submit redemption request')
        }

        const result = await response.json()
        return result.data
    },

    async getRedemptions(walletAddress: string): Promise<RedemptionRequest[]> {
        const response = await fetch('/api/redemption', {
            method: 'GET',
            credentials: 'include',
            headers: getHeaders(walletAddress)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to fetch redemption history')
        }

        const result = await response.json()
        return result.data
    }
}
