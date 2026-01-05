<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

// Blob element
const follower = ref<HTMLElement>()

// Hover state
const isHovering = ref(false)

const handleMouseMove = (e: MouseEvent) => {
  if (!follower.value) return

  const x = e.clientX
  const y = e.clientY

  // Smooth follow pakai lerp
  const updatePosition = () => {
    if (!follower.value) return
    const currentX = Number.parseFloat(follower.value.style.left || '0')
    const currentY = Number.parseFloat(follower.value.style.top || '0')

    const lerpX = currentX + (x - currentX) * 0.15
    const lerpY = currentY + (y - currentY) * 0.15

    follower.value.style.left = `${lerpX}px`
    follower.value.style.top = `${lerpY}px`

    requestAnimationFrame(updatePosition)
  }
  updatePosition()
}

// Efek hover
const handleMouseEnter = () => (isHovering.value = true)
const handleMouseLeave = () => (isHovering.value = false)

onMounted(() => {
  globalThis.addEventListener('mousemove', handleMouseMove)
  document.querySelectorAll('a, button, [role="button"], .cursor-pointer').forEach(el => {
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
  })
})

onBeforeUnmount(() => {
  globalThis.window.removeEventListener('mousemove', handleMouseMove)
})

</script>

<template>
  <!-- Card Kedua (Kanan) - Moto & Profil -->
  <div class="col-span-4">
    <div class="md:ml-36 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/90 dark:to-gray-800/90
                  backdrop-blur-lg border border-gray-200 dark:border-gray-700/50
                  rounded-2xl shadow-xl dark:shadow-2xl p-8
                  hover:shadow-purple-200 dark:hover:shadow-purple-500/10
                  hover:border-purple-300 dark:hover:border-purple-500/30
                  transition-all duration-500" @mouseenter="isHovering = true" @mouseleave="isHovering = false">

      <!-- Header dengan Logo/Icon -->
      <div class="flex items-center mb-6">
        <div
          class="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl flex items-center justify-center mr-4">
          <span class="text-2xl font-bold text-white">W</span>
        </div>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500
                     dark:from-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
            Wancash Token
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm">The Future of Community Finance</p>
        </div>
      </div>

      <!-- Moto Utama -->
      <div class="mb-8">
        <blockquote class="text-xl italic border-l-4 border-purple-500 pl-6 py-2
                          text-gray-800 dark:text-gray-200">
          "Decentralizing finance, empowering communities — one token at a time."
        </blockquote>
        <p class="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Wancash is more than a token; it's a movement toward true financial inclusivity
          and community-driven growth.
        </p>
      </div>

      <!-- Profil Singkat -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Wancash</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          Wancash is a decentralized utility token designed to facilitate fast, low-cost
          transactions while providing sustainable rewards through staking. Built on a secure
          and scalable blockchain, Wancash aims to bridge the gap between traditional finance
          and the future of digital assets.
        </p>
      </div>

      <!-- Key Features -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Wancash?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-start p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
            <span class="text-green-600 dark:text-green-400 mr-3">✓</span>
            <span class="text-gray-800 dark:text-gray-300">Community-First Governance</span>
          </div>
          <div class="flex items-start p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
            <span class="text-green-600 dark:text-green-400 mr-3">✓</span>
            <span class="text-gray-800 dark:text-gray-300">Eco-Friendly Staking</span>
          </div>
          <div class="flex items-start p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
            <span class="text-green-600 dark:text-green-400 mr-3">✓</span>
            <span class="text-gray-800 dark:text-gray-300">Transparent & Audited</span>
          </div>
          <div class="flex items-start p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
            <span class="text-green-600 dark:text-green-400 mr-3">✓</span>
            <span class="text-gray-800 dark:text-gray-300">Real-World Utility</span>
          </div>
        </div>
      </div>

      <!-- Roadmap & Community -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Roadmap</h3>
          <ul class="space-y-2">
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <div class="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              Q4 2026: CEX Listings & Wallet
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Q1 2027: Staking Platform Launch
            </li>
            <li class="flex items-center text-gray-700 dark:text-gray-300">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Q2 2028: Merchant Adoption
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Join Community</h3>
          <div class="flex space-x-4">
            <a href="https://t.me/wancash" class="w-10 h-10 bg-blue-100 hover:bg-blue-200 dark:bg-blue-500/20
                     dark:hover:bg-blue-500/40 rounded-lg flex items-center justify-center
                     transition-colors cursor-pointer" title="Telegram">
              <span class="text-blue-600 dark:text-blue-400 font-medium">TG</span>
            </a>
            <a href="https://twitter.com/WancashToken" class="w-10 h-10 bg-sky-100 hover:bg-sky-200 dark:bg-sky-500/20
                     dark:hover:bg-sky-500/40 rounded-lg flex items-center justify-center
                     transition-colors cursor-pointer" title="Twitter">
              <span class="text-sky-600 dark:text-sky-400 font-medium">TW</span>
            </a>
            <a href="https://wancash.org" class="w-10 h-10 bg-purple-100 hover:bg-purple-200 dark:bg-purple-500/20
                     dark:hover:bg-purple-500/40 rounded-lg flex items-center justify-center
                     transition-colors cursor-pointer" title="Website">
              <span class="text-purple-600 dark:text-purple-400 font-medium">WEB</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Footer Timestamp -->
      <div class="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700/50 text-center">
        <p class="text-gray-500 dark:text-gray-400 text-sm">Last updated: {{
          new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Efek hover halus untuk semua elemen interaktif */
a,
button,
[role="button"],
.cursor-pointer {
  transition: all 0.3s ease;
}

/* Gradien teks untuk judul */
.bg-gradient-to-r {
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* Memastikan teks tetap terlihat dengan baik di light mode */
@media (prefers-color-scheme: light) {
  .text-transparent {
    background-clip: text;
    -webkit-background-clip: text;
  }
}
</style>
