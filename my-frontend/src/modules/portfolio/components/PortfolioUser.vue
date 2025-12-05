<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-10">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Portfolio & Riwayat</h1>
              <p class="text-gray-600 dark:text-gray-300">Kelola aset token Anda dan pantau semua transaksi</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Button @click="refreshData"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
            <Button @click="goToTransfer"
              class="hidden md:flex bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transfer Token
            </Button>
          </div>
        </div>
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
                <p class="font-semibold text-gray-900 dark:text-white">Wallet belum terhubung</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Hubungkan wallet untuk melihat portfolio dan riwayat
                </p>
              </div>
            </div>
            <Button @click="connectWallet"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6">
              Hubungkan Wallet
            </Button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Portfolio Overview -->
        <div class="mb-10">
          <div
            class="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            <!-- Background Gradient Effect -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl">
            </div>

            <div class="relative p-8">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Ringkasan Portfolio</h2>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Update: {{ lastUpdate }}</span>
                  <Button @click="refreshData" size="sm"
                    class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </Button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Total Balance -->
                <div
                  class="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl border border-blue-100 dark:border-blue-800">
                  <div class="flex items-center justify-between mb-4">
                    <div
                      class="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-blue-600 dark:text-blue-400">Total</span>
                  </div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(totalBalance) }} GLD
                  </p>
                  <p class="text-lg font-semibold text-blue-600 dark:text-blue-400">Rp {{ formatCurrency(totalValue) }}
                  </p>
                </div>

                <!-- Available Balance -->
                <div
                  class="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border border-green-100 dark:border-green-800">
                  <div class="flex items-center justify-between mb-4">
                    <div
                      class="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-green-600 dark:text-green-400">Tersedia</span>
                  </div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(availableBalance) }}
                    GLD</p>
                  <p class="text-lg font-semibold text-green-600 dark:text-green-400">Rp {{
                    formatCurrency(availableValue) }}</p>
                </div>

                <!-- Locked Balance -->
                <div
                  class="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl border border-amber-100 dark:border-amber-800">
                  <div class="flex items-center justify-between mb-4">
                    <div
                      class="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-amber-600 dark:text-amber-400">Terkunci</span>
                  </div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ formatNumber(lockedBalance) }} GLD
                  </p>
                  <p class="text-lg font-semibold text-amber-600 dark:text-amber-400">Rp {{ formatCurrency(lockedValue)
                    }}</p>
                </div>

                <!-- Token Price -->
                <div
                  class="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-purple-100 dark:border-purple-800">
                  <div class="flex items-center justify-between mb-4">
                    <div
                      class="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-purple-600 dark:text-purple-400">Harga</span>
                  </div>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Rp {{ formatCurrency(tokenPrice) }}
                  </p>
                  <div class="flex items-center gap-2">
                    <span
                      :class="priceChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                      {{ priceChange >= 0 ? '+' : '' }}{{ priceChange.toFixed(2) }}%
                    </span>
                    <svg v-if="priceChange >= 0" class="w-4 h-4 text-green-600 dark:text-green-400" fill="none"
                      stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction History Tabs -->
        <div class="mb-8">
          <div class="flex border-b border-gray-200 dark:border-gray-800 mb-6">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
              'px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300',
              activeTab === tab.id
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            ]">
              {{ tab.label }}
              <span :class="[
                'ml-2 px-2 py-1 text-xs rounded-full',
                activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              ]">
                {{ tab.count }}
              </span>
            </button>
          </div>

          <!-- Send Token History -->
          <div v-if="activeTab === 'send'" class="space-y-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Riwayat Transfer Token</h3>
              <div class="flex items-center gap-3">
                <div class="relative">
                  <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input v-model="searchQuery" type="text" placeholder="Cari alamat atau jumlah..."
                    class="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <select v-model="filterStatus"
                  class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">Semua Status</option>
                  <option value="success">Berhasil</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Gagal</option>
                </select>
              </div>
            </div>

            <!-- Transaction Table -->
            <div
              class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        class="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Tanggal</th>
                      <th
                        class="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Penerima</th>
                      <th
                        class="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Jumlah</th>
                      <th
                        class="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Biaya</th>
                      <th
                        class="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Status</th>
                      <th
                        class="px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                    <tr v-if="filteredSendTransactions.length === 0" class="text-center">
                      <td colspan="6" class="px-6 py-12 text-gray-500 dark:text-gray-400">
                        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none"
                          stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Tidak ada riwayat transfer
                      </td>
                    </tr>
                    <tr v-for="transaction in filteredSendTransactions" :key="transaction.id"
                      class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(transaction.date) }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(transaction.date) }}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div
                            class="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mr-3">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ transaction.recipientName
                              || 'Unknown' }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{
                              shortenAddress(transaction.recipient) }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-semibold text-red-600 dark:text-red-400">-{{
                          formatNumber(transaction.amount) }} GLD</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Rp {{ formatCurrency(transaction.amount *
                          tokenPrice) }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">{{ formatNumber(transaction.fee) }} GLD</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="[
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                          transaction.status === 'success' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400' :
                            transaction.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400' :
                              'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400'
                        ]">
                          {{ transaction.status === 'success' ? 'Berhasil' : transaction.status === 'pending' ?
                            'Pending' : 'Gagal' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <button @click="viewTransactionDetails(transaction)"
                          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                          Detail
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="filteredSendTransactions.length > 0"
                class="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Menampilkan {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredSendTransactions.length) }}-{{
                    Math.min(currentPage * itemsPerPage, filteredSendTransactions.length) }} dari {{
                    filteredSendTransactions.length }} transaksi
                </div>
                <div class="flex items-center gap-2">
                  <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Sebelumnya
                  </button>
                  <span class="text-sm text-gray-700 dark:text-gray-300">
                    Halaman {{ currentPage }} dari {{ totalPages }}
                  </span>
                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bridge Token History -->
          <div v-else-if="activeTab === 'bridge'" class="space-y-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Riwayat Bridge Token</h3>
              <div class="flex items-center gap-3">
                <select v-model="bridgeFilterStatus"
                  class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">Semua Status</option>
                  <option value="completed">Selesai</option>
                  <option value="processing">Diproses</option>
                  <option value="failed">Gagal</option>
                </select>
              </div>
            </div>

            <!-- Bridge Transaction Cards -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div v-for="bridge in filteredBridgeTransactions" :key="bridge.id"
                class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div class="p-6">
                  <!-- Header with Status -->
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                      <div :class="[
                        'w-3 h-3 rounded-full',
                        bridge.status === 'completed' ? 'bg-green-500' :
                          bridge.status === 'processing' ? 'bg-amber-500' :
                            'bg-red-500'
                      ]"></div>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ bridge.status === 'completed' ? 'Selesai' : bridge.status === 'processing' ? 'Diproses' :
                          'Gagal' }}
                      </span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(bridge.date) }}</span>
                  </div>

                  <!-- Bridge Path -->
                  <div class="flex items-center justify-between mb-6">
                    <div class="text-center">
                      <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-2">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ bridge.fromChain }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Dari</p>
                    </div>

                    <div class="relative flex-1 mx-4">
                      <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
                      </div>
                      <div class="relative flex justify-center">
                        <div
                          class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div class="text-center">
                      <div
                        class="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center mx-auto mb-2">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ bridge.toChain }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Ke</p>
                    </div>
                  </div>

                  <!-- Amount and Details -->
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Jumlah:</span>
                      <span class="font-semibold text-gray-900 dark:text-white">{{ formatNumber(bridge.amount) }}
                        GLD</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Biaya Bridge:</span>
                      <span class="text-gray-900 dark:text-white">{{ formatNumber(bridge.fee) }} GLD</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-600 dark:text-gray-400">Estimasi Waktu:</span>
                      <span class="text-gray-900 dark:text-white">{{ bridge.estimatedTime }}</span>
                    </div>
                    <div v-if="bridge.transactionHash" class="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Transaction Hash:</p>
                      <div class="flex items-center justify-between">
                        <code class="text-xs font-mono text-gray-900 dark:text-white truncate">
                          {{ shortenTransactionHash(bridge.transactionHash) }}
                        </code>
                        <button @click="copyHash(bridge.transactionHash)"
                          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs">
                          Salin
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Action Button -->
                  <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button @click="viewBridgeDetails(bridge)"
                      class="w-full py-2 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredBridgeTransactions.length === 0" class="text-center py-12">
              <div
                class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada riwayat bridge</h4>
              <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Anda belum melakukan bridge token antar jaringan. Cobalah bridge token untuk melihat riwayatnya di sini.
              </p>
              <Button @click="goToBridge"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6">
                Coba Bridge Token
              </Button>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="mt-8">
          <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Statistik Transaksi</h3>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ totalSendTransactions }}</div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total Transfer</p>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{{ successfulSendTransactions
                    }}</div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Transfer Berhasil</p>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ totalBridgeTransactions }}</div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total Bridge</p>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{{
                    formatCurrency(totalBridgeVolume) }}</div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Volume Bridge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Details Dialog -->
    <Dialog :open="showTransactionDetails" @update:open="showTransactionDetails = $event">
      <DialogContent class="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle class="text-gray-900 dark:text-white">Detail Transaksi</DialogTitle>
        </DialogHeader>
        <div v-if="selectedTransaction" class="space-y-6 py-4">
          <!-- Transaction Info -->
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Status:</span>
              <span :class="[
                'font-medium',
                selectedTransaction.status === 'success' ? 'text-green-600 dark:text-green-400' :
                  selectedTransaction.status === 'pending' ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
              ]">
                {{ selectedTransaction.status === 'success' ? 'Berhasil' : selectedTransaction.status === 'pending' ?
                  'Pending' : 'Gagal' }}
              </span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Tanggal:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatDateTime(selectedTransaction.date)
                }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Jumlah:</span>
              <span class="font-bold text-red-600 dark:text-red-400">-{{ formatNumber(selectedTransaction.amount) }}
                GLD</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Biaya:</span>
              <span class="text-gray-900 dark:text-white">{{ formatNumber(selectedTransaction.fee) }} GLD</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600 dark:text-gray-400">Total:</span>
              <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{
                formatNumber(selectedTransaction.amount + selectedTransaction.fee) }} GLD</span>
            </div>
          </div>

          <!-- Recipient Info -->
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">Penerima:</p>
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p class="font-medium text-gray-900 dark:text-white">{{ selectedTransaction.recipientName || 'Unknown' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">{{ selectedTransaction.recipient
                }}</p>
            </div>
          </div>

          <!-- Transaction Hash -->
          <div v-if="selectedTransaction.hash" class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">Transaction Hash:</p>
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <code class="text-sm font-mono text-gray-900 dark:text-white truncate">
                {{ shortenTransactionHash(selectedTransaction.hash) }}
              </code>
              <button @click="copyHash(selectedTransaction.hash)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                Salin
              </button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button @click="showTransactionDetails = false"
            class="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog' // sesuaikan path jika pakai shadcn
import { Button } from '@/components/ui/button' // sesuaikan path

const router = useRouter()

// ── State ─────────────────────────────────────────────────────────────────────
const walletConnected = ref(true)
const lastUpdate = ref(new Date().toLocaleString('id-ID'))
const activeTab = ref<'send' | 'bridge'>('send')
const searchQuery = ref('')
const filterStatus = ref<'all' | 'success' | 'pending' | 'failed'>('all')
const bridgeFilterStatus = ref<'all' | 'completed' | 'processing' | 'failed'>('all')
const currentPage = ref(1)
const itemsPerPage = 10
const showTransactionDetails = ref(false)
const selectedTransaction = ref<SendTransaction | null>(null)

// ── Portfolio Data ────────────────────────────────────────────────────────────
const totalBalance = ref(15_000)
const availableBalance = ref(12_000)
const lockedBalance = ref(3_000)
const tokenPrice = ref(500_000)
const priceChange = ref(2.5)

const totalValue = computed(() => totalBalance.value * tokenPrice.value)
const availableValue = computed(() => availableBalance.value * tokenPrice.value)
const lockedValue = computed(() => lockedBalance.value * tokenPrice.value)

// ── Types ─────────────────────────────────────────────────────────────────────
interface SendTransaction {
  id: number
  date: Date
  recipient: string
  recipientName: string | null
  amount: number
  fee: number
  status: 'success' | 'pending' | 'failed'
  hash: string | null
}

interface BridgeTransaction {
  id: number
  date: Date
  fromChain: string
  toChain: string
  amount: number
  fee: number
  status: 'completed' | 'processing' | 'failed'
  estimatedTime: string
  transactionHash?: string
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const tabs = [
  { id: 'send' as const, label: 'Transfer Token', count: 24 },
  { id: 'bridge' as const, label: 'Bridge Token', count: 8 },
]

// ── Sample Data ───────────────────────────────────────────────────────────────
const sendTransactions = ref<SendTransaction[]>([
  {
    id: 1,
    date: new Date('2024-01-15T10:30:00'),
    recipient: '0x742d35Cc6634C0532925a3b844Bc9e',
    recipientName: 'John Doe',
    amount: 1000,
    fee: 2.5,
    status: 'success',
    hash: '0x8a2b4c6d9e1f3a5b7c9d2e4f6a8b0c2d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b',
  },
  {
    id: 2,
    date: new Date('2024-01-14T14:20:00'),
    recipient: '0x8b3c5d7e9f1a3b5c7d9e2f4a6b8c0d2e4f6a8b',
    recipientName: 'Jane Smith',
    amount: 2500,
    fee: 3.2,
    status: 'success',
    hash: '0x9b3c5d7e9f1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d3e5f7a9b1c3d5e7f9a1b',
  },
  {
    id: 3,
    date: new Date('2024-01-13T09:15:00'),
    recipient: '0x9c4d6e8f0a2b4c6d8e0f2a4b6c8e0f2a4b6c8d',
    recipientName: null,
    amount: 500,
    fee: 1.8,
    status: 'pending',
    hash: null,
  },
  {
    id: 4,
    date: new Date('2024-01-12T16:45:00'),
    recipient: '0xad5e7f9a1b3c5d7e9f1a3b5c7d9e2f4a6b8c0d',
    recipientName: 'Company Wallet',
    amount: 7500,
    fee: 5.5,
    status: 'success',
    hash: '0xac5e7f9a1b3c5d7e9f1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d3e5f7a9b1c3',
  },
  {
    id: 5,
    date: new Date('2024-01-11T11:20:00'),
    recipient: '0xbe6f8a0c2d4e6f8a0c2d4e6f8a0c2d4e6f8a0c',
    recipientName: null,
    amount: 1200,
    fee: 2.1,
    status: 'failed',
    hash: null,
  },
])

const bridgeTransactions = ref<BridgeTransaction[]>([
  {
    id: 1,
    date: new Date('2024-01-15T09:45:00'),
    fromChain: 'Ethereum',
    toChain: 'Polygon',
    amount: 5000,
    fee: 25,
    status: 'completed',
    estimatedTime: '15 menit',
    transactionHash: '0x3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7',
  },
  {
    id: 2,
    date: new Date('2024-01-14T13:30:00'),
    fromChain: 'BSC',
    toChain: 'Arbitrum',
    amount: 3200,
    fee: 18,
    status: 'completed',
    estimatedTime: '10 menit',
    transactionHash: '0x4c6d8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8',
  },
  {
    id: 3,
    date: new Date('2024-01-13T08:20:00'),
    fromChain: 'Polygon',
    toChain: 'Optimism',
    amount: 1800,
    fee: 12,
    status: 'processing',
    estimatedTime: '20 menit',
    transactionHash: '0x5d7e9f1a3b5c7d9e2f4a6b8c0d2e4f6a8b0c2d3e5f7a9b1c3d5e7f9a1b3c5d7e9',
  },
  {
    id: 4,
    date: new Date('2024-01-12T17:10:00'),
    fromChain: 'Avalanche',
    toChain: 'Fantom',
    amount: 4200,
    fee: 22,
    status: 'completed',
    estimatedTime: '25 menit',
    transactionHash: '0x6e8f0a2b4c6d8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0f2a4b6c8e0',
  },
])

// ── Computed ──────────────────────────────────────────────────────────────────
const filteredSendTransactions = computed(() => {
  let filtered = sendTransactions.value

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter((t) => t.status === filterStatus.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.recipient.toLowerCase().includes(q) ||
        t.recipientName?.toLowerCase().includes(q) ||
        t.amount.toString().includes(q) ||
        t.hash?.toLowerCase().includes(q)
    )
  }

  return filtered.sort((a, b) => +b.date - +a.date) // newest first
})

const filteredBridgeTransactions = computed(() => {
  let filtered = bridgeTransactions.value

  if (bridgeFilterStatus.value !== 'all') {
    filtered = filtered.filter((t) => t.status === bridgeFilterStatus.value)
  }

  return filtered.sort((a, b) => +b.date - +a.date)
})

const totalPages = computed(() =>
  Math.ceil(filteredSendTransactions.value.length / itemsPerPage)
)

// const paginatedTransactions = computed(() => {
//   const start = (currentPage.value - 1) * itemsPerPage
//   return filteredSendTransactions.value.slice(start, start + itemsPerPage)
// })

const totalSendTransactions = computed(() => sendTransactions.value.length)
const successfulSendTransactions = computed(() =>
  sendTransactions.value.filter((t) => t.status === 'success').length
)
const totalBridgeTransactions = computed(() => bridgeTransactions.value.length)
const totalBridgeVolume = computed(() =>
  bridgeTransactions.value
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) * tokenPrice.value
)

// ── Methods ───────────────────────────────────────────────────────────────────
const connectWallet = () => {
  walletConnected.value = true
  refreshData()
}

const refreshData = () => {
  lastUpdate.value = new Date().toLocaleString('id-ID')
}

const goToTransfer = () => router.push('/sendToken')
const goToBridge = () => router.push('/bridge')

const viewTransactionDetails = (transaction: SendTransaction) => {
  selectedTransaction.value = transaction
  showTransactionDetails.value = true
}

const viewBridgeDetails = (bridge: BridgeTransaction) => {
  console.log('View bridge details:', bridge)
}

const copyHash = async (hash: string) => {
  try {
    await navigator.clipboard.writeText(hash)
    alert('Hash berhasil disalin!')
  } catch (err) {
    console.error('Gagal menyalin hash', err)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// ── Formatters ────────────────────────────────────────────────────────────────
const formatNumber = (num: number) =>
  new Intl.NumberFormat('id-ID').format(num)

const formatCurrency = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(num)
    .replace('Rp', 'Rp ')

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const formatTime = (date: Date | string) =>
  new Date(date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

const formatDateTime = (date: Date | string) => `${formatDate(date)} ${formatTime(date)}`

const shortenAddress = (addr: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

const shortenTransactionHash = (hash: string) =>
  hash ? `${hash.slice(0, 8)}...${hash.slice(-6)}` : ''

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  refreshData()
})
</script>
