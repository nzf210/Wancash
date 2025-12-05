import { defineStore } from 'pinia'
import type { Chain, Token, BridgeHistory } from '../types/bridge.types'

interface BridgeState {
  fromChain: Chain | null
  toChain: Chain | null
  fromToken: Token | null
  toToken: Token | null
  amount: string
  history: BridgeHistory[]
  isLoading: boolean
  bridgeFee: string
  estimatedAmount: string
}

export const useBridgeStore = defineStore('bridge', {
  state: (): BridgeState => ({
    fromChain: null,
    toChain: null,
    fromToken: null,
    toToken: null,
    amount: '',
    history: [],
    isLoading: false,
    bridgeFee: '0.00',
    estimatedAmount: '0.00',
  }),

  getters: {
    canBridge: (state): boolean => {
      return !!(
        state.fromChain &&
        state.toChain &&
        state.fromToken &&
        state.toToken &&
        state.amount &&
        parseFloat(state.amount) > 0 &&
        parseFloat(state.amount) >= 10 &&
        state.fromChain.id !== state.toChain.id
      )
    },

    bridgeFee: (state): string => {
      if (!state.amount || !state.fromChain) return '0.00'
      const feePercent = state.fromChain.fee || 0.1
      const fee = (parseFloat(state.amount) * feePercent) / 100
      return fee.toFixed(4)
    },

    estimatedAmount: (state): string => {
      if (!state.amount) return '0.00'
      const fee = parseFloat(state.bridgeFee)
      const estimated = parseFloat(state.amount) - fee
      return estimated > 0 ? estimated.toFixed(4) : '0.00'
    }
  },

  actions: {
    setFromChain(chain: Chain) {
      this.fromChain = chain
      // Reset token selection jika chain berubah
      this.fromToken = null
    },

    setToChain(chain: Chain) {
      this.toChain = chain
      // Reset token selection jika chain berubah
      this.toToken = null
    },

    setFromToken(token: Token) {
      this.fromToken = token
    },

    setToToken(token: Token) {
      this.toToken = token
    },

    setAmount(amount: string) {
      this.amount = amount
    },

    async initiateBridge(): Promise<{ success: boolean; txHash?: string; error?: string }> {
      if (!this.canBridge || this.isLoading) {
        return { success: false, error: 'Cannot initiate bridge' }
      }

      this.isLoading = true

      try {
        // Simulate API call
        const result = await this.simulateBridge()

        // Add to history
        const historyItem: BridgeHistory = {
          id: Date.now(),
          fromChain: this.fromChain!.symbol,
          toChain: this.toChain!.symbol,
          token: this.fromToken!.symbol,
          amount: this.amount,
          timestamp: Date.now(),
          status: result.success ? 'pending' : 'failed',
          txHash: result.txHash
        }

        this.history.unshift(historyItem)

        // Keep only last 20 items
        if (this.history.length > 20) {
          this.history = this.history.slice(0, 20)
        }

        return result
      } catch (error) {
        console.error('Bridge error:', error)
        return { success: false, error: 'Bridge failed' }
      } finally {
        this.isLoading = false
      }
    },

    simulateBridge(): Promise<{ success: boolean; txHash: string }> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            txHash: `0x${Math.random().toString(16).slice(2, 42)}`
          })
        }, 1500)
      })
    }
  }
})
