import type { NavigationItem, ProductMenuItem } from "./types"

export const productMenuItems: ProductMenuItem[] = [
  {
    title: 'Redem',
    description: 'Redem your token for gift',
    href: '/redem',
    icon: '💰'
  },
  {
    title: 'Bridge',
    description: 'Send your token to other chains',
    href: '/bridgeToken',
    icon: '📋'
  },
  {
    title: 'Send',
    description: 'Send your token to other wallet',
    href: '/sendToken',
    icon: '💸'
  }
]

export const navigationItems: NavigationItem[] = [
  {
    title: 'Support',
    href: '/support',
  }
]
