<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref<Error | null>(null)

// Capture errors from child components
onErrorCaptured((err) => {
    hasError.value = true
    error.value = err as Error
    // Log to console (Sentry will pick it up automatically if configured globally, 
    // but we can also log explicitly if needed)
    console.error('[ErrorBoundary] Caught error:', err)

    // Return false to stop propagation if you want to handle it fully here
    // Return true to let it bubble up (e.g. to global handler)
    return false
})

const reload = () => {
    window.location.reload()
}
</script>

<template>
    <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div
            class="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
            <div
                class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                    </path>
                </svg>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
                We encountered an unexpected error. Our team has been notified.
            </p>

            <div
                class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6 text-left overflow-auto max-h-32 text-xs font-mono text-red-500 dark:text-red-400">
                {{ error?.message }}
            </div>

            <button @click="reload"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.058M20 20v-5h-.058M9 4H4v5m16 16h-5v-5M20 4a9 9 0 11-18 0"></path>
                </svg>
                Reload Application
            </button>
        </div>
    </div>
    <slot v-else />
</template>
