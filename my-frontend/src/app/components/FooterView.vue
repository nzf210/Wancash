<template>
  <footer class=" dark:text-white text-gray-900">
    <div class="container mx-auto px-4 py-12">
      <!-- Main Footer Grid -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
        <!-- Product Column -->
        <div>
          <h3 class="font-semibold dark:text-white mb-4 text-lg">Product</h3>
          <ul class="space-y-2">
            <li><router-link to="/"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition">Staking</router-link></li>
            <li><router-link to="/bridgeToken"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition">Bridge</router-link></li>
            <li><router-link to="/redem"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition">Redemption</router-link></li>
            <li><router-link to="/"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition">Dashboard</router-link></li>
          </ul>
        </div>

        <!-- Resources Column -->
        <div>
          <h3 class="font-semibold dark:text-white mb-4 text-lg">Resources</h3>
          <ul class="space-y-2">
            <li><a :href="whitepaperUrl" target="_blank" rel="noopener noreferrer"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center">
                Whitepaper
                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a></li>
            <li><router-link to="/about" class="hover:text-blue-600 dark:hover:text-blue-400 transition">About
                Us</router-link></li>
          </ul>
        </div>

        <!-- Support Column -->
        <div>
          <h3 class="font-semibold dark:text-white mb-4 text-lg">Support</h3>
          <ul class="space-y-2">
            <li><router-link to="/support" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact
                Us</router-link></li>
            <li><router-link to="/faq"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition">FAQs</router-link></li>
          </ul>
        </div>

        <!-- Legal Column -->
        <div>
          <h3 class="font-semibold dark:text-white mb-4 text-lg">Legal</h3>
          <ul class="space-y-2">
            <li><router-link to="/terms" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Terms of
                Service</router-link></li>
            <li><router-link to="/privacy" class="hover:text-blue-600 dark:hover:text-blue-400 transition">Privacy
                Policy</router-link></li>
            <li><router-link to="/disclaimer"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition">Disclaimer</router-link></li>
          </ul>
        </div>

        <!-- Subscribe Section -->
        <div class="col-span-2 md:col-span-1">
          <h3 class="font-semibold dark:text-white mb-4 text-lg">Subscribe to our newsletter</h3>
          <p class="text-sm mb-4">The latest news, articles, and resources, sent to your inbox monthly.</p>

          <!-- Form Subscribe -->
          <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-2">
            <Input type="email" placeholder="Enter your email" class="bg-gray-800 border-gray-700 text-white w-full"
              v-model="email" :disabled="isLoading" required />
            <Button type="submit" class="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" :disabled="isLoading">
              {{ isLoading ? 'Subscribing...' : 'Subscribe' }}
            </Button>
          </form>
        </div>
      </div>

      <!-- Divider -->
      <hr class="border-gray-700 my-8" />

      <!-- Bottom Section -->
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Copyright -->
        <div class="mb-4 md:mb-0">
          <p class="text-sm">© 2025 Wancash, Inc. All rights reserved.</p>
        </div>

        <!-- Social Links -->
        <div class="flex space-x-4">
          <a href="#" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition" title="Twitter">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition" title="GitHub">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition" title="Telegram">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.093.036.305.02.47z" />
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition" title="Discord">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue';
import { Input } from '@/components/ui/input';
import { ref, computed } from 'vue';
import { newsletterApi } from '@/modules/contact/services/newsletterApi';
import { toast } from 'vue-sonner';

const email = ref('');
const isLoading = ref(false);

// Get whitepaper URL from environment variable
const whitepaperUrl = computed(() => {
  return import.meta.env.VITE_WHITEPAPER_URL || 'https://wancash.gitbook.io/whitepaper';
});

const handleSubscribe = async () => {
  if (!email.value) return;

  isLoading.value = true;
  try {
    await newsletterApi.subscribe(email.value);
    email.value = ''; // Clear input on success
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    toast.error('Failed to subscribe. Please try again.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
footer {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
