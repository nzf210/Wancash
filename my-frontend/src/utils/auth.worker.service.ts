// import { useDisconnect } from '@reown/appkit/vue'

// // types.ts
// export interface AuthResponse {
//   success: boolean;
//   error?: string;
// }

// export interface NonceResponse extends AuthResponse {
//   nonce?: string;
//   expiresAt?: string;
//   message?: string;
// }

// export interface VerifyResponse extends AuthResponse {
//   token?: string;
//   session?: {
//     token: string;
//     expiresAt: string;
//   };
//   user?: {
//     id: string;
//     wallet_address: string;
//     username: string;
//     email?: string;
//     avatar_url?: string;
//   };
// }

// export interface ValidateResponse extends AuthResponse {
//   valid?: boolean;
//   user?: {
//     id: string;
//     wallet_address: string;
//     username: string;
//     email?: string;
//     avatar_url?: string;
//   };
// }

// // authService.ts
// const API_URL = import.meta.env.WORKER_URL || 'http://localhost:8787';
// const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// class AuthService {
//   async requestNonce(walletAddress: string): Promise<NonceResponse> {
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'apikey': API_KEY, // atau 'Authorization': `Bearer ${API_KEY}`
//       },
//       body: JSON.stringify({
//         action: 'request-nonce',
//         walletAddress: walletAddress.toLowerCase()
//       })
//     });

//     return await response.json();
//   }

//   async verifySignature(walletAddress: string, signature: string, nonce: string): Promise<VerifyResponse> {
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'apikey': API_KEY,
//       },
//       body: JSON.stringify({
//         action: 'verify-signature',
//         walletAddress: walletAddress.toLowerCase(),
//         signature: signature,
//         nonce: nonce
//       })
//     });

//     return await response.json();
//   }

//   async validateToken(token: string): Promise<ValidateResponse> {
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'apikey': API_KEY,
//       },
//       body: JSON.stringify({
//         action: 'validate-token',
//         token: token
//       })
//     });

//     return await response.json();
//   }

//   async logout(token: string): Promise<AuthResponse> {

//             const { disconnect } = useDisconnect()
//             await disconnect()

//     const response = await fetch(API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'apikey': API_KEY,
//       },
//       body: JSON.stringify({
//         action: 'logout',
//         token: token
//       })
//     });

//     return await response.json();
//   }
// }

// export const authService = new AuthService();
