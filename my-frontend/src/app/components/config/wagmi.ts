import { createConfig, type Transport } from '@wagmi/core'
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

export const supportedNetworks = process.env.NODE_ENV !== 'production' ?
                          [sepolia, polygonAmoy, avalancheFuji , bscTestnet, arbitrumSepolia] as const :
                          [mainnet, polygon, arbitrum, avalanche, bsc] as const

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [...supportedNetworks]
export const chains = supportedNetworks.map(n => ({ id: n.id, name: n.name }))

export const config = createConfig({
  chains: [...supportedNetworks],
  transports: supportedNetworks.reduce((acc, network) => ({ ...acc, [network.id]: http() }), {}) as Record<number, Transport<string, Record<string, unknown>, EIP1193RequestFn>>,
})

// transports: {
//   [mainnet.id]: http(),
//   [polygon.id]: http(),
//   [arbitrum.id]: http(),
//   [avalanche.id]: http(),
//   [bsc.id]: http(),
//   [sepolia.id]: http(),
// },
