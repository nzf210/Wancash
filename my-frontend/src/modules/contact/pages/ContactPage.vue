<template>
  <div
    class="min-h-screen bg-gradient-to-b from-purple-50/50 to-blue-50/50 dark:from-gray-900 dark:to-gray-950 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <ContactHeader />

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <ContactForm />
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <QuickActions />
          <ContactInfo />
          <QuickFAQ />
        </div>
      </div>

      <!-- Bottom Banner -->
      <HelpBanner />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ContactHeader from '../components/ContactHeader.vue'
import ContactForm from '../components/ContactForm.vue'
import QuickActions from '../components/QuickActions.vue'
import ContactInfo from '../components/ContactInfo.vue'
import QuickFAQ from '../components/QuickFAQ.vue'
import HelpBanner from '../components/HelpBanner.vue'
</script>
