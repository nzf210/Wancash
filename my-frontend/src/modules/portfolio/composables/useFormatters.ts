/**
 * Centralized formatting utilities for the portfolio module
 */
export function useFormatters() {
    /**
     * Format number with locale formatting
     */
    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US').format(num)
    }

    /**
     * Format currency (USD)
     */
    const formatCurrency = (num: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num)
    }

    /**
     * Format date in readable format
     */
    const formatDate = (date: Date | string): string => {
        return new Date(date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    }

    /**
     * Format time in 12-hour format
     */
    const formatTime = (date: Date | string): string => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    /**
     * Format date and time together
     */
    const formatDateTime = (date: Date | string): string => {
        return `${formatDate(date)} ${formatTime(date)}`
    }

    /**
     * Shorten Ethereum address (0x1234...5678)
     */
    const shortenAddress = (addr: string): string => {
        if (!addr) return ''
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    /**
     * Shorten transaction hash
     */
    const shortenTransactionHash = (hash: string): string => {
        if (!hash) return ''
        return `${hash.slice(0, 8)}...${hash.slice(-6)}`
    }

    /**
     * Copy text to clipboard
     */
    const copyToClipboard = async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch (err) {
            console.error('Failed to copy to clipboard', err)
            return false
        }
    }

    return {
        formatNumber,
        formatCurrency,
        formatDate,
        formatTime,
        formatDateTime,
        shortenAddress,
        shortenTransactionHash,
        copyToClipboard,
    }
}
