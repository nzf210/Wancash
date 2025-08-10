import { createAppKit } from '@reown/appkit/vue'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, arbitrum } from '@reown/appkit/networks'

export const projectId = process.env.VITE_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694"

export const appkit = createAppKit({
  adapters: [new WagmiAdapter({ networks: [mainnet, polygon, arbitrum], projectId })],
  networks: [mainnet, polygon, arbitrum],
  projectId,
  metadata: {
    name: 'Your App Name',
    description: 'Your App Description',
    url: window.location.origin,
    icons: ['https://your-app-logo.png']
  }
})
