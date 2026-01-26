<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
                <p class="text-gray-600 dark:text-gray-400">Last updated: January 17, 2026</p>
            </div>

            <!-- Content -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 prose dark:prose-invert max-w-none">

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Welcome to Wancash. By accessing or using our services, you agree to be bound by these Terms of
                        Service.
                        Please read these terms carefully before using the platform.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Eligibility</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        You must be at least 18 years old to use Wancash services. By using this platform, you represent
                        and warrant that:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                        <li>You are of legal age in your jurisdiction</li>
                        <li>You have the legal capacity to enter into these terms</li>
                        <li>You are not prohibited from using our services under applicable laws</li>
                        <li>You comply with all local laws regarding online conduct and acceptable content</li>
                    </ul>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Services Description</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        Wancash provides decentralized finance (DeFi) services including but not limited to:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                        <li>Token staking and yield generation</li>
                        <li>Cross-chain token bridging via LayerZero protocol</li>
                        <li>Reward redemption services</li>
                        <li>Wallet integration and management</li>
                    </ul>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. User Obligations</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        When using Wancash, you agree to:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                        <li>Maintain the security of your wallet and private keys</li>
                        <li>Not use the service for any illegal or unauthorized purpose</li>
                        <li>Provide accurate and complete information when required</li>
                        <li>Comply with all applicable laws and regulations</li>
                        <li>Not attempt to interfere with or disrupt the service</li>
                    </ul>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Risks and Disclaimers</h2>
                    <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
                        <p class="text-yellow-800 dark:text-yellow-200 font-semibold">⚠️ Important Risk Notice</p>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        Cryptocurrency and DeFi activities involve significant risks including but not limited to:
                    </p>
                    <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                        <li>Smart contract vulnerabilities and potential exploits</li>
                        <li>Price volatility and potential loss of funds</li>
                        <li>Network congestion and transaction failures</li>
                        <li>Regulatory changes affecting service availability</li>
                        <li>Irreversible transactions on blockchain networks</li>
                    </ul>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Limitation of Liability
                    </h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        To the maximum extent permitted by law, Wancash and its affiliates shall not be liable for any
                        indirect,
                        incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
                        whether incurred
                        directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting
                        from your
                        use of the service.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Modifications to Service
                    </h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        We reserve the right to modify, suspend, or discontinue any part of the service at any time
                        without prior notice.
                        We will not be liable to you or any third party for any modification, suspension, or
                        discontinuance of the service.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Governing Law</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        These Terms shall be governed by and construed in accordance with applicable laws. Any disputes
                        arising from
                        these terms shall be resolved through binding arbitration in accordance with international
                        arbitration rules.
                    </p>
                </section>

                <section class="mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Contact Information</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        If you have any questions about these Terms of Service, please contact us through our
                        <router-link to="/support" class="text-blue-600 dark:text-blue-400 hover:underline">support
                            page</router-link>.
                    </p>
                </section>

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// No reactive state needed for this static page
</script>
