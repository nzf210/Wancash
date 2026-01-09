import { defineStore } from 'pinia'
import type { Chain, Token, BridgeHistory } from '../types/bridge.types'
import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { parseUnits, encodeAbiParameters, parseAbiParameters, pad } from 'viem'
import { wagmiConfig } from '@/app/components/config/appkit'
import { wancashContractAddress, wancashAbi } from '@/app/services/contracts'
import { toast } from 'vue-sonner'
import { SUPPORTED_CHAINS } from '@/app/composables/useChain'

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
    history: [],
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

        // Construct SendParam
        // struct SendParam {
        //     uint32 dstEid;
        //     bytes32 to;
        //     uint256 amountLD;
        //     uint256 minAmountLD;
        //     bytes extraOptions;
        //     bytes composeMsg;
        //     bytes oftCmd;
        // }

        // Using user's address as recipient for now (self-bridge)
        // Ideally we need the user's wallet address from connection
        // We'll trust the component to handle connection check before calling
        // For quote, we can use a dummy address if not connected, but let's assume connected.

        // Note: In a real app we need the current user address. 
        // Since we are in a store, we might need to be passed the address or use the composable outside.
        // For quoting, the 'to' address usually doesn't affect the fee much unless it's a specific contract logic.
        const dummyAddress = pad('0x0000000000000000000000000000000000000001')

        const sendParam = {
          dstEid: dstEid,
          to: dummyAddress, // bytes32
          amountLD: amountLD,
          minAmountLD: amountLD, // Slippage logic here if needed
          extraOptions: "0x" as `0x${string}`, // Standard options
          composeMsg: "0x" as `0x${string}`,
          oftCmd: "0x" as `0x${string}`
        }

        const contractAddress = wancashContractAddress[this.fromChain!.id]
        if (!contractAddress) throw new Error("Contract not found for chain")

        const quoteResult = await readContract(wagmiConfig, {
          address: contractAddress as `0x${string}`,
          abi: wancashAbi.abi,
          functionName: 'quoteSend',
          args: [sendParam, false]
        }) as any

        // quoteResult returns nativeFee and lzTokenFee
        const nativeFee = quoteResult.nativeFee

        // Rough estimation
        // In a real app, you'd convert nativeFee to token units if paying in ZRO, 
        // or just display it as "Native Fee". 
        // For simplicity here, we interpret fee as "Native Gas" separate from amount.
        // So estimated amount is just amount (1:1) minus protocol fees if any (usually included in quote).
        // OFT standards typically receive 1:1 minus fee.

        // let's just assume 1:1 for now minus hardcoded fee for display if we can't parse detailed receipt
        this.estimatedAmount = this.amount // OFT is usually 1:1
        this.bridgeFee = (Number(nativeFee) / 1e18).toFixed(6) + ' ETH (Gas)'

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

        // Use pad to convert address to bytes32 format required by LayerZero
        // We need the REAL recipient address here. 
        // We will fetch account from wagmi/core inside action
        // or require it to be passed.
        // Let's rely on the user being connected.

        // This is a limitation of this store rewrite without converting everything to composables.
        // We will assume 'to' is the same as 'from' (self-transfer) for now.
        // But we need the address from the wallet.
        // We'll grab it from the window object or assume passed via setAddress (better: passed as arg).
        // For now, let's fix the signature to NOT take address and use global config/connection if possible, 
        // OR better: component calls `writeContract`? 
        // No, store action is cleaner. 
        // Let's use `getAccount(config)`

        const { getAccount } = await import('@wagmi/core')
        const account = getAccount(wagmiConfig)

        if (!account.address) throw new Error("Wallet not connected")

        const toAddressBytes32 = pad(account.address)

        const sendParam = {
          dstEid: dstEid,
          to: toAddressBytes32,
          amountLD: amountLD,
          minAmountLD: amountLD,
          extraOptions: "0x" as `0x${string}`,
          composeMsg: "0x" as `0x${string}`,
          oftCmd: "0x" as `0x${string}`
        }

        // We need to fetch the fee again to pass it
        const contractAddress = wancashContractAddress[this.fromChain!.id]

        const quoteResult = await readContract(wagmiConfig, {
          address: contractAddress as `0x${string}`,
          abi: wancashAbi.abi,
          functionName: 'quoteSend',
          args: [sendParam, false]
        }) as any

        const fee = quoteResult // The struct returned is used as fee param

        const hash = await writeContract(wagmiConfig, {
          address: contractAddress as `0x${string}`,
          abi: wancashAbi.abi,
          functionName: 'send',
          args: [sendParam, fee, account.address], // owner as refund address
          value: fee.nativeFee
        })

        toast.info("Transaction sent! Waiting for confirmation...")

        await waitForTransactionReceipt(wagmiConfig, { hash })

        toast.success(`Bridge Success! Sent ${this.amount} ${this.fromToken?.symbol} to ${this.toChain?.name}`)

        // Add to history
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

        this.amount = '' // Reset
        this.estimatedAmount = '0.00'

        // Refresh balance
        this.updateBalance()

      } catch (error: any) {
        console.error('Bridge failed:', error)
        toast.error('Bridge failed: ' + (error.message || 'Unknown error'))
      } finally {
        this.isLoading = false
      }
    },

    async updateBalance() {
      const { getAccount, getBalance, readContract } = await import('@wagmi/core')
      const account = getAccount(wagmiConfig)

      if (!account.address || !this.fromChain || !this.fromToken) {
        this.userBalance = '0'
        return
      }

      try {
        if (this.fromToken.address === '') {
          // Native token
          const balance = await getBalance(wagmiConfig, {
            address: account.address,
            chainId: this.fromChain.id
          })
          this.userBalance = balance.formatted
        } else {
          // ERC20
          const balance = await readContract(wagmiConfig, {
            address: this.fromToken.address as `0x${string}`,
            abi: [{
              constant: true,
              inputs: [{ name: "_owner", type: "address" }],
              name: "balanceOf",
              outputs: [{ name: "balance", type: "uint256" }],
              type: "function"
            }],
            functionName: 'balanceOf',
            args: [account.address],
            chainId: this.fromChain.id
          }) as bigint

          // We need to import formatUnits. 
          // Since this file already imports parseUnits from viem, we can use formatUnits there 
          // but need to make sure it is imported.
          // Assuming formatUnits is imported or will be added. 
          // Actually, let's use the valid import.
          const { formatUnits } = await import('viem')
          this.userBalance = formatUnits(balance, this.fromToken.decimals)
        }
      } catch (e) {
        console.error("Failed to fetch balance", e)
        this.userBalance = '0'
      }
    }
  },
})

