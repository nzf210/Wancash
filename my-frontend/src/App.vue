<script setup lang="ts">
import DefaultLayout from './app/layout/DefaultLayout.vue'
import { provideTheme } from '@/app/components/providers/theme-provider'
provideTheme()
</script>

<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>
