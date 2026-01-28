<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <!-- Background Animation Blobs (similar to dashboard) -->
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40">
            <div class="absolute top-[10%] left-[5%] w-72 h-72 bg-purple-400 rounded-full blur-[120px] animate-pulse">
            </div>
            <div class="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-400 rounded-full blur-[150px] animate-pulse"
                style="animation-delay: 2s"></div>
        </div>

        <div class="max-w-5xl mx-auto relative z-10">
            <!-- Hero Header -->
            <div class="text-center mb-16">
                <div
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold mb-4 border border-purple-200 dark:border-purple-800">
                    <span>🟢</span> WCH ECOSYSTEM
                </div>
                <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                    About <span
                        class="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Wancash</span>
                </h1>
                <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Building a sustainable blockchain ecosystem powered by real utility and asset-backed stability.
                </p>
            </div>

            <!-- Core Vision Card -->
            <div
                class="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700/50 mb-12">
                <div class="flex flex-col md:flex-row gap-8 items-start">
                    <div
                        class="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                        <WancashIcon class-name="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">The WCH Vision</h2>
                        <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                            Wancash is a blockchain-based project focused on building a sustainable ecosystem powered by
                            real utility, with WCH serving as the core token that drives all activities within the
                            platform.
                        </p>
                        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Unlike speculative tokens that rely solely on price movement, WCH is designed as a hybrid
                            utility token with direct operational use cases, including serving as the gas fee for the
                            Wancash arbitrage bot platform, a staking instrument, and the official medium of exchange
                            for products and services within the Wancash redeem system.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Asset Backing Section -->
            <div class="grid md:grid-cols-2 gap-8 mb-12">
                <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 text-white shadow-xl">
                    <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                        <span class="text-2xl">💰</span>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">Real Assets, Real Value</h3>
                    <p class="text-amber-50 leading-relaxed">
                        The Wancash ecosystem integrates both on-chain and offline activities, where a portion of
                        project revenue is allocated to strengthen real-world asset backing in the form of <span
                            class="font-bold underline">gold reserves</span>.
                    </p>
                    <p class="mt-4 text-amber-100 text-sm italic">
                        This approach aims to establish a more stable value foundation and support long-term
                        sustainability.
                    </p>
                </div>

                <div
                    class="bg-gray-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-gray-800">
                    <div class="absolute -right-8 -bottom-8 opacity-10">
                        <WancashIcon class-name="w-48 h-48" />
                    </div>
                    <div
                        class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 border border-purple-500/30">
                        <span class="text-2xl">🌍</span>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">Multi-Chain Vision</h3>
                    <p class="text-gray-400 leading-relaxed">
                        WCH is developed with a multi-chain and cross-ecosystem vision, starting with EVM-compatible
                        networks and planned expansion to non-EVM networks such as <span
                            class="text-blue-400 font-bold">Solana</span> and <span
                            class="text-purple-400 font-bold">SUI</span>.
                    </p>
                </div>
            </div>

            <!-- Revenue Allocation Section -->
            <div class="mb-12">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Disciplined Allocation
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        class="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                        <div class="text-4xl font-black text-amber-500 mb-2">40%</div>
                        <div class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4">Gold
                            Reserves</div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Strengthening the physical asset foundation
                            of the token value.</p>
                    </div>
                    <div
                        class="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                        <div class="text-4xl font-black text-blue-500 mb-2">40%</div>
                        <div class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4">
                            Operations</div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Funding continuous platform development and
                            ecosystem growth.</p>
                    </div>
                    <div
                        class="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                        <div class="text-4xl font-black text-green-500 mb-2">20%</div>
                        <div class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4">
                            Buyback</div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Token buybacks and liquidity provision to
                            enhance market stability.</p>
                    </div>
                </div>
            </div>

            <!-- Commitment Section -->
            <div
                class="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 md:p-12 text-white border border-gray-800">
                <div class="max-w-3xl">
                    <h2 class="text-2xl md:text-3xl font-bold mb-6">Our Commitment</h2>
                    <p class="text-gray-400 leading-relaxed mb-6">
                        Through the implementation of <span class="text-white font-medium">anti-whale mechanisms</span>,
                        <span class="text-white font-medium">adaptive vesting</span>, and <span
                            class="text-white font-medium">open-source smart contracts</span>, Wancash is committed to
                        building a fair, transparent, and publicly verifiable ecosystem.
                    </p>
                    <div class="flex items-center gap-6">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-green-500"></span>
                            <span class="text-xs font-bold uppercase tracking-wider">Fair Launch</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span class="text-xs font-bold uppercase tracking-wider">Verified Code</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                            <span class="text-xs font-bold uppercase tracking-wider">Audited</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Community CTA -->
            <div class="mt-16 text-center">
                <p class="text-gray-500 dark:text-gray-400 mb-6 font-medium tracking-wide uppercase text-xs">Join the
                    Community</p>
                <div class="flex justify-center gap-4">
                    <a href="https://t.me/wancash_token" target="_blank"
                        class="w-12 h-12 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-all">
                        <span class="text-lg">📱</span>
                    </a>
                    <a href="https://twitter.com/Wancash_token" target="_blank"
                        class="w-12 h-12 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-all">
                        <span class="text-lg">🐦</span>
                    </a>
                    <a href="https://wancash.org" target="_blank"
                        class="w-12 h-12 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-all">
                        <span class="text-lg">🌐</span>
                    </a>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { useSEO } from '@/utils/useSEO'
import WancashIcon from '@/components/icons/WancashIcon.vue'

// SEO Configuration
useSEO({
    title: 'About Wancash (WCH) - Sustainable Utility Ecosystem',
    description: 'Wancash is a hybrid utility ecosystem powered by WCH, featuring gold-backed reserves, arbitrage bots, and a sustainable 40/40/20 revenue model.',
    keywords: ['about wancash', 'wch token', 'hybrid utility token', 'gold backed crypto', 'arbitrage bot fuel', 'sustainable defi'],
    url: typeof window !== 'undefined' ? `${window.location.origin}/about` : 'https://wancash.org/about'
})
</script>
