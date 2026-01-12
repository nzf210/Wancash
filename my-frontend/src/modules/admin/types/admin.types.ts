export interface AdminRedemptionRequest {
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
    shipping_option: string
    status: string
    tracking_number?: string
    admin_notes?: string
    transaction_hash?: string
    created_at: string
    updated_at?: string
    items?: {
        product_id: string
        quantity: number
        snapshot_name: string
        snapshot_price: number
        snapshot_weight: number
    }[]
}

export interface DashboardStats {
    total_requests: number
    pending_requests: number
    waiting_payment: number
    processing: number
    completed: number
    total_revenue: number
}
