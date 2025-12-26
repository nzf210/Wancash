// ===== file: appkit.ts =====
import { createAppKit } from '@reown/appkit/vue'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { supportedNetworks } from '@/app/components/config/wagmi'

export const projectId = import.meta.env.VITE_PROJECT_ID || ""

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
  debug: import.meta.env.VITE_NODE_ENV === 'development',
  enableWalletGuide: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-z-index': 1000
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    // connectMethodsOrder: ['wallet','social', 'email']
  }
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

export const updateAppKitTheme = (theme: 'light' | 'dark') => {
  appkit.setThemeMode(theme)
}

export const getProvider = async () => {
  const provider = await wagmiConfig.connectors[0].getProvider()
  return provider
}

export const getAccounts = async () => {
  const accounts = await wagmiConfig.connectors[0].getAccounts()
  return accounts
}
