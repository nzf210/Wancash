<template>
  <div class="container mx-auto px-1 md:px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <BridgeHeader />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <!-- Main Content (Form) -->
        <div class="lg:col-span-2">
          <div
            class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <BridgeForm />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Bridge Stats Card -->
          <div
            class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <BridgeStats />
          </div>

          <RecentBridges :recent-bridges="recentBridges" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useBridgeStore } from '@/modules/bridge/store/bridgeStore'
import BridgeHeader from '@/modules/bridge/components/BridgeHeader.vue'
import BridgeStats from '@/modules/bridge/components/BridgeStats.vue'
import BridgeForm from '@/modules/bridge/components/BridgeForm.vue'
import RecentBridges from '@/modules/bridge/components/RecentBridges.vue'

const bridgeStore = useBridgeStore()
const { history: recentBridges } = storeToRefs(bridgeStore)

// Load persisted bridge history on mount
onMounted(() => {
  bridgeStore.loadHistory()
})
</script>
