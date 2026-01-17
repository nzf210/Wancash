<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">

            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
                <p class="text-gray-600 dark:text-gray-400">Find answers to common questions about Wancash</p>
            </div>

            <!-- FAQ Categories -->
            <div class="space-y-6">

                <!-- Staking FAQs -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div class="bg-blue-600 px-6 py-4">
                        <h2 class="text-xl font-semibold text-white">Staking</h2>
                    </div>
                    <div class="p-6 space-y-4">

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>What is staking and how does it work?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                Staking involves locking your WCH tokens in a smart contract to support network
                                operations and earn rewards.
                                When you stake, you receive stWCH tokens representing your staked position. Rewards are
                                accumulated automatically
                                and can be claimed at any time.
                            </div>
                        </details>

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>What is the minimum staking amount?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                There is no minimum staking amount. You can stake any amount of WCH tokens you own.
                                However, please consider
                                gas fees when staking small amounts.
                            </div>
                        </details>

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>Can I unstake my tokens anytime?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                Yes, you can unstake your tokens at any time. Simply initiate an unstake request and
                                your WCH tokens will
                                be returned to your wallet. Note that there may be a cooldown period depending on the
                                staking pool parameters.
                            </div>
                        </details>

                    </div>
                </div>

                <!-- Bridge FAQs -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div class="bg-green-600 px-6 py-4">
                        <h2 class="text-xl font-semibold text-white">Cross-Chain Bridge</h2>
                    </div>
                    <div class="p-6 space-y-4">

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>Which chains are supported for bridging?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                Currently, Wancash supports bridging between Ethereum, BSC (Binance Smart Chain),
                                Avalanche, and Arbitrum.
                                We're constantly working to add support for more blockchain networks.
                            </div>
                        </details>

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>How long does a bridge transaction take?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                Bridge transactions typically take 5-15 minutes to complete, depending on network
                                congestion and block confirmation
                                times. You can track your transaction status on the dashboard or via LayerZero Scan.
                            </div>
                        </details>

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>What are the fees for bridging?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                Bridge fees consist of gas fees on both source and destination chains, plus a small
                                LayerZero messaging fee.
                                The exact amount varies based on network conditions. You'll see the estimated fee before
                                confirming your transaction.
                            </div>
                        </details>

                    </div>
                </div>

                <!-- Redemption FAQs -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div class="bg-purple-600 px-6 py-4">
                        <h2 class="text-xl font-semibold text-white">Reward Redemption</h2>
                    </div>
                    <div class="p-6 space-y-4">

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>How do I earn redemption points?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                You earn points by staking WCH tokens. Points accumulate based on the amount staked and
                                duration. Additional
                                points may be earned through special promotions and community activities.
                            </div>
                        </details>

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>How long does redemption processing take?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                Redemption requests are typically processed within 3-7 business days. You'll receive
                                email notifications
                                at each stage: pending, processing, shipped (if applicable), and completed.
                            </div>
                        </details>

                    </div>
                </div>

                <!-- Security FAQs -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div class="bg-red-600 px-6 py-4">
                        <h2 class="text-xl font-semibold text-white">Security</h2>
                    </div>
                    <div class="p-6 space-y-4">

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>Are the smart contracts audited?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                Yes, our smart contracts undergo comprehensive security audits by reputable third-party
                                firms. We also
                                maintain an active bug bounty program to ensure ongoing security.
                            </div>
                        </details>

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>Do you store my private keys?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                No, Wancash is a non-custodial platform. We never have access to your private keys or
                                seed phrases. You
                                maintain full control of your assets at all times through your own wallet.
                            </div>
                        </details>

                    </div>
                </div>

                <!-- General FAQs -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div class="bg-gray-600 px-6 py-4">
                        <h2 class="text-xl font-semibold text-white">General</h2>
                    </div>
                    <div class="p-6 space-y-4">

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>Which wallets are supported?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                Wancash supports all major Web3 wallets including MetaMask, Trust Wallet, Coinbase
                                Wallet, and any wallet
                                compatible with WalletConnect protocol.
                            </div>
                        </details>

                        <details class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                <span>How can I get help or report issues?</span>
                                <svg class="w-5 h-5 transition group-open:rotate-180" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </summary>
                            <div class="p-4 text-gray-700 dark:text-gray-300">
                                You can reach our support team through the
                                <router-link to="/support"
                                    class="text-blue-600 dark:text-blue-400 hover:underline font-semibold">support
                                    page</router-link>,
                                join our Telegram community, or email us directly. We're here to help!
                            </div>
                        </details>

                    </div>
                </div>

            </div>

            <!-- Still have questions? -->
            <div class="mt-12 text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Still have questions?</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Can't find the answer you're looking for? Our support team is ready to help.
                </p>
                <router-link to="/support"
                    class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition">
                    Contact Support
                </router-link>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
// No reactive state needed for this static page
</script>

<style scoped>
details summary::-webkit-details-marker {
    display: none;
}
</style>
