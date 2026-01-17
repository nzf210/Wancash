<script setup lang="ts">
import CardView from '../components/cardView.vue';
import MainView from '../components/mainView.vue';
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useSEO, useOrganizationSchema } from '@/utils/useSEO'

// SEO Configuration
useSEO({
  title: 'Wancash - Decentralized Cross-Chain Token Bridge',
  description: 'Bridge your WCH tokens seamlessly across BSC, Polygon, Arbitrum, and more blockchains. Fast, secure, and decentralized token transfers with real-time price charts.',
  keywords: ['wancash', 'wch token', 'cross-chain bridge', 'defi', 'cryptocurrency', 'token bridge', 'bsc', 'polygon', 'arbitrum']
})
useOrganizationSchema()


// Blob element
const follower = ref<HTMLElement>()

// Hover state (biar blob bisa membesar saat di atas card/button)
const isHovering = ref(false)

const handleMouseMove = (e: MouseEvent) => {
  if (!follower.value) return

  const x = e.clientX
  const y = e.clientY

  // Smooth follow pakai lerp (lerp)
  const updatePosition = () => {
    if (!follower.value) return
    const currentX = parseFloat(follower.value.style.left || '0')
    const currentY = parseFloat(follower.value.style.top || '0')

    const lerpX = currentX + (x - currentX) * 0.15
    const lerpY = currentY + (y - currentY) * 0.15

    follower.value.style.left = `${lerpX}px`
    follower.value.style.top = `${lerpY}px`

    requestAnimationFrame(updatePosition)
  }
  updatePosition()
}

// Efek hover (membesar saat di atas elemen interaktif)
const handleMouseEnter = () => (isHovering.value = true)
const handleMouseLeave = () => (isHovering.value = false)

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  // Biar semua button, card, link otomatis trigger hover
  document.querySelectorAll('a, button, [role="button"], .cursor-pointer').forEach(el => {
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})

</script>

<template>
  <div ref="follower" class="fixed left-0 top-0 w-80 h-80 -translate-x-1/2 -translate-y-1/2
            pointer-events-none z-50 select-none
            rounded-full bg-gradient-to-br from-violet-600/50 via-fuchsia-500/40 to-amber-500/40 blur-4xl
            blur-3xl mix-blend-screen
            transition-all duration-500" :class="{
              'scale-150 opacity-90': isHovering,
              'scale-100 opacity-40': !isHovering
            }" style="will-change: transform;" />
  <div ref="follower" class="flex flex-col md:grid md:grid-cols-6 gap-1 py-5 items-center md:items-start">
    <div class="w-full max-w-md md:w-auto md:col-span-2 flex justify-center">
      <CardView class="md:mr-3 w-full" @mouseenter="isHovering = true" @mouseleave="isHovering = false" />
    </div>
    <div class="col-span-4">
      <MainView />
    </div>
  </div>
</template>
