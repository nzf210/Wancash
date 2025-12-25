import type { UserProfile } from '@/types/auth.d'

import { useDisconnect } from '@reown/appkit/vue'
import { defineStore } from 'pinia'
import { appkit } from '../components/config/appkit'
import { type Router } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { authService } from '@/utils/auth.service'
// import { useAuthStore as auth } from '@/app/stores/auth'

// const authStore = auth()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userProfile: null as UserProfile | null,
    display_name: null as string | null,
    isLoading: false,
    error: null as Error | null,
    isAuthenticated: localStorage.getItem('@appkit/connection_status') === 'connected' || false,
    wallet_address: null as string | null,
    session: undefined as unknown,
    ready: false
  }),

  getters: {
    userAvatar: (state) => state.userProfile?.avatar || 'https://github.com/shadcn.png',
    userDisplayName: (state) => state.userProfile?.display_name || 'Wancash User',
    userInitials: (state) => state.userProfile?.wallet_address || null,
    userEmail: (state) => state.userProfile?.email || null
  },

  actions: {
    goToPortfolio(router : Router) {
      router.push({ name: 'portfolio' })
    },
    goToProfile(router : Router) {
      router.push({ name: 'profile' })
    },
    goToSetting(router : Router) {
      router.push({ name: 'settings' })
    },

    // Parent akan memanggil ini saat wallet connect
    setAuthenticationStatus(authenticated: boolean) {
      this.isAuthenticated = authenticated
      localStorage.setItem('walletConnected', String(authenticated))
      // Simpan timestamp terakhir
      if (authenticated) {
        localStorage.setItem('lastConnection', Date.now().toString())
      } else {
        localStorage.removeItem('lastConnection')
      }
    },

    async persistSession() {
      if (this.isAuthenticated) {
        localStorage.setItem('walletSession', JSON.stringify({
          connected: true,
          timestamp: Date.now(),
          provider: appkit.chainAdapters // Simpan provider yang digunakan
        }))
      } else {
        localStorage.removeItem('walletSession')
      }
    },

    async restoreSession() {
      const session = JSON.parse(localStorage.getItem('walletSession') || 'null')
      if (session?.connected) {
        try {
          // Verifikasi session masih valid (contoh: < 7 hari)
          const isExpired = Date.now() - session.timestamp > 7 * 24 * 60 * 60 * 1000
          if (!isExpired) {
            await appkit.open()
            return true
          }
        } catch (error) {
          console.error('Session restore failed:', error)
        }
        this.clearSession()
      }
      return false
    },

    async setUserProfile(profile: UserProfile) {
      console.log('setUserProfile', profile)
      this.userProfile = profile
    },

    async logout() {
      // Kosongkan, implementasi di handleDisconnect
      await supabase.auth.signOut()
      this.session = null
      this.userProfile = null
    },

    clearUserProfile() {
      this.userProfile = null
      this.isAuthenticated = false
      this.error = null
    },

    clearSession() {
      this.isAuthenticated = false
      this.userProfile = null
      localStorage.removeItem('walletConnected')
      localStorage.removeItem('lastConnectedProvider')
      localStorage.removeItem('walletSession')
    },

    async handleDisconnect() {
      try {
        this.isLoading = true
        const { disconnect } = useDisconnect()
        await disconnect()
        authService.logout()
        this.clearUserProfile()
        this.clearSession()
        localStorage.removeItem('walletConnected')
      } catch (err) {
        this.error = err as Error
      } finally {
        this.isLoading = false
      }
    },
    async init() {
      const { data } = await supabase.auth.getSession()
      this.session = data.session

      if (this.session) {
        await this.fetchProfile()
      }

      this.ready = true
    },
    async fetchProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .single()

      this.userProfile = data
    },

  }
})
