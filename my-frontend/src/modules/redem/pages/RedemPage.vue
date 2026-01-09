<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-10 text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div
            class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                clip-rule="evenodd" />
              <path fill-rule="evenodd"
                d="M10 5a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5h-3.5a.75.75 0 010-1.5h3.5v-3.5A.75.75 0 0110 5z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Token Redemption with Gold</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Exchange your tokens for physical gold that will
          be shipped to your address</p>
      </div>

      <!-- Wallet Connection Check -->
      <WalletConnectPrompt v-if="!walletConnected" @connect="connectWallet" />

      <!-- Main Redemption Form -->
      <div v-else>
        <!-- Profile Data Section -->
        <ProfileDataCard :profile="userProfile" v-model:useProfileData="useProfileData" />

        <!-- Recipient Information -->
        <RecipientForm v-model:form="form" />

        <!-- Shipping Options -->
        <ShippingOptions v-model:shippingOption="shippingOption" :tokenGold="tokenGold" :shippingCost="shippingCost"
          :totalToken="totalToken" />

        <!-- Summary -->
        <RedemptionSummary :totalToken="totalToken" v-model:agreeTerms="agreeTerms" />

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <Button @click="cancelRedemption"
            class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl py-4 text-lg font-semibold transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </Button>
          <Button @click="submitRedemption"
            class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Confirm Redemption
          </Button>
        </div>
      </div>

      <!-- Dialogs -->
      <ProcessingDialog :open="isLoading" />
      <SuccessDialog :open="showSuccess" @close="showSuccess = false" @dashboard="goToDashboard" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'

// Components
import WalletConnectPrompt from '../components/WalletConnectPrompt.vue'
import ProfileDataCard from '../components/ProfileDataCard.vue'
import RecipientForm from '../components/RecipientForm.vue'
import ShippingOptions from '../components/ShippingOptions.vue'
import RedemptionSummary from '../components/RedemptionSummary.vue'
import ProcessingDialog from '../components/ProcessingDialog.vue'
import SuccessDialog from '../components/SuccessDialog.vue'

const router = useRouter()

// State
const walletConnected = ref(false)
const useProfileData = ref(false)
const shippingOption = ref('included')
const agreeTerms = ref(false)
const isLoading = ref(false)
const showSuccess = ref(false)

// Form data
const form = ref({
  phone: '',
  telegram: '',
  whatsapp: '',
  name: '',
  address: ''
})

// User profile data
const userProfile = ref({
  name: 'Ahmad Santoso',
  phone: '081234567890',
  address: 'Jl. Merdeka No. 123, Jakarta Pusat, 10110',
  telegram: '',
  whatsapp: ''
})

// Token calculations
const tokenGold = ref(1000)
const shippingCost = ref(50)

const totalToken = computed(() => {
  if (shippingOption.value === 'included') {
    return tokenGold.value + shippingCost.value
  }
  return tokenGold.value
})

// Watch for profile data usage
watch(useProfileData, (value) => {
  if (value) {
    form.value = {
      phone: userProfile.value.phone,
      telegram: userProfile.value.telegram || '',
      whatsapp: userProfile.value.whatsapp || '',
      name: userProfile.value.name,
      address: userProfile.value.address
    }
    toast.success('Profile data has been auto-filled')
  } else {
    form.value = {
      phone: '',
      telegram: '',
      whatsapp: '',
      name: '',
      address: ''
    }
  }
})

// Simulate wallet connection
onMounted(() => {
  // Check if wallet is already connected (simulated)
  const storedWalletStatus = localStorage.getItem('walletConnected')
  walletConnected.value = storedWalletStatus === 'true'

  if (walletConnected.value) {
    toast.success('Wallet already connected', {
      description: 'You can continue the redemption process.'
    })
  }
})

const connectWallet = () => {
  isLoading.value = true
  // Simulate wallet connection
  setTimeout(() => {
    walletConnected.value = true
    localStorage.setItem('walletConnected', 'true')
    isLoading.value = false

    toast.success('Wallet Successfully Connected!', {
      description: 'Your wallet has been connected to the application.',
      duration: 3000,
    })
  }, 1500)
}

const cancelRedemption = () => {
  toast('Cancelling redemption...', {
    description: 'Are you sure you want to cancel the redemption process?',
    action: {
      label: 'Yes, Cancel',
      onClick: () => {
        resetForm()
        walletConnected.value = false
        localStorage.removeItem('walletConnected')
        toast.info('Redemption cancelled', {
          description: 'The redemption process has been cancelled.'
        })
      }
    },
    cancel: {
      label: 'No',
      onClick: () => {
        toast('Cancelled', {
          description: 'The redemption process continues.'
        })
      }
    }
  })
}

const submitRedemption = () => {
  // Validate form
  if (!form.value.phone || !form.value.name || !form.value.address) {
    toast.error('Incomplete Data', {
      description: 'Please complete all required recipient data.',
      duration: 4000,
    })
    return
  }

  if (!agreeTerms.value) {
    toast.error('Agreement Required', {
      description: 'You must agree to the terms and conditions to continue.',
      duration: 4000,
    })
    return
  }

  // Show loading toast
  const loadingToast = toast.loading('Processing your redemption...', {
    duration: Infinity,
  })

  isLoading.value = true

  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    showSuccess.value = true

    // Dismiss loading toast
    toast.dismiss(loadingToast)

    // Show success toast
    toast.success('Redemption Successfully Processed!', {
      description: 'Your redemption request has been sent and is being processed.',
      duration: 5000,
    })

    // Log redemption data (in real app, send to API)
    console.log('Redemption submitted:', {
      ...form.value,
      shippingOption: shippingOption.value,
      totalToken: totalToken.value,
      timestamp: new Date().toISOString()
    })
  }, 2000)
}

const resetForm = () => {
  form.value = {
    phone: '',
    telegram: '',
    whatsapp: '',
    name: '',
    address: ''
  }
  useProfileData.value = false
  shippingOption.value = 'included'
  agreeTerms.value = false
}

const goToDashboard = () => {
  resetForm()
  showSuccess.value = false
  router.push({ name: 'dashboard' })

  toast('Returning to Dashboard', {
    description: 'You will be redirected to the main dashboard.',
    duration: 2000,
  })
}
</script>
