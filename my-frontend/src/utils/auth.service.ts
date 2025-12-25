// src/services/auth.service.ts
import { ref } from 'vue'
import { toast } from 'vue-sonner'

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
  // Add other potential fields here if known
}


class AuthService {
  private readonly baseUrl: string
  private readonly anomKey: string
  private readonly currentUser = ref<User | null>(null)
  private readonly authToken = ref<string | null>(null)
  private readonly isLoading = ref(false)

  constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL
    this.anomKey = import.meta.env.VITE_ANOM_KEY
    this.loadStoredAuth()
  }


  // ========== PUBLIC METHODS ==========

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

    // Re-throw to allow upstream handling (e.g., in UI components)
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

    // Re-throw to allow upstream handling (e.g., error boundaries)
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
    console.log('Unknown :',error)
    return false;
  }
}

async logout(): Promise<void> {
    if (!this.authToken.value) return

    try {
      await this.fetchEdgeFunction('wallet-auth', {
        action: 'logout',
        token: this.authToken.value
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuthData()
      toast.success('Logged out successfully')
    }
  }

  // ========== PRIVATE METHODS ==========

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
    // Optionally parse error response for better debugging
    const errorText = await response.text();
    throw new Error(
      `Edge function "${functionName}" failed with status ${response.status}: ${errorText || response.statusText}`
    );
  }

  // Type assertion is safe here as we expect JSON from Supabase Edge Functions
  return (await response.json()) as TResponse;
}

  private saveAuthData(token: string, user: User): void {
    this.authToken.value = token
    this.currentUser.value = user

    // Store in localStorage
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        // Validate token expiration
        const tokenData = JSON.parse(atob(token))
        const isExpired: boolean = tokenData.exp < Math.floor(Date.now() / 1000)

      if (isExpired) {
        this.clearAuthData();
      } else {
        this.authToken.value = token;
        this.currentUser.value = JSON.parse(userStr);
      }

      } catch {
        this.clearAuthData()
      }
    }
  }

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
}

// Export singleton instance
export const authService = new AuthService()
