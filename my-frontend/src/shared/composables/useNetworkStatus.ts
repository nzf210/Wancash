import { ref, onMounted, onUnmounted } from 'vue'
import { toast } from 'vue-sonner'

interface NetworkStatusOptions {
    checkInterval?: number // Interval in milliseconds to check connectivity (default: 10000 = 10s)
    timeout?: number // Timeout for fetch request in milliseconds (default: 5000 = 5s)
    endpoint?: string // Endpoint to check connectivity (default: cloudflare dns)
}

export function useNetworkStatus(options: NetworkStatusOptions = {}) {
    const {
        checkInterval = 15000, // Check every 10 seconds
        timeout = 6000, // 5 second timeout
        endpoint = 'https://1.1.1.1', // Cloudflare's DNS - very reliable
    } = options

    const isOnline = ref(navigator.onLine)
    const wasOffline = ref(false)
    const isChecking = ref(false)
    let checkIntervalId: ReturnType<typeof setInterval> | null = null
    let toastId: string | number | undefined

    /**
     * Check actual internet connectivity by making an HTTP request
     * This distinguishes between "connected to network" vs "has internet access"
     */
    const checkInternetConnectivity = async (): Promise<boolean> => {
        // If browser says we're offline, don't even try
        if (!navigator.onLine) {
            return false
        }

        if (isChecking.value) {
            return isOnline.value
        }

        isChecking.value = true

        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), timeout)

            // Use HEAD request to minimize data transfer
            // Add timestamp to prevent caching
            await fetch(`${endpoint}?t=${Date.now()}`, {
                method: 'HEAD',
                mode: 'no-cors', // Allow cross-origin requests
                cache: 'no-store',
                signal: controller.signal,
            })

            clearTimeout(timeoutId)
            isChecking.value = false

            // With no-cors mode, we can't check response.ok, but if we get here without error, we're online
            return true
        } catch {
            isChecking.value = false
            // Network error means no internet connectivity
            return false
        }
    }

    const showOfflineToast = () => {
        // Dismiss any existing toast first
        if (toastId) {
            toast.dismiss(toastId)
        }

        toastId = toast.error('No Internet Connection', {
            description: 'Please check your internet connection and try again.',
            duration: Infinity, // Keep showing until dismissed or comes back online
        })
    }

    const showOnlineToast = () => {
        // Dismiss the offline toast
        if (toastId) {
            toast.dismiss(toastId)
            toastId = undefined
        }

        toast.success('Connection Restored', {
            description: 'Your internet connection has been restored.',
            duration: 3000,
        })
    }

    const updateOnlineStatus = async (forceCheck = false) => {
        const previousStatus = isOnline.value

        // First check browser's online status
        if (!navigator.onLine) {
            isOnline.value = false
        } else if (forceCheck || previousStatus === false) {
            // If browser says online, verify actual connectivity
            const hasInternet = await checkInternetConnectivity()
            isOnline.value = hasInternet
        }

        const currentStatus = isOnline.value

        // Show toast when going offline
        if (!currentStatus && previousStatus) {
            wasOffline.value = true
            showOfflineToast()
        }

        // Show toast when coming back online
        if (currentStatus && !previousStatus && wasOffline.value) {
            showOnlineToast()
            wasOffline.value = false
        }
    }

    const handleOnline = () => {
        // When browser says we're online, verify actual connectivity
        updateOnlineStatus(true)
    }

    const handleOffline = () => {
        // When browser says we're offline, trust it immediately
        isOnline.value = false
        wasOffline.value = true
        showOfflineToast()
    }

    const startPeriodicCheck = () => {
        // Perform periodic connectivity checks
        checkIntervalId = setInterval(async () => {
            await updateOnlineStatus(true)
        }, checkInterval)
    }

    const stopPeriodicCheck = () => {
        if (checkIntervalId) {
            clearInterval(checkIntervalId)
            checkIntervalId = null
        }
    }

    onMounted(() => {
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Initial connectivity check
        updateOnlineStatus(true)

        // Start periodic checks
        startPeriodicCheck()
    })

    onUnmounted(() => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        stopPeriodicCheck()

        // Dismiss any active toasts
        if (toastId) {
            toast.dismiss(toastId)
        }
    })

    return {
        isOnline,
        checkInternetConnectivity, // Expose for manual checks if needed
    }
}
