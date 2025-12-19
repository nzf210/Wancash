// composables/useTokenTransfers.ts
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import type { Database } from '@/types/supabase.d'

interface SendTokenParams {
  txHash: string
  from: string
  to: string
  tokenId: string
  amount: number
  chainId: number
  blockNumber: number
  gasFee?: number
}

interface ReceiveTokenParams {
  txHash: string
  from: string
  to: string
  tokenId: string
  amount: number
  chainId: number
  blockNumber: number
}

export function useTokenTransfers(userId: string) {
  const transfers = ref<Database['public']['Tables']['token_transfers']['Row'][]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchTransfers = async (limit: number = 50): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const { data, error: supabaseError } = await supabase
        .from('token_transfers')
        .select(`
          id,
          tx_hash,
          from_address,
          to_address,
          amount,
          chain_id,
          block_timestamp,
          status,
          transaction_type,
          tokens (
            symbol,
            name,
            logo_url
          )
        `)
        .eq('user_id', userId)
        .order('block_timestamp', { ascending: false })
        .limit(limit)

      if (supabaseError) throw supabaseError
      transfers.value = data as unknown as Database['public']['Tables']['token_transfers']['Row'][]
    } catch (err) {
      if (err instanceof Error) {
            error.value = (err as { message: string }).message;
          } else {
            error.value = 'An unknown error occurred.';
          }
          console.error('Error fetching transfers:', err);
    } finally {
          loading.value = false
        }
  }

  const recordSend = async (params: SendTokenParams): Promise<void> => {
    try {
      const { error: supabaseError } = await supabase
        .from('token_transfers')
        .insert({
          user_id: userId,
          tx_hash: params.txHash,
          from_address: params.from,
          to_address: params.to,
          token_id: params.tokenId,
          amount: params.amount,
          chain_id: params.chainId,
          block_number: params.blockNumber,
          block_timestamp: new Date().toISOString(),
          gas_fee: params.gasFee || null,
          transaction_type: 'SEND',
          status: 'PENDING',
        })

      if (supabaseError) throw supabaseError
    } catch (err) {
      if (err instanceof Error) {
            error.value = (err as { message: string }).message;
          } else {
            error.value = 'An unknown error occurred.';
          }
          console.error('Error recording send:', err);
    }
  }

  const recordReceive = async (params: ReceiveTokenParams): Promise<void> => {
    try {
      const { error: supabaseError } = await supabase
        .from('token_transfers')
        .insert({
          user_id: userId,
          tx_hash: params.txHash,
          from_address: params.from,
          to_address: params.to,
          token_id: params.tokenId,
          amount: params.amount,
          chain_id: params.chainId,
          block_number: params.blockNumber,
          block_timestamp: new Date().toISOString(),
          transaction_type: 'RECEIVE' as const,
          status: 'CONFIRMED'
        } as const)

      if (supabaseError) throw supabaseError
    }catch (err) {
      if (err instanceof Error) {
            error.value = (err as { message: string }).message;
          } else {
            error.value = 'An unknown error occurred.';
          }
          console.error('Error recording receive:', err);
    }
  }

  const updateTransferStatus = async (
    txHash: string,
    status: 'PENDING' | 'CONFIRMED'
  ): Promise<void> => {
    try {
      const { error: supabaseError } = await supabase
      .from('token_transfers')
       .update({ status })
      .eq('tx_hash', txHash)

      if (supabaseError) throw supabaseError
    } catch (err) {
      if (err instanceof Error) {
            error.value = (err as { message: string }).message;
          } else {
            error.value = 'An unknown error occurred.';
          }
          console.error('Error updating transfer status:', err);
    }
  }

  const filteredTransfers = computed(() => {
    return transfers.value.filter(transfer =>
      transfer.transaction_type === 'SEND' || transfer.transaction_type === 'RECEIVE'
    )
  })

  const recentTransfers = computed(() => {
    return transfers.value.slice(0, 10)
  })

  const totalTransfers = computed(() => {
    return transfers.value.length
  })

  return {
    transfers,
    loading,
    error,
    fetchTransfers,
    recordSend,
    recordReceive,
    updateTransferStatus,
    filteredTransfers,
    recentTransfers,
    totalTransfers
  }
}
