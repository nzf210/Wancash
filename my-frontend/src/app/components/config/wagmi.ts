// ===== file: wagmi.ts (updated) =====
import { createConfig, injected, type Transport } from '@wagmi/core'
import { http, type EIP1193RequestFn } from 'viem'
import {
  mainnet,
  polygon,
  arbitrum,
  avalanche,
  bsc,
  sepolia,
  type AppKitNetwork,
  polygonAmoy,
  avalancheFuji,
  bscTestnet,
  arbitrumSepolia
} from '@reown/appkit/networks'

const itsProd: boolean = (import.meta as unknown as { env: { VITE_NODE_ENV: string } }).env.VITE_NODE_ENV !== 'production';

export const supportedNetworks = itsProd ?
  [sepolia, polygonAmoy, avalancheFuji, bscTestnet, arbitrumSepolia] as const :
  [mainnet, polygon, arbitrum, avalanche, bsc] as const;

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [...supportedNetworks]
export const chains = supportedNetworks.map(n => ({ id: n.id, name: n.name }))

// Project ID untuk WalletConnect
// const projectId = process.env.VITE_PROJECT_ID || 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [...supportedNetworks],
  transports: supportedNetworks.reduce((acc, network) => ({ ...acc, [network.id]: http() }), {}) as Record<number, Transport<string, Record<string, unknown>, EIP1193RequestFn>>,
  ssr: true,
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
})
