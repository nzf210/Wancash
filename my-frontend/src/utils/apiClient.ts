import { useAuth } from '@/app/composables/useAuth'

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>
}

export const apiClient = {
    async fetch(url: string, options: FetchOptions = {}) {
        console.log('\n🌐 [apiClient] ========== API REQUEST ==========')
        console.log('🌐 [apiClient] URL:', url)
        console.log('🌐 [apiClient] Method:', options.method || 'GET')

        const { getAuthHeaders, refreshSession } = useAuth()

        // 1. Prepare headers
        const authHeaders = getAuthHeaders()
        const headers = {
            ...authHeaders,
            ...options.headers,
            'Content-Type': 'application/json'
        }

        console.log('🌐 [apiClient] Headers:', headers)
        console.log('🌐 [apiClient] Credentials:', 'include')

        // 2. Initial Request
        console.log('🌐 [apiClient] Sending initial request...')
        let response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include' // Important for cookies
        })

        console.log('🌐 [apiClient] Response status:', response.status)
        console.log('🌐 [apiClient] Response ok:', response.ok)

        // 3. Handle 401 Unauthorized
        if (response.status === 401) {
            console.warn('⚠️ [apiClient] 401 Unauthorized detected!')
            console.log('🌐 [apiClient] Attempting token refresh...')

            try {
                // Attempt to refresh the session
                const refreshed = await refreshSession()

                if (refreshed) {
                    console.log('✅ [apiClient] Refresh successful, retrying original request...')
                    // Retry original request with new headers
                    const newAuthHeaders = getAuthHeaders()
                    const newHeaders = {
                        ...newAuthHeaders,
                        ...options.headers,
                        'Content-Type': 'application/json'
                    }

                    console.log('🌐 [apiClient] Retry headers:', newHeaders)

                    response = await fetch(url, {
                        ...options,
                        headers: newHeaders,
                        credentials: 'include'
                    })

                    console.log('🌐 [apiClient] Retry response status:', response.status)
                } else {
                    console.error('❌ [apiClient] Refresh failed, user needs to re-login')
                }
            } catch (error) {
                console.error('❌ [apiClient] Error during refresh:', error)
            }
        }

        // 4. Return response (caller handles other errors)
        console.log('🌐 [apiClient] ========== RETURNING RESPONSE ==========\n')
        return response
    }
}
