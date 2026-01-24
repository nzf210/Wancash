/**
 * Global Redemption Service
 * Handles all redemption-related API calls
 * This is a global service - all modules should use this instead of module-specific APIs
 */
import { apiClient } from '@/utils/apiClient';
// Product Category Interface
export interface ProductCategory {
    id: string
    name: string
    slug: string
    description?: string
    icon?: string
    display_order: number
    is_active: boolean
    parent_category_id?: string
    product_count?: number
}

// Generic Product Interface (supports all product types)
export interface Product {
    // Identifiers
    id: string
    sku?: string
    slug?: string

    // Basic Info
    name: string
    brand?: string

    // Categorization
    category_id?: string
    category_name?: string  // From API join
    category_icon?: string  // From API join
    sub_category?: string
    tags?: string[]

    // Pricing & Stock
    price_wch: number
    compare_at_price?: number
    cost_price?: number
    stock: number
    low_stock_threshold?: number
    track_inventory?: boolean
    allow_backorder?: boolean

    // Physical Properties (optional - for physical items)
    weight_grams?: number
    purity?: string
    dimensions?: string
    unit?: string

    // Digital Properties (optional - for digital items)
    quantity_unit?: string
    delivery_type?: 'instant' | 'email' | 'manual'
    license_type?: string

    // Descriptions
    description?: string  // Legacy field
    short_description?: string
    long_description?: string

    // Structured Data
    specifications?: Record<string, string>
    features?: string[]
    benefits?: string[]
    metadata?: Record<string, any>

    // Media
    image_url: string
    images?: string[]
    video_url?: string

    // Product Type
    product_type?: 'physical' | 'digital'
    auto_fulfill?: boolean
    fulfillment_data?: Record<string, any>

    // Status & Visibility
    is_active: boolean
    is_featured?: boolean
    is_new?: boolean
    is_on_sale?: boolean

    // SEO
    meta_title?: string
    meta_description?: string
    meta_keywords?: string[]

    // Timestamps
    created_at: string
    updated_at: string
    available_from?: string
    available_until?: string
}

// Backward compatibility alias
export type GoldProduct = Product

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

    // Reconciliation fields
    payment_status?: 'unpaid' | 'pending' | 'confirmed' | 'failed'
    reconciliation_status?: 'pending' | 'verified' | 'failed' | 'manual_review'
    reconciliation_verified_at?: string
    reconciliation_error?: string
    expected_amount?: number
    actual_amount?: number
    expected_recipient?: string
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





// Helper removed - using apiClient

export const redemptionService = {
    async getSettings(): Promise<RedemptionConfig> {
        const response = await apiClient.fetch('/api/redemption/config', {
            method: 'GET'
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
        const response = await apiClient.fetch('/api/redemption/admin/redemption/config', {
            method: 'PUT',
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
        const response = await apiClient.fetch('/api/redemption', {
            method: 'POST',
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
        const response = await apiClient.fetch('/api/redemption', {
            method: 'GET'
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
    async getGoldProducts(): Promise<Product[]> {
        try {
            const response = await apiClient.fetch('/api/products', {
                method: 'GET'
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
                    description: 'Fine Gold 999.9 - 0.1 Gram',
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'gold-1g',
                    name: 'Gold 1g',
                    weight_grams: 1,
                    purity: '99.9%',
                    price_wch: 95,
                    image_url: 'https://via.placeholder.com/150?text=1g+Gold',
                    stock: 50,
                    description: 'Fine Gold 999.9 - 1 Gram',
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'gold-2g',
                    name: 'Gold 2g',
                    weight_grams: 2,
                    purity: '99.9%',
                    price_wch: 185,
                    image_url: 'https://via.placeholder.com/150?text=2g+Gold',
                    stock: 20,
                    description: 'Fine Gold 999.9 - 2 Grams',
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'gold-5g',
                    name: 'Gold 5g',
                    weight_grams: 5,
                    purity: '99.9%',
                    price_wch: 450,
                    image_url: 'https://via.placeholder.com/150?text=5g+Gold',
                    images: ['https://via.placeholder.com/150?text=5g+Gold'],
                    stock: 10,
                    description: 'Fine Gold 999.9 - 5 Grams',
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
            ];
        }
    },

    /**
     * Get all product categories with product counts
     */
    async getCategories(): Promise<ProductCategory[]> {
        try {
            const response = await apiClient.fetch('/api/products/categories', {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Categories endpoint not available');
            }

            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.warn('Failed to fetch categories:', error);
            return [];
        }
    },

    /**
     * Confirm payment after blockchain transaction
     */
    async payRedemption(id: string, transactionHash: string, chainId?: number): Promise<void> {
        const response = await apiClient.fetch(`/api/redemption/${id}/pay`, {
            method: 'POST',
            body: JSON.stringify({
                transaction_hash: transactionHash,
                chain_id: chainId
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to confirm payment');
        }

        // No return value needed as per Promise<void>
    },

    /**
     * Get reconciliation status for a redemption
     */
    async getReconciliationStatus(id: string): Promise<{
        payment_status?: string
        reconciliation_status?: string
        reconciliation_verified_at?: string
        reconciliation_error?: string
        expected_amount?: number
        actual_amount?: number
        expected_recipient?: string
        transaction_hash?: string
    }> {
        const response = await apiClient.fetch(`/api/redemption/${id}/reconciliation-status`, {
            method: 'GET'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch reconciliation status');
        }

        const result = await response.json();
        return result.data;
    },

    /**
     * Admin: Manually trigger payment reconciliation
     */
    async adminReconcilePayment(id: string): Promise<{
        success: boolean
        message?: string
        error?: string
        data?: any
    }> {
        const response = await apiClient.fetch(`/api/redemption/admin/${id}/reconcile`, {
            method: 'POST'
        });

        const result = await response.json();

        if (!response.ok && !result.success) {
            throw new Error(result.error || 'Failed to verify payment');
        }

        return result;
    }
};

export default redemptionService;
