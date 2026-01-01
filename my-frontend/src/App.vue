<script setup lang="ts">
import DefaultLayout from '@/app/layout/DefaultLayout.vue'
import { provideTheme } from '@/app/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

provideTheme()

const positionValue = 'top-center'
</script>

<template>
  <Toaster :position="positionValue" :offset="0"
    :style="{ top: '5%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '9999', position: 'fixed' }" />
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>
