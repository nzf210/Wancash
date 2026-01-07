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
      <div v-if="!walletConnected" class="mb-8">
        <div
          class="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
          <!-- Background Gradient Effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl">
          </div>

          <div class="relative p-8">
            <div class="text-center">
              <div
                class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 2H4v8h12V6z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Wallet Not Connected</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                You need to connect your wallet first to continue the token redemption process
              </p>
              <Button @click="connectWallet"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Redemption Form -->
      <div v-else>
        <!-- Profile Data Section -->
        <div v-if="userProfile" class="mb-8">
          <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div class="p-6">
              <div class="flex items-center gap-2 mb-4">
                <div
                  class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Profile Data Available</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="profile-name">Full
                    Name</Label>
                  <p class="font-medium text-gray-900 dark:text-white" id="profile-name">{{ userProfile.name }}</p>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="phone-number">Phone
                    Number</Label>
                  <p class="font-medium text-gray-900 dark:text-white" id="phone-number">{{ userProfile.phone }}</p>
                </div>
                <div class="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" for="address">Address</Label>
                  <p class="font-medium text-gray-900 dark:text-white" id="address">{{ userProfile.address }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <Checkbox v-model="useProfileData" id="use-profile-data"
                  class="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400" />
                <div class="grid gap-1.5">
                  <Label for="use-profile-data"
                    class="text-sm font-medium leading-none cursor-pointer text-gray-900 dark:text-white">
                    Use profile data for shipping
                  </Label>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Data will be automatically filled into the form below
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recipient Information -->
        <div class="mb-8">
          <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div class="p-6">
              <div class="flex items-center gap-2 mb-6">
                <div
                  class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recipient Data</h3>
              </div>

              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="phone" class="text-sm font-medium text-gray-900 dark:text-white">Phone Number <span
                        class="text-red-500">*</span></Label>
                    <div class="relative">
                      <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <Input id="phone" v-model="form.phone" placeholder="081234567890"
                        class="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
                        required />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label for="telegram" class="text-sm font-medium text-gray-900 dark:text-white">Telegram
                      Username</Label>
                    <div class="relative">
                      <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.289-.6.289-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                      </svg>
                      <Input id="telegram" v-model="form.telegram" placeholder="@username"
                        class="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl" />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label for="whatsapp" class="text-sm font-medium text-gray-900 dark:text-white">WhatsApp
                      Number</Label>
                    <div class="relative">
                      <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.437 9.88-9.885 9.88" />
                      </svg>
                      <Input id="whatsapp" v-model="form.whatsapp" placeholder="081234567890"
                        class="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl" />
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">If not filled, we will use the phone number for
                      WhatsApp</p>
                  </div>
                </div>

                <div class="space-y-2">
                  <Label for="name" class="text-sm font-medium text-gray-900 dark:text-white">Recipient Full Name
                    <span class="text-red-500">*</span></Label>
                  <div class="relative">
                    <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd" />
                    </svg>
                    <Input id="name" v-model="form.name" placeholder="Full name according to ID card"
                      class="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
                      required />
                  </div>
                </div>

                <div class="space-y-2">
                  <Label for="address-detail" class="text-sm font-medium text-gray-900 dark:text-white">Complete
                    Shipping
                    Address <span class="text-red-500">*</span></Label>
                  <div class="relative">
                    <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clip-rule="evenodd" />
                    </svg>
                    <Textarea id="address-detail" v-model="form.address"
                      placeholder="Complete address including postal code"
                      class="pl-10 min-h-[100px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
                      required />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping Options -->
        <div class="mb-8">
          <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div class="p-6">
              <div class="flex items-center gap-2 mb-6">
                <div
                  class="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path
                      d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-10a1 1 0 00-1-1H3zM14 7h2v6h-2V7z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Shipping Cost</h3>
              </div>

              <div class="space-y-4">
                <div class="space-y-3">
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-2">
                      <input type="radio" id="shipping-included" v-model="shippingOption" value="included"
                        class="h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400" />
                      <Label for="shipping-included" class="text-gray-900 dark:text-white cursor-pointer">
                        Token already includes shipping cost
                      </Label>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-2">
                      <input type="radio" id="shipping-separate" v-model="shippingOption" value="separate"
                        class="h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400" />
                      <Label for="shipping-separate" class="text-gray-900 dark:text-white cursor-pointer">
                        Pay separately for shipping cost
                      </Label>
                    </div>
                  </div>
                </div>

                <!-- Shipping Details -->
                <div
                  class="mt-6 p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div class="space-y-4">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span class="text-gray-700 dark:text-gray-300">Token Amount for Gold:</span>
                      <span class="font-semibold text-gray-900 dark:text-white">{{ tokenGold }} Token</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                      <span class="text-gray-700 dark:text-gray-300">Shipping Cost:</span>
                      <span class="font-semibold text-gray-900 dark:text-white">{{ shippingCost }} Token</span>
                    </div>
                    <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div class="flex justify-between items-center">
                        <span class="text-lg font-bold text-gray-900 dark:text-white">Total Token Required:</span>
                        <span class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ totalToken }} Token</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="mb-8">
          <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div class="p-6">
              <div class="flex items-center gap-2 mb-6">
                <div
                  class="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Redemption Summary</h3>
              </div>

              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Gold to be shipped</p>
                    <p class="font-semibold text-gray-900 dark:text-white">5 grams (24 karat)</p>
                  </div>
                  <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Estimated value</p>
                    <p class="font-semibold text-gray-900 dark:text-white">Rp 5,000,000</p>
                  </div>
                  <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Shipping method</p>
                    <p class="font-semibold text-gray-900 dark:text-white">Special courier (3-5 business days)</p>
                  </div>
                  <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Shipping insurance</p>
                    <p class="font-semibold text-gray-900 dark:text-white">Included</p>
                  </div>
                </div>

                <div
                  class="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-gray-900 dark:text-white">Total Tokens:</span>
                    <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ totalToken }} Tokens</span>
                  </div>
                </div>

                <div class="flex items-start space-x-3 pt-4">
                  <Checkbox v-model="agreeTerms" id="terms"
                    class="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400" />
                  <div class="grid gap-1.5">
                    <Label for="terms"
                      class="text-sm font-medium leading-none cursor-pointer text-gray-900 dark:text-white">
                      I agree to the applicable terms and conditions
                    </Label>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      By checking this, you agree to all terms and conditions for token redemption with gold.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

      <!-- Loading Overlay -->
      <Dialog :open="isLoading">
        <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle class="text-gray-900 dark:text-white">Processing Redemption</DialogTitle>
          </DialogHeader>
          <div class="flex flex-col items-center justify-center py-8">
            <div
              class="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4">
            </div>
            <p class="text-center text-gray-600 dark:text-gray-400">Please wait a moment, we are processing your
              request...</p>
          </div>
        </DialogContent>
      </Dialog>

      <!-- Success Dialog -->
      <Dialog :open="showSuccess">
        <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle class="text-center text-gray-900 dark:text-white">Redemption Successful!</DialogTitle>
          </DialogHeader>
          <div class="flex flex-col items-center justify-center py-4">
            <div
              class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 border border-green-200 dark:border-green-800">
              <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-center text-gray-700 dark:text-gray-300 mb-2">Your token redemption request has been
              successfully submitted.</p>
            <p class="text-center text-gray-600 dark:text-gray-400 text-sm">Physical gold will be shipped to the address
              you provided shortly.</p>
            <p class="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">You will receive notifications via
              WhatsApp/Telegram regarding the shipping status.</p>
          </div>
          <DialogFooter class="flex flex-col sm:flex-row gap-2">
            <Button @click="showSuccess = false"
              class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
              Close
            </Button>
            <Button @click="goToDashboard"
              class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
/**
 *
 // import {
  //   Card,
  //   CardContent,
  //   CardDescription,
  //   CardHeader,
  //   CardTitle
  // } from '@/components/ui/card'
  */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
      telegram: userProfile.value.telegram,
      whatsapp: userProfile.value.whatsapp,
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
