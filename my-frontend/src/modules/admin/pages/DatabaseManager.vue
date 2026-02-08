<template>
    <div class="database-manager">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Export Card -->
            <div
                class="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
                <div
                    class="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
                <h2 class="text-xl font-semibold text-white mb-2">Export Data</h2>
                <p class="text-slate-400 text-sm mb-6">
                    Download a full snapshot of your database in JSON format. This includes all tables, users, and
                    transactions.
                </p>
                <button @click="handleExport" :disabled="isExporting"
                    class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                    <span v-if="isExporting">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </span>
                    <span v-else>Download Backup (.json)</span>
                </button>
            </div>

            <!-- Import Card -->
            <div
                class="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-red-500/30 transition-all group">
                <div
                    class="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <h2 class="text-xl font-semibold text-white mb-2">Restore Data</h2>
                <p class="text-slate-400 text-sm mb-6">
                    Upload a previously exported JSON file to restore the database.
                    <span class="text-red-400 font-bold block mt-1">WARNING: This will overwrite CURRENT data!</span>
                </p>

                <label class="cursor-pointer">
                    <input type="file" class="hidden" @change="handleImport" accept=".json" :disabled="isImporting" />
                    <div class="w-full py-3 px-4 border-2 border-dashed border-slate-700 hover:border-red-500/50 text-slate-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2 group-hover:bg-red-500/5"
                        :class="{ 'opacity-50 cursor-not-allowed': isImporting }">
                        <span v-if="isImporting">
                            <svg class="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Restoring Database...
                        </span>
                        <span v-else>Restore from File (.json)</span>
                    </div>
                </label>
            </div>
        </div>

        <!-- Security Information -->
        <div class="mt-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
            <div class="flex gap-4">
                <div class="text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 class="text-blue-400 font-semibold">Security Note</h3>
                    <p class="text-slate-400 text-sm mt-1 leading-relaxed">
                        Backup files contain sensitive user data and transaction history.
                        Store them in a secure, encrypted location. Avoid sharing them over insecure channels.
                        Large databases may take a few moments to export/import.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { adminApi } from '../services/adminApi';

const isExporting = ref(false);
const isImporting = ref(false);

const handleExport = async () => {
    try {
        isExporting.value = true;
        const blob = await adminApi.exportDatabase();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `wancash_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err: any) {
        alert('Export failed: ' + err.message);
    } finally {
        isExporting.value = false;
    }
};

const handleImport = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!confirm('CRITICAL WARNING: This will DESTRUCTIVELY overwrite the entire database with the content of this file. Are you absolutely sure?')) {
        (event.target as HTMLInputElement).value = '';
        return;
    }

    try {
        isImporting.value = true;

        // Read file as text
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                const result = await adminApi.importDatabase(data);
                alert(result.message || 'Database restored successfully!');
            } catch (err: any) {
                alert('Restore failed: ' + err.message);
            } finally {
                isImporting.value = false;
                (event.target as HTMLInputElement).value = '';
            }
        };
        reader.readAsText(file);
    } catch (err: any) {
        alert('File reading failed: ' + err.message);
        isImporting.value = false;
    }
};
</script>

<style scoped>
.database-manager {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
