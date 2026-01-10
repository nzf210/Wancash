/**
 * Unified Transaction History Service
 * Handles persistent storage for both Send and Bridge transactions
 */

export interface TransactionRecord {
    id: number;
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
}

const STORAGE_KEY = 'wancash_transactions';
const MAX_RECORDS = 100;

export const transactionHistoryService = {
    /**
     * Get all transaction records
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
     * Get transactions filtered by wallet address
     */
    getByWallet(walletAddress: string): TransactionRecord[] {
        const address = walletAddress.toLowerCase();
        return this.getAll().filter(tx =>
            tx.from.toLowerCase() === address || tx.to.toLowerCase() === address
        );
    },

    /**
     * Get transactions filtered by chain ID
     */
    getByChain(chainId: number): TransactionRecord[] {
        return this.getAll().filter(tx =>
            tx.fromChainId === chainId || tx.toChainId === chainId
        );
    },

    /**
     * Add a new transaction record
     */
    add(tx: Omit<TransactionRecord, 'id'>): TransactionRecord {
        try {
            const history = this.getAll();
            const newTx: TransactionRecord = { ...tx, id: Date.now() };

            // Add to beginning (most recent first)
            history.unshift(newTx);

            // Keep only the last MAX_RECORDS
            while (history.length > MAX_RECORDS) {
                history.pop();
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
            return newTx;
        } catch (error) {
            console.error('Failed to save transaction:', error);
            throw error;
        }
    },

    /**
     * Update transaction status by hash
     */
    updateStatus(hash: string, status: 'pending' | 'success' | 'failed'): boolean {
        try {
            const history = this.getAll();
            const index = history.findIndex(tx => tx.hash === hash);

            if (index !== -1) {
                history[index].status = status;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to update transaction status:', error);
            return false;
        }
    },

    /**
     * Find a transaction by hash
     */
    findByHash(hash: string): TransactionRecord | undefined {
        return this.getAll().find(tx => tx.hash === hash);
    },

    /**
     * Clear all transaction history
     */
    clearAll(): void {
        localStorage.removeItem(STORAGE_KEY);
    },

    /**
     * Get pending transactions (useful for status polling)
     */
    getPending(): TransactionRecord[] {
        return this.getAll().filter(tx => tx.status === 'pending');
    },

    /**
     * Get pending bridge transactions (for LayerZero status tracking)
     */
    getPendingBridges(): TransactionRecord[] {
        return this.getAll().filter(tx => tx.type === 'bridge' && tx.status === 'pending');
    }
};

export default transactionHistoryService;
