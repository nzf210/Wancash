import { defineStore } from 'pinia'
import type { Chain, Token, BridgeHistory } from '../types/bridge.types'
import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { parseUnits, pad } from 'viem'
import { wagmiConfig } from '@/app/components/config/appkit'
import { wancashContractAddress, wancashAbi } from '@/app/services/contracts'
import { toast } from 'vue-sonner'
import { SUPPORTED_CHAINS } from '@/app/composables/useChain'
import { Options } from '@layerzerolabs/lz-v2-utilities'
import { transactionHistoryService } from '@/app/services/transactionHistoryService'

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
  availableTokens: Token[]
  sourceChains: Chain[]
  destChains: Chain[]
  _timer: any
  userBalance: string
}

const HARDCODED_TOKENS: Token[] = [
  { name: 'Wancash', symbol: 'WCH', address: '', decimals: 18 },
]

export const useBridgeStore = defineStore('bridge', {
  state: (): BridgeState => ({
    fromChain: null,
    toChain: null,
    fromToken: null,
    toToken: null,
    amount: '',
    history: [], // Will be loaded from transactionHistoryService
    isLoading: false,
    bridgeFee: '0.00',
    estimatedAmount: '0.00',
    availableTokens: HARDCODED_TOKENS,
    // Internal timer for debounce
    _timer: null as any,
    sourceChains: SUPPORTED_CHAINS as Chain[],
    destChains: SUPPORTED_CHAINS as Chain[],
    userBalance: '0',
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
        state.fromChain.id !== state.toChain.id
      )
    },

    filteredSourceChains: (state) => {
      return state.sourceChains.filter(c => !state.toChain || c.id !== state.toChain.id)
    },

    filteredDestChains: (state) => {
      return state.destChains.filter(c => !state.fromChain || c.id !== state.fromChain.id)
    }
  },

  actions: {
    setFromChain(chain: Chain) {
      this.fromChain = chain
      this.fromToken = this.availableTokens[0] // Select default token
    },

    setToChain(chain: Chain) {
      this.toChain = chain
      this.toToken = this.availableTokens[0]
    },

    setFromToken(token: Token) {
      this.fromToken = token
    },

    setAmount(amount: string) {
      this.amount = amount
      this.debounceQuote()
    },

    // Load bridge history from persistent storage
    loadHistory() {
      const bridgeTxs = transactionHistoryService.getByType('bridge')
      this.history = bridgeTxs.map(tx => ({
        id: typeof tx.id === 'number' ? tx.id : Date.now(),
        fromChain: tx.fromChainName || 'Unknown',
        toChain: tx.toChainName || 'Unknown',
        token: tx.tokenSymbol,
        amount: tx.amount,
        timestamp: tx.timestamp,
        status: tx.status === 'success' ? 'completed' as const : tx.status === 'failed' ? 'failed' as const : 'pending' as const,
        txHash: tx.hash
      }))
    },

    debounceQuote() {
      // Simple debounce for quote
      if (this._timer) clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.getQuote()
      }, 500)
    },

    async getQuote() {
      if (!this.canBridge) {
        this.bridgeFee = '0.00'
        this.estimatedAmount = '0.00'
        return
      }

      try {
        const amountLD = parseUnits(this.amount, this.fromToken!.decimals)
        const dstEid = this.toChain!.eid

        // Use LayerZero Options (v2)
        // Error 0x00575ea1 (Executor_NoOptions) indicates options are required.
        // We add standard lzReceive option: 200k switch gas, 0 value.
        const extraOptions = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex() as `0x${string}`

        const dummyAddress = pad('0x0000000000000000000000000000000000000000')
        const sendParam = {
          dstEid: dstEid,
          to: dummyAddress,
          amountLD: amountLD,
          minAmountLD: amountLD,
          extraOptions: extraOptions,
          composeMsg: "0x" as `0x${string}`,
          oftCmd: "0x" as `0x${string}`
        }

        const contractAddress = wancashContractAddress[this.fromChain!.id]
        if (!contractAddress) throw new Error("Contract not found for chain")

        const quoteResult = await readContract(wagmiConfig, {
          address: contractAddress as `0x${string}`,
          abi: wancashAbi.abi,
          functionName: 'quoteSend',
          args: [sendParam, false] // false = pay in native
        }) as unknown as { nativeFee: bigint, lzTokenFee: bigint }

        // quoteResult is { nativeFee: bigint, lzTokenFee: bigint }
        const nativeFee = quoteResult.nativeFee

        // Estimated amount is amountLD (1:1)
        this.estimatedAmount = this.amount
        const feeFormatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(nativeFee) / 1e18)
        this.bridgeFee = feeFormatted + ' ' + (this.fromChain!.currency || 'ETH')

      } catch (e) {
        console.error("Quote error", e)
        this.bridgeFee = 'Error'
      }
    },

    async initiateBridge() {
      if (!this.canBridge || this.isLoading) return

      this.isLoading = true
      try {
        const amountLD = parseUnits(this.amount, this.fromToken!.decimals)
        const dstEid = this.toChain!.eid

        const { getAccount } = await import('@wagmi/core')
        const account = getAccount(wagmiConfig)

        if (!account.address) throw new Error("Wallet not connected")

        const toAddressBytes32 = pad(account.address)
        // Add executor options (gas limit 200k)
        const extraOptions = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex() as `0x${string}`

        const sendParam = {
          dstEid: dstEid,
          to: toAddressBytes32,
          amountLD: amountLD,
          minAmountLD: amountLD, // 0 slippage for now, or 99% if needed
          extraOptions: extraOptions,
          composeMsg: "0x" as `0x${string}`,
          oftCmd: "0x" as `0x${string}`
        }

        const contractAddress = wancashContractAddress[this.fromChain!.id]

        // Re-quote for accuracy before send
        const quoteResult = await readContract(wagmiConfig, {
          address: contractAddress as `0x${string}`,
          abi: wancashAbi.abi,
          functionName: 'quoteSend',
          args: [sendParam, false]
        }) as any

        const fee = quoteResult // { nativeFee, lzTokenFee }

        const hash = await writeContract(wagmiConfig, {
          address: contractAddress as `0x${string}`,
          abi: wancashAbi.abi,
          functionName: 'send',
          args: [sendParam, fee, account.address], // refund address
          value: fee.nativeFee
        })

        toast.info("Transaction sent! Waiting for confirmation...")

        await waitForTransactionReceipt(wagmiConfig, { hash })

        toast.success(`Bridge Success! Sent ${this.amount} ${this.fromToken?.symbol} to ${this.toChain?.name}`)

        // Add to in-memory history
        this.history.unshift({
          id: Date.now(),
          fromChain: this.fromChain!.symbol,
          toChain: this.toChain!.symbol,
          token: this.fromToken!.symbol,
          amount: this.amount,
          timestamp: Date.now(),
          status: 'completed',
          txHash: hash
        })

        // Persist to unified transaction history service
        transactionHistoryService.add({
          type: 'bridge',
          hash: hash,
          from: account.address,
          to: account.address, // Same address on destination chain
          amount: this.amount,
          tokenSymbol: this.fromToken!.symbol,
          fromChainId: this.fromChain!.id,
          toChainId: this.toChain!.id,
          fromChainName: this.fromChain!.name,
          toChainName: this.toChain!.name,
          timestamp: Date.now(),
          status: 'success',
          lzScanUrl: `https://layerzeroscan.com/tx/${hash}`
        })

        this.amount = '' // Reset
        this.estimatedAmount = '0.00'

      } catch (error: any) {
        console.error('Bridge failed:', error)
        toast.error('Bridge failed: ' + (error.message || 'Unknown error'))
      } finally {
        this.isLoading = false
      }
    }
  },
})

