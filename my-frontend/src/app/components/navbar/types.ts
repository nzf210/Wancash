export interface ProfileAuthStores {
  walletAddress?: string
  isConnected?: boolean
  userAvatar?: string
  userDisplayName?: string
  userInitials?: string
  userEmail?: string
  network?: string
  balance?: string
  handleDisconnect:  () => Promise<void>
}

export interface ProductMenuItem {
  title: string
  description: string
  href: string
  icon: string
}

export interface NavigationItem {
  title: string
  href: string
}

export interface NavbarProps {
  notificationCount?: number
  showWalletConnect?: boolean
  showThemeToggle?: boolean
}

export interface NavbarEmits {
  (e: 'login'): void
  (e: 'logout'): void
  (e: 'profileClick'): void
  (e: 'settingsClick'): void
  (e: 'notificationClick'): void
}
