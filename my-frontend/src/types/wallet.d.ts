// Strict TypeScript types untuk Wallet Manager dengan AppKit
import type { Chain, CreateAppKit } from '@reown/appkit'

export interface WalletMetadata {
  name: string
  description: string
  url: string
  icons: string[]
}

export interface WalletConfig {
  projectId: string
  chains: Chain[]
  metadata: WalletMetadata
  autoConnect?: boolean
  reconnectAttempts?: number
  reconnectDelay?: number
  sessionTimeout?: number
  pollingInterval?: number
}

export interface WalletSession {
  id: string
  wallet_address: string
  chain_id: number
  connected_at: Date | string
  last_activity: Date | string
  disconnected_at?: Date | string
  session_token: string
  is_active: boolean
  user_agent?: string
  client_info?: Record<string, unknown>
  created_at: Date | string
}

export interface UserProfile {
  id: string
  wallet_address: string
  display_name?: string
  avatar?: string
  email?: string
  metadata?: Record<string, unknown>
  created_at: Date | string
  updated_at: Date | string
  last_login: Date | string
}

export interface ConnectionStatus {
  state: 'idle' | 'connecting' | 'connected' | 'disconnecting' | 'error'
  timestamp: number
  error?: string
  retryCount: number
}

export interface WalletState {
  address: string | null
  chainId: number | null
  isConnected: boolean
  session: WalletSession | null
  userProfile: UserProfile | null
  status: ConnectionStatus
}

export interface ConnectionResult {
  success: boolean
  address?: string
  error?: string
}

// AppKit event types
export interface AppKitAccount {
  address?: string
  isConnected: boolean
}

export interface AppKitNetwork {
  chainId?: number
}

// Event types untuk EventEmitter
export type WalletEventMap = {
  connected: [data: { address: string; chainId: number; session: WalletSession }]
  disconnected: [data: { reason?: string }]
  error: [error: Error]
  statusChanged: [status: ConnectionStatus]
  chainChanged: [chainId: number]
  addressChanged: [address: string]
  reconnected: [data: { address: string; session: WalletSession | null }]
}

// Types untuk AppKit - menggunakan tipe dari library
export type AppKitInstance = ReturnType<typeof CreateAppKit>
export interface AppKitState {
  account?: {
    address?: string
    isConnected?: boolean
  }
  network?: {
    chainId?: number
  }
}
