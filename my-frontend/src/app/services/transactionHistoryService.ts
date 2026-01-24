/**
 * Unified Transaction History Service
 * Handles persistent storage for both Send and Bridge transactions
 * Syncs with backend API and uses localStorage as cache/fallback
 */

import { apiClient } from '@/utils/apiClient';

export interface TransactionRecord {
    id: number | string;
    type: 'send' | 'bridge';
    hash: string;
    from: string;
    to: string;
    amount: string;
    tokenSymbol: string;
    fromChainId: number;
    toChainId?: number;        // Only for bridge transactions
    fromChainName?: string;
    toChainName?: string;
    timestamp: number;
    status: 'pending' | 'success' | 'failed';
    memo?: string;             // Optional memo for send transactions
    lzScanUrl?: string;        // LayerZero scan URL for bridge tracking
    isReconciled?: boolean;    // Has been verified on blockchain
}

// API response types
interface ApiTransactionRecord {
    id: string;
    type: 'send' | 'bridge';
    tx_hash: string;
    from_address: string;
    to_address: string;
    amount: string;
    token_symbol: string;
    from_chain_id: number;
    from_chain_name?: string;
    to_chain_id?: number;
    to_chain_name?: string;
    status: 'pending' | 'success' | 'failed';
    memo?: string;
    lz_scan_url?: string;
    is_reconciled?: boolean;
    created_at: string;
}

const STORAGE_KEY = 'wancash_transactions';
const MAX_RECORDS = 100;


// Helper removed - using apiClient

// Helper to convert API record to local format
const mapApiToLocal = (apiTx: ApiTransactionRecord): TransactionRecord => ({
    id: apiTx.id,
    type: apiTx.type,
    hash: apiTx.tx_hash || '',
    from: apiTx.from_address,
    to: apiTx.to_address,
    amount: apiTx.amount,
    tokenSymbol: apiTx.token_symbol,
    fromChainId: apiTx.from_chain_id,
    fromChainName: apiTx.from_chain_name,
    toChainId: apiTx.to_chain_id,
    toChainName: apiTx.to_chain_name,
    timestamp: new Date(apiTx.created_at).getTime(),
    status: apiTx.status,
    memo: apiTx.memo,
    lzScanUrl: apiTx.lz_scan_url,
    isReconciled: apiTx.is_reconciled,
});

export const transactionHistoryService = {
    // ==========================================
    // LOCAL STORAGE METHODS (cache/fallback)
    // ==========================================

    /**
     * Get all transaction records from localStorage
     */
    getAll(): TransactionRecord[] {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (error) {
            console.error('Failed to load transaction history:', error);
            return [];
        }
    },

    /**
     * Get transactions filtered by type
     */
    getByType(type: 'send' | 'bridge'): TransactionRecord[] {
        return this.getAll().filter(tx => tx.type === type);
    },

    /**
     * Add to local storage
     */
    addLocal(tx: Omit<TransactionRecord, 'id'>): TransactionRecord {
        const history = this.getAll();
        const newTx: TransactionRecord = { ...tx, id: Date.now() };
        history.unshift(newTx);
        while (history.length > MAX_RECORDS) history.pop();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        return newTx;
    },

    /**
     * Update local storage by ID
     */
    updateLocal(id: number | string, updates: Partial<TransactionRecord>): boolean {
        const history = this.getAll();
        const index = history.findIndex(tx => tx.id === id);
        if (index !== -1) {
            history[index] = { ...history[index], ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            return true;
        }
        return false;
    },

    /**
     * Update transaction status by hash (legacy method)
     */
    updateStatus(hash: string, status: 'pending' | 'success' | 'failed'): boolean {
        const history = this.getAll();
        const index = history.findIndex(tx => tx.hash === hash);
        if (index !== -1) {
            history[index].status = status;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            return true;
        }
        return false;
    },

    /**
     * Find a transaction by hash
     */
    findByHash(hash: string): TransactionRecord | undefined {
        return this.getAll().find(tx => tx.hash === hash);
    },

    /**
     * Get pending transactions
     */
    getPending(): TransactionRecord[] {
        return this.getAll().filter(tx => tx.status === 'pending');
    },

    /**
     * Get pending bridge transactions
     */
    getPendingBridges(): TransactionRecord[] {
        return this.getAll().filter(tx => tx.type === 'bridge' && tx.status === 'pending');
    },

    /**
     * Clear all local transaction history
     */
    clearAll(): void {
        localStorage.removeItem(STORAGE_KEY);
    },

    // ==========================================
    // API METHODS (sync with backend)
    // ==========================================

    /**
     * Create pending transaction in backend
     * @returns Transaction ID from backend
     */
    async createPending(tx: {
        type: 'send' | 'bridge';
        fromAddress: string;
        toAddress: string;
        amount: string;
        tokenSymbol: string;
        fromChainId: number;
        fromChainName?: string;
        toChainId?: number;
        toChainName?: string;
        memo?: string;
        lzScanUrl?: string;
    }): Promise<{ id: string; localId: number }> {
        // First save to localStorage
        const localTx = this.addLocal({
            type: tx.type,
            hash: '', // No hash yet (DB now allows NULL)
            from: tx.fromAddress,
            to: tx.toAddress,
            amount: tx.amount,
            tokenSymbol: tx.tokenSymbol,
            fromChainId: tx.fromChainId,
            fromChainName: tx.fromChainName,
            toChainId: tx.toChainId,
            toChainName: tx.toChainName,
            timestamp: Date.now(),
            status: 'pending',
            memo: tx.memo,
            lzScanUrl: tx.lzScanUrl,
        });

        try {
            const response = await apiClient.fetch('/api/transactions', {
                method: 'POST',
                body: JSON.stringify(tx),
            });

            if (!response.ok) {
                console.error('Failed to create transaction in backend');
                return { id: '', localId: localTx.id as number };
            }

            const data = await response.json();

            // Update local with backend ID
            this.updateLocal(localTx.id, { id: data.data.id });

            return { id: data.data.id, localId: localTx.id as number };
        } catch (error) {
            console.error('API error creating transaction:', error);
            return { id: '', localId: localTx.id as number };
        }
    },

    /**
     * Update transaction to success with tx hash
     */
    async confirmSuccess(id: string | number, txHash: string): Promise<boolean> {
        // Update local first
        this.updateLocal(id, { status: 'success', hash: txHash });

        if (!id || typeof id === 'number') {
            // No backend ID, just local update
            return true;
        }

        try {
            const response = await apiClient.fetch(`/api/transactions/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'success', txHash }),
            });

            return response.ok;
        } catch (error) {
            console.error('API error confirming transaction:', error);
            return false;
        }
    },

    /**
     * Mark transaction as failed
     */
    async markFailed(id: string | number): Promise<boolean> {
        this.updateLocal(id, { status: 'failed' });

        if (!id || typeof id === 'number') {
            return true;
        }

        try {
            const response = await apiClient.fetch(`/api/transactions/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'failed' }),
            });

            return response.ok;
        } catch (error) {
            console.error('API error marking transaction failed:', error);
            return false;
        }
    },

    /**
     * Fetch transactions from backend
     */
    async fetchFromBackend(options?: {
        type?: 'send' | 'bridge';
        status?: 'pending' | 'success' | 'failed';
        direction?: 'incoming' | 'outgoing';
        page?: number;
        limit?: number;
    }): Promise<{ data: TransactionRecord[], meta: { total: number, limit: number, offset: number } }> {
        try {
            const params = new URLSearchParams();
            if (options?.type) params.set('type', options.type);
            if (options?.status) params.set('status', options.status);
            if (options?.direction) params.set('direction', options.direction);

            const page = options?.page || 1;
            const limit = options?.limit || 50;
            const offset = (page - 1) * limit;

            params.set('limit', limit.toString());
            params.set('offset', offset.toString());

            const response = await apiClient.fetch(
                `/api/transactions?${params.toString()}`,
                {
                    method: 'GET'
                }
            );

            if (!response.ok) {
                console.error('Failed to fetch transactions from backend');
                return { data: this.getAll(), meta: { total: 0, limit, offset } }; // Fallback to local
            }

            const data = await response.json();
            const transactions = data.data.map(mapApiToLocal);

            // Update localStorage with backend data (only if first page, to keep cache fresh)
            if (page === 1) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
            }

            return {
                data: transactions,
                meta: data.pagination || { total: transactions.length, limit, offset }
            };
        } catch (error) {
            console.error('API error fetching transactions:', error);
            return { data: this.getAll(), meta: { total: 0, limit: 50, offset: 0 } }; // Fallback to local
        }
    },

    // ==========================================
    // CONVENIENCE METHOD (combines local + API)
    // ==========================================

    /**
     * Add new transaction (saves to both local and backend)
     * This is the main method to use from components
     */
    async add(tx: Omit<TransactionRecord, 'id'>): Promise<TransactionRecord> {
        // For backward compatibility, save to local immediately
        const localTx = this.addLocal(tx);

        // If transaction already has hash (confirmed), sync to backend
        if (tx.hash && tx.status === 'success') {
            try {
                await apiClient.fetch('/api/transactions', {
                    method: 'POST',
                    body: JSON.stringify({
                        type: tx.type,
                        txHash: tx.hash,
                        fromAddress: tx.from,
                        toAddress: tx.to,
                        amount: tx.amount,
                        tokenSymbol: tx.tokenSymbol,
                        fromChainId: tx.fromChainId,
                        fromChainName: tx.fromChainName,
                        toChainId: tx.toChainId,
                        toChainName: tx.toChainName,
                        memo: tx.memo,
                        lzScanUrl: tx.lzScanUrl,
                    }),
                }).then(async (res) => {
                    if (res.ok) {
                        const data = await res.json();
                        // Update local with backend ID
                        this.updateLocal(localTx.id, { id: data.data.id });
                        // Also update status to success in backend
                        await apiClient.fetch(`/api/transactions/${data.data.id}`, {
                            method: 'PATCH',
                            body: JSON.stringify({ status: 'success', txHash: tx.hash }),
                        });
                    }
                });
            } catch (error) {
                console.error('Failed to sync transaction to backend:', error);
            }
        }

        return localTx;
    },
};

export default transactionHistoryService;

