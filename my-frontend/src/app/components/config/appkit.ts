import { createAppKit } from '@reown/appkit/vue'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { supportedNetworks } from '@/app/components/config/wagmi'

export const projectId = process.env.VITE_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694"

export const appkit = createAppKit({
  adapters: [new WagmiAdapter({ networks: [...supportedNetworks], projectId })],
  networks: [...supportedNetworks],
  projectId,
  metadata: {
    name: 'Wancash Gold',
    description: 'Wancash gold for exchange and trading purposes',
    url: window.location.origin,
    icons: ['https://your-app-logo.png']
  },
  // tokens: {
  //   '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': { symbol: 'WANCASH', decimals: 18 },
  // },
  debug: process.env.NODE_ENV !== 'production',
  enableWalletGuide: true,
})

export const setupAutoReconnect = () => {
  let reconnectAttempts = 0
  const maxAttempts = 3

  const attemptReconnect = async () => {
    try {
      await appkit.open()
      reconnectAttempts = 0
    } catch (error: unknown) {
      console.error('Auto-reconnect failed:', error)
      if (reconnectAttempts < maxAttempts) {
        reconnectAttempts++
        setTimeout(attemptReconnect, 3000)
      }
    }
  }
  window.addEventListener('focus', attemptReconnect)
}
