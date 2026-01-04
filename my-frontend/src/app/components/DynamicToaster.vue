<script lang="ts" setup>
import { Toaster, toast } from 'vue-sonner';

enum Position {
  TopLeft = 'top-left',
  TopCenter = 'top-center',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomCenter = 'bottom-center',
  BottomRight = 'bottom-right',
}

const props = defineProps({
  type: {
    type: String,
    default: 'info', // success, error, warning, info, loading, custom
    validator: (value: string) => ['success', 'error', 'warning', 'info', 'loading', 'custom'].includes(value)
  },
  message: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: Number, default: 3000 }, // ms
  position: {
    type: String as () => Position | undefined,
    validator: (value: string) =>
      ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'].includes(value),
    default: 'bottom-right',
  },
  options: { type: Object, default: () => ({}) } // Custom Sonner options
});

// Emit event jika toast selesai
const emit = defineEmits(['toast-closed']);

// Fungsi trigger toast dinamis
const showToast = () => {
  let toastFunc;
  switch (props.type) {
    case 'success': toastFunc = toast.success; break;
    case 'error': toastFunc = toast.error; break;
    case 'warning': toastFunc = toast.warning; break;
    case 'info': toastFunc = toast.info; break;
    case 'loading': toastFunc = toast.loading; break;
    default: toastFunc = toast; // Custom
  }

  const toastId = toastFunc(props.message, {
    description: props.description,
    duration: props.duration,
    position: props.position || 'bottom-center',
    ...props.options,
    onDismiss: () => emit('toast-closed')
  });

  return toastId; // Bisa digunakan untuk update toast (e.g., promise)
};

// Expose method untuk parent component
defineExpose({ showToast });
</script>

<template>
  <!-- Toaster dari Sonner, styled dengan shadcn -->
  <Toaster :position="position || 'bottom-center'" :theme="options.theme || 'light'" richColors expand closeButton />
</template>

<style>
/* Custom style jika perlu, gunakan Tailwind dari shadcn */
</style>
