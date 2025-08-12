import { type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { projectId } from './appkit'
import { supportedNetworks } from '@/app/components/config/wagmi'


export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [...supportedNetworks]
// export const chains = supportedNetworks.map(n => ({ id: n.id, name: n.name }))

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  chains: supportedNetworks
})

/**
 *
export const metadata = {
  name: 'Wancash Gold',
  description: 'Wancash gold for exchange and trading purposes',
  url: window.location.origin,
  icons: ['https://your-app-logo.png']
}
*/
