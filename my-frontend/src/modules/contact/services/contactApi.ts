import type { ContactFormData, Attachment } from '../types/contact.types'
import { useAuth } from '@/app/composables/useAuth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

interface ContactSubmission extends ContactFormData {
    type: string
    attachments: Attachment[]
}

interface SubmitResponse {
    success: boolean
    data?: {
        id: string
        ticketNumber: string
        status: string
        createdAt: string
        message: string
    }
    error?: string
}

/**
 * Submit contact form to backend
 * @param data Contact form data with attachments
 */
export const submitContactForm = async (data: ContactSubmission): Promise<SubmitResponse> => {
    const requestBody = {
        name: data.name,
        email: data.email,
        wallet_address: data.wallet || undefined,
        subject: data.subject,
        message: data.message,
        ticket_type: data.type,
        priority: data.urgent ? 'high' : 'normal'
    }

    console.log('📤 Submitting ticket:', requestBody)
    console.log('📍 API URL:', `${API_BASE_URL}/api/support`)

    const { getAuthHeaders } = useAuth()

    try {
        const response = await fetch(`${API_BASE_URL}/api/support`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        })

        const result = await response.json()
        console.log('📥 API Response:', response.status, result)

        if (!response.ok) {
            return { success: false, error: result.error || 'Failed to submit ticket' }
        }

        return result
    } catch (error) {
        console.error('❌ Submit ticket error:', error)
        return { success: false, error: 'Network error. Please try again.' }
    }
}

/**
 * Get user's support tickets
 */
export const getUserTickets = async () => {
    const { getAuthHeaders } = useAuth()
    try {
        const response = await fetch(`${API_BASE_URL}/api/support`, {
            method: 'GET',
            headers: {
                ...getAuthHeaders()
            },
            credentials: 'include'
        })

        return await response.json()
    } catch (error) {
        console.error('Get tickets error:', error)
        return { success: false, error: 'Failed to fetch tickets' }
    }
}

/**
 * Get ticket details by ID
 */
export const getTicketDetails = async (ticketId: string) => {
    const { getAuthHeaders } = useAuth()
    try {
        const response = await fetch(`${API_BASE_URL}/api/support/${ticketId}`, {
            method: 'GET',
            headers: {
                ...getAuthHeaders()
            },
            credentials: 'include'
        })

        return await response.json()
    } catch (error) {
        console.error('Get ticket details error:', error)
        return { success: false, error: 'Failed to fetch ticket details' }
    }
}
