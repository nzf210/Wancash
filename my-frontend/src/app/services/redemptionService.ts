/**
 * Global Redemption Service
 * Handles all redemption-related API calls
 * This is a global service - all modules should use this instead of module-specific APIs
 */

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

export interface RedemptionRecord {
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
    updated_at?: string
}

const API_BASE = import.meta.env.VITE_API_URL || '';

// Helper to get auth headers consistently
const getAuthHeaders = (additionalHeaders: Record<string, string> = {}) => {
    const headers: Record<string, string> = { ...additionalHeaders };

    // Get wallet address from localStorage (auth_state)
    const savedAuth = localStorage.getItem('auth_state');
    if (savedAuth) {
        try {
            const parsed = JSON.parse(savedAuth);
            const { address, token } = parsed;
            if (address) {
                headers['X-Wallet-Address'] = address;
            }
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (e) {
            console.warn('Failed to parse auth_state:', e);
        }
    }

    return headers;
};

export const redemptionService = {
    /**
     * Create a new redemption request
     */
    async createRedemption(data: CreateRedemptionRequest): Promise<RedemptionRecord> {
        const response = await fetch(`${API_BASE}/api/redemption`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit redemption request');
        }

        const result = await response.json();
        return result.data;
    },

    /**
     * Get all redemption requests for the current user
     * Always uses the authenticated wallet address from auth_state
     */
    async getRedemptions(): Promise<RedemptionRecord[]> {
        const headers = getAuthHeaders();

        const response = await fetch(`${API_BASE}/api/redemption`, {
            method: 'GET',
            credentials: 'include',
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch redemption history');
        }

        const result = await response.json();
        return result.data || [];
    },

    /**
     * Get a specific redemption request by ID
     */
    async getRedemptionById(id: string): Promise<RedemptionRecord | null> {
        try {
            const redemptions = await this.getRedemptions();
            return redemptions.find(r => r.id === id) || null;
        } catch (error) {
            console.error('Error fetching redemption by ID:', error);
            return null;
        }
    }
};

export default redemptionService;
