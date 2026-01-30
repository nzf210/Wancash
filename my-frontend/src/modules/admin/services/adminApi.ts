// Admin API Service for managing redemption requests and products

export interface AdminRequestFilters {
    status?: string
    wallet_address?: string
    start_date?: string
    end_date?: string
    page?: number
    limit?: number
}

export interface UpdateStatusData {
    status: string
    tracking_number?: string
    admin_notes?: string
    shipping_cost_token?: number
}

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Helper to get auth headers
const getAuthHeaders = (additionalHeaders: Record<string, string> = {}) => {
    const headers: Record<string, string> = { ...additionalHeaders };

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

export const adminApi = {
    /**
     * Get all redemption requests (admin view)
     */
    async getAllRequests(filters?: AdminRequestFilters): Promise<{ data: any[], meta?: any }> {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.wallet_address) params.append('wallet_address', filters.wallet_address);
        if (filters?.start_date) params.append('start_date', filters.start_date);
        if (filters?.end_date) params.append('end_date', filters.end_date);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await fetch(`${API_BASE}/api/redemption/admin/redemption/requests?${params}`, {
            method: 'GET',
            credentials: 'include',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch requests');
        }

        const result = await response.json();
        // Return full result to access meta data
        return result;
    },

    /**
     * Update redemption request status
     */
    async updateRequestStatus(id: string, data: UpdateStatusData): Promise<any> {
        const response = await fetch(`${API_BASE}/api/redemption/admin/redemption/${id}/status`, {
            method: 'PATCH',
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update request status');
        }

        const result = await response.json();
        return result.data;
    },

    /**
     * Get all gold products (admin view)
     */
    async getProducts(): Promise<any[]> {
        const response = await fetch(`${API_BASE}/api/products/admin/products`, {
            method: 'GET',
            credentials: 'include',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch products');
        }

        const result = await response.json();
        return result.data || [];
    },

    /**
     * Get all product categories
     */
    async getCategories(): Promise<any[]> {
        const response = await fetch(`${API_BASE}/api/products/categories`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch categories');
        }

        const result = await response.json();
        return result.data || [];
    },

    /**
     * Create new gold product
     */
    async createProduct(data: any): Promise<any> {
        const response = await fetch(`${API_BASE}/api/products/admin/products`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create product');
        }

        const result = await response.json();
        return result.data;
    },

    /**
     * Update gold product
     */
    async updateProduct(id: string, data: any): Promise<any> {
        console.log('🌐 API: Updating product', id, 'with data:', data);

        const response = await fetch(`${API_BASE}/api/products/admin/products/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });

        console.log('📡 API Response Status:', response.status, response.statusText);

        if (!response.ok) {
            let errorMessage = 'Failed to update product';
            let errorDetails = null;
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
                errorDetails = error;
                console.error('❌ API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: error
                });
            } catch (e) {
                console.error('❌ Failed to parse error response');
                console.error('❌ Raw response status:', response.status, response.statusText);
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('✅ API: Product updated successfully');
        return result.data;
    },

    /**
     * Delete gold product
     */
    async deleteProduct(id: string): Promise<void> {
        const response = await fetch(`${API_BASE}/api/products/admin/products/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete product');
        }
    },

    /**
     * Update redemption configuration
     */
    async updateConfig(settings: { shipping_enabled: boolean; shipping_cost_wch: number }): Promise<any> {
        const response = await fetch(`${API_BASE}/api/redemption/admin/redemption/config`, {
            method: 'PUT',
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(settings)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update configuration');
        }

        const result = await response.json();
        return result.data;
    },

    /**
     * Get dashboard statistics
     */
    async getStats(): Promise<any> {
        const response = await fetch(`${API_BASE}/api/redemption/admin/redemption/stats`, {
            method: 'GET',
            credentials: 'include',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch statistics');
        }

        const result = await response.json();
        return result.data;
    }
};
