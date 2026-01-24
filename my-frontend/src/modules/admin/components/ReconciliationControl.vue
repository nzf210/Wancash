<template>
    <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Reconciliation Control</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
                Manually trigger reconciliation processes or monitor their status.
                Automated reconciliation runs every 5 minutes.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Redemption Reconciliation -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <span class="text-2xl">🎁</span>
                            <h3 class="font-medium text-gray-900 dark:text-white">Redemption Payments</h3>
                        </div>
                        <span v-if="redemptionStatus" :class="{
                            'bg-green-100 text-green-800': redemptionStatus === 'success',
                            'bg-red-100 text-red-800': redemptionStatus === 'error',
                            'bg-blue-100 text-blue-800': redemptionStatus === 'running'
                        }" class="px-2 py-1 rounded-full text-xs font-semibold">
                            {{ redemptionStatus.toUpperCase() }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 mb-4">
                        Verifies pending redemption payments against blockchain transactions.
                    </p>
                    <button @click="runRedemptionReconciliation" :disabled="redemptionStatus === 'running'"
                        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                        <svg v-if="redemptionStatus === 'running'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ redemptionStatus === 'running' ? 'Running...' : 'Run Reconciliation' }}
                    </button>
                    <div v-if="redemptionResult" class="mt-4 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                        <p>✅ Verified: {{ redemptionResult.verified }}</p>
                        <p>❌ Failed: {{ redemptionResult.failed }}</p>
                        <p>⏩ Skipped: {{ redemptionResult.skipped }}</p>
                    </div>
                </div>

                <!-- History Reconciliation -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <span class="text-2xl">📜</span>
                            <h3 class="font-medium text-gray-900 dark:text-white">Transaction History</h3>
                        </div>
                        <span v-if="historyStatus" :class="{
                            'bg-green-100 text-green-800': historyStatus === 'success',
                            'bg-red-100 text-red-800': historyStatus === 'error',
                            'bg-blue-100 text-blue-800': historyStatus === 'running'
                        }" class="px-2 py-1 rounded-full text-xs font-semibold">
                            {{ historyStatus.toUpperCase() }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 mb-4">
                        Verifies general transaction history statuses (Send/Bridge).
                    </p>
                    <button @click="runHistoryReconciliation" :disabled="historyStatus === 'running'"
                        class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                        <svg v-if="historyStatus === 'running'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ historyStatus === 'running' ? 'Running...' : 'Run Reconciliation' }}
                    </button>
                    <div v-if="historyResult" class="mt-4 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                        <p>✅ Verified: {{ historyResult.verified }}</p>
                        <p>❌ Failed: {{ historyResult.failed }}</p>
                        <p>⏩ Skipped: {{ historyResult.skipped }}</p>
                    </div>
                </div>

                <!-- Treasury Sweep (Orphaned Payments) -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <span class="text-2xl">🧹</span>
                            <h3 class="font-medium text-gray-900 dark:text-white">Treasury Sweep</h3>
                        </div>
                        <span v-if="scanStatus" :class="{
                            'bg-green-100 text-green-800': scanStatus === 'success',
                            'bg-red-100 text-red-800': scanStatus === 'error',
                            'bg-blue-100 text-blue-800': scanStatus === 'running'
                        }" class="px-2 py-1 rounded-full text-xs font-semibold">
                            {{ scanStatus.toUpperCase() }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 mb-4">
                        Scans Treasury wallet for unrecorded payments (Orphans).
                    </p>
                    <div class="mb-4">
                        <select v-model="selectedChainId"
                            class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                            <option :value="null">All Chains (Bulk Scan)</option>
                            <option :value="1">Ethereum (1)</option>
                            <option :value="56">BSC (56)</option>
                            <option :value="137">Polygon (137)</option>
                            <option :value="43114">Avalanche (43114)</option>
                            <option :value="42161">Arbitrum (42161)</option>
                            <option :value="11155111">Sepolia (11155111)</option>
                            <option :value="97">BSC Testnet (97)</option>
                            <option :value="80002">Amoy (80002)</option>
                            <option :value="43113">Fuji (43113)</option>
                            <option :value="421614">Arb Sepolia (421614)</option>
                        </select>
                    </div>
                    <button @click="runTreasuryScan" :disabled="scanStatus === 'running'"
                        class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                        <svg v-if="scanStatus === 'running'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ scanStatus === 'running' ? 'Scanning...' : 'Scan Treasury' }}
                    </button>
                    <div v-if="scanResult" class="mt-4 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                        <p>🧹 New Orphans Found: {{ scanResult.newOrphans }}</p>
                    </div>
                </div>

                <!-- Global Token Scan (New) -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <span class="text-2xl">🌍</span>
                            <h3 class="font-medium text-gray-900 dark:text-white">Global WCH Scan</h3>
                        </div>
                        <span v-if="globalScanStatus" :class="{
                            'bg-green-100 text-green-800': globalScanStatus === 'success',
                            'bg-red-100 text-red-800': globalScanStatus === 'error',
                            'bg-blue-100 text-blue-800': globalScanStatus === 'running'
                        }" class="px-2 py-1 rounded-full text-xs font-semibold">
                            {{ globalScanStatus.toUpperCase() }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 mb-4">
                        Scans ALL WCH token transfers on-chain. Auto-imports missing transactions.
                    </p>
                    <div class="mb-4">
                        <select v-model="selectedGlobalInternalChainId"
                            class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                            <option :value="null">All Chains (Bulk Scan)</option>
                            <option :value="1">Ethereum (1)</option>
                            <option :value="56">BSC (56)</option>
                            <option :value="137">Polygon (137)</option>
                            <option :value="43114">Avalanche (43114)</option>
                            <option :value="42161">Arbitrum (42161)</option>
                            <option :value="11155111">Sepolia (11155111)</option>
                            <option :value="97">BSC Testnet (97)</option>
                            <option :value="80002">Amoy (80002)</option>
                            <option :value="43113">Fuji (43113)</option>
                            <option :value="421614">Arb Sepolia (421614)</option>
                        </select>
                    </div>
                    <button @click="runGlobalScan" :disabled="globalScanStatus === 'running'"
                        class="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                        <svg v-if="globalScanStatus === 'running'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ globalScanStatus === 'running' ? 'Scanning...' : 'Run Global Scan' }}
                    </button>
                    <div v-if="globalScanResult" class="mt-4 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded space-y-1">
                        <p class="font-medium text-gray-900 dark:text-white">🔎 Scan Results:</p>
                        <div class="grid grid-cols-2 gap-2 mt-2">
                            <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                <span class="block text-xs text-blue-600 dark:text-blue-400">Found</span>
                                <span class="text-lg font-bold text-blue-800 dark:text-blue-200">{{
                                    globalScanResult.totalFound }}</span>
                            </div>
                            <div class="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                <span class="block text-xs text-green-600 dark:text-green-400">Matched</span>
                                <span class="text-lg font-bold text-green-800 dark:text-green-200">{{
                                    globalScanResult.matched }}</span>
                            </div>
                            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                                <span class="block text-xs text-yellow-600 dark:text-yellow-400">Orphans</span>
                                <span class="text-lg font-bold text-yellow-800 dark:text-yellow-200">{{
                                    globalScanResult.orphans }}</span>
                            </div>
                            <div class="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                                <span class="block text-xs text-purple-600 dark:text-purple-400">Imported</span>
                                <span class="text-lg font-bold text-purple-800 dark:text-purple-200">{{
                                    globalScanResult.imported }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Missing Hash Audit (New) -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-2">
                            <span class="text-2xl">🕵️</span>
                            <h3 class="font-medium text-gray-900 dark:text-white">Missing Hash Audit</h3>
                        </div>
                        <span v-if="auditStatus" :class="{
                            'bg-green-100 text-green-800': auditStatus === 'success',
                            'bg-red-100 text-red-800': auditStatus === 'error',
                            'bg-blue-100 text-blue-800': auditStatus === 'running'
                        }" class="px-2 py-1 rounded-full text-xs font-semibold">
                            {{ auditStatus.toUpperCase() }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 mb-4">
                        Identify records missing transaction hashes.
                    </p>
                    <button @click="runHashAudit" :disabled="auditStatus === 'running'"
                        class="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                        <svg v-if="auditStatus === 'running'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ auditStatus === 'running' ? 'Scanning...' : 'Run Audit' }}
                    </button>
                    <div v-if="auditResult"
                        class="mt-4 text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded max-h-60 overflow-y-auto space-y-3">

                        <!-- History Audit Results -->
                        <div v-if="Object.keys(auditResult.history || {}).length > 0">
                            <p class="font-bold text-gray-800 dark:text-gray-200 mb-1">Transaction History (Missing
                                Hash)</p>
                            <div v-for="(rows, chainId) in auditResult.history" :key="'hist-' + chainId" class="mb-2">
                                <span class="text-orange-600 dark:text-orange-400 font-semibold">Chain {{ chainId }}:
                                    {{ rows.length }} records</span>
                                <div class="pl-2 mt-1 space-y-0.5">
                                    <div v-for="row in rows.slice(0, 5)" :key="row.id"
                                        class="text-gray-500 dark:text-gray-400 truncate">
                                        ID: <span class="font-mono">{{ row.id }}</span>
                                    </div>
                                    <div v-if="rows.length > 5" class="text-gray-400 italic">
                                        ...and {{ rows.length - 5 }} more
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-green-600 dark:text-green-400">
                            ✓ No missing hashes in Transaction History
                        </div>

                        <!-- Redemption Audit Results -->
                        <div v-if="Object.keys(auditResult.redemptions || {}).length > 0">
                            <p class="font-bold text-gray-800 dark:text-gray-200 mt-3 mb-1">Redemptions (Missing
                                Hash)</p>
                            <div v-for="(rows, chainId) in auditResult.redemptions" :key="'redem-' + chainId"
                                class="mb-2">
                                <span class="text-orange-600 dark:text-orange-400 font-semibold">Chain {{ chainId }}:
                                    {{ rows.length }} records</span>
                                <div class="pl-2 mt-1 space-y-0.5">
                                    <div v-for="row in rows.slice(0, 5)" :key="row.id"
                                        class="text-gray-500 dark:text-gray-400 truncate">
                                        ID: <span class="font-mono">{{ row.id }}</span> ({{ row.status }})
                                    </div>
                                    <div v-if="rows.length > 5" class="text-gray-400 italic">
                                        ...and {{ rows.length - 5 }} more
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-green-600 dark:text-green-400 mt-3">
                            ✓ No missing hashes in Redemptions
                        </div>
                    </div>
                </div>
            </div>

            <!-- Orphans List -->
            <div v-if="orphans.length > 0" class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Unclaimed Payments (Orphans: {{
                    orphans.length }})</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                                <th
                                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date</th>
                                <th
                                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chain</th>
                                <th
                                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sender</th>
                                <th
                                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount</th>
                                <th
                                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hash</th>
                                <th
                                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status</th>
                                <th
                                    class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-for="orphan in orphans" :key="orphan.id">
                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                    {{ new Date(orphan.detected_at).toLocaleString() }}
                                </td>
                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ orphan.chain_id }}</td>
                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 font-mono">{{
                                    orphan.sender_address }}</td>
                                <td
                                    class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-bold">
                                    {{ orphan.amount }}</td>
                                <td class="px-3 py-2 whitespace-nowrap text-sm text-blue-500">
                                    <a :href="getChainExplorerUrl(orphan.chain_id, orphan.transaction_hash)"
                                        target="_blank" title="View on Explorer" class="hover:underline">{{
                                            orphan.transaction_hash.substring(0, 10) }}...</a>
                                </td>
                                <td class="px-3 py-2 whitespace-nowrap">
                                    <span
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        {{ orphan.status }}
                                    </span>
                                </td>
                                <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                    <button @click="openMergeModal(orphan)"
                                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                        Merge
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Merge Modal (Themed & Clean) -->
    <!-- Merge Modal (Foolproof Centering) -->
    <div v-if="showMergeModal" class="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title"
        role="dialog" aria-modal="true">
        <!-- Flex Container for Centering -->
        <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">

            <!-- Overlay -->
            <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="closeResolveModal"></div>

            <!-- Modal Panel -->
            <div
                class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200 dark:border-gray-700">

                <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                            <span class="text-blue-600 dark:text-blue-300 text-xl">🔗</span>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white" id="modal-title">
                                Resolve Orphaned Payment
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Payment Amount: <strong class="text-gray-900 dark:text-white">{{
                                        selectedOrphan?.amount }} WCH</strong><br>
                                    Sender: <span class="font-mono text-xs">{{ selectedOrphan?.sender_address
                                    }}</span>
                                </p>

                                <!-- Action Type Selection -->
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Action Type
                                    </label>
                                    <div class="flex space-x-2">
                                        <button v-for="type in resolveTypes" :key="type.id"
                                            @click="resolveType = type.id" :class="[
                                                resolveType === type.id
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600',
                                                'flex-1 py-2 px-2 border rounded-md text-xs font-medium focus:outline-none transition-colors'
                                            ]">
                                            {{ type.label }}
                                        </button>
                                    </div>
                                </div>

                                <!-- Dynamic Form -->
                                <div v-if="resolveType === 'merge_redemption'" class="mt-4">
                                    <label for="requestId"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Target Redemption ID (UUID)
                                    </label>
                                    <input type="text" v-model="targetId" id="requestId"
                                        class="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm shadow-sm"
                                        placeholder="Enter Redemption Request ID..." />
                                </div>

                                <div v-if="resolveType === 'merge_history'" class="mt-4">
                                    <label for="historyId"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Target Transaction ID (UUID)
                                    </label>
                                    <input type="text" v-model="targetId" id="historyId"
                                        class="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm shadow-sm"
                                        placeholder="Enter Transaction History ID..." />
                                    <p class="mt-1 text-xs text-gray-500">
                                        This will update the existing 'Pending' transaction with this hash and mark it
                                        as
                                        Completed.
                                    </p>
                                </div>

                                <div v-if="resolveType === 'create_history'" class="mt-4">
                                    <div
                                        class="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md p-3">
                                        <div class="flex">
                                            <div class="flex-shrink-0">
                                                <span class="text-yellow-400">⚠️</span>
                                            </div>
                                            <div class="ml-3">
                                                <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                    Create New History Record
                                                </h3>
                                                <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                                    <p> This will create a new "Send" transaction for user <strong>{{
                                                        selectedOrphan?.sender_address }}</strong>.</p>
                                                    <p class="mt-1">If the user doesn't exist, a new User account will
                                                        be
                                                        created automatically.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" @click="submitResolve" :disabled="isMerging || !canSubmit"
                        class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto">
                        {{ isMerging ? 'Processing...' : 'Confirm Resolution' }}
                    </button>
                    <button type="button" @click="closeResolveModal"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toast } from 'vue-sonner';
import { apiClient } from '@/utils/apiClient';
import { getChainExplorerUrl } from '@/app/composables/useChain';

const redemptionStatus = ref<'idle' | 'running' | 'success' | 'error'>('idle');
const historyStatus = ref<'idle' | 'running' | 'success' | 'error'>('idle');

const redemptionResult = ref<any>(null);
const historyResult = ref<any>(null);

const runRedemptionReconciliation = async () => {
    redemptionStatus.value = 'running';
    redemptionResult.value = null;
    try {
        const response = await apiClient.fetch('/api/reconcile/redemption', {
            method: 'POST'
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Request failed (${response.status}): ${text}`);
        }

        const data = await response.json();
        redemptionResult.value = data.results;
        redemptionStatus.value = 'success';
        toast.success(`Reconciliation Complete: Verified ${redemptionResult.value.verified}, Failed ${redemptionResult.value.failed}`);
    } catch (error: any) {
        console.error('Redemption Reconciliation Error:', error);
        redemptionStatus.value = 'error';
        toast.error(error.message || 'Reconciliation Failed');
    } finally {
        if (redemptionStatus.value === 'running') redemptionStatus.value = 'idle';
    }
};

const runHistoryReconciliation = async () => {
    historyStatus.value = 'running';
    historyResult.value = null;
    try {
        const response = await apiClient.fetch('/api/reconcile/history', {
            method: 'POST'
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Request failed (${response.status}): ${text}`);
        }

        const data = await response.json();
        historyResult.value = data.results;
        historyStatus.value = 'success';
        toast.success(`Reconciliation Complete: Verified ${historyResult.value.verified}, Failed ${historyResult.value.failed}`);
    } catch (error: any) {
        console.error('History Reconciliation Error:', error);
        historyStatus.value = 'error';
        toast.error(error.message || 'Reconciliation Failed');
    } finally {
        if (historyStatus.value === 'running') historyStatus.value = 'idle';
    }
};

const scanStatus = ref<'idle' | 'running' | 'success' | 'error'>('idle');
const scanResult = ref<any>(null);
const selectedChainId = ref<number | null>(null);
const orphans = ref<any[]>([]);

const fetchOrphans = async () => {
    try {
        const response = await apiClient.fetch('/api/reconcile/orphans');
        if (response.ok) {
            const data = await response.json();
            orphans.value = data.data;
        }
    } catch (e) {
        console.error('Failed to fetch orphans:', e);
    }
};

const runTreasuryScan = async () => {
    scanStatus.value = 'running';
    const body = selectedChainId.value ? JSON.stringify({ chainId: selectedChainId.value }) : undefined;
    try {
        const response = await apiClient.fetch('/api/reconcile/scan', {
            method: 'POST',
            body
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Request failed (${response.status}): ${text}`);
        }

        const data = await response.json();
        scanResult.value = data.results;
        scanStatus.value = 'success';
        toast.success(`Treasury Scanned: Found ${scanResult.value.newOrphans} new orphans.`);
        await fetchOrphans(); // Refresh list
    } catch (error: any) {
        console.error('Treasury Scan Error:', error);
        scanStatus.value = 'error';
        toast.error(error.message || 'Scan Failed');
    } finally {
        if (scanStatus.value === 'running') scanStatus.value = 'idle';
    }
};

// Fetch orphans on mount
fetchOrphans();

const globalScanStatus = ref<'idle' | 'running' | 'success' | 'error'>('idle');
const globalScanResult = ref<any>(null);
const selectedGlobalInternalChainId = ref<number | null>(null); // Distinct from treasury scan selection

const runGlobalScan = async () => {
    globalScanStatus.value = 'running';
    const body = selectedGlobalInternalChainId.value ? JSON.stringify({ chainId: selectedGlobalInternalChainId.value }) : undefined;
    try {
        const response = await apiClient.fetch('/api/reconcile/global-scan', {
            method: 'POST',
            body
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Request failed (${response.status}): ${text}`);
        }

        const data = await response.json();
        globalScanResult.value = data.result;
        globalScanStatus.value = 'success';
        toast.success(`Global Scan Complete: Found ${globalScanResult.value.totalFound} transfers.`);
    } catch (error: any) {
        console.error('Global Scan Error:', error);
        globalScanStatus.value = 'error';
        toast.error(error.message || 'Scan Failed');
    } finally {
        if (globalScanStatus.value === 'running') globalScanStatus.value = 'idle';
    }
};

// Scan Logic
// ... (Previous logic)

// Audit Logic (Missing Hashes)
const auditStatus = ref<'idle' | 'running' | 'success' | 'error'>('idle');
const auditResult = ref<any>(null);

const runHashAudit = async () => {
    auditStatus.value = 'running';
    auditResult.value = null;
    try {
        const response = await apiClient.fetch('/api/reconcile/check-missing-hashes', {
            method: 'POST'
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Request failed (${response.status}): ${text}`);
        }

        const data = await response.json();
        auditResult.value = data.data;
        auditStatus.value = 'success';
        toast.success(`Audit Complete`);
    } catch (error: any) {
        console.error('Audit Error:', error);
        auditStatus.value = 'error';
        toast.error(error.message || 'Audit Failed');
    } finally {
        if (auditStatus.value === 'running') auditStatus.value = 'idle';
    }
};

// Resolve/Merge Logic
const showMergeModal = ref(false);
const selectedOrphan = ref<any>(null);
const targetId = ref('');
const isMerging = ref(false);

const resolveTypes = [
    { id: 'merge_redemption', label: 'Merge to Redemption' },
    { id: 'merge_history', label: 'Merge to History' },
    { id: 'create_history', label: 'Create New History' }
];
const resolveType = ref('merge_redemption');

const openMergeModal = (orphan: any) => {
    selectedOrphan.value = orphan;
    targetId.value = '';
    resolveType.value = 'merge_redemption'; // Default
    showMergeModal.value = true;
};

const closeResolveModal = () => {
    showMergeModal.value = false;
    selectedOrphan.value = null;
    targetId.value = '';
};

const canSubmit = computed(() => {
    if (resolveType.value === 'create_history') return true;
    return targetId.value.trim().length > 0;
});

const submitResolve = async () => {
    if (!selectedOrphan.value) return;
    if (resolveType.value !== 'create_history' && !targetId.value) return;

    isMerging.value = true;
    try {
        const response = await apiClient.fetch('/api/reconcile/resolve-orphan', {
            method: 'POST',
            body: JSON.stringify({
                orphanId: selectedOrphan.value.id,
                action: resolveType.value,
                targetId: targetId.value.trim()
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Resolution failed');
        }

        toast.success('Successfully resolved orphaned payment');
        closeResolveModal();
        fetchOrphans(); // Refresh list
    } catch (e: any) {
        console.error(e);
        toast.error(e.message || 'Resolution Failed');
    } finally {
        isMerging.value = false;
    }
};


</script>
