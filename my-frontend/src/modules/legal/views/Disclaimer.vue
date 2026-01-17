<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Disclaimer</h1>
                <p class="text-gray-600 dark:text-gray-400">Important Information and Risk Warnings</p>
            </div>

            <!-- Alert Banner -->
            <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 mb-8">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">High Risk Warning</h3>
                        <p class="mt-2 text-red-700 dark:text-red-300">
                            Cryptocurrency and DeFi investments carry significant risks. Only invest what you can afford
                            to lose.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 prose dark:prose-invert max-w-none">

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Not Financial Advice</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        The information provided on this platform is for informational purposes only and does not
                        constitute financial,
                        investment, trading, or any other type of professional advice. You should not rely on this
                        information as a
                        substitute for professional financial advice. Always consult with a qualified financial advisor
                        before making
                        any investment decisions.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Investment Risks</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        By using Wancash services, you acknowledge and accept the following risks:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                        <li><strong>Market Volatility:</strong> Cryptocurrency prices can fluctuate dramatically in
                            short periods</li>
                        <li><strong>Loss of Funds:</strong> You may lose some or all of your invested capital</li>
                        <li><strong>Smart Contract Risks:</strong> Bugs or vulnerabilities may lead to loss of funds
                        </li>
                        <li><strong>Impermanent Loss:</strong> Providing liquidity may result in losses compared to
                            holding</li>
                        <li><strong>Regulatory Risks:</strong> Changes in laws may affect platform availability or
                            functionality</li>
                    </ul>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Smart Contract Risks</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        While our smart contracts have been developed with security in mind, we cannot guarantee they
                        are bug-free or
                        immune to exploits. Smart contracts operate on blockchain networks and once deployed, their code
                        cannot be
                        modified. Users interact with smart contracts at their own risk.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. No Guaranteed Returns</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Any yields, APY (Annual Percentage Yield), or rewards shown on the platform are estimates based
                        on current
                        conditions and past performance. They are not guaranteed and may change at any time without
                        notice. Past
                        performance is not indicative of future results.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Cross-Chain Bridge Risks
                    </h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        When using cross-chain bridging services:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                        <li>Transactions may be delayed due to network congestion</li>
                        <li>Bridge protocols may have their own risks and vulnerabilities</li>
                        <li>Gas fees can be high and unpredictable</li>
                        <li>Transactions are irreversible once confirmed on the blockchain</li>
                    </ul>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Regulatory Uncertainty</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        The regulatory environment for cryptocurrencies and DeFi is evolving and uncertain. Laws and
                        regulations
                        applicable to blockchain technology, cryptocurrencies, and DeFi services may change, which could
                        affect your
                        ability to use our services or the value of your holdings.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Tax Obligations</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        You are solely responsible for determining what taxes, if any, apply to your transactions and
                        for reporting
                        and remitting the correct taxes to the appropriate tax authorities. Wancash is not responsible
                        for determining
                        or reporting any taxes that may apply to your use of the platform.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Platform Availability</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        We do not guarantee that the platform will be available at all times or that it will function
                        without
                        disruptions, delays, or errors. The platform may be unavailable due to maintenance, upgrades,
                        network issues,
                        or unforeseen circumstances.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Third-Party Services</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Our platform integrates with various third-party services including wallet providers, blockchain
                        networks,
                        and data providers. We are not responsible for the performance, security, or availability of
                        these third-party
                        services.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. User Responsibility</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        You are responsible for:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                        <li>Maintaining the security of your wallet and private keys</li>
                        <li>Verifying transaction details before confirming</li>
                        <li>Understanding the risks involved in DeFi activities</li>
                        <li>Complying with all applicable laws and regulations</li>
                        <li>Conducting your own research before making investment decisions</li>
                    </ul>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. No Warranties</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        The platform is provided "as is" and "as available" without any warranties of any kind, either
                        express or
                        implied. We disclaim all warranties, including but not limited to, implied warranties of
                        merchantability,
                        fitness for a particular purpose, and non-infringement.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Limitation of Liability
                    </h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        To the maximum extent permitted by law, Wancash and its affiliates shall not be liable for any
                        direct,
                        indirect, incidental, special, consequential, or exemplary damages arising from your use of the
                        platform,
                        including but not limited to loss of profits, data, or goodwill.
                    </p>
                </section>

                <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mt-8">
                    <p class="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        By using Wancash services, you acknowledge that you have read, understood, and agree to this
                        Disclaimer.
                    </p>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">
                        If you have questions, please contact us through our
                        <router-link to="/support" class="text-blue-600 dark:text-blue-400 hover:underline">support
                            page</router-link>.
                    </p>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// No reactive state needed for this static page
</script>
