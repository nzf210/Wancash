<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">

            <!-- Hero Section -->
            <div class="text-center mb-16">
                <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">About Wancash</h1>
                <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Building the future of decentralized finance through innovative cross-chain staking solutions
                </p>
            </div>

            <!-- Vision & Mission -->
            <div class="grid md:grid-cols-2 gap-8 mb-16">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <div class="flex items-center mb-4">
                        <div
                            class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                </path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        To become a leading multi-chain DeFi platform that empowers users worldwide to participate in
                        decentralized finance through secure, efficient, and user-friendly staking and reward
                        mechanisms.
                    </p>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <div class="flex items-center mb-4">
                        <div
                            class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        To provide accessible, transparent, and secure DeFi solutions that bridge multiple blockchain
                        networks,
                        enabling seamless asset management and maximizing returns for our community.
                    </p>
                </div>
            </div>

            <!-- Key Features -->
            <div class="mb-16">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">What We Offer</h2>
                <div class="grid md:grid-cols-3 gap-6">

                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                        <div
                            class="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                </path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Token Staking</h3>
                        <p class="text-gray-600 dark:text-gray-400">
                            Stake your WCH tokens to earn competitive rewards while supporting the network's security
                            and growth.
                        </p>
                    </div>

                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                        <div
                            class="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cross-Chain Bridge</h3>
                        <p class="text-gray-600 dark:text-gray-400">
                            Seamlessly transfer assets across multiple blockchain networks using LayerZero V2
                            technology.
                        </p>
                    </div>

                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                        <div
                            class="w-14 h-14 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7">
                                </path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Reward Redemption</h3>
                        <p class="text-gray-600 dark:text-gray-400">
                            Exchange your earned points for exclusive rewards and products from our curated marketplace.
                        </p>
                    </div>

                </div>
            </div>

            <!-- Technology Stack -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-16">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Technology</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    Wancash is built on cutting-edge blockchain technology, ensuring security, scalability, and
                    interoperability:
                </p>

                <div class="grid md:grid-cols-2 gap-6">
                    <div class="border-l-4 border-blue-500 pl-4">
                        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Smart Contracts</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">
                            Solidity-based smart contracts with comprehensive security audits and testing
                        </p>
                    </div>

                    <div class="border-l-4 border-green-500 pl-4">
                        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">LayerZero V2</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">
                            Next-generation cross-chain messaging protocol for seamless interoperability
                        </p>
                    </div>

                    <div class="border-l-4 border-purple-500 pl-4">
                        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Multi-Chain Support</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">
                            Compatible with Ethereum, BSC, Avalanche, Arbitrum, and more
                        </p>
                    </div>

                    <div class="border-l-4 border-yellow-500 pl-4">
                        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Decentralized Architecture</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">
                            Non-custodial platform ensuring users maintain full control of their assets
                        </p>
                    </div>
                </div>
            </div>

            <!-- Community -->
            <div class="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-12">
                <h2 class="text-3xl font-bold text-white mb-4">Join Our Community</h2>
                <p class="text-blue-100 mb-8 max-w-2xl mx-auto">
                    Be part of a growing community of DeFi enthusiasts, developers, and innovators shaping the future of
                    finance.
                </p>
                <div class="flex justify-center gap-4 flex-wrap">
                    <a href="#"
                        class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                        Twitter
                    </a>
                    <a href="#"
                        class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                        Telegram
                    </a>
                    <a href="#"
                        class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                        Discord
                    </a>
                    <a href="#"
                        class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                        GitHub
                    </a>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { useSEO } from '@/utils/useSEO'

// SEO Configuration
useSEO({
    title: 'About Wancash - Our Vision & Mission',
    description: 'Learn about Wancash\'s mission to provide accessible, transparent, and secure DeFi solutions that bridge multiple blockchain networks. Built on LayerZero V2 for seamless cross-chain transfers.',
    keywords: ['about wancash', 'defi platform', 'cross-chain technology', 'layerzero', 'blockchain', 'crypto staking'],
    url: typeof window !== 'undefined' ? `${window.location.origin}/about` : 'https://wancash.org/about'
})
</script>
