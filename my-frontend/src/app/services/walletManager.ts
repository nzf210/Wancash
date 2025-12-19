import type { UserProfile } from "@/types/auth"

export const buildProfileFromAddress = (address: string): UserProfile => ({
  avatar: 'https://github.com/shadcn.png',
  display_name: 'Wancash User',
  initials: shortAddres(address),
  email: `${shortAddres(address)}@wallet.local`,
  wallet_address: address,
});


const shortAddres = (address: string) => {
  if (!address) return
  return formatHexAddress(address)
}


const formatHexAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
