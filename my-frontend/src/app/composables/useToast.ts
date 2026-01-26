// frontend/src/composables/useToast.ts
import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
}

export const useToast = () => {
  const toasts = ref<Toast[]>([])

  const showToast = (
    message: string,
    type: Toast['type'] = 'info',
    duration: number = 3000
  ) => {
    const id = Date.now()

    const toast: Toast = {
      id,
      message,
      type,
      duration
    }

    toasts.value.push(toast)

    // Auto remove
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  // Convenience methods
  const success = (message: string, duration?: number) =>
    showToast(message, 'success', duration)

  const error = (message: string, duration?: number) =>
    showToast(message, 'error', duration)

  const warning = (message: string, duration?: number) =>
    showToast(message, 'warning', duration)

  const info = (message: string, duration?: number) =>
    showToast(message, 'info', duration)

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
