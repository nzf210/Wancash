// composables/useBridgeBalance.ts
import { ref, computed } from 'vue'
import { useConfig, useConnection } from '@wagmi/vue'
import { readContract, getBalance } from '@wagmi/core'
import { watchDebounced } from '@vueuse/core'
import { formatUnits } from 'viem'
import { wancashAbi, wancashContractAddress } from '@/app/services/contracts'
import type { Token } from '../types/bridge.types'

export function useBridgeBalance(fromChainId: () => number | null | undefined, selectedToken: () => Token | null) {
    const { isConnected, address: walletAddress } = useConnection()
    const config = useConfig()

    // State
    const rawBalance = ref<bigint | null>(null)
    const balanceLoading = ref(true)
    const balanceError = ref(false)

    // Contract address based on chain
    const contractAddress = computed(() => {
        const chainId = fromChainId()
        if (!chainId) return null
        return wancashContractAddress[chainId] ?? null
    })

    // Query key for watching changes
    const queryKey = computed(() => [
        'bridgeBalance',
        contractAddress.value,
        walletAddress.value,
        fromChainId(),
        selectedToken()?.address,
    ])

    // Watch for changes and fetch balance
    watchDebounced(
        queryKey,
        async ([, contract, address, chainId, tokenAddress]) => {
            if (!isConnected.value || !address || !chainId) {
                rawBalance.value = null
                balanceLoading.value = false
                return
            }

            balanceLoading.value = true
            balanceError.value = false

            try {
                const token = selectedToken()

                if (!token) {
                    rawBalance.value = null
                    return
                }

                // Check if it's Wancash (WCH) which uses the contract address
                // even if the token definition has empty address
                const isWancash = token.symbol === 'WCH'

                if (isWancash) {
                    // It is WCH, so we MUST use the contract address for this chain
                    // This matches SendToken.vue logic
                    const wchContract = wancashContractAddress[chainId as number]

                    if (!wchContract) {
                        console.warn('No Wancash contract for chain', chainId)
                        rawBalance.value = null
                        return
                    }

                    const balance = await readContract(config, {
                        address: wchContract as `0x${string}`,
                        abi: wancashAbi.abi,
                        functionName: 'balanceOf',
                        args: [address as `0x${string}`],
                        chainId: chainId as number,
                    })

                    rawBalance.value = balance as bigint
                }
            } catch (err) {
                console.error('Bridge balance fetch error:', err)
                balanceError.value = true
                rawBalance.value = null
            } finally {
                balanceLoading.value = false
            }
        },
        { debounce: 300, immediate: true }
    )

    // Wallet balance as number (standardized to 18 decimals like send token module)
    const walletBalance = computed(() => {
        if (!rawBalance.value) return 0
        // Always use 18 decimals for WCH token standardization
        const num = Number(rawBalance.value) / 1e18
        return Number(num.toFixed(4))
    })

    // Formatted balance as string for display
    const formattedBalance = computed(() => {
        if (!rawBalance.value) return '0'
        const token = selectedToken()
        const decimals = token?.decimals ?? 18
        // Convert using formatUnits then format to 4 decimals with en-US locale for consistency
        const formatted = formatUnits(rawBalance.value, decimals)
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(Number(formatted))
    })

    // Manual refresh function
    const refreshBalance = async () => {
        if (!isConnected.value || !walletAddress.value) return

        const chainId = fromChainId()
        const token = selectedToken()

        if (!chainId || !token) return

        try {
            balanceLoading.value = true
            balanceError.value = false

            if (token.symbol === 'WCH') {
                // Wancash logic
                const wchContract = wancashContractAddress[chainId as number]
                if (!wchContract) {
                    rawBalance.value = null
                    return
                }
                const balance = await readContract(config, {
                    address: wchContract as `0x${string}`,
                    abi: wancashAbi.abi,
                    functionName: 'balanceOf',
                    args: [walletAddress.value as `0x${string}`],
                    chainId: chainId as number,
                })
                rawBalance.value = balance as bigint
            } else if (token.address === '') {
                // Native token
                const balance = await getBalance(config, {
                    address: walletAddress.value as `0x${string}`,
                    chainId: chainId as number,
                })
                rawBalance.value = balance.value
            } else {
                // ERC20 token
                const balance = await readContract(config, {
                    address: token.address as `0x${string}`,
                    abi: wancashAbi.abi,
                    functionName: 'balanceOf',
                    args: [walletAddress.value as `0x${string}`],
                    chainId: chainId as number,
                })

                rawBalance.value = balance as bigint
            }
        } catch (err) {
            console.error('Manual balance refresh error:', err)
            balanceError.value = true
        } finally {
            balanceLoading.value = false
        }
    }

    return {
        rawBalance,
        walletBalance,
        formattedBalance,
        balanceLoading,
        balanceError,
        refreshBalance,
    }
}
