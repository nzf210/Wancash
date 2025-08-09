<script lang="ts">
// TokenPanel component
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'TokenPanel',
  props: {
    title: String,
    token: Object as PropType<{ symbol: string; icon: string }>,
    network: Object as PropType<{ name: string; icon: string }>,
    amount: Number,
    showMax: Boolean,
    customAddress: Boolean
  },
  emits: ['update:amount', 'selectToken', 'selectNetwork', 'toggleCustomAddress'],
  setup(props, { emit }) {
    const onAmountChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value
      const num = value === '' ? null : Number(value)
      emit('update:amount', num)
    }

    const toggleCustomAddress = () => {
      emit('toggleCustomAddress', !props.customAddress)
    }

    return { onAmountChange, toggleCustomAddress }
  },
  template: `
  <div class="bg-gray-800 rounded-lg p-4 relative">
    <div class="flex justify-between items-center mb-3">
      <div class="text-xs text-gray-400 cursor-pointer hover:underline">{{ title }}</div>
      <div v-if="customAddress !== undefined" class="flex items-center space-x-1 text-xs cursor-pointer text-gray-400">
        <label for="custom-address-toggle" class="select-none">Custom Address</label>
        <input id="custom-address-toggle" type="checkbox" :checked="customAddress" @change="toggleCustomAddress" class="w-4 h-4" />
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2 cursor-pointer" @click="$emit('selectToken')">
        <img :src="token?.icon" alt="token-icon" class="w-6 h-6 rounded-full" />
        <span class="font-semibold">{{ token?.symbol }}</span>
      </div>
      <div class="flex items-center space-x-2 cursor-pointer" @click="$emit('selectNetwork')">
        <img :src="network?.icon" alt="network-icon" class="w-4 h-4 rounded" />
        <span class="text-xs text-gray-300">{{ network?.name }}</span>
      </div>
    </div>
    <input
      type="number"
      :value="amount"
      @input="onAmountChange"
      placeholder="0.00"
      class="bg-gray-900 text-white text-2xl w-full mt-3 rounded-md px-3 py-1 focus:outline-none"
    />
    <div v-if="showMax" class="absolute top-4 right-4 text-xs cursor-pointer text-blue-400 hover:underline select-none" @click="$emit('update:amount', 9999)">Max</div>
    <div class="text-xs text-gray-500 mt-1">$0.00</div>
  </div>
  `
})
</script>

<style scoped>
/* Background image stars.png bisa kamu taruh di folder public/ */
</style>
