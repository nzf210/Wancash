<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center space-y-8">
      <!-- 404 Illustration placeholder or just large text -->
      <div class="relative">
        <h1 class="text-9xl font-extrabold text-blue-600 dark:text-blue-500 tracking-widest">
          404
        </h1>
        <div class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <span
            class="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-2 text-sm rounded rotate-12 absolute transform translate-x-16 -translate-y-8 font-bold border border-blue-200 dark:border-blue-900 shadow-sm">
            Page Not Found
          </span>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Something's missing.
        </h2>
        <p class="text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
      </div>

      <div class="mt-8">
        <router-link to="/"
          class="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <Home class="w-5 h-5" />
          Back to Homepage
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home } from 'lucide-vue-next';
</script>

<style scoped>
/* No raw CSS needed, using Tailwind */
</style>
