<script setup lang="ts">
import DefaultLayout from '@/app/layout/DefaultLayout.vue'
import { provideTheme } from '@/app/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { toastOptions } from '@/utils/toastUtils'
import OfflineOverlay from '@/shared/components/OfflineOverlay.vue'
import { useNetworkStatus } from '@/shared/composables/useNetworkStatus'
import ErrorBoundary from '@/components/ErrorBoundary.vue'

provideTheme()

// Monitor network status globally
const { isOnline } = useNetworkStatus()
</script>

<template>
  <Toaster :duration="3000" :rich-colors="false" :close-button="true" position="top-center" :offset="16" expand unstyled
    class="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]" :toast-options="toastOptions" />

  <!-- Offline Overlay - Blocks all activity when connection is lost -->
  <OfflineOverlay :is-online="isOnline" />

  <DefaultLayout v-if="isOnline">
    <ErrorBoundary>
      <router-view />
    </ErrorBoundary>
  </DefaultLayout>
</template>

<style scoped>
/* Tambahan styling untuk konsistensi dengan dashboard */
[data-sonner-toast] {
  backdrop-filter: blur(8px);
}

[data-sonner-toast]:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark [data-sonner-toast]:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Styling untuk close button icon di dalam */
[data-sonner-toast] [data-close-button] svg {
  width: 12px;
  height: 12px;
}

/* Styling untuk action dan cancel button */
[data-sonner-toast] button {
  transition: all 0.2s ease;
}

/* Gradient border effect */
[data-sonner-toast]::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* Variasi gradient untuk tipe yang berbeda */
[data-sonner-toast][data-type="success"]::before {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
}

[data-sonner-toast][data-type="error"]::before {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(244, 63, 94, 0.1));
}

[data-sonner-toast][data-type="warning"]::before {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1));
}

[data-sonner-toast][data-type="info"]::before {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(14, 165, 233, 0.1));
}
</style>
