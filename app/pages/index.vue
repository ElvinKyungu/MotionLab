<script setup lang="ts">
/**
 * Landing Page
 *
 * Demonstrates the use of animation composables following MotionLab architecture:
 * - No GSAP code in the component
 * - All animation logic delegated to composables
 * - Automatic cleanup via useGsapContext
 */

const heroTitle = ref<HTMLElement | null>(null)
const heroSubtitle = ref<HTMLElement | null>(null)
const heroButton = ref<HTMLElement | null>(null)
const features = ref<HTMLElement[]>([])

// Template ref callback function
const setFeatureRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el) {
    features.value[index] = el as HTMLElement
  }
}

const featureData = [
  { icon: '⚡', title: 'Composable First', desc: 'Build animations with reusable composables. No GSAP boilerplate in your components.' },
  { icon: '🎨', title: 'Type Safe', desc: 'Full TypeScript support with autocomplete for all animation properties.' },
  { icon: '🚀', title: 'Auto Cleanup', desc: 'Automatic context cleanup on unmount. No memory leaks, no manual kill().' },
  { icon: '🔧', title: 'Scroll Triggers', desc: 'ScrollTrigger integration out of the box with sensible defaults.' },
  { icon: '📱', title: 'Production Ready', desc: 'Tree-shakeable, SSR compatible, works with Nuxt 3 and Vue 3.' },
  { icon: '💎', title: 'GSAP Powered', desc: 'Built on GSAP 3.12+ with full access to timelines and plugins.' }
]
// Hero entrance animation
useHeroAnimation({
  title: heroTitle,
  subtitle: heroSubtitle,
  button: heroButton,
})

// Features scroll reveal animation
onMounted(() => {
  nextTick(() => {
    useScrollReveal({
      targets: features,
      stagger: 0.2,
      y: 60,
    })
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white overflow-hidden relative">
    <!-- Effets de fond floutés -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-gradient-radial from-sky-500/20 via-sky-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/15 via-cyan-500/5 to-transparent rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-radial from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
    </div>

    <!-- Grille subtile en arrière-plan -->
    <div class="fixed inset-0 pointer-events-none opacity-[0.02]" style="background-image: url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%271%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

    <!-- Navigation -->
    <nav class="relative z-50 px-6 py-6 md:px-12 lg:px-24">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="text-2xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
          MotionLab
        </div>
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-gray-400 hover:text-sky-400 transition-colors duration-300">Features</a>
          <a href="/lab" class="text-gray-400 hover:text-sky-400 transition-colors duration-300">Components</a>
          <a href="https://github.com/ElvinKyungu/MotionLab" class="text-gray-400 hover:text-sky-400 transition-colors duration-300">GitHub</a>
          <button class="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 transition-all duration-300 font-medium shadow-lg shadow-sky-500/20">
            Browse Lab
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative z-10 px-6 md:px-12 lg:px-24 pt-20 pb-32">
      <div class="max-w-7xl mx-auto">
        <div class="max-w-4xl">
          <h1
            ref="heroTitle"
            class="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          >
            <span class="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              GSAP Animations
            </span>
            <br>
            <span class="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p
            ref="heroSubtitle"
            class="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl font-light leading-relaxed"
          >
            Build production-ready animations with composable patterns.
            No boilerplate, just clean code and smooth 60fps motion.
          </p>

          <div ref="heroButton" class="flex flex-wrap gap-4">
            <button class="group px-8 py-4 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 transition-all duration-300 font-medium shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-105">
              <span class="flex items-center gap-2">
                Browse Components
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            </button>
            <button class="px-8 py-4 rounded-lg border border-gray-700 hover:border-sky-500 hover:bg-sky-500/10 transition-all duration-300 font-medium backdrop-blur-sm">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="relative z-10 px-6 md:px-12 lg:px-24 py-32">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Why MotionLab
          </h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to ship buttery smooth animations
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in featureData"
            :key="index"
            :ref="(el) => setFeatureRef(el, index)"
            class="group p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-900/20 border border-gray-800 hover:border-sky-500/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/10"
          >
            <div class="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {{ feature.icon }}
            </div>
            <h3 class="text-xl font-semibold mb-3 text-white group-hover:text-sky-400 transition-colors">
              {{ feature.title }}
            </h3>
            <p class="text-gray-400 leading-relaxed">
              {{ feature.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative z-10 px-6 md:px-12 lg:px-24 py-32">
      <div class="max-w-4xl mx-auto text-center">
        <div class="relative p-16 rounded-3xl bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-transparent border border-sky-500/20 backdrop-blur-sm overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-cyan-500/5 animate-gradient-shift"></div>

          <div class="relative z-10">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Start Building
            </h2>
            <p class="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Check out the component library and see the code behind each animation
            </p>
            <button class="group px-10 py-5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 transition-all duration-300 font-semibold text-lg shadow-2xl shadow-sky-500/40 hover:shadow-sky-500/60 hover:scale-105">
              <span class="flex items-center gap-2">
                Explore Components
                <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 px-6 md:px-12 lg:px-24 py-12 border-t border-gray-800">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="text-2xl font-bold `bg-gradient-to-r` from-sky-400 to-cyan-400 bg-clip-text text-transparent">
            MotionLab
          </div>
          <div class="flex gap-8 text-gray-400">
            <a href="#" class="hover:text-sky-400 transition-colors">Twitter</a>
            <a href="#" class="hover:text-sky-400 transition-colors">GitHub</a>
            <a href="#" class="hover:text-sky-400 transition-colors">LinkedIn</a>
          </div>
          <div class="text-gray-500 text-sm">
            © 2026 MotionLab. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-30px) translateX(-15px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.15;
  }
}

@keyframes gradient-shift {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-float {
  animation: float 15s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 20s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

.animate-gradient-shift {
  animation: gradient-shift 8s linear infinite;
}

.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}
</style>
