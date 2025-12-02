import type { UserProfile } from '@/types/auth'
import { useDisconnect } from '@reown/appkit/vue'
import { defineStore } from 'pinia'
import { appkit } from '../components/config/appkit'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userProfile: null as UserProfile | null,
    isLoading: false,
    error: null as Error | null,
    isAuthenticated: localStorage.getItem('@appkit/connection_status') === 'connected' || false,
  }),

  getters: {
    userAvatar: (state) => state.userProfile?.avatar || 'https://github.com/shadcn.png',
    userDisplayName: (state) => state.userProfile?.displayName || 'John Doe',
    userInitials: (state) => state.userProfile?.initials || null,
    userEmail: (state) => state.userProfile?.email || null
  },

  actions: {
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
    },
    async handleDisconnect() {
      try {
        this.isLoading = true
        const { disconnect } = useDisconnect()
        await disconnect()
        this.clearUserProfile() // Hapus pemanggilan rekursif
        this.clearSession()
        localStorage.removeItem('walletConnected')
      } catch (err) {
        this.error = err as Error
      } finally {
        this.isLoading = false
      }
    },
    handleProfileClick() {
      console.log('Profile clicked')
    },

    handleSettingsClick() {
      console.log('Settings clicked')
    }
  }
}
)
