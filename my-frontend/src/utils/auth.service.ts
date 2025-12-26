// src/services/auth.service.ts - PERBAIKAN TANPA GANTI STRUKTUR
import { ref } from 'vue'
import { toast } from 'vue-sonner'

// import { useAuthStore } from '@/app/stores/auth'

// const authStore = useAuthStore()

export interface User {
  id: string
  wallet_address: string
  username: string
  email?: string
  avatar_url?: string
}

export interface AuthResponse {
  success: boolean
  token: string
  session: {
    token: string
    expiresAt: string
  }
  user: User
  error: string
}

export interface NonceResponse {
  success: boolean
  nonce: string
  expiresAt: string
  message: string
  error: string
}

interface ValidateTokenResponse {
  success?: boolean;
  valid?: boolean;
  user?: User; // ✅ TAMBAHKAN ini untuk return user data
}

class AuthService {
  private readonly baseUrl: string
  currentUser = ref<User | null>(null)
  private readonly authToken = ref<string | null>(null)
  private readonly isLoading = ref(false)
  private readonly isInitialized = ref(false) // ✅ TAMBAHKAN: track initialization

  constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL
    this.initAuth() // ✅ GANTI dari loadStoredAuth() ke initAuth()
  }

  // ✅ TAMBAHKAN: Initialize auth dengan async
  private async initAuth(): Promise<void> {
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        // Validate token expiration
        const tokenData = JSON.parse(atob(token))
        const isExpired: boolean = tokenData.exp < Math.floor(Date.now() / 1000)

        if (!isExpired) {
          this.authToken.value = token
          this.currentUser.value = JSON.parse(userStr)
          console.log('Loaded stored auth for:', this.currentUser.value?.wallet_address)

          // ✅ TAMBAHKAN: Validate dengan server di background
          this.validateAndUpdateToken(token).catch(console.error)
        } else {
          this.clearAuthData()
        }
      } catch {
        this.clearAuthData()
      }
    }

    this.isInitialized.value = true
  }

  // ✅ TAMBAHKAN: Helper untuk validate dan update token
  private async validateAndUpdateToken(token: string): Promise<void> {
    try {
      const response = await this.fetchEdgeFunction<
        { action: 'validate-token'; token: string },
        ValidateTokenResponse
      >('wallet-auth', {
        action: 'validate-token',
        token,
      })

      if (response.success && response.valid && response.user) {
        // Update user data jika ada perubahan
        this.currentUser.value = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
      } else if (!response.valid) {
        // Token invalid, clear auth
        this.clearAuthData()
      }
    } catch (error) {
      console.error('Token validation error:', error)
    }
  }

  // ========== PUBLIC METHODS ==========
  // TIDAK ADA PERUBAHAN di method berikut
  async requestNonce(walletAddress: string): Promise<NonceResponse> {
    try {
      const response = await this.fetchEdgeFunction<
        { action: 'request-nonce'; walletAddress: string },
        NonceResponse
      >('wallet-auth', {
        action: 'request-nonce',
        walletAddress,
      });

      if (!response.success) {
        throw new Error(response.error ?? 'Failed to get nonce');
      }

      return response;
    } catch (error: unknown) {
      console.error('Request nonce error:', error);
      let errorMessage = 'Failed to get authentication challenge';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
      ) {
        errorMessage = (error as { message: string }).message;
      }

      toast.error(errorMessage);
      throw error;
    }
  }

  async loginWithSignature(
    walletAddress: string,
    signature: string,
    nonce: string
  ): Promise<AuthResponse> {
    this.isLoading.value = true;

    try {
      const response = await this.fetchEdgeFunction<
        {
          action: 'verify-signature';
          walletAddress: string;
          signature: string;
          nonce: string;
        },
        AuthResponse
      >('wallet-auth', {
        action: 'verify-signature',
        walletAddress,
        signature,
        nonce,
      });

      if (!response.success) {
        throw new Error(response.error ?? 'Authentication failed');
      }

      // Save auth data
      this.saveAuthData(response.token, response.user);

      toast.success('Successfully logged in!');
      return response;
    } catch (error: unknown) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
      ) {
        errorMessage = (error as { message: string }).message;
      }

      toast.error(errorMessage);
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.fetchEdgeFunction<
        { action: 'validate-token'; token: string },
        ValidateTokenResponse
      >('wallet-auth', {
        action: 'validate-token',
        token,
      });

      return !!(response.success && response.valid);
    } catch (error: unknown) {
      console.log('Token validation error:', error)
      return false;
    }
  }

  // ✅ TAMBAHKAN: Method untuk get user dari token validation
  async validateTokenWithUser(token: string): Promise<{valid: boolean, user?: User}> {
    try {
      const response = await this.fetchEdgeFunction<
        { action: 'validate-token'; token: string },
        ValidateTokenResponse
      >('wallet-auth', {
        action: 'validate-token',
        token,
      });

      return {
        valid: !!(response.success && response.valid),
        user: response.user
      };
    } catch (error: unknown) {
      console.log('Token validation error:', error)
      return { valid: false };
    }
  }

  async logout(): Promise<void> {
    if (!this.authToken.value) return

    try {
      await this.fetchEdgeFunction('wallet-auth', {
        action: 'logout',
        token: this.authToken.value
      })
      // authStore.handleDisconnect()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuthData()
      toast.success('Logged out successfully')
    }
  }

  // ========== PRIVATE METHODS ==========
  // TIDAK ADA PERUBAHAN di fetchEdgeFunction
  private async fetchEdgeFunction<TRequest = unknown, TResponse = unknown>(
    functionName: string,
    data: TRequest
  ): Promise<TResponse> {
    const response = await fetch(
      `${this.baseUrl}/functions/v1/${functionName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Edge function "${functionName}" failed with status ${response.status}: ${errorText || response.statusText}`
      );
    }

    return (await response.json()) as TResponse;
  }

  // TIDAK ADA PERUBAHAN di saveAuthData
  private saveAuthData(token: string, user: User): void {
    this.authToken.value = token
    this.currentUser.value = user

    // Store in localStorage
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  // HAPUS loadStoredAuth() karena sudah diganti dengan initAuth()

  private clearAuthData(): void {
    this.authToken.value = null
    this.currentUser.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  // ========== GETTERS ==========
  get user() {
    return this.currentUser
  }

  get token() {
    return this.authToken
  }

  get loading() {
    return this.isLoading
  }

  get isAuthenticated() {
    return !!this.authToken.value && !!this.currentUser.value
  }

  // ✅ TAMBAHKAN: Getter untuk initialization status
  get initialized() {
    return this.isInitialized
  }
}

// Export singleton instance
export const authService = new AuthService()
