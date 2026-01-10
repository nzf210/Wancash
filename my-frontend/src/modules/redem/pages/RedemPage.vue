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
        <ProfileDataCard :profile="userProfile" v-model:useProfileData="useProfileData" :walletAddress="walletAddress"
          :chainInfo="chainInfo" :nativeBalance="nativeBalance" :nativeCurrencySymbol="nativeCurrencySymbol" />

        <!-- Recipient Information -->
        <RecipientForm v-model:form="form" v-model:saveToProfile="saveToProfile" />

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
          <Button @click="submitRedemption" :disabled="!isFormValid || isLoading" :class="[
            'flex-1 text-white rounded-xl py-4 text-lg font-semibold shadow-lg transition-all duration-300',
            !isFormValid || isLoading
              ? 'bg-gray-400 cursor-not-allowed opacity-70'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
          ]">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isLoading ? 'Processing...' : 'Confirm Redemption' }}
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
import { useAccount, useChainId, useConfig } from '@wagmi/vue'
import { getBalance } from '@wagmi/core'
import { storeToRefs } from 'pinia'

// Stores & Composables
import { useProfileStore } from '@/modules/profile/store/profileStore'
import { useChain } from '@/app/composables/useChain'
import { redemptionApi, type CreateRedemptionRequest } from '../services/redemptionApi'

// Components
import WalletConnectPrompt from '../components/WalletConnectPrompt.vue'
import ProfileDataCard from '../components/ProfileDataCard.vue'
import RecipientForm from '../components/RecipientForm.vue'
import ShippingOptions from '../components/ShippingOptions.vue'
import RedemptionSummary from '../components/RedemptionSummary.vue'
import ProcessingDialog from '../components/ProcessingDialog.vue'
import SuccessDialog from '../components/SuccessDialog.vue'

const router = useRouter()
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)
const { address, isConnected } = useAccount()
const chainId = useChainId()
const { getChainInfo, switchToSupportedChain } = useChain()

// State
const walletConnected = computed(() => isConnected.value)
const useProfileData = ref(false)
const shippingOption = ref<'included' | 'separate'>('included')
const agreeTerms = ref(false)
const isLoading = ref(false)
const showSuccess = ref(false)

// Native coin balance
const nativeBalance = ref<number>(0)
const nativeCurrencySymbol = computed(() => {
  const info = getChainInfo(chainId.value)
  return info?.symbol || 'ETH'
})
const config = useConfig()
const saveToProfile = ref(false)

// Form data
const form = ref({
  phone: '',
  telegram: '',
  whatsapp: '',
  name: '',
  address: ''
})

// Mapped Profile Data
// Map the generic profile store data to the expected format for ProfileDataCard
const userProfile = computed(() => {
  if (!profile.value) return null
  return {
    name: profile.value.display_name || 'User',
    phone: profile.value.phone || '',
    address: profile.value.shipping_address || '',
    telegram: '', // Not in profile interface yet
    whatsapp: ''  // Not in profile interface yet
  }
})

// Wallet & Chain Data
const walletAddress = computed(() => address.value || '')
const chainInfo = computed(() => {
  const info = getChainInfo(chainId.value)
  if (!info) return undefined
  return {
    name: info.name,
    icon: info.icon
  }
})


// Token calculations (Mock logic for now as price API not defined)
const tokenGold = ref(1000)
const shippingCost = ref(50)

const totalToken = computed(() => {
  if (shippingOption.value === 'included') {
    return tokenGold.value + shippingCost.value
  }
  return tokenGold.value
})


// Fetch profile when wallet connects
watch(address, async (newAddress) => {
  if (newAddress) {
    await profileStore.fetchProfile(newAddress)
  }
}, { immediate: true })

// Fetch native balance
const fetchNativeBalance = async () => {
  if (!isConnected.value || !address.value) return
  try {
    const balance = await getBalance(config, {
      address: address.value as `0x${string}`,
    })
    nativeBalance.value = Number(balance.formatted)
  } catch (err) {
    console.error('Native balance fetch error:', err)
  }
}

// Watch for chain changes to update native balance reactively
watch(chainId, () => {
  if (isConnected.value && address.value) {
    fetchNativeBalance()
  }
})

// Initial fetch
watch(address, (newAddress) => {
  if (newAddress) {
    fetchNativeBalance()
  }
}, { immediate: true })


// Watch for profile data usage
watch(useProfileData, (value) => {
  if (value && userProfile.value) {
    form.value = {
      phone: userProfile.value.phone,
      telegram: form.value.telegram, // preserved
      whatsapp: form.value.whatsapp, // preserved
      name: userProfile.value.name,
      address: userProfile.value.address
    }
    toast.success('Profile data has been auto-filled')
  } else if (!value) {
    // Optional: Clear form or keep it? Keeping it is usually better UX, 
    // but requirements usually imply toggle off = empty? 
    // Let's keep data to avoid accidental loss.
  }
})

const connectWallet = async () => {
  // Real wallet connection is handled by the generic wallet modal usually triggers elsewhere
  // But if we have a connect function in useChain or similar we can use it. 
  // Assuming standard wagmi modal trigger or similar instructions.
  // For now, redirect to global connect or trigger it.
  // Since we don't have a direct "open modal" hook imported here, we assume the WalletConnectPrompt
  // emits 'connect' which usually opens the global modal.
  // NOTE: In this app context, usually there's a global modal. 
  // We'll show a toast instructing user.
  toast.info('Please check your wallet extension to connect.')
}

const cancelRedemption = () => {
  if (confirm('Are you sure you want to cancel the redemption process?')) {
    resetForm()
    toast.info('Redemption cancelled')
  }
}

const isFormValid = computed(() => {
  return !!(
    form.value.phone &&
    form.value.name &&
    form.value.address &&
    agreeTerms.value &&
    walletConnected.value
  )
})

const submitRedemption = async () => {
  // Double check validation (though button should be disabled)
  if (!isFormValid.value) {
    toast.error('Details Required', {
      description: 'Please complete the form and agree to the terms.'
    })
    return
  }

  isLoading.value = true

  try {
    const requestData: CreateRedemptionRequest = {
      wallet_address: address.value!, // Asserted by isFormValid
      chain_id: chainId.value,
      recipient_name: form.value.name,
      phone_number: form.value.phone,
      whatsapp_number: form.value.whatsapp,
      telegram_username: form.value.telegram,
      shipping_address: form.value.address,
      shipping_option: shippingOption.value,
      gold_amount_grams: 5.00, // Fixed for now based on context
      token_amount_gold: tokenGold.value,
      shipping_cost_token: shippingCost.value,
      total_token_amount: totalToken.value,
      save_to_profile: saveToProfile.value
    }

    await redemptionApi.createRedemption(requestData)

    isLoading.value = false
    showSuccess.value = true

    // Refresh profile if we saved data
    if (saveToProfile.value) {
      // @ts-ignore
      await profileStore.fetchProfile(address.value)
    }

  } catch (error) {
    isLoading.value = false
    console.error(error)
    toast.error('Redemption Failed', {
      description: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
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
  saveToProfile.value = false
}

const goToDashboard = () => {
  resetForm()
  showSuccess.value = false
  router.push({ name: 'dashboard' })
}
</script>
