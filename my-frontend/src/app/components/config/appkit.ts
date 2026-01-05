// ===== file: appkit.ts (updated) =====
import { createAppKit } from '@reown/appkit/vue'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { getAccount, signTypedData } from '@wagmi/core'
import { supportedNetworks } from '@/app/components/config/wagmi'

export const projectId = (import.meta as unknown as { env: { VITE_PROJECT_ID: string } }).env.VITE_PROJECT_ID

export const wagmiAdapter = new WagmiAdapter({
  networks: [...supportedNetworks],
  projectId,
  chains: supportedNetworks,
  ssr: true
})

export const appkit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [...supportedNetworks],
  projectId,
  metadata: {
    name: 'Wancash Gold',
    description: 'Wancash gold for exchange and trading purposes',
    url: globalThis.location.origin,
    icons: [`${globalThis.location.origin}/wancash.png`]
  },
  debug: (import.meta as unknown as { env: { VITE_NODE_ENV: string } }).env.VITE_NODE_ENV !== 'production',
  enableWalletGuide: false,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-z-index': 1000
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  allWallets: 'SHOW'
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

interface MyProvider {
  request: (params: unknown) => Promise<string>;
}
export const updateAppKitTheme = (theme: 'light' | 'dark') => {
  appkit.setThemeMode(theme)
}

// Utility untuk mendapatkan provider dari active connector
export const getActiveProvider = async () => {
  const account = getAccount(wagmiConfig)
  if (account.connector) {
    return await account.connector.getProvider()
  }
  return null
}

// Utility untuk mendapatkan signer
export const getSigner = async () => {
  const provider = await getActiveProvider() as MyProvider
  if (provider) {
    // Return provider sebagai signer
    return provider
  }
  return null
}

// Utility untuk sign message dengan berbagai fallback
export const signAuthMessage = async (
  address: string,
  message: {
    nonce: string;
    timestamp: number;
    address: string;
    chainId: number;
  },
  chainId: number
): Promise<string> => {
  try {
    // Coba signTypedData dari wagmi terlebih dahulu
    const signature = await signTypedData(wagmiConfig, {
      domain: {
        name: "Wancash Auth",
        version: "1",
        chainId,
        verifyingContract: "0x0A16FB6aD11eD74D1334b93F725eefAae5F6e7aE" as `0x${string}`
      },
      types: {
        Nonce: [
          { name: "nonce", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "address", type: "address" },
          { name: "chainId", type: "uint256" }
        ]
      },
      primaryType: "Nonce",
      message: {
        nonce: message.nonce,
        timestamp: BigInt(message.timestamp),
        address: message.address as `0x${string}`,
        chainId: BigInt(message.chainId)
      }
    })

    return signature
  } catch (error) {
    console.warn('wagmi signTypedData failed, trying fallback:', error)

    // Fallback ke provider langsung
    const provider = await getActiveProvider() as MyProvider
    if (!provider) {
      throw new Error('No provider available')
    }

    // Coba berbagai signing methods
    try {
      const signature = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [address, JSON.stringify({
          domain: {
            name: "Wancash Auth",
            version: "1",
            chainId,
            verifyingContract: "0x0A16FB6aD11eD74D1334b93F725eefAae5F6e7aE"
          },
          message,
          primaryType: "Nonce",
          types: {
            Nonce: [
              { name: "nonce", type: "string" },
              { name: "timestamp", type: "uint256" },
              { name: "address", type: "address" },
              { name: "chainId", type: "uint256" }
            ]
          }
        })]
      })

      return signature
    } catch (e) {
      throw new Error(`Signing failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
    }
  }
}
