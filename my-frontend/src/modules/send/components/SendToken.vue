<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-10">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Token Transfer</h1>
              <p class="text-gray-600 dark:text-gray-300">Send tokens to another wallet address securely</p>
            </div>
          </div>
          <Button @click="goToPortfolio"
            class="hidden md:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Portfolio
          </Button>
        </div>

        <!-- Wallet Connection Banner -->
        <div v-if="!walletConnected" class="mb-8">
          <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div class="p-6 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">Wallet not connected</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Connect wallet to make transfers</p>
                </div>
              </div>
              <Button @click="connectWallet"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6">
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="walletConnected">
        <!-- Balance Card -->
        <div class="mb-8">
          <div
            class="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            <!-- Background Gradient Effect -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl">
            </div>

            <div class="relative p-8">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center md:text-left">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Available Token Balance</p>
                  <div class="flex items-center justify-center md:justify-start gap-3">
                    <div
                      class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(walletBalance) }} GLD
                    </p>
                  </div>
                </div>
                <div class="text-center">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Equivalent Value</p>
                  <p class="text-xl font-bold text-blue-600 dark:text-blue-400">Rp {{ formatCurrency(walletBalance *
                    tokenPrice) }}</p>
                </div>
                <div class="text-center md:text-right">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Token Price</p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">Rp {{ formatCurrency(tokenPrice) }} /
                    GLD</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Transfer Form -->
          <div class="lg:col-span-2">
            <div
              class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
              <div class="p-8">
                <div class="flex items-center gap-3 mb-6">
                  <div
                    class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Transfer Form</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Fill in token transfer details to the
                      destination address</p>
                  </div>
                </div>

                <div class="space-y-8">
                  <!-- Recipient Address -->
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <Label for="recipient" class="text-sm font-medium text-gray-900 dark:text-white">Recipient Wallet
                        Address *</Label>
                      <Button type="button" @click="showAddressBook = true"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Address Book
                      </Button>
                    </div>
                    <div class="relative">
                      <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                      <Input id="recipient" v-model="form.recipientAddress" placeholder="0x..."
                        class="pl-12 font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
                        :class="{ 'border-red-300 dark:border-red-500': addressError }" @input="validateAddress" />
                    </div>
                    <div v-if="addressError" class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd" />
                      </svg>
                      {{ addressError }}
                    </div>
                    <div v-if="recipientName"
                      class="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd" />
                      </svg>
                      Registered as: {{ recipientName }}
                    </div>
                  </div>

                  <!-- Amount -->
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <Label for="amount" class="text-sm font-medium text-gray-900 dark:text-white">Token Amount
                        *</Label>
                      <Button type="button" @click="setMaxAmount"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                        Use Max: {{ formatNumber(maxTransferable) }} GLD
                      </Button>
                    </div>
                    <div class="relative">
                      <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                          clip-rule="evenodd" />
                      </svg>
                      <Input id="amount" v-model="form.amount" type="number" :min="minimumTransfer"
                        :max="maxTransferable" placeholder="0.00"
                        class="pl-12 text-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
                        :class="{ 'border-red-300 dark:border-red-500': amountError }" @input="validateAmount" />
                      <span class="absolute right-4 top-3.5 text-gray-500 dark:text-gray-400 font-medium">GLD</span>
                    </div>
                    <div v-if="amountError" class="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd" />
                      </svg>
                      {{ amountError }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      Equivalent to: <span class="font-semibold text-blue-600 dark:text-blue-400">Rp {{
                        formatCurrency(equivalentValue) }}</span>
                    </div>
                  </div>

                  <!-- Network Fee -->
                  <div
                    class="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div class="space-y-4">
                      <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Network Fee (Gas Fee)</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ formatNumber(networkFee) }}
                          GLD</span>
                      </div>
                      <div class="flex justify-between items-center py-2">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Estimated Time</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ estimatedTime }}</span>
                      </div>
                      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex justify-between items-center">
                          <span class="font-semibold text-gray-900 dark:text-white">Total to be Sent</span>
                          <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(totalAmount)
                            }} GLD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Memo/Note (Optional) -->
                  <div class="space-y-3">
                    <Label for="memo" class="text-sm font-medium text-gray-900 dark:text-white">Note (Optional)</Label>
                    <Textarea id="memo" v-model="form.memo" placeholder="Add a note for this transaction"
                      class="min-h-[100px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl"
                      maxlength="200" />
                    <div class="text-xs text-gray-500 dark:text-gray-400 text-right">
                      {{ form.memo.length }}/200 characters
                    </div>
                  </div>

                  <!-- Terms Checkbox -->
                  <div class="flex items-start space-x-3 pt-6">
                    <Checkbox v-model="agreeTerms" id="transfer-terms"
                      class="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400" />
                    <div class="grid gap-1.5">
                      <Label for="transfer-terms"
                        class="text-sm font-medium leading-none cursor-pointer text-gray-900 dark:text-white">
                        I have verified the recipient address and transfer amount
                      </Label>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Ensure the destination address is correct as transactions cannot be cancelled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mt-8">
              <Button @click="resetForm"
                class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl py-4 text-lg font-semibold transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reset Form
              </Button>
              <Button @click="previewTransfer" :disabled="!isFormValid"
                class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Continue to Preview
              </Button>
            </div>
          </div>

          <!-- Right Column - Recent Transfers & Info -->
          <div class="space-y-6">
            <!-- Transfer Info Card -->
            <div
              class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
              <div class="p-6">
                <div class="flex items-center gap-3 mb-6">
                  <div
                    class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Transfer Information</h3>
                </div>

                <div class="space-y-4">
                  <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Minimum Transfer</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(minimumTransfer) }}
                      GLD</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Maximum per Transaction</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(maxTransferPerTx) }}
                      GLD</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Daily Limit</span>
                    <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(dailyLimit) }} GLD</span>
                  </div>
                  <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Network</p>
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd"
                            d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <span class="font-semibold text-gray-900 dark:text-white">Ethereum Mainnet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Transfers -->
            <div
              class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
              <div class="p-6">
                <div class="flex items-center gap-3 mb-6">
                  <div
                    class="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transfers</h3>
                </div>

                <div v-if="recentTransfers.length === 0" class="text-center py-6">
                  <p class="text-gray-500 dark:text-gray-400">No transfer history yet</p>
                </div>
                <div v-else class="space-y-3">
                  <div v-for="transfer in recentTransfers.slice(0, 3)" :key="transfer.id"
                    class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                    <div>
                      <p class="font-medium text-sm text-gray-900 dark:text-white">
                        {{ transfer.recipientShort }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ transfer.time }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-red-600 dark:text-red-400">-{{ transfer.amount }} GLD</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ transfer.status }}</p>
                    </div>
                  </div>
                  <Button @click="goToHistory"
                    class="w-full mt-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-xl">
                    View All History
                  </Button>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div
              class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>

                <div class="space-y-4">
                  <Button @click="scanQR"
                    class="w-full justify-start bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl">
                    <svg class="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Scan QR Code
                  </Button>
                  <Button @click="showAddressBook = true"
                    class="w-full justify-start bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl">
                    <svg class="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path
                        d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-10a1 1 0 00-1-1H3z" />
                    </svg>
                    Send to Contact
                  </Button>
                  <Button @click="copyOwnAddress"
                    class="w-full justify-start bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl">
                    <svg class="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy My Address
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Address Book Dialog -->
    <Dialog :open="showAddressBook" @update:open="showAddressBook = $event">
      <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle class="text-gray-900 dark:text-white">Address Book</DialogTitle>
          <DialogDescription class="text-gray-600 dark:text-gray-400">
            Select from contacts you've sent to before
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <Input placeholder="Search name or address..." v-model="addressBookSearch"
            class="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl" />
          <div v-if="filteredAddressBook.length === 0" class="text-center py-6">
            <p class="text-gray-500 dark:text-gray-400">No contacts found</p>
          </div>
          <div v-else class="space-y-2 max-h-60 overflow-y-auto">
            <div v-for="contact in filteredAddressBook" :key="contact.address"
              class="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors"
              @click="selectContact(contact)">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ contact.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-mono">{{ shortenAddress(contact.address) }}</p>
              </div>
              <Button
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-4">
                Select
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter class="flex-col sm:flex-row gap-2">
          <Button @click="showAddressBook = false"
            class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
            Close
          </Button>
          <Button @click="showAddContact = true"
            class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
            Add New Contact
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add Contact Dialog -->
    <Dialog :open="showAddContact" @update:open="showAddContact = $event">
      <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle class="text-gray-900 dark:text-white">Add New Contact</DialogTitle>
        </DialogHeader>
        <div class="space-y-6 py-4">
          <div class="space-y-3">
            <Label for="contact-name" class="text-sm font-medium text-gray-900 dark:text-white">Contact Name</Label>
            <Input id="contact-name" v-model="newContact.name" placeholder="Enter contact name"
              class="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl" />
          </div>
          <div class="space-y-3">
            <Label for="contact-address" class="text-sm font-medium text-gray-900 dark:text-white">Wallet
              Address</Label>
            <Input id="contact-address" v-model="newContact.address" placeholder="0x..."
              class="font-mono bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl" />
          </div>
        </div>
        <DialogFooter class="flex-col sm:flex-row gap-2">
          <Button @click="showAddContact = false"
            class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
            Cancel
          </Button>
          <Button @click="saveContact" :disabled="!newContact.name || !newContact.address"
            class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Preview Transfer Dialog -->
    <Dialog :open="showPreview" @update:open="showPreview = $event">
      <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle class="text-gray-900 dark:text-white">Preview Transfer</DialogTitle>
          <DialogDescription class="text-gray-600 dark:text-gray-400">
            Review transfer details before confirming
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-6 py-4">
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Recipient:</span>
              <div class="text-right">
                <p class="font-semibold text-gray-900 dark:text-white">{{ recipientName || 'Unknown' }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-mono">{{ shortenAddress(form.recipientAddress)
                  }}</p>
              </div>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Amount:</span>
              <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(Number(form.amount)) }}
                GLD</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Network Fee:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatNumber(networkFee) }} GLD</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600 dark:text-gray-400">Total:</span>
              <span class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ formatNumber(totalAmount) }}
                GLD</span>
            </div>
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p class="text-gray-600 dark:text-gray-400 mb-2">Note:</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">{{
                form.memo || 'No note' }}</p>
            </div>
          </div>
        </div>
        <DialogFooter class="flex-col sm:flex-row gap-2">
          <Button @click="showPreview = false"
            class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
            Back
          </Button>
          <Button @click="confirmTransfer"
            class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Confirm Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Loading Dialog -->
    <Dialog :open="isLoading">
      <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle class="text-gray-900 dark:text-white">Processing Transfer</DialogTitle>
        </DialogHeader>
        <div class="flex flex-col items-center justify-center py-8">
          <div
            class="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4">
          </div>
          <p class="text-center text-gray-600 dark:text-gray-400">Please wait, transfer is being processed...</p>
          <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">Do not close this page</p>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Success Dialog -->
    <Dialog :open="showSuccess">
      <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle class="text-center text-green-600 dark:text-green-400">Transfer Successful!</DialogTitle>
        </DialogHeader>
        <div class="flex flex-col items-center justify-center py-4">
          <div
            class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 border border-green-200 dark:border-green-800">
            <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-center font-semibold text-gray-900 dark:text-white mb-2">{{ formatNumber(Number(form.amount))
            }} GLD successfully sent!</p>
          <p class="text-center text-gray-600 dark:text-gray-400 mb-1">To: {{ recipientName ||
            shortenAddress(form.recipientAddress) }}</p>
          <p class="text-center text-sm text-gray-500 dark:text-gray-400">Transaction Hash:</p>
          <div class="flex items-center gap-2 mt-2">
            <code
              class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-gray-900 dark:text-white">
              {{ shortenTransactionHash(transactionHash) }}
            </code>
            <Button @click="copyTransactionHash"
              class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Button>
          </div>
        </div>
        <DialogFooter class="flex-col sm:flex-row gap-2">
          <Button @click="showSuccess = false"
            class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
            Close
          </Button>
          <Button @click="goToHistory"
            class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
            View History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
/**
 // import {
 //   Card,
 //   CardContent,
 //   CardDescription,
 //   CardHeader,
 //   CardTitle
 // } from '@/components/ui/card'
 *
*/
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const router = useRouter()

// Interface untuk tipe data
interface Contact {
  name: string
  address: string
}

interface Transfer {
  id: number
  recipientShort: string
  amount: number
  time: string
  status: string
}

interface FormData {
  recipientAddress: string
  amount: string
  memo: string
}

interface NewContact {
  name: string
  address: string
}

// State
const walletConnected = ref<boolean>(true) // Set true for demo
const isLoading = ref<boolean>(false)
const showAddressBook = ref<boolean>(false)
const showAddContact = ref<boolean>(false)
const showPreview = ref<boolean>(false)
const showSuccess = ref<boolean>(false)
const agreeTerms = ref<boolean>(false)

// Form data
const form = ref<FormData>({
  recipientAddress: '',
  amount: '',
  memo: ''
})

// Validation errors
const addressError = ref<string>('')
const amountError = ref<string>('')

// User data
const walletBalance = ref<number>(1500.75)
const tokenPrice = ref<number>(5000) // Rp 5,000 per token
const recipientName = ref<string>('')

// Transfer limits
const minimumTransfer = ref<number>(1)
const maxTransferPerTx = ref<number>(10000)
const dailyLimit = ref<number>(50000)
const networkFee = ref<number>(0.01)
const estimatedTime = ref<string>('~15 seconds')

// Address book
const addressBookSearch = ref<string>('')
const addressBook = ref<Contact[]>([
  { name: 'Budi Santoso', address: '0x742d35Cc6634C0532925a3b844Bc9e0E3F2e0a1b' },
  { name: 'Sari Wijaya', address: '0x98dC8d7b0E3B5F5c5F5C5F5C5F5C5F5C5F5C5F5C' },
  { name: 'PT Gold Invest', address: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE' },
])

// New contact
const newContact = ref<NewContact>({
  name: '',
  address: ''
})

// Transaction hash
const transactionHash = ref<string>('')

// Recent transfers (mock data)
const recentTransfers = ref<Transfer[]>([
  { id: 1, recipientShort: '0x742d...0a1b', amount: 100, time: '2 hours ago', status: 'Successful' },
  { id: 2, recipientShort: '0x98dC...5C5C', amount: 50.5, time: '1 day ago', status: 'Successful' },
  { id: 3, recipientShort: '0x3f5C...f0bE', amount: 1000, time: '3 days ago', status: 'Successful' },
])

// Computed properties
const maxTransferable = computed<number>(() => {
  return Math.min(walletBalance.value - networkFee.value, maxTransferPerTx.value)
})

const equivalentValue = computed<number>(() => {
  const amount = Number.parseFloat(form.value.amount) || 0
  return amount * tokenPrice.value
})

const totalAmount = computed<number>(() => {
  const amount = Number.parseFloat(form.value.amount) || 0
  return amount + networkFee.value
})

const filteredAddressBook = computed<Contact[]>(() => {
  if (!addressBookSearch.value) return addressBook.value

  const searchTerm = addressBookSearch.value.toLowerCase()
  return addressBook.value.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm) ||
    contact.address.toLowerCase().includes(searchTerm)
  )
})

const isFormValid = computed<boolean>(() => {
  const amount = Number.parseFloat(form.value.amount)
  return form.value.recipientAddress.trim() !== '' &&
    amount >= minimumTransfer.value &&
    amount <= maxTransferable.value &&
    !addressError.value &&
    !amountError.value &&
    agreeTerms.value
})

// Methods
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(num)
}

const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(Math.round(num))
}

const shortenAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const shortenTransactionHash = (hash: string): string => {
  if (!hash) return ''
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`
}

const validateAddress = (): void => {
  const address = form.value.recipientAddress.trim()

  if (!address) {
    addressError.value = ''
    recipientName.value = ''
    return
  }

  // Basic Ethereum address validation
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    addressError.value = 'Invalid wallet address format'
    recipientName.value = ''
    return
  }

  // Check if address is in address book
  const contact = addressBook.value.find(c =>
    c.address.toLowerCase() === address.toLowerCase()
  )

  if (contact) {
    recipientName.value = contact.name
    addressError.value = ''
  } else {
    recipientName.value = ''
    addressError.value = ''
  }
}

const validateAmount = (): void => {
  const amount = Number.parseFloat(form.value.amount)

  if (!amount || Number.isNaN(amount)) {
    amountError.value = ''
    return
  }

  if (amount < minimumTransfer.value) {
    amountError.value = `Minimum transfer is ${minimumTransfer.value} GLD`
  } else if (amount > maxTransferable.value) {
    amountError.value = `Maximum transfer is ${formatNumber(maxTransferable.value)} GLD`
  } else if (amount > walletBalance.value - networkFee.value) {
    amountError.value = 'Insufficient balance'
  } else {
    amountError.value = ''
  }
}

const setMaxAmount = (): void => {
  form.value.amount = maxTransferable.value.toString()
  validateAmount()
}

const selectContact = (contact: Contact): void => {
  form.value.recipientAddress = contact.address
  recipientName.value = contact.name
  showAddressBook.value = false
  validateAddress()
}

const saveContact = (): void => {
  if (newContact.value.name.trim() && newContact.value.address.trim()) {
    // Validate address format before saving
    if (!/^0x[a-fA-F0-9]{40}$/.test(newContact.value.address.trim())) {
      toast.error('Invalid wallet address format')
      return
    }

    addressBook.value.push({
      name: newContact.value.name.trim(),
      address: newContact.value.address.trim()
    })

    // Save to localStorage
    localStorage.setItem('addressBook', JSON.stringify(addressBook.value))

    toast.success('Contact added successfully')
    newContact.value = { name: '', address: '' }
    showAddContact.value = false
  }
}

const previewTransfer = (): void => {
  if (isFormValid.value) {
    showPreview.value = true
  }
}

const confirmTransfer = async (): Promise<void> => {
  showPreview.value = false
  isLoading.value = true

  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    showSuccess.value = true

    // Generate mock transaction hash
    const hexChars = '0123456789abcdef'
    transactionHash.value = '0x' + Array.from({ length: 64 },
      () => hexChars[Math.floor(Math.random() * 16)]).join('')

    // Update wallet balance
    const amount = Number.parseFloat(form.value.amount) || 0
    walletBalance.value -= (amount + networkFee.value)

    // Add to recent transfers
    recentTransfers.value.unshift({
      id: Date.now(),
      recipientShort: shortenAddress(form.value.recipientAddress),
      amount: amount,
      time: 'Just now',
      status: 'Successful'
    })

    toast.success('Transfer successful!', {
      description: `${formatNumber(amount)} GLD successfully sent`,
      duration: 5000,
    })
  }, 2000)
}

const resetForm = (): void => {
  form.value = {
    recipientAddress: '',
    amount: '',
    memo: ''
  }
  agreeTerms.value = false
  addressError.value = ''
  amountError.value = ''
  recipientName.value = ''

  toast.info('Form has been reset')
}

const connectWallet = (): void => {
  toast.info('Wallet connection feature will be implemented')
}

const scanQR = (): void => {
  toast.info('QR scanner feature will be implemented')
}

const copyOwnAddress = async (): Promise<void> => {
  const hexChars = '0123456789abcdef'
  const mockAddress = '0x' + Array.from({ length: 40 },
    () => hexChars[Math.floor(Math.random() * 16)]).join('')

  try {
    await navigator.clipboard.writeText(mockAddress)
    toast.success('Address successfully copied to clipboard')
  } catch (error) {
    console.error('Failed to copy address:', error)
    toast.error('Failed to copy address')
  }
}

const copyTransactionHash = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(transactionHash.value)
    toast.success('Transaction hash successfully copied')
  } catch (error) {
    console.error('Failed to copy transaction hash:', error)
    toast.error('Failed to copy transaction hash')
  }
}

const goToPortfolio = (): void => {
  router.push('/portfolio')
}

const goToHistory = (): void => {
  router.push('/history')
}

// Lifecycle
onMounted((): void => {
  // Load address book from localStorage
  const savedAddressBook = localStorage.getItem('addressBook')
  if (savedAddressBook) {
    try {
      const parsed = JSON.parse(savedAddressBook)
      // Validate loaded data
      if (Array.isArray(parsed) && parsed.every(item =>
        typeof item === 'object' &&
        'name' in item &&
        'address' in item
      )) {
        addressBook.value = parsed
      }
    } catch (error) {
      console.error('Error parsing address book:', error)
    }
  }
})
</script>
