export type TransactionStatus = 'success' | 'pending' | 'failed'
export type BridgeStatus = 'completed' | 'processing' | 'failed'

export interface SendTransaction {
    id: number
    date: Date
    recipient: string
    recipientName: string | null
    amount: number
    fee: number
    status: TransactionStatus
    hash: string | null
}

export interface BridgeTransaction {
    id: number
    date: Date
    fromChain: string
    toChain: string
    amount: number
    fee: number
    status: BridgeStatus
    estimatedTime: string
    transactionHash?: string
}

export interface TransactionFilters {
    searchQuery: string
    filterStatus: 'all' | TransactionStatus
    bridgeFilterStatus: 'all' | BridgeStatus
}
