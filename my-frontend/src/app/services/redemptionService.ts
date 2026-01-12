/**
 * Global Redemption Service
 * Handles all redemption-related API calls
 * This is a global service - all modules should use this instead of module-specific APIs
 */

export interface GoldProduct {
    id: string
    name: string
    weight_grams: number
    purity: string
    price_wch: number
    image_url: string
    stock: number
    description: string
}

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
    shipping_cost_token?: number
    total_token_amount?: number
    save_to_profile: boolean
    items: {
        product_id: string
        quantity: number
        snapshot_price: number // Price at time of request
        snapshot_weight: number
    }[]
}

export interface RedemptionItem {
    product_id: string
    quantity: number
    snapshot_name: string
    snapshot_price: number
    snapshot_weight: number
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
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'rejected' | 'waiting_payment'
    tracking_number?: string
    admin_notes?: string
    transaction_hash?: string
    created_at: string
    updated_at?: string
    items?: RedemptionItem[]
}

export interface RedemptionConfig {
    shipping_enabled: boolean
    shipping_cost_wch: number
    treasury_address?: string
}

// Mock Global Config
let globalConfig: RedemptionConfig = {
    shipping_enabled: false,        // Default False (Calculated Later)
    shipping_cost_wch: 0            // 0 when disabled
};

const API_BASE = import.meta.env.VITE_API_URL || '';

export interface GoldProduct {
    id: string
    name: string
    description: string
    weight_grams: number
    purity: string
    price_wch: number
    image_url: string
    stock: number
}

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
    async getSettings(): Promise<RedemptionConfig> {
        const response = await fetch(`${API_BASE}/api/redemption/config`, {
            method: 'GET',
            credentials: 'include',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            // Fallback to default if endpoint doesn't exist yet
            console.warn('Redemption config endpoint not available, using defaults');
            return { ...globalConfig };
        }

        const result = await response.json();
        return result.data || { ...globalConfig };
    },

    // For Demo / Admin Simulation
    async updateSettings(newConfig: Partial<RedemptionConfig>) {
        const response = await fetch(`${API_BASE}/api/redemption/admin/redemption/config`, {
            method: 'PUT',
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(newConfig)
        });

        if (!response.ok) {
            // Fallback for local testing
            console.warn('Admin config endpoint not available, updating local state');
            globalConfig = { ...globalConfig, ...newConfig };
            return globalConfig;
        }

        const result = await response.json();
        return result.data;
    },
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
    },

    /**
     * Get available gold products
     * Fetches from backend, falls back to mock data if not available
     */
    async getGoldProducts(): Promise<GoldProduct[]> {
        try {
            const response = await fetch(`${API_BASE}/api/products`, {
                method: 'GET',
                credentials: 'include',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Products endpoint not available');
            }

            const result = await response.json();
            return result.data || [];
        } catch (error) {
            // Fallback to mock data for development
            console.warn('Using mock product data:', error);
            return [
                {
                    id: 'gold-0.1g',
                    name: 'Gold 0.1g',
                    weight_grams: 0.1,
                    purity: '99.9%',
                    price_wch: 10,
                    image_url: 'https://via.placeholder.com/150?text=0.1g+Gold',
                    stock: 100,
                    description: 'Fine Gold 999.9 - 0.1 Gram'
                },
                {
                    id: 'gold-1g',
                    name: 'Gold 1g',
                    weight_grams: 1,
                    purity: '99.9%',
                    price_wch: 95,
                    image_url: 'https://via.placeholder.com/150?text=1g+Gold',
                    stock: 50,
                    description: 'Fine Gold 999.9 - 1 Gram'
                },
                {
                    id: 'gold-2g',
                    name: 'Gold 2g',
                    weight_grams: 2,
                    purity: '99.9%',
                    price_wch: 185,
                    image_url: 'https://via.placeholder.com/150?text=2g+Gold',
                    stock: 20,
                    description: 'Fine Gold 999.9 - 2 Grams'
                },
                {
                    id: 'gold-5g',
                    name: 'Gold 5g',
                    weight_grams: 5,
                    purity: '99.9%',
                    price_wch: 450,
                    image_url: 'https://via.placeholder.com/150?text=5g+Gold',
                    stock: 10,
                    description: 'Fine Gold 999.9 - 5 Grams'
                },
            ];
        }
    },

    /**
     * Confirm payment after blockchain transaction
     */
    async payRedemption(id: string, transactionHash: string): Promise<void> {
        const response = await fetch(`${API_BASE}/api/redemption/${id}/pay`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ transaction_hash: transactionHash })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to confirm payment');
        }

        // No return value needed as per Promise<void>
    },
};

export default redemptionService;
