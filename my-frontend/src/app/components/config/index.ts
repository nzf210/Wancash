import {
  mainnet,
  polygon,
  arbitrum,
  avalanche,
  bsc,
  sepolia,
  type AppKitNetwork
} from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { projectId } from './appkit'

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet,
  polygon,
  arbitrum,
  avalanche,
  bsc,
  sepolia // testnet
]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId
})

export const metadata = {
  name: 'Wancash',
  description: 'Secure and easy to use wallet for Wancash',
  url: window.location.origin, // Menggunakan origin saat ini
  icons: ['https://path-ke-logo-anda.png']
}
