<template>
  <div
    class="min-h-screen bg-gradient-to-b from-purple-50/50 to-blue-50/50 dark:from-gray-900 dark:to-gray-950 py-8 px-4">
    <div class="max-w-6xl mx-auto"> <!-- Header Section -->
      <div class="mb-12 text-center">
        <div class="flex items-center justify-center mb-6">
          <div
            class="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            CT </div>
          <div class="ml-4">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Client Token Support</h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 mt-2">Contact us for token and staking support</p>
          </div>
        </div>
        <!-- Stats Bar -->
        <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="glass-blue rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-white mb-2">24/7</div>
            <div class="text-blue-light">Support Available</div>
          </div>
          <div class="glass-blue rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-white mb-2">≤ 1h</div>
            <div class="text-blue-light">Response Time</div>
          </div>
          <div class="glass-blue rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-white mb-2">99%</div>
            <div class="text-blue-light">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <Card
            class="card-glow border-2 border-purple-200 dark:border-blue-light transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl">
            <CardHeader>
              <CardTitle class="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Message to Support Team
              </CardTitle>
              <CardDescription class="text-gray-600 dark:text-gray-300">
                Fill out the form below and we will respond within 1 hour
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Token Info -->
                <div class="bg-blue-elevated rounded-lg p-4 mb-6">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                      WCH
                    </div>
                    <div>
                      <div class="font-semibold text-white">Staking Wancash Token (WCH)</div>
                      <div class="text-sm text-blue-muted">Current Price: ${{ currentPrice.toLocaleString() }}</div>
                    </div>
                  </div>
                </div>

                <!-- Contact Type -->
                <div class="space-y-2">
                  <Label class="text-gray-700 dark:text-gray-300 font-medium" for="type">Issue Type</Label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button v-for="type in contactTypes" :key="type.id" type="button" @click="selectedType = type.id"
                      :class="[
                        'p-4 rounded-lg border-2 transition-all duration-200',
                        selectedType === type.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-blue-900/30 dark:border-blue-500'
                          : 'border-gray-200 dark:border-blue-light hover:border-purple-300 dark:hover:border-blue-400'
                      ]">
                      <div class="flex items-center">
                        <div :class="[
                          'w-8 h-8 rounded-full mr-3 flex items-center justify-center',
                          selectedType === type.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-blue-800 text-gray-600 dark:text-gray-300'
                        ]">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" :d="type.icon" />
                          </svg>
                        </div>
                        <div class="text-left">
                          <div class="font-medium text-gray-800 dark:text-white">{{ type.name }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">{{ type.desc }}</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Form Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <Label for="name" class="text-gray-700 dark:text-gray-300">Full Name</Label>
                    <Input id="name" v-model="form.name" placeholder="Enter your name"
                      class="dark:bg-blue-elevated dark:border-blue-light dark:text-white" required />
                  </div>

                  <div class="space-y-2">
                    <Label for="email" class="text-gray-700 dark:text-gray-300">Email</Label>
                    <Input id="email" v-model="form.email" type="email" placeholder="name@email.com"
                      class="dark:bg-blue-elevated dark:border-blue-light dark:text-white" required />
                  </div>
                </div>

                <div class="space-y-2">
                  <Label for="wallet" class="text-gray-700 dark:text-gray-300">Wallet Address</Label>
                  <Input id="wallet" v-model="form.wallet" placeholder="0x..."
                    class="font-mono dark:bg-blue-elevated dark:border-blue-light dark:text-white" />
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    *Optional, only required for technical issues related to transactions
                  </p>
                </div>

                <div class="space-y-2">
                  <Label for="subject" class="text-gray-700 dark:text-gray-300">Subject</Label>
                  <Input id="subject" v-model="form.subject" placeholder="e.g., Staking Issue, Token Question, etc."
                    class="dark:bg-blue-elevated dark:border-blue-light dark:text-white" required />
                </div>

                <div class="space-y-2">
                  <Label for="message" class="text-gray-700 dark:text-gray-300">Issue Details</Label>
                  <textarea id="message" v-model="form.message" rows="6"
                    placeholder="Describe your issue or question in detail..."
                    class="w-full rounded-lg border-2 border-gray-200 dark:border-blue-light bg-white dark:bg-blue-elevated text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-blue-500 focus:border-transparent transition-all"
                    required></textarea>
                </div>

                <div class="flex items-center space-x-2">
                  <Checkbox id="urgent" v-model="form.urgent" class="border-gray-300 dark:border-blue-light" />
                  <Label for="urgent" class="text-gray-700 dark:text-gray-300 text-sm cursor-pointer">
                    Mark as urgent (high priority)
                  </Label>
                </div>

                <!-- Attachments -->
                <div class="space-y-2">
                  <Label class="text-gray-700 dark:text-gray-300" for="file-upload">Attachments (Optional)</Label>
                  <div class="border-2 border-dashed border-gray-300 dark:border-blue-light rounded-lg p-6 text-center">
                    <input type="file" @change="handleFileUpload" class="hidden" id="file-upload" multiple />
                    <label for="file-upload" class="cursor-pointer">
                      <svg class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p class="text-gray-600 dark:text-gray-400">Click to upload screenshots or documents</p>
                      <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Max. 5MB per file</p>
                    </label>
                  </div>
                  <div v-if="attachments.length > 0" class="mt-4">
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Attached files:</div>
                    <div class="space-y-2">
                      <div v-for="(file, index) in attachments" :key="index"
                        class="flex items-center justify-between bg-gray-50 dark:bg-blue-800/50 rounded-lg p-3">
                        <div class="flex items-center">
                          <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span class="text-gray-700 dark:text-gray-300 truncate max-w-xs">{{ file.name }}</span>
                        </div>
                        <button v-if="typeof file === 'object' && file !== null" @click="removeAttachment(index)"
                          type="button" class="text-red-500 hover:text-red-600">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" :disabled="loading" class="w-full btn-blue-gradient py-6 text-lg font-semibold">
                  <span v-if="!loading">Send Message</span>
                  <span v-else class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Sending...
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar - Contact Info -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <Card class="border-2 border-purple-200 dark:border-blue-light">
            <CardHeader>
              <CardTitle class="text-xl font-bold text-gray-800 dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <Button @click="connectWallet"
                class="w-full justify-start bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Connect Wallet
              </Button>

              <Button @click="checkTransaction" variant="outline"
                class="w-full justify-start border-purple-200 dark:border-blue-light text-purple-600 dark:text-blue-400 hover:bg-purple-50 dark:hover:bg-blue-900/30">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Check Transaction Status
              </Button>

              <Button @click="viewDocumentation" variant="outline"
                class="w-full justify-start border-purple-200 dark:border-blue-light text-purple-600 dark:text-blue-400 hover:bg-purple-50 dark:hover:bg-blue-900/30">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Token Documentation
              </Button>
            </CardContent>
          </Card>

          <!-- Contact Information -->
          <Card class="border-2 border-purple-200 dark:border-blue-light">
            <CardHeader>
              <CardTitle class="text-xl font-bold text-gray-800 dark:text-white">Other Contacts</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-blue-800/30">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-800 dark:text-white">Support Phone</div>
                  <div class="text-gray-600 dark:text-gray-400">+62 812-3456-7890</div>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-blue-800/30">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-800 dark:text-white">Email</div>
                  <div class="text-gray-600 dark:text-gray-400">support@wancash.org</div>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-blue-800/30">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-800 dark:text-white">Live Chat</div>
                  <div class="text-gray-600 dark:text-gray-flex items-center">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Available 24/7
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-blue-800/30">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-800 dark:text-white">Social Media</div>
                  <div class="flex space-x-3 mt-2">
                    <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-blue-400">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">...</svg>
                    </a>
                    <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-blue-400">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">...</svg>
                    </a>
                    <a href="#" class="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-blue-400">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">...</svg>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- FAQ Quick Links -->
          <Card class="border-2 border-purple-200 dark:border-blue-light">
            <CardHeader>
              <CardTitle class="text-xl font-bold text-gray-800 dark:text-white">Quick FAQ</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <a v-for="faq in quickFAQs" :key="faq.id" href="#"
                class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-blue-800/30 transition-colors">
                <div class="flex items-center justify-between">
                  <span class="text-gray-700 dark:text-gray-300">{{ faq.question }}</span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Bottom Banner -->
      <div class="mt-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white text-center">
        <h3 class="text-2xl font-bold mb-4">Need Immediate Help?</h3>
        <p class="mb-6 max-w-2xl mx-auto">Our support team is ready to help 24/7. Contact us via live chat for instant
          response.</p>
        <Button @click="openLiveChat" class="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3">
          Open Live Chat
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

// Data
const currentPrice = ref(145.67)
const loading = ref(false)
const selectedType = ref('technical')

type Attachment = {
  name?: string;
  url?: string;
};

const attachments = ref<Attachment[]>([]);

// Form data
const form = ref({
  name: '',
  email: '',
  wallet: '',
  subject: '',
  message: '',
  urgent: false
})

// Contact types
const contactTypes = [
  {
    id: 'technical',
    name: 'Technical',
    desc: 'Transaction issues, wallet, etc.',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  },
  {
    id: 'staking',
    name: 'Staking',
    desc: 'Questions about staking',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 'general',
    name: 'General',
    desc: 'General token questions',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]

// Quick FAQs
const quickFAQs = [
  { id: 1, question: 'How to stake Wancash?' },
  { id: 2, question: 'What is the minimum deposit for staking?' },
  { id: 3, question: 'What fees are charged?' },
  { id: 4, question: 'How to claim rewards?' },
  { id: 5, question: 'Is my token safe?' }
]

// Methods
const submitForm = async () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    console.log('Form submitted:', form.value)
    alert('Your message has been sent! The support team will contact you within 1 hour.')
    resetForm()
    loading.value = false
  }, 1500)
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    wallet: '',
    subject: '',
    message: '',
    urgent: false
  }
  attachments.value = []
}

const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files !== null) {
    for (const element of Array.from(files)) {  // Add Array.from here
      if (element.size <= 5 * 1024 * 1024) {
        attachments.value.push({ name: element.name });
      } else {
        alert(`File ${element.name} exceeds the maximum size of 5MB`);
      }
    }
  }
};

const removeAttachment = (index: number) => {
  if (index >= 0 && index < attachments.value.length) {
    attachments.value.splice(index, 1); // Directly delete element
  }
};

const connectWallet = () => {
  alert('Connect wallet function will be implemented here')
}

const checkTransaction = () => {
  alert('Check transaction feature will be implemented here')
}

const viewDocumentation = () => {
  alert('Opening token documentation...')
}

const openLiveChat = () => {
  alert('Opening live chat support...')
}
</script>

<style scoped>
/* Custom styles untuk halaman kontak */
.glass-blue {
  background: linear-gradient(135deg,
      oklch(0.26 0.03 240 / 0.8) 0%,
      oklch(0.28 0.03 240 / 0.6) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid oklch(0.32 0.03 240);
}

.card-glow {
  box-shadow:
    0 0 0 1px oklch(0.75 0.18 240 / 0.15),
    0 4px 6px -1px oklch(0.22 0.03 240 / 0.15),
    0 2px 4px -1px oklch(0.22 0.03 240 / 0.1);
}

.btn-blue-gradient {
  background: linear-gradient(135deg,
      oklch(0.75 0.18 240) 0%,
      oklch(0.7 0.22 235) 100%);
  color: white;
}

.btn-blue-gradient:hover {
  background: linear-gradient(135deg,
      oklch(0.8 0.18 240) 0%,
      oklch(0.75 0.22 235) 100%);
}

.bg-blue-elevated {
  background-color: oklch(0.28 0.03 240);
}

.text-blue-muted {
  color: oklch(0.78 0.05 240);
}

.border-blue-light {
  border-color: oklch(0.36 0.04 240);
}

/* Animasi untuk form */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
