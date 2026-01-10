<template>
  <div class="container mx-auto px-1 md:px-4 py-8">
    <BridgeHeader />

    <div class="max-w-4xl mx-auto">
      <div
        class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <BridgeStats />
        <BridgeForm />
      </div>

      <RecentBridges :recent-bridges="recentBridges" />
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
