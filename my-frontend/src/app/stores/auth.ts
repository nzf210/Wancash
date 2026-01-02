// src/app/stores/auth.ts
import type { UserProfile } from '@/types/auth.d'

import { defineStore } from 'pinia'
import { type Router } from 'vue-router'
import { watch } from 'vue'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { isAddressEqual } from 'viem'
import { config } from '@/app/components/config/wagmi'  // Import the config
import { getAccount, watchAccount, reconnect, disconnect } from '@wagmi/core'  // Use core actions

const nonceSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.coerce.number().int().positive()
})

const {address, status} = getAccount(config)

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userProfile: null as UserProfile | null,
    display_name: null as string | null,
    isLoading: false,
    error: null as Error | null,
    isAuthenticated: false,
    wallet_address: address as string | null,
    session: undefined as unknown,
    ready: false,
    isConnected: status === 'connected',  // Added reactive connection status
  }),

  getters: {
    userAvatar: (state) => state.userProfile?.avatar || 'https://github.com/shadcn.png',
    userDisplayName: (state) => state.userProfile?.display_name || 'Wancash User',
    userInitials: (state) => state.userProfile?.wallet_address?.charAt(0).toUpperCase() || null,
    userEmail: (state) => state.userProfile?.email || null
  },

  actions: {
    goToPortfolio(router: Router) {
      router.push({ name: 'portfolio' })
    },
    goToProfile(router: Router) {
      router.push({ name: 'profile' })
    },
    goToSetting(router: Router) {
      router.push({ name: 'settings' })
    },

    async requestNonce(): Promise<{ nonce: string; message: unknown }> {
      const account = getAccount(config)
      const walletAddress = account.address
      const chainId = account.chain?.id
      if (!walletAddress || !chainId) {
        throw new Error('Wallet not connected')
      }
      const parsedChainId = Number(chainId)
      try {
        nonceSchema.parse({ address: walletAddress, chainId: parsedChainId })
      } catch (e: unknown) {
        if (e instanceof z.ZodError) {
          throw new Error(`Invalid parameters: ${e.message}`)
        }
        throw new Error(`Invalid parameters`)
      }
      const response = await fetch(
        `/api/auth/nonce?address=${walletAddress}&chainId=${parsedChainId}`,
        { credentials: 'include' }
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get nonce')
      }
      return response.json()
    },

    async login(): Promise<unknown> {
      const account = getAccount(config)
      const walletAddress = account.address
      const chainId = account.chain?.id
      if (!walletAddress || !chainId) {
        throw new Error('Wallet not connected')
      }
      this.isLoading = true
      try {
        const { message } = await this.requestNonce()
        if (!globalThis.window.ethereum) {
          throw new Error('Ethereum provider not found')
        }
        const signature = await (globalThis.window.ethereum.request as (args: { method: string; params?: unknown[] }) => Promise<string>)({
          method: 'eth_signTypedData_v4',
          params: [walletAddress, JSON.stringify(message)]
        })
        if (!signature) {
          throw new Error('User rejected signature')
        }
        const verifyResponse = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            address: walletAddress,
            signature,
            message,
            chainId
          })
        })
        if (!verifyResponse.ok) {
          const error = await verifyResponse.json()
          throw new Error(error.error || 'Authentication failed')
        }
        const data = await verifyResponse.json()
        this.isAuthenticated = true
        this.userProfile = data.user
        this.wallet_address = walletAddress
        localStorage.setItem('auth_state', JSON.stringify({
          authenticated: true,
          user: data.user,
          walletAddress: walletAddress,
          timestamp: Date.now()
        }))
        toast.success('Successfully signed in!')
        return data
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
          toast.info('Logged out successfully')
        } else {
          toast.error('Logout failed: ' + response.statusText)
        }
      } catch (error) {
        console.warn('Backend logout failed:', error)
      } finally {
        this.isAuthenticated = false
        this.userProfile = null
        this.wallet_address = null
        this.session = null
        localStorage.removeItem('auth_state')
      }
    },

    async checkAuth() {
      this.isLoading = true
      const account = getAccount(config)
      const walletAddress = account.address
      try {
        const response = await fetch('/api/me', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          if (walletAddress && !isAddressEqual(data.user.address, walletAddress)) {
            await this.logout()
            return
          }
          this.userProfile = data.user
          this.wallet_address = walletAddress ?? null
          this.isAuthenticated = true
        } else if (response.status === 401) {
          const refreshed = await this.refreshToken()
          if (refreshed) {
            await this.checkAuth()
          } else {
            this.isAuthenticated = false
            toast.warning('Session expired. Please sign in again.')
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Auth check failed:', error.message)
        }
        this.isAuthenticated = false
      } finally {
        this.isLoading = false
      }
    },

    async refreshToken(): Promise<boolean> {
      try {
        const response = await fetch('/api/auth/refresh', { credentials: 'include' })
        return response.ok
      } catch (error) {
        console.error('Token refresh failed:', error)
        return false
      }
    },

    restoreFromLocalStorage() {
      const account = getAccount(config)
      const walletAddress = account.address
      const savedAuth = localStorage.getItem('auth_state')
      if (savedAuth) {
        const authState = JSON.parse(savedAuth)
        const age = Date.now() - authState.timestamp
        if (age < 60 * 60 * 1000 && walletAddress && isAddressEqual(authState.walletAddress, walletAddress)) {
          this.isAuthenticated = authState.authenticated
          this.userProfile = authState.user
          this.wallet_address = walletAddress
          console.log('Auth state restored from localStorage (store)')
        } else {
          console.warn('LocalStorage state invalid or expired (store)')
          localStorage.removeItem('auth_state')
        }
      }
    },

    async handleDisconnect() {
      try {
        this.isLoading = true
        await disconnect(config)
        await this.logout()
      } catch (err) {
        this.error = err as Error
      } finally {
        this.isLoading = false
      }
    },

    // New utility to wait for connection with timeout
    waitForConnection(timeoutMs = 5000): Promise<void> {
      return new Promise((resolve, reject) => {
        const account = getAccount(config)
        if (account.status === 'connected') return resolve()
        const timer = setTimeout(() => {
          reject(new Error('Connection timeout'))
        }, timeoutMs)
        // Poll for connection
        const interval = setInterval(() => {
          const account = getAccount(config)
          if (account.status === 'connected') {
            clearInterval(interval)
            clearTimeout(timer)
            resolve()
          }
        }, 500)
      })
    },

    async init() {
      // Restore session and reconnect if necessary
      const savedAuth = localStorage.getItem('auth_state')
      const account = getAccount(config)
      if (savedAuth && account.status !== 'connected') {
        try {
          await reconnect(config)
          await this.waitForConnection()
          console.log('Reconnection successful (store)')
        } catch (error) {
          console.error('Reconnection failed (store):', error)
          toast.error('Failed to reconnect wallet. Please connect manually.')
          localStorage.removeItem('auth_state')
        }
      }

      // Restore auth state if connected
      if (account.status === 'connected') {
        this.restoreFromLocalStorage()
        await this.checkAuth()
      }

      // Setup watcher for account changes (do not unwatch immediately)
      watchAccount(config, {
        onChange: (account) => {
          this.wallet_address = account.address ?? null
          this.isConnected = account.status === 'connected'
          // chainId can be handled here if needed
          console.info(`Account changed: ${this.isConnected ? 'Connected' : 'Disconnected'} (${account.chain?.id ?? 'unknown'})`)
        }
      })

      // Watch for address changes using Vue watch on store state
      watch(() => this.wallet_address, async (newAddress, oldAddress) => {
        if (this.isAuthenticated && newAddress && oldAddress && !isAddressEqual(newAddress as `0x${string}`, oldAddress as `0x${string}`)) {
          await this.logout()
          toast.warning('Wallet address has changed. Please sign in again.')
        }
      })

      // Watch for connection status changes using reactive state
      watch(() => this.isConnected, async (connected) => {
        if (connected) {
          this.restoreFromLocalStorage()
          await this.checkAuth()
        } else if (this.isAuthenticated) {
          await this.logout()
        }
      })

      this.ready = true
    }
  }
})
