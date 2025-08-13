// ===== file: appkit.ts =====
import { createAppKit } from '@reown/appkit/vue'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { supportedNetworks } from '@/app/components/config/wagmi'

export const projectId = process.env.VITE_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694"

// Buat single wagmiAdapter yang akan digunakan di semua tempat
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
    url: window.location.origin,
    icons: ['https://your-app-logo.png']
  },
  debug: process.env.VITE_NODE_ENV === 'development',
  enableWalletGuide: true,
  themeMode: 'light',
  themeVariables: {
    '--w3m-z-index': 1000
  }
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
