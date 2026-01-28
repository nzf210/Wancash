<template>
    <div class="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">

            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Frequently Asked Questions
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                    Everything you need to know about Wancash (WCH)
                </p>
            </div>

            <!-- FAQ Sections -->
            <div class="space-y-8">
                <div v-for="section in faqData" :key="section.title"
                    class="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700/50">

                    <div :class="[section.color, 'px-6 py-4 border-b border-white/10']">
                        <h2 class="text-sm font-bold text-white tracking-wide uppercase">
                            {{ section.title }}
                        </h2>
                    </div>

                    <div class="p-6 space-y-4">
                        <details v-for="item in section.items" :key="item.q" class="group">
                            <summary
                                class="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-900">
                                <span class="pr-4">{{ item.q }}</span>
                                <svg class="w-5 h-5 text-blue-500 transition-transform duration-300 group-open:rotate-180 flex-shrink-0"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <div class="px-5 py-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm animate-in fade-in slide-in-from-top-2 duration-300"
                                v-html="item.a">
                            </div>
                        </details>
                    </div>
                </div>
            </div>

            <!-- Still Need Help? -->
            <div class="mt-16 text-center">
                <div
                    class="p-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                    <h3 class="text-2xl font-bold mb-4">Still have questions?</h3>
                    <p class="text-blue-50 mb-8 max-w-xl mx-auto opacity-90 leading-relaxed">
                        If you couldn't find the answer you were looking for, our support team is ready to assist you on
                        our Telegram community.
                    </p>
                    <a href="https://t.me/wancash_token" target="_blank"
                        class="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        <span>📱</span> Join Telegram Community
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSEO } from '@/utils/useSEO'

// SEO Configuration
useSEO({
    title: 'FAQ - Wancash (WCH)',
    description: 'Find answers to common questions about Wancash ecosystem, WCH tokenomics, utility, and security.',
    keywords: ['wancash faq', 'wch staking help', 'crypto vesting info', 'anti whale crypto', 'arbitrage bot rewards'],
    url: typeof window !== 'undefined' ? `${window.location.origin}/faq` : 'https://wancash.org/faq'
})

const faqData = [
    {
        title: "Token & Project Overview",
        color: "bg-yellow-600/90",
        items: [
            {
                q: "What is Wancash (WCH)?",
                a: "Wancash (WCH) is a utility-driven hybrid token designed for real ecosystem usage. It powers staking, arbitrage bot gas fees, and redemption within the Wancash platform.<br /><br /><strong>Designed for long-term growth through real utility, not speculation.</strong>"
            },
            {
                q: "Does WCH guarantee profits?",
                a: "No. WCH does not promise or guarantee profits. All ecosystem participation involves market, technical, and regulatory risks. Users should conduct their own research (DYOR)."
            },
            {
                q: "Which networks does WCH support?",
                a: "WCH is deployed across EVM-compatible networks including Arbitrum, Ethereum, BSC, and Polygon. Future expansion plans include Solana and SUI."
            }
        ]
    },
    {
        title: "Tokenomics & Supply Control",
        color: "bg-blue-600/90",
        items: [
            {
                q: "What is the total supply of WCH?",
                a: "The total supply of WCH is fixed at 999.99 million tokens. No additional minting is possible beyond this cap."
            },
            {
                q: "How does the vesting mechanism work?",
                a: "80% of the total supply is locked in a smart contract and distributed gradually over a 5-year period via monthly vesting. <br /><br />Vesting is enforced fully on-chain and publicly verifiable."
            },
            {
                q: "What does full vesting mean?",
                a: "Full vesting applies only to the current vesting cycle. Under normal conditions, only 60% of the scheduled vesting amount is released. <br /><br />If predefined price performance conditions are met, the vesting for that specific month may be released in full without affecting future vesting schedules."
            },
            {
                q: "Is there a burn mechanism?",
                a: "Yes. If the token price drops more than 20% compared to the previous monthly average, up to 50% of that month's vesting allocation may be permanently burned. <br /><br />This mechanism helps control inflation and protect long-term sustainability."
            }
        ]
    },
    {
        title: "Anti-Whale & Governance",
        color: "bg-purple-600/90",
        items: [
            {
                q: "Is there a maximum token holding per wallet?",
                a: "Yes. Each wallet is limited to holding a maximum of 5,000,000 WCH tokens. Any transaction that would exceed this limit is automatically rejected at the smart contract level."
            },
            {
                q: "Are any wallets excluded from this limit?",
                a: "Yes. Certain addresses such as liquidity pools, treasury wallets, and ecosystem contracts are whitelisted. <br /><br />All exclusions are explicitly defined in the open-source smart contract and governed via multisig or governance mechanisms."
            },
            {
                q: "Is the smart contract open source?",
                a: "Yes. All core Wancash smart contracts are open source and publicly verifiable. Contract addresses are published on the dashboard and whitepaper."
            }
        ]
    },
    {
        title: "Staking & Revenue",
        color: "bg-green-600/90",
        items: [
            {
                q: "What is staking in Wancash?",
                a: "Staking allows users to lock WCH tokens to support the ecosystem and earn protocol-based rewards derived from platform activity."
            },
            {
                q: "Where does staking revenue come from?",
                a: "Revenue is generated primarily from gas fees paid in WCH by users of the Wancash arbitrage bot platform. <br /><br />Future offline business integrations may contribute additional revenue and token buyback mechanisms."
            }
        ]
    },
    {
        title: "Security & Risk",
        color: "bg-red-600/90",
        items: [
            {
                q: "Are the smart contracts audited?",
                a: "Security audits are planned and conducted by independent third parties. Audit reports will be published transparently once completed."
            },
            {
                q: "Is Wancash custodial?",
                a: "No. Wancash is fully non-custodial. The platform never accesses user private keys or seed phrases."
            },
            {
                q: "What are the main risks?",
                a: "Risks include smart contract vulnerabilities, market volatility, and regulatory uncertainty depending on jurisdiction."
            }
        ]
    }
]
</script>

<style scoped>
details summary::-webkit-details-marker {
    display: none;
}
</style>
