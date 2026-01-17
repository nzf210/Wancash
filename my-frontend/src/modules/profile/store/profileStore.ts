// Profile Store - Pinia
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { profileApi, type Profile, type UserSettings, type NotificationSettings, type PrivacySettings } from '../services/profileApi'

export const useProfileStore = defineStore('profile', () => {
    // State
    const profile = ref<Profile | null>(null)
    const settings = ref<UserSettings | null>(null)
    const notifications = ref<NotificationSettings | null>(null)
    const privacy = ref<PrivacySettings | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Getters
    const isLoaded = computed(() => profile.value !== null)

    const displayName = computed(() =>
        profile.value?.display_name ||
        profile.value?.username ||
        shortenAddress(profile.value?.wallet_address)
    )

    const avatarUrl = computed(() =>
        profile.value?.avatar_url ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.value?.wallet_address}`
    )

    // Helper
    function shortenAddress(address?: string | null): string {
        if (!address) return 'User'
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    // Actions
    async function fetchProfile(walletAddress: string): Promise<void> {
        loading.value = true
        error.value = null

        try {
            const data = await profileApi.getProfile(walletAddress)
            profile.value = {
                id: data.id,
                wallet_address: data.wallet_address,
                display_name: data.display_name,
                username: data.username,
                email: data.email,
                bio: data.bio,
                avatar_url: data.avatar_url,
                phone: data.phone,
                shipping_address: data.shipping_address,
                role: data.role,
                created_at: data.created_at,
                last_login_at: data.last_login_at,
                login_count: data.login_count
            }
            settings.value = data.settings
            notifications.value = data.notifications
            privacy.value = data.privacy
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to load profile'
            console.error('Failed to fetch profile:', e)
        } finally {
            loading.value = false
        }
    }

    async function updateProfile(
        walletAddress: string,
        data: Partial<Pick<Profile, 'display_name' | 'username' | 'email' | 'bio' | 'avatar_url' | 'phone' | 'shipping_address'>>
    ): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            const updated = await profileApi.updateProfile(walletAddress, data)
            profile.value = { ...profile.value, ...updated } as Profile
            return true
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to update profile'
            return false
        } finally {
            loading.value = false
        }
    }

    async function updateSettings(
        walletAddress: string,
        data: Partial<Omit<UserSettings, 'id' | 'user_id' | 'updated_at'>>
    ): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            settings.value = await profileApi.updateSettings(walletAddress, data)
            return true
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to update settings'
            return false
        } finally {
            loading.value = false
        }
    }

    async function updateNotifications(
        walletAddress: string,
        data: Partial<Omit<NotificationSettings, 'id' | 'user_id' | 'updated_at'>>
    ): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            notifications.value = await profileApi.updateNotifications(walletAddress, data)
            return true
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to update notifications'
            return false
        } finally {
            loading.value = false
        }
    }

    async function updatePrivacy(
        walletAddress: string,
        data: Partial<Omit<PrivacySettings, 'id' | 'user_id' | 'updated_at'>>
    ): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            privacy.value = await profileApi.updatePrivacy(walletAddress, data)
            return true
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to update privacy'
            return false
        } finally {
            loading.value = false
        }
    }

    async function deleteAccount(walletAddress: string): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            await profileApi.deleteAccount(walletAddress)
            reset()
            return true
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to delete account'
            return false
        } finally {
            loading.value = false
        }
    }

    function reset(): void {
        profile.value = null
        settings.value = null
        notifications.value = null
        privacy.value = null
        error.value = null
    }

    return {
        // State
        profile,
        settings,
        notifications,
        privacy,
        loading,
        error,
        // Getters
        isLoaded,
        displayName,
        avatarUrl,
        // Actions
        fetchProfile,
        updateProfile,
        updateSettings,
        updateNotifications,
        updatePrivacy,
        deleteAccount,
        reset
    }
})
