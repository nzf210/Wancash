<script setup lang="ts">
import { useThirdWeb } from "@/app/composables/useThirdWeb";
import { ChevronDownIcon } from "@radix-icons/vue";
import { computed, ref } from "vue";

const { address, isConnected, connectWallet, disconnect } = useThirdWeb();

const showDropdown = ref(false);

const formattedAddress = computed(() => {
  if (!address.value) return "";
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`;
});
</script>

<template>
  <div class="relative">
    <Button @click="isConnected ? (showDropdown = !showDropdown) : connectWallet()" variant="outline" class="gap-2">
      <WalletIcon class="h-4 w-4" />
      <span>{{ isConnected ? formattedAddress : "Connect Wallet" }}</span>
      <ChevronDownIcon v-if="isConnected" class="h-4 w-4 transition-transform"
        :class="{ 'rotate-180': showDropdown }" />
    </Button>

    <div v-if="isConnected && showDropdown"
      class="absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-lg">
      <div class="p-2 text-sm">
        <div class="truncate px-2 py-1 text-muted-foreground">
          {{ formattedAddress }}
        </div>
        <Button variant="ghost" class="w-full justify-start text-red-500 hover:bg-red-500/10" @click="disconnect">
          Disconnect
        </Button>
      </div>
    </div>
  </div>
</template>
