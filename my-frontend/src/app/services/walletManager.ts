import type { UserProfile } from "@/types/auth"

/**
 * Builds a user profile object from an Ethereum address.
 *
 * @param {string} address The Ethereum address to build the profile from.
 * @returns {UserProfile} A user profile object containing the user's avatar, display name, initials, email, and wallet address.
 */
export const buildProfileFromAddress = (address: string): UserProfile => {
  /**
   * The user profile object.
   */
  const profile: UserProfile = {
    /**
     * The user's avatar URL.
     */
    avatar: 'https://github.com/shadcn.png',
    /**
     * The user's display name.
     */
    display_name: 'Wancash User',
    /**
     * The user's initials, derived from their Ethereum address.
     */
    initials: shortAddres(address),
    /**
     * The user's email address, derived from their Ethereum address.
     */
    email: `${shortAddres(address)}@wallet.local`,
    /**
     * The user's Ethereum address.
     */
    wallet_address: address,
  };

  return profile;
};

const shortAddres = (address: string) => {
  if (!address) return
  return formatHexAddress(address)
}

const formatHexAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
