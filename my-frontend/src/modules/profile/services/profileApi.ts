// Profile API Service
import { toast } from 'vue-sonner'

export interface Profile {
    id: string
    wallet_address: string
    display_name: string | null
    username: string | null
    email: string | null
    bio: string | null
    avatar_url: string | null
    phone: string | null
    shipping_address: string | null
    role: string
    created_at: string
    last_login_at: string | null
    login_count: number
}

export interface UserSettings {
    id: number
    user_id: string
    language: 'en' | 'id'
    theme: 'light' | 'dark' | 'system'
    timezone: string
    currency: 'USD' | 'IDR' | 'EUR'
    updated_at: string
}

export interface NotificationSettings {
    id: number
    user_id: string
    email_promotions: boolean
    email_security: boolean
    email_newsletter: boolean
    push_mentions: boolean
    push_comments: boolean
    push_updates: boolean
    updated_at: string
}

export interface PrivacySettings {
    id: number
    user_id: string
    profile_visibility: 'public' | 'followers' | 'private'
    show_online_status: boolean
    allow_tagging: boolean
    search_engine_index: boolean
    updated_at: string
}

export interface FullProfile extends Profile {
    settings: UserSettings
    notifications: NotificationSettings
    privacy: PrivacySettings
}

const getHeaders = (walletAddress?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    }
    if (walletAddress) {
        headers['X-Wallet-Address'] = walletAddress
    }
    return headers
}

export const profileApi = {
    async getProfile(walletAddress: string): Promise<FullProfile> {
        const response = await fetch('/api/profile', {
            method: 'GET',
            credentials: 'include',
            headers: getHeaders(walletAddress)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to fetch profile')
        }

        const result = await response.json()
        return result.data
    },

    async updateProfile(
        walletAddress: string,
        data: Partial<Pick<Profile, 'display_name' | 'username' | 'email' | 'bio' | 'avatar_url' | 'phone' | 'shipping_address'>>
    ): Promise<Profile> {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            credentials: 'include',
            headers: getHeaders(walletAddress),
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to update profile')
        }

        const result = await response.json()
        toast.success('Profile updated successfully')
        return result.data
    },

    async updateSettings(
        walletAddress: string,
        data: Partial<Omit<UserSettings, 'id' | 'user_id' | 'updated_at'>>
    ): Promise<UserSettings> {
        const response = await fetch('/api/profile/settings', {
            method: 'PUT',
            credentials: 'include',
            headers: getHeaders(walletAddress),
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to update settings')
        }

        const result = await response.json()
        toast.success('Settings updated successfully')
        return result.data
    },

    async updateNotifications(
        walletAddress: string,
        data: Partial<Omit<NotificationSettings, 'id' | 'user_id' | 'updated_at'>>
    ): Promise<NotificationSettings> {
        const response = await fetch('/api/profile/notifications', {
            method: 'PUT',
            credentials: 'include',
            headers: getHeaders(walletAddress),
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to update notifications')
        }

        const result = await response.json()
        toast.success('Notification preferences updated')
        return result.data
    },

    async updatePrivacy(
        walletAddress: string,
        data: Partial<Omit<PrivacySettings, 'id' | 'user_id' | 'updated_at'>>
    ): Promise<PrivacySettings> {
        const response = await fetch('/api/profile/privacy', {
            method: 'PUT',
            credentials: 'include',
            headers: getHeaders(walletAddress),
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to update privacy settings')
        }

        const result = await response.json()
        toast.success('Privacy settings updated')
        return result.data
    },

    async deleteAccount(walletAddress: string): Promise<void> {
        const response = await fetch('/api/profile', {
            method: 'DELETE',
            credentials: 'include',
            headers: getHeaders(walletAddress)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to delete account')
        }

        toast.success('Account deleted successfully')
    }
}
