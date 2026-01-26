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

// State untuk posisi target (mouse) dan posisi current (element)
const mouseX = ref(0)
const mouseY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
let animationFrameId: number | null = null

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

// Single animation loop logic
const animate = () => {
  if (!follower.value) return

  // Lerp smoothing (0.15 factor)
  const dx = mouseX.value - currentX.value
  const dy = mouseY.value - currentY.value
  
  currentX.value += dx * 0.15
  currentY.value += dy * 0.15

  follower.value.style.left = `${currentX.value}px`
  follower.value.style.top = `${currentY.value}px`

  animationFrameId = requestAnimationFrame(animate)
}

// Efek hover (membesar saat di atas elemen interaktif)
const handleMouseEnter = () => (isHovering.value = true)
const handleMouseLeave = () => (isHovering.value = false)

onMounted(() => {
  // Set initial position to prevent jump
  // Better: start center or checking initial mouse pos if possible, 
  // but starting at 0,0 and letting it lerp is standard for this effect.
  
  window.addEventListener('mousemove', handleMouseMove)
  
  // Start the single loop
  animate()

  // Biar semua button, card, link otomatis trigger hover
  document.querySelectorAll('a, button, [role="button"], .cursor-pointer').forEach(el => {
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
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
