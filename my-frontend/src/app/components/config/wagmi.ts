import { createConfig } from '@wagmi/core'
import { mainnet, polygon, arbitrum } from '@wagmi/core/chains'
import { http } from 'viem'

export const config = createConfig({
  chains: [mainnet, polygon, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
})
