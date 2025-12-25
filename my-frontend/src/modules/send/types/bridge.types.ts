// src/types/bridge.types.ts

/**
 * Represents a blockchain network/chain supported by the bridge.
 */
export interface Chain {
  /** Unique identifier (e.g., 1 for Ethereum Mainnet, 56 for BSC) */
  id: number;
  /** Human-readable name (e.g., "Ethereum", "Binance Smart Chain") */
  name: string;
  /** Chain symbol/ticker used in UI (e.g., "ETH", "BNB") */
  symbol: string;
  /** Optional bridge fee percentage applied when bridging from this chain */
  fee?: number;
  /** Optional RPC URL or other chain-specific data */
  rpcUrl?: string;
  /** Optional icon URL for display */
  icon?: string;
}

/**
 * Represents a token that can be bridged.
 */
export interface Token {
  /** Contract address of the token on its native chain */
  address: string;
  /** Token symbol (e.g., "USDT", "WANCASH") */
  symbol: string;
  /** Token name (e.g., "Tether USD", "Wancash Token") */
  name: string;
  /** Number of decimals for display and calculations */
  decimals: number;
  /** Optional icon URL for the token */
  icon?: string;
}

/**
 * Represents a single entry in the bridge transaction history.
 */
export interface BridgeHistory {
  /** Unique identifier for the history item (timestamp-based or UUID) */
  id: number | string;
  /** Symbol of the source chain (e.g., "ETH") */
  fromChain: string;
  /** Symbol of the destination chain (e.g., "BSC") */
  toChain: string;
  /** Symbol of the bridged token (e.g., "USDT") */
  token: string;
  /** Amount that was sent (as string to preserve precision) */
  amount: string;
  /** Unix timestamp (ms) when the bridge was initiated */
  timestamp: number;
  /** Current status of the transaction */
  status: 'pending' | 'completed' | 'failed';
  /** Transaction hash on the source chain (if available) */
  txHash?: string;
}
