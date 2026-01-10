import { useAuth } from '@/app/composables/useAuth'

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>
}

export const apiClient = {
    async fetch(url: string, options: FetchOptions = {}) {
        const { getAuthHeaders, refreshSession } = useAuth()

        // 1. Prepare headers
        const headers = {
            ...getAuthHeaders(),
            ...options.headers,
            'Content-Type': 'application/json'
        }

        // 2. Initial Request
        let response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include' // Important for cookies
        })

        // 3. Handle 401 Unauthorized
        if (response.status === 401) {
            console.warn('[apiClient] 401 detected, attempting refresh...')

            try {
                // Attempt to refresh the session
                const refreshed = await refreshSession()

                if (refreshed) {
                    console.log('[apiClient] Refresh successful, retrying request...')
                    // Retry original request with new headers
                    const newHeaders = {
                        ...getAuthHeaders(),
                        ...options.headers,
                        'Content-Type': 'application/json'
                    }

                    response = await fetch(url, {
                        ...options,
                        headers: newHeaders,
                        credentials: 'include'
                    })
                } else {
                    console.error('[apiClient] Refresh failed')
                }
            } catch (error) {
                console.error('[apiClient] Error during refresh:', error)
            }
        }

        // 4. Return response (caller handles other errors)
        return response
    }
}
