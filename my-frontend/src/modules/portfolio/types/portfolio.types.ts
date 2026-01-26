export interface PortfolioData {
    totalBalance: number
    availableBalance: number
    lockedBalance: number
    tokenPrice: number
    priceChange: number
}

export interface PortfolioValue {
    totalValue: number
    availableValue: number
    lockedValue: number
}

export interface PortfolioStats {
    totalSendTransactions: number
    successfulSendTransactions: number
    totalBridgeTransactions: number
    totalBridgeVolume: number
}
