<script lang="ts">
// Sub-komponen ChainSection
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ChainSection',
  props: {
    title: String,
    wallets: Array,
  },
  setup(props) {
    const isOpen = ref(true)
    const toggle = () => {
      isOpen.value = !isOpen.value
    }
    return { isOpen, toggle }
  },
  template: `
    <div class="mb-4">
      <button @click="toggle" class="flex items-center justify-between w-full text-left font-semibold text-gray-300 hover:text-white mb-2">
        <span>{{ title }}</span>
        <span class="text-xl select-none">{{ isOpen ? '▼' : '▶' }}</span>
      </button>
      <ul v-if="isOpen" class="space-y-2 max-h-60 overflow-y-auto">
        <li v-for="wallet in wallets" :key="wallet.name" class="flex items-center justify-between p-2 rounded hover:bg-gray-700 cursor-pointer">
          <div class="flex items-center space-x-3">
            <img :src="wallet.icon" alt="" class="w-6 h-6 rounded" />
            <span>{{ wallet.name }}</span>
          </div>
          <button class="text-sm px-3 py-1 border border-gray-500 rounded hover:border-white">
            {{ wallet.action }}
          </button>
        </li>
      </ul>
    </div>
  `
})
</script>

<style scoped></style>
