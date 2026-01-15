<template>
    <div class="p-2 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            <!-- From Section -->
            <div
                class="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2 mb-4">
                    <div
                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">From</h3>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div v-if="fromChain?.id === chainId" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-semibold text-yellow-600 dark:text-yellow-400">{{
                            formatNativeBalance(nativeBalance) }} {{ nativeCurrencySymbol }}</span>
                    </div>
                    <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Balance: <span class="font-semibold text-gray-900 dark:text-white">{{ formattedBalance }} {{
                            fromToken?.symbol }}</span>
                    </div>
                </div>

                <div class="space-y-4">

                    <!-- Source Address -->
                    <div>
                        <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source
                            Address</label>
                        <div
                            class="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div class="flex items-center space-x-2">
                                    <div
                                        class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                        <PersonIcon class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                    <div>
                                        <div class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Your
                                            Wallet</div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">{{
                                            shortenAddress(walletAddress) }}</div>
                                    </div>
                                </div>
                                <button @click="copyAddress(walletAddress)"
                                    class="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors self-start sm:self-center">
                                    <CopyIcon class="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Chain Selection -->
                    <div ref="fromChainDropdownRef" class="relative group">
                        <label
                            class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Network</label>
                        <div @click="toggleFromChains($event)"
                            class="relative cursor-pointer p-2 sm:p-3 md:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2 sm:space-x-3">
                                    <div
                                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                        <ChainIcon :chain="fromChain" class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <div class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{
                                            fromChain?.name ||
                                            'Select Chain' }}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{
                                            fromChain?.type ||
                                            'Network' }}</div>
                                    </div>
                                </div>
                                <ChevronDownIcon
                                    class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300"
                                    :class="{ 'rotate-180': showFromChains }" />
                            </div>
                        </div>

                        <!-- Chain Dropdown -->
                        <Transition name="slide-down">
                            <div v-if="showFromChains"
                                class="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div class="max-h-64 overflow-y-auto">
                                    <div v-for="chain in filteredSourceChains" :key="chain.id"
                                        @click="selectFromChain(chain, $event)"
                                        class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                        <div
                                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                            <ChainIcon :chain="chain" class="w-5 h-5 text-white" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="font-medium text-gray-900 dark:text-white truncate">{{
                                                chain.name }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">{{ chain.type }}</div>
                                        </div>
                                        <div v-if="chain.fee"
                                            class="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {{ chain.fee }}%
                                        </div>
                                    </div>
                                    <div v-if="filteredSourceChains.length === 0"
                                        class="p-4 text-center text-gray-500 dark:text-gray-400">
                                        No available chains
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <!-- Token Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Token</label>
                        <div
                            class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <TokenIcon :token="fromToken" class="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900 dark:text-white">{{ fromToken?.name ||
                                            'Select Token' }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ fromToken?.symbol || ''
                                            }}
                                        </div>
                                    </div>
                                </div>
                                <!-- Old Select Removed -->
                                <button @click="toggleFromTokens($event)" ref="fromTokenDropdownTrigger"
                                    class="flex items-center space-x-2 bg-white dark:bg-gray-700 rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-600 hover:border-blue-500 transition-colors">
                                    <span class="font-medium text-gray-900 dark:text-white">{{ fromToken?.symbol ||
                                        'Select' }}</span>
                                    <ChevronDownIcon class="w-4 h-4 text-gray-400 transition-transform duration-300"
                                        :class="{ 'rotate-180': showFromTokens }" />
                                </button>
                            </div>

                            <!-- Token Dropdown -->
                            <div class="relative">
                                <Transition name="slide-down">
                                    <div v-if="showFromTokens" ref="fromTokenDropdownRef"
                                        class="absolute top-0 left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        <div class="max-h-64 overflow-y-auto">
                                            <div v-for="token in availableTokens" :key="token.address"
                                                @click="selectFromToken(token)"
                                                class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                                <div
                                                    class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                    <TokenIcon :token="token" class="w-4 h-4 text-white" />
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <div class="font-medium text-gray-900 dark:text-white truncate">{{
                                                        token.symbol }}</div>
                                                    <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{
                                                        token.name
                                                        }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                            <div class="flex space-x-2 mb-3">
                                <button v-for="percent in [25, 50, 75, 100]" :key="percent"
                                    @click="setAmountPercentage(percent)"
                                    class="flex-1 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors">
                                    {{ percent }}%
                                </button>
                            </div>
                            <div class="relative">
                                <input v-model="amountModel" type="text" placeholder="0.00"
                                    class="w-full p-2 md:p-3 text-xl md:text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500 outline-none" />
                                <div class="absolute right-0 top-0 bottom-0 flex items-center pr-3">
                                    <span class="text-gray-500 dark:text-gray-400">{{ fromToken?.symbol || '' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- To Section -->
            <div
                class="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                <div class="flex items-center gap-2 mb-4">
                    <div
                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">To</h3>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Estimated: <span class="font-semibold text-gray-900 dark:text-white">{{
                            formatTokenBalance(estimatedAmount) }} {{
                                toToken?.symbol }}</span>
                    </div>
                </div>

                <div class="space-y-4 flex-grow">

                    <!-- Destination Address -->
                    <div>
                        <label
                            class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination
                            Address</label>
                        <div
                            class="p-2 sm:p-3 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 focus-within:border-green-500 transition-colors">
                            <div class="flex items-center space-x-2">
                                <input v-model="destinationAddress" type="text"
                                    placeholder="0x... or select from address book"
                                    class="flex-1 bg-transparent border-none focus:ring-0 text-xs sm:text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 outline-none w-full" />
                                <button @click="showAddressBook = true"
                                    class="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                    title="Address Book">
                                    <IdCardIcon class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                            <div v-if="destinationName" class="mt-2 text-xs text-green-600 dark:text-green-400">
                                ✓ {{ destinationName }}
                            </div>
                        </div>
                    </div>

                    <!-- Chain Selection -->
                    <div ref="toChainDropdownRef" class="relative group">
                        <label
                            class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination
                            Network</label>
                        <div @click="toggleToChains($event)"
                            class="relative cursor-pointer p-2 sm:p-3 md:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl hover:border-green-500 dark:hover:border-green-500 transition-all duration-300">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2 sm:space-x-3">
                                    <div
                                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                                        <ChainIcon :chain="toChain" class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <div class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{{
                                            toChain?.name ||
                                            'SelectChain' }}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{
                                            toChain?.type || 'Network'
                                            }}</div>
                                    </div>
                                </div>
                                <ChevronDownIcon
                                    class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300"
                                    :class="{ 'rotate-180': showToChains }" />
                            </div>
                        </div>

                        <!-- Chain Dropdown -->
                        <Transition name="slide-down">
                            <div v-if="showToChains"
                                class="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div class="max-h-64 overflow-y-auto">
                                    <div v-for="chain in filteredDestChains" :key="chain.id"
                                        @click="selectToChain(chain, $event)"
                                        class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                        <div
                                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                                            <ChainIcon :chain="chain" class="w-5 h-5 text-white" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="font-medium text-gray-900 dark:text-white truncate">{{
                                                chain.name }}
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">{{ chain.type }}</div>
                                        </div>
                                        <div v-if="chain.fee"
                                            class="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {{ chain.fee }}%
                                        </div>
                                    </div>
                                    <div v-if="filteredDestChains.length === 0"
                                        class="p-4 text-center text-gray-500 dark:text-gray-400">
                                        No available chains
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <!-- Receiving Token -->
                    <div>
                        <label
                            class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Receive</label>
                        <div
                            class="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-green-100 dark:border-green-900/50">
                            <div class="flex items-center justify-between mb-4 sm:mb-6">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                                        <TokenIcon :token="toToken" class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-900 dark:text-white">{{ toToken?.name ||
                                            'SelectToken' }}
                                        </div>
                                        <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{
                                            toToken?.symbol || '' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {{ formatTokenBalance(estimatedAmount) || '0.00' }}
                                </div>
                                <div class="text-sm sm:text-base text-gray-500 dark:text-gray-400">{{ toToken?.symbol ||
                                    '' }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bridge Details -->
                <div class="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">


                    <div class="flex justify-between items-center py-1">
                        <div class="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <RocketIcon class="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Bridge Fee</span>
                        </div>
                        <span class="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">{{ bridgeFee }}
                            {{ fromToken?.symbol ||
                                ''
                            }}</span>
                    </div>
                    <div class="flex justify-between items-center py-1">
                        <div class="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <TimerIcon class="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Estimated Time</span>
                        </div>
                        <span class="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">{{ timeEstimate
                            }}</span>
                    </div>
                    <div class="flex justify-between items-center py-1">
                        <div class="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <MinusCircledIcon class="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Minimum Amount</span>
                        </div>
                        <span class="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">{{
                            formatTokenBalance(21000) }} {{
                                fromToken?.symbol || ''
                            }}</span>
                    </div>

                </div>
            </div>
        </div>

        <!-- Bridge Button -->
        <div class="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
            <button @click="initiateBridge" :disabled="!canBridge || loading" :class="[
                'w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]',
                canBridge && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            ]">
                <div class="flex items-center justify-center space-x-3">
                    <div v-if="loading" class="animate-spin">
                        <LoopIcon class="w-5 h-5" />
                    </div>
                    <ArrowRightIcon v-else class="w-5 h-5" />
                    <span>{{ loading ? 'Processing Bridge...' : 'Bridge Tokens' }}</span>
                </div>
            </button>

            <div v-if="canBridge" class="mt-4 text-center">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    You will receive approximately
                    <span class="font-semibold text-gray-900 dark:text-white">{{ formatTokenBalance(estimatedAmount) }}
                        {{
                            toToken?.symbol
                        }}</span>
                    on {{ toChain?.name }}
                </p>
            </div>
        </div>
    </div>

    <!-- Address Book Dialog -->
    <AddressBookDialog :open="showAddressBook" :address-book="addressBook" :address-book-search="addressBookSearch"
        @update:open="showAddressBook = $event" @update:address-book-search="addressBookSearch = $event"
        @select-contact="selectContact" @show-add-contact="showAddContact = true" />

    <AddContactDialog :open="showAddContact" @update:open="showAddContact = $event" @save-contact="saveContact" />

    <!-- Bridge Confirmation Dialog -->
    <Dialog :open="showConfirmDialog" @update:open="showConfirmDialog = $event">
        <DialogContent class="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Review Transaction</DialogTitle>
                <DialogDescription>
                    Please review your bridge transaction details before confirming.
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-4 py-4">
                <!-- Source -->
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">From</span>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <TokenIcon v-if="fromToken" :token="fromToken" class="w-6 h-6" />
                            <span class="font-medium text-gray-900 dark:text-white">{{ amount }} {{ fromToken?.symbol
                            }}</span>
                        </div>
                        <div class="flex items-center gap-1.5 text-sm text-gray-500">
                            <ChainIcon v-if="fromChain" :chain="fromChain" class="w-4 h-4" />
                            <span>{{ fromChain?.name }}</span>
                        </div>
                    </div>
                </div>

                <!-- Arrow -->
                <div class="flex justify-center -my-2 relative z-10">
                    <div class="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full ring-4 ring-white dark:ring-gray-900">
                        <ArrowRightIcon class="w-4 h-4 text-gray-500" />
                    </div>
                </div>

                <!-- Destination -->
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">To</span>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <TokenIcon v-if="toToken" :token="toToken" class="w-6 h-6" />
                            <span class="font-medium text-gray-900 dark:text-white">~{{
                                formatTokenBalance(estimatedAmount)
                            }} {{ toToken?.symbol }}</span>
                        </div>
                        <div class="flex items-center gap-1.5 text-sm text-gray-500">
                            <ChainIcon v-if="toChain" :chain="toChain" class="w-4 h-4" />
                            <span>{{ toChain?.name }}</span>
                        </div>
                    </div>
                    <div v-if="destinationAddress"
                        class="text-xs text-gray-500 pt-1 border-t border-gray-200 dark:border-gray-700 mt-2">
                        To: <span class="font-mono">{{ shortenAddress(destinationAddress) }}</span>
                    </div>
                </div>

                <!-- Fees & Time -->
                <div class="text-sm space-y-2 pt-2">
                    <div class="flex justify-between">
                        <span class="text-gray-500">Bridge Fee</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ bridgeFee }} {{ fromToken?.symbol
                        }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Estimated Time</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ timeEstimate }}</span>
                    </div>
                </div>
            </div>

            <DialogFooter class="flex-col sm:justify-between gap-2">
                <DialogClose as-child>
                    <button
                        class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                        Cancel
                    </button>
                </DialogClose>
                <button @click="confirmBridge"
                    class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Confirm Bridge
                </button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useConnection, useConfig } from '@wagmi/vue'
import { getBalance } from '@wagmi/core'
import { toast } from 'vue-sonner'
import { useBridgeStore } from '@/modules/bridge/store/bridgeStore'
import { useBridgeBalance } from '@/modules/bridge/composables/useBridgeBalance'
import { addressBookService, type Contact } from '@/modules/send/services/addressBook'
import type { Chain, Token } from '@/modules/bridge/types/bridge.types'
import { useChain } from '@/app/composables/useChain'
import { formatTokenBalance, formatNativeBalance } from '@/utils/format'

import {
    ChevronDownIcon,
    RocketIcon,
    TimerIcon,
    MinusCircledIcon,
    LoopIcon,
    ArrowRightIcon,
    PersonIcon,
    CopyIcon,
    IdCardIcon
} from '@radix-icons/vue'
import ChainIcon from './ChainIcon.vue'
import TokenIcon from './TokenIcon.vue'
import AddressBookDialog from '@/modules/send/components/AddressBookDialog.vue'
import AddContactDialog from '@/modules/send/components/AddContactDialog.vue'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose
} from '@/components/ui/dialog'

// Wallet connection
const { address: walletAddress, chainId } = useConnection()
const config = useConfig()
const { getChainInfo } = useChain()

// Native coin balance
const nativeBalance = ref<number>(0)
const nativeCurrencySymbol = computed(() => {
    const info = getChainInfo(chainId.value || 0)
    return info?.symbol || 'ETH'
})

// Fetch native coin balance
const fetchNativeBalance = async () => {
    if (!walletAddress.value) return
    try {
        const balance = await getBalance(config, {
            address: walletAddress.value as `0x${string}`,
        })
        nativeBalance.value = Number(balance.formatted)
    } catch (err) {
        console.error('Native balance fetch error:', err)
    }
}

// Watch for chain changes to update native balance
watch(chainId, () => {
    if (walletAddress.value) {
        fetchNativeBalance()
    }
})

// Store
const bridgeStore = useBridgeStore()

// State (use storeToRefs for reactive state only)
const {
    fromChain,
    toChain,
    fromToken,
    toToken,
    amount,
    bridgeFee,
    estimatedAmount,
    isLoading: loading,
    availableTokens,
    sourceChains
} = storeToRefs(bridgeStore)

// Getters (accessed directly on store, they're already computed)
const canBridge = computed(() => bridgeStore.canBridge)
const filteredSourceChains = computed(() => bridgeStore.filteredSourceChains)
const filteredDestChains = computed(() => bridgeStore.filteredDestChains)

// Actions (direct destructuring from store)
const { initiateBridge: bridgeAction } = bridgeStore

// Balance composable with reactive updates
const { walletBalance, formattedBalance, refreshBalance } = useBridgeBalance(
    () => fromChain.value?.id,
    () => fromToken.value
)

// Watch for wallet chain changes to sync fromChain and refresh WCH balance
watch(chainId, (newChainId) => {
    if (newChainId) {
        // Find the chain in sourceChains that matches the wallet's chain
        const matchingChain = sourceChains.value.find(c => c.id === newChainId)
        if (matchingChain && fromChain.value?.id !== newChainId) {
            bridgeStore.setFromChain(matchingChain)
        }
        // Refresh token balance for the new chain
        refreshBalance()
    }
})

// Local state for UI
const showFromChains = ref(false)
const showToChains = ref(false)
const showFromTokens = ref(false)
const fromChainDropdownRef = ref<HTMLElement | null>(null)
const toChainDropdownRef = ref<HTMLElement | null>(null)
const fromTokenDropdownRef = ref<HTMLElement | null>(null)
const fromTokenDropdownTrigger = ref<HTMLElement | null>(null)

// Address book state
const showAddressBook = ref(false)
const showAddContact = ref(false)
const addressBook = ref<Contact[]>([])
const addressBookSearch = ref('')
const destinationAddress = ref('')
const destinationName = ref('')

// Helper functions
const shortenAddress = (address: string | undefined) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const copyAddress = async (address: string | undefined) => {
    if (!address) return
    try {
        await navigator.clipboard.writeText(address)
        toast.success('Address copied to clipboard')
    } catch (error) {
        console.error('Copy failed:', error)
        toast.error('Failed to copy address')
    }
}

const selectContact = (contact: Contact) => {
    destinationAddress.value = contact.address
    destinationName.value = contact.name
    showAddressBook.value = false
}

// Watch destination address for matching contacts
watch(destinationAddress, (newAddr) => {
    if (!newAddr) {
        destinationName.value = ''
        return
    }
    const contact = addressBook.value.find(c => c.address.toLowerCase() === newAddr.toLowerCase())
    destinationName.value = contact?.name || ''
})

const saveContact = (newContactData: Contact) => {
    if (newContactData.name.trim() && newContactData.address.trim()) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(newContactData.address.trim())) {
            toast.error('Invalid wallet address format');
            return
        }

        if (!walletAddress.value) {
            toast.error('Please connect wallet first')
            return;
        }

        // Call backend
        addressBookService.addContact(walletAddress.value, {
            label: newContactData.name,
            wallet: newContactData.address,
            chain_id: chainId.value || 0
        }).then((newContact) => {
            addressBook.value.push(newContact)
            toast.success('Contact added successfully')
            showAddContact.value = false
        }).catch(err => {
            console.error(err)
            toast.error('Failed to save contact')
        })
    }
}

// Load address book on mount and set default destination to own address
onMounted(async () => {
    // Default destination to own wallet address
    if (walletAddress.value && !destinationAddress.value) {
        destinationAddress.value = walletAddress.value
    }

    // Fetch native balance
    fetchNativeBalance()

    if (walletAddress.value) {
        try {
            // Get all contacts (no chain filter for cross-chain bridge)
            const contacts = await addressBookService.getContacts(walletAddress.value)
            addressBook.value = contacts
        } catch (error) {
            console.error('Failed to load address book:', error)
        }
    }
})

// Two-way binding helper for amount
const amountModel = computed({
    get: () => {
        const val = amount.value
        if (!val) return ''
        const parts = val.split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return parts.join('.')
    },
    set: (val) => {
        const clean = val.replace(/,/g, '')
        if (clean === '' || /^\d*\.?\d*$/.test(clean)) {
            bridgeStore.setAmount(clean)
        }
    }
})

// Click outside
onClickOutside(fromChainDropdownRef, () => showFromChains.value = false)
onClickOutside(toChainDropdownRef, () => showToChains.value = false)
const closeTokenDropdown = (event: Event) => {
    const target = event.target as HTMLElement
    if (fromTokenDropdownTrigger.value && fromTokenDropdownTrigger.value.contains(target)) return
    showFromTokens.value = false
}
onClickOutside(fromTokenDropdownRef, closeTokenDropdown)

// Methods
const toggleFromChains = (e: MouseEvent) => {
    e.stopPropagation()
    showFromChains.value = !showFromChains.value
    if (showFromChains.value) showToChains.value = false
}

const toggleToChains = (e: MouseEvent) => {
    e.stopPropagation()
    showToChains.value = !showToChains.value
    if (showToChains.value) showFromChains.value = false
}

const selectFromChain = (chain: Chain, e: MouseEvent) => {
    e.stopPropagation()
    bridgeStore.setFromChain(chain)
    showFromChains.value = false

    // Check for network mismatch
    if (walletAddress.value && chainId.value && chain.id !== chainId.value) {
        toast.warning(`Please switch your wallet network to ${chain.name}`, {
            duration: 5000,
            action: {
                label: 'Dismiss',
                onClick: () => { }
            }
        })
    }
}

const selectToChain = (chain: Chain, e: MouseEvent) => {
    e.stopPropagation()
    bridgeStore.setToChain(chain)
    showToChains.value = false
}

const selectFromToken = (token: Token) => {
    bridgeStore.setFromToken(token)
    showFromTokens.value = false
}

const toggleFromTokens = (e: MouseEvent) => {
    e.stopPropagation()
    showFromTokens.value = !showFromTokens.value
}

const setAmountPercentage = (percent: number) => {
    const bal = walletBalance.value
    if (bal && !Number.isNaN(bal)) {
        bridgeStore.setAmount(((bal * percent) / 100).toFixed(2))
    }
}

const timeEstimate = computed(() => {
    if (!fromChain.value || !toChain.value) return '2-5 minutes'
    if (fromChain.value.id === toChain.value.id) return 'Instant'
    return fromChain.value.type === 'Layer 2' || toChain.value.type === 'Layer 2' ? '1-3 minutes' : '2-5 minutes'
})

// Dialog State
const showConfirmDialog = ref(false)

const initiateBridge = () => {
    // Check if network matches first
    if (fromChain.value && chainId.value && fromChain.value.id !== chainId.value) {
        toast.error(`Please switch network to ${fromChain.value.name} to continue`)
        return
    }
    showConfirmDialog.value = true
}

const confirmBridge = async () => {
    showConfirmDialog.value = false
    await bridgeAction()
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.2s ease-out;
    transform-origin: top;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: scaleY(0.95);
}
</style>
