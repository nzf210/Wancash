<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-6 md:mb-10 text-center">
        <div class="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
          <div
            class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                clip-rule="evenodd" />
              <path fill-rule="evenodd"
                d="M10 5a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5h-3.5a.75.75 0 010-1.5h3.5v-3.5A.75.75 0 0110 5z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <h1 class="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">Claim Reward</h1>
        </div>
        <p class="text-xs md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Exchange your points for a wide range of rewards, including both physical merchandise and digital products.
        </p>
      </div>

      <!-- Wallet Connection Check -->
      <WalletConnectPrompt v-if="!walletConnected" @connect="connectWallet" />

      <div v-else>
        <!-- Tabs or View Switcher -->
        <div class="flex justify-center mb-8">
          <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl inline-flex">
            <button @click="activeView = 'new'" :class="[
              'px-6 py-2 rounded-lg text-sm font-medium transition-all',
              activeView === 'new'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]">
              Start Claim
            </button>
            <button @click="activeView = 'history'" :class="[
              'px-6 py-2 rounded-lg text-sm font-medium transition-all',
              activeView === 'history'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]">
              My Requests
            </button>
          </div>
        </div>

        <!-- New Redemption View -->
        <div v-if="activeView === 'new'">
          <!-- Step 1: Product Selection (Cart) -->
          <div v-if="!isCheckout" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProductList :cart="cart" @increase="increaseQuantity" @decrease="decreaseQuantity"
              ref="productListComponent" />

            <!-- Cart Footer -->
            <div v-if="cartTotalItems > 0"
              class="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl lg:static lg:bg-transparent lg:border-0 lg:shadow-none lg:mt-8">
              <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-center sm:text-left">
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ cartTotalItems }} Items Selected</p>
                  <div class="space-y-1">
                    <p class="text-base text-gray-700 dark:text-gray-300">
                      Subtotal: <span class="font-semibold">{{ formatNumber(cartTotalPrice) }} WCH</span>
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Shipping:
                      <span v-if="adminSettings.shipping_enabled" class="font-medium text-gray-900 dark:text-white">
                        {{ formatNumber(adminSettings.shipping_cost_wch) }} WCH
                      </span>
                      <span v-else class="text-amber-500 font-medium">Calculated Later</span>
                    </p>
                    <p class="text-xl font-bold text-gray-900 dark:text-white">
                      Total: <span class="text-blue-600">{{ formatNumber(estimatedTotalWithShipping) }} WCH</span>
                      <span v-if="!adminSettings.shipping_enabled" class="text-sm text-amber-500">+ Shipping</span>
                    </p>
                  </div>
                </div>
                <Button @click="goToCheckout"
                  class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all shadow-lg">
                  Proceed to Request
                </Button>
              </div>
            </div>
          </div>

          <!-- Step 2: Details & Confirmation -->
          <div v-else class="animate-in fade-in slide-in-from-right-8 duration-500">
            <button @click="isCheckout = false"
              class="mb-6 flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to cart
            </button>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Main Content (Forms) -->
              <div class="lg:col-span-2 space-y-6">

                <!-- Cart Summary Card -->
                <div
                  class="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Cart Items</h3>
                  <div class="space-y-4">
                    <div v-for="item in cartItemsDetails" :key="item.id" class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center text-white font-bold text-xs">
                          {{ item.weight_grams }}g
                        </div>
                        <div>
                          <p class="font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
                          <p class="text-sm text-gray-500">{{ formatNumber(item.price_wch) }} WCH x {{ item.quantity }}
                          </p>
                        </div>
                      </div>
                      <div class="font-bold text-gray-900 dark:text-white">
                        {{ formatNumber(item.price_wch * item.quantity) }} WCH
                      </div>
                    </div>
                    <div
                      class="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between font-bold text-lg">
                      <span class="text-gray-900 dark:text-white">Subtotal</span>
                      <span class="text-blue-600">{{ formatNumber(cartTotalPrice) }} WCH</span>
                    </div>
                  </div>

                  <!-- Summary Section -->
                  <div v-if="cartTotalItems > 0" class="space-y-2 mt-4">
                    <!-- Subtotal -->
                    <!-- <div
                      class="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between font-bold text-lg">
                      <span class="text-gray-900 dark:text-white">Subtotal</span>
                      <span class="text-blue-600">{{ formatNumber(cartTotalPrice) }} WCH</span>
                    </div> -->

                    <!-- Shipping -->
                    <div class="pt-2 flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span v-if="adminSettings.shipping_enabled" class="font-medium text-gray-900 dark:text-white">
                        {{ formatNumber(adminSettings.shipping_cost_wch) }} WCH
                      </span>
                      <span v-else class="font-medium text-amber-500">Calculated Later</span>
                    </div>

                    <!-- Total -->
                    <div
                      class="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between font-bold text-xl">
                      <span class="text-gray-900 dark:text-white">Total</span>
                      <span class="text-blue-600">
                        {{ formatNumber(estimatedTotalWithShipping) }} WCH
                        {{ !adminSettings.shipping_enabled ? '+ Shipping' : '' }}
                      </span>
                    </div>
                  </div>
                </div>


                <!-- Profile Data Section -->
                <ProfileDataCard :profile="userProfile" v-model:useProfileData="useProfileData"
                  :walletAddress="walletAddress" :chainInfo="chainInfo" :nativeBalance="wchBalance"
                  :nativeCurrencySymbol="'WCH'" />

                <!-- Recipient Information -->
                <RecipientForm v-model:form="form" v-model:saveToProfile="saveToProfile" />

                <!-- Shipping Options -->
                <!-- Shipping Options (Controlled by Admin Settings) -->
                <ShippingOptions v-model:shippingOption="shippingOption" :tokenGold="cartTotalPrice"
                  :shippingCost="adminSettings.shipping_enabled ? adminSettings.shipping_cost_wch : 0"
                  :totalToken="estimatedTotalWithShipping" :hideCost="!adminSettings.shipping_enabled" :description="adminSettings.shipping_enabled
                    ? 'Flat rate shipping fee applied.'
                    : 'Shipping cost will be calculated by admin after request submission.'" />
              </div>

              <!-- Sidebar (Summary & Actions) -->
              <div class="space-y-6">
                <div class="sticky top-6 space-y-6">
                  <!-- Summary -->
                  <div
                    class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Reward Summary</h3>

                    <div class="space-y-3 mb-6">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Total Weight</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ cartTotalWeight }}g</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Reward Value</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{
                          formatNumber(cartTotalPrice) }} WCH</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                        <span v-if="adminSettings.shipping_enabled" class="font-medium text-gray-900 dark:text-white">
                          {{ formatNumber(adminSettings.shipping_cost_wch) }} WCH
                        </span>
                        <span v-else class="font-medium text-amber-500">Calculated Later</span>
                      </div>
                      <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <div class="flex justify-between items-center text-xl font-bold">
                          <span class="text-gray-900 dark:text-white">Total</span>
                          <span class="text-blue-600 dark:text-blue-400">{{ formatNumber(estimatedTotalWithShipping) }}
                            WCH</span>
                        </div>

                        <!-- Balance Warning -->
                        <div v-if="wchBalance < estimatedTotalWithShipping"
                          class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <div class="flex items-start gap-2">
                            <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor"
                              viewBox="0 0 20 20">
                              <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                            </svg>
                            <div class="flex-1">
                              <p class="text-sm font-semibold text-red-800 dark:text-red-300">Insufficient Balance</p>
                              <p class="text-xs text-red-700 dark:text-red-400 mt-1">
                                Your balance: {{ formatNumber(wchBalance) }} WCH<br />
                                Required: {{ formatNumber(estimatedTotalWithShipping) }} WCH<br />
                                Short by: {{ formatNumber(estimatedTotalWithShipping - wchBalance) }} WCH
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-start gap-3 mb-6">
                      <div class="flex items-center h-5">
                        <input id="terms" type="checkbox" v-model="agreeTerms"
                          class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800">
                      </div>
                      <label for="terms" class="text-sm font-medium text-gray-900 dark:text-gray-300">
                        I agree to the <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">Terms and
                          Conditions</a>
                      </label>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-col gap-4">
                    <Button @click="submitRedemption" :disabled="!isFormValid || isLoading" :class="[
                      'w-full text-white rounded-xl py-4 text-lg font-semibold shadow-lg transition-all duration-300',
                      !isFormValid || isLoading
                        ? 'bg-gray-400 cursor-not-allowed opacity-70'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
                    ]">
                      <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ isLoading ? 'Processing...' : 'Request Quote' }}
                    </Button>

                    <Button @click="cancelRedemption"
                      class="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl py-4 text-lg font-semibold transition-colors">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- History View -->
        <div v-else class="animate-in fade-in slide-in-from-right-8 duration-500">
          <RedemptionRequestList />
        </div>
      </div>

      <!-- Dialogs -->
      <ProcessingDialog :open="isLoading" />
      <SuccessDialog :open="showSuccess" @close="showSuccess = false" @dashboard="goToDashboard"
        title="Request Submitted"
        message="Your redemption request has been submitted. The admin will review it and calculate shipping costs. Check 'My Requests' for updates."
        buttonText="Go to My Requests" />

      <!-- Confirmation Dialog -->
      <Dialog :open="confirmDialog.isOpen" @update:open="confirmDialog.isOpen = $event">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{ confirmDialog.title }}</DialogTitle>
            <DialogDescription>
              {{ confirmDialog.description }}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" @click="confirmDialog.isOpen = false" :disabled="confirmDialog.isLoading">
              Cancel
            </Button>
            <Button :variant="confirmDialog.variant || 'default'" @click="handleConfirm"
              :disabled="confirmDialog.isLoading">
              <svg v-if="confirmDialog.isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ confirmDialog.confirmText || 'Confirm' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useConnection, useChainId, useConfig } from '@wagmi/vue'
import { readContract } from '@wagmi/core'
import { storeToRefs } from 'pinia'

// Stores & Composables
import { useProfileStore } from '@/modules/profile/store/profileStore'
import { useChain } from '@/app/composables/useChain'
import { redemptionApi, type CreateRedemptionRequest, type GoldProduct, type RedemptionConfig } from '../services/redemptionApi'
import { wancashAbi, wancashContractAddress } from '@/app/services/contracts'

// Components
import WalletConnectPrompt from '../components/WalletConnectPrompt.vue'
import ProfileDataCard from '../components/ProfileDataCard.vue'
import RecipientForm from '../components/RecipientForm.vue'
import ShippingOptions from '../components/ShippingOptions.vue'
import ProcessingDialog from '../components/ProcessingDialog.vue'
import SuccessDialog from '../components/SuccessDialog.vue'
import ProductList from '../components/ProductList.vue'
import RedemptionRequestList from '../components/RedemptionRequestList.vue'

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)
const { address, isConnected } = useConnection()
const chainId = useChainId()
const { getChainInfo } = useChain()

const route = useRoute()
const router = useRouter()

// Helper to parse valid tabs from query
const getValidTab = (val: any): 'new' | 'history' => {
  const tab = Array.isArray(val) ? val[0] : val
  return (tab === 'history') ? 'history' : 'new' // default to 'new'
}

// State
const walletConnected = computed(() => isConnected.value)
// Initialize active tab from URL query param
const activeView = ref<'new' | 'history'>(getValidTab(route.query.tab))

// Watch for tab changes -> Update URL
watch(activeView, (newTab) => {
  const currentTab = getValidTab(route.query.tab)
  if (currentTab !== newTab) {
    router.replace({ query: { ...route.query, tab: newTab } })
  }
})

// Watch for URL changes (e.g. Back button) -> Update State
watch(() => route.query.tab, (newVal) => {
  const validTab = getValidTab(newVal)
  if (activeView.value !== validTab) {
    activeView.value = validTab
  }
})

const useProfileData = ref(false)
const shippingOption = ref<'included' | 'separate'>('included')
const agreeTerms = ref(false)
const isLoading = ref(false)
const showSuccess = ref(false)
const isCheckout = ref(false)

const adminSettings = ref<RedemptionConfig>({ shipping_enabled: false, shipping_cost_wch: 0 })

// Confirmation Dialog State
const confirmDialog = ref({
  isOpen: false,
  title: '',
  description: '',
  confirmText: 'Confirm',
  variant: 'default' as 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link',
  isLoading: false,
  onConfirm: async () => { }
})

const openConfirmDialog = (options: {
  title: string,
  description: string,
  confirmText?: string,
  variant?: 'default' | 'destructive',
  onConfirm: () => Promise<void>
}) => {
  confirmDialog.value = {
    isOpen: true,
    title: options.title,
    description: options.description,
    confirmText: options.confirmText || 'Confirm',
    variant: options.variant || 'default',
    isLoading: false,
    onConfirm: options.onConfirm
  }
}

const handleConfirm = async () => {
  confirmDialog.value.isLoading = true
  try {
    await confirmDialog.value.onConfirm()
    confirmDialog.value.isOpen = false
  } catch {
    // Error handling
  } finally {
    confirmDialog.value.isLoading = false
  }
}

// Cart State
const cart = ref<Record<string, number>>({}) // product_id -> quantity
const productListComponent = ref() // To access products array from child
const availableProducts = ref<GoldProduct[]>([]) // Store products in parent

// Fetch products and settings on mount
onMounted(async () => {
  try {
    adminSettings.value = await redemptionApi.getSettings()
    // Fetch products directly in parent
    availableProducts.value = await redemptionApi.getGoldProducts()

    // Fetch WCH balance on mount if wallet is already connected
    if (isConnected.value && address.value && contractAddress.value) {
      await fetchWchBalance()
    }
  } catch (e) {
    console.error('Failed to load settings or products', e)
  }
})

const increaseQuantity = async (id: string) => {
  const productToAdd = availableProducts.value.find(p => p.id === id)
  if (!productToAdd) return

  // Validate mixed cart (Physical vs Digital)
  const cartItems = cartItemsDetails.value
  if (cartItems.length > 0) {
    const existingType = cartItems[0].product_type || 'physical'
    const newType = productToAdd.product_type || 'physical'

    if (existingType !== newType) {
      toast.error('Cannot mix different product types', {
        description: `Your cart contains ${existingType} items. Please clear cart before adding ${newType} items.`
      })
      return
    }
  }

  // Validate Min Holding Requirement
  if (productToAdd.min_holding_required && productToAdd.min_holding_required > 0) {
    if (!walletConnected.value) {
      toast.error('Connect Wallet', { description: 'Please connect wallet to check eligibility.' })
      return
    }

    // IMPORTANT: Fetch latest balance before validation to avoid race condition
    await fetchWchBalance()

    console.log('🔍 Min Holding Validation:', {
      productName: productToAdd.name,
      requiredHolding: productToAdd.min_holding_required,
      currentBalance: wchBalance.value,
      chainId: chainId.value,
      chainName: chainInfo.value?.name,
      contractAddress: contractAddress.value,
      isPassing: wchBalance.value >= productToAdd.min_holding_required
    })

    if (wchBalance.value < productToAdd.min_holding_required) {
      const required = new Intl.NumberFormat('en-US').format(productToAdd.min_holding_required)
      const current = new Intl.NumberFormat('en-US').format(wchBalance.value)
      toast.error('Insufficient Holding Balance', {
        description: `You need at least ${required} WCH but you have ${current} WCH on ${chainInfo.value?.name || 'this chain'}.`
      })
      return
    }
  }

  cart.value[id] = (cart.value[id] || 0) + 1
}

const decreaseQuantity = (id: string) => {
  if (cart.value[id] > 0) {
    cart.value[id]--
    if (cart.value[id] === 0) {
      delete cart.value[id]
    }
  }
}

// Derived Cart Computations
const cartItemsDetails = computed(() => {
  const items: (GoldProduct & { quantity: number })[] = []
  const products = availableProducts.value

  for (const [id, qty] of Object.entries(cart.value)) {
    if (qty > 0) {
      const prod = products.find(p => p.id === id)
      if (prod) {
        items.push({ ...prod, quantity: qty })
      }
    }
  }
  return items
})

const cartTotalPrice = computed(() => {
  return cartItemsDetails.value.reduce((sum, item) => sum + (item.price_wch * item.quantity), 0)
})

const cartTotalWeight = computed(() => {
  return cartItemsDetails.value.reduce((sum, item) => sum + ((item.weight_grams || 0) * item.quantity), 0)
})

const cartTotalItems = computed(() => {
  return Object.values(cart.value).reduce((sum, qty) => sum + qty, 0)
})

const estimatedTotalWithShipping = computed(() => {
  let total = cartTotalPrice.value
  if (adminSettings.value.shipping_enabled) {
    total += adminSettings.value.shipping_cost_wch
  }
  return total
})

const goToCheckout = () => {
  if (cartTotalItems.value === 0) {
    toast.error('Cart is empty', { description: 'Please add items to cart first.' })
    return
  }
  isCheckout.value = true
}

// WCH Token balance
const wchBalance = ref<number>(0)

const config = useConfig()
const saveToProfile = ref(false)
const contractAddress = computed(() => {
  if (!chainId.value) return null
  return wancashContractAddress[chainId.value] ?? '0x03A71968491d55603FFe1b11A9e23eF013f75bCF'
})

// Form data
const form = ref({
  phone: '',
  telegram: '',
  whatsapp: '',
  name: '',
  address: ''
})

// Mapped Profile Data
const userProfile = computed(() => {
  if (!profile.value) return null
  return {
    name: profile.value.display_name || 'User',
    phone: profile.value.phone || '',
    address: profile.value.shipping_address || '',
    telegram: '',
    whatsapp: ''
  }
})

// Wallet & Chain Data
const walletAddress = computed(() => address.value || '')
const chainInfo = computed(() => getChainInfo(chainId.value) ?? undefined)

// Fetch logic ... (keeping same)
watch(address, async (newAddress) => {
  if (newAddress) {
    await profileStore.fetchProfile(newAddress)
  }
}, { immediate: true })

const fetchWchBalance = async () => {
  if (!isConnected.value || !address.value || !contractAddress.value) return
  try {
    const balance = await readContract(config, {
      address: contractAddress.value as `0x${string}`,
      abi: wancashAbi.abi,
      functionName: 'balanceOf',
      args: [address.value as `0x${string}`],
    })
    wchBalance.value = Number(balance as bigint) / 1e18
  } catch (err) {
    console.error('WCH balance fetch error:', err)
  }
}

watch(chainId, () => {
  if (isConnected.value && address.value) {
    fetchWchBalance()
  }
})

watch(address, (newAddress) => {
  if (newAddress) {
    fetchWchBalance()
  }
}, { immediate: true })

// Watch for connection status changes
watch(isConnected, (connected) => {
  if (connected && address.value && contractAddress.value) {
    fetchWchBalance()
  }
})


// Auto-populate form from profile when profile data becomes available
// DISABLED: User must manually check "use profile data" to auto-fill
// watch([profile, isCheckout], ([newProfile, newIsCheckout]) => {
//   // When user navigates to checkout and has profile data, auto-fill if form is empty
//   if (newIsCheckout && newProfile && !form.value.name && !form.value.phone) {
//     useProfileData.value = true
//     form.value = {
//       phone: newProfile.phone || '',
//       telegram: form.value.telegram,
//       whatsapp: form.value.whatsapp,
//       name: newProfile.display_name || '',
//       address: newProfile.shipping_address || ''
//     }
//     toast.success('Profile data has been auto-filled from your account')
//   }
// })

watch(useProfileData, (value) => {
  if (value && userProfile.value) {
    form.value = {
      phone: userProfile.value.phone,
      telegram: form.value.telegram,
      whatsapp: form.value.whatsapp,
      name: userProfile.value.name,
      address: userProfile.value.address
    }
    toast.success('Profile data has been auto-filled')
  }
})

const connectWallet = async () => {
  toast.info('Please check your wallet extension to connect.')
}


const cancelRedemption = () => {
  openConfirmDialog({
    title: 'Cancel Redemption',
    description: 'Are you sure you want to cancel the claim process? Your progress will be lost.',
    confirmText: 'Yes, Cancel',
    variant: 'destructive',
    onConfirm: async () => {
      resetForm()
      isCheckout.value = false
      toast.info('Cancelled')
    }
  })
}

const isFormValid = computed(() => {
  return !!(
    form.value.phone &&
    form.value.name &&
    form.value.address &&
    agreeTerms.value &&
    walletConnected.value &&
    cartTotalItems.value > 0
  )
})

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}

const submitRedemption = async () => {
  if (!address.value) {
    toast.error('Please connect your wallet')
    return
  }

  // Validate form
  if (!form.value.name || !form.value.phone || !form.value.address) {
    toast.error('Please fill all required fields')
    return
  }

  // Validate cart
  if (Object.keys(cart.value).length === 0) {
    toast.error('Your cart is empty')
    return
  }

  // Validate balance
  const totalRequired = estimatedTotalWithShipping.value
  const currentBalance = wchBalance.value

  if (currentBalance < totalRequired) {
    toast.error(`Insufficient balance! You need ${totalRequired.toFixed(2)} WCH but only have ${currentBalance.toFixed(2)} WCH`, {
      duration: 5000
    })
    return
  }

  try {
    isLoading.value = true

    const requestData: CreateRedemptionRequest = {
      wallet_address: address.value!,
      chain_id: chainId.value,
      recipient_name: form.value.name,
      phone_number: form.value.phone,
      whatsapp_number: form.value.whatsapp,
      telegram_username: form.value.telegram,
      shipping_address: form.value.address,
      shipping_option: shippingOption.value,
      gold_amount_grams: cartTotalWeight.value, // Total weight
      token_amount_gold: cartTotalPrice.value, // Total price
      shipping_cost_token: adminSettings.value.shipping_enabled ? adminSettings.value.shipping_cost_wch : 0,
      total_token_amount: estimatedTotalWithShipping.value,
      save_to_profile: saveToProfile.value,
      // Map Items to API structure
      items: cartItemsDetails.value.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        snapshot_price: Number(item.price_wch || 0),
        snapshot_weight: Number(item.weight_grams || 0)
      }))
    }

    await redemptionApi.createRedemption(requestData)

    isLoading.value = false
    showSuccess.value = true

    // Clear Cart on Success
    cart.value = {}
    isCheckout.value = false

    if (saveToProfile.value) {
      // @ts-ignore
      await profileStore.fetchProfile(address.value)
    }

  } catch (error) {
    isLoading.value = false
    console.error(error)
    toast.error('Request Failed', {
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
  agreeTerms.value = false
  saveToProfile.value = false
}

const goToDashboard = () => {
  resetForm()
  showSuccess.value = false
  activeView.value = 'history'
  isCheckout.value = false
}
</script>
