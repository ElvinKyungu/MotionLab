/**
 * GSAP Plugin (Client-side)
 *
 * Configures GSAP and registers necessary plugins.
 * This file is suffixed ".client.ts" to ensure it only executes
 * client-side (GSAP doesn't work in SSR).
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger)

  /**
   * Global GSAP configuration
   */
  gsap.config({
    // Disable warnings in production
    nullTargetWarn: import.meta.dev,
    // Performance optimization
    force3D: true,
  })

  /**
   * ScrollTrigger configuration
   */
  ScrollTrigger.config({
    // Limit ScrollTrigger refresh for better performance
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  })

  /**
   * Disable all animations if user prefers reduced motion
   * (accessibility)
   */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    gsap.globalTimeline.timeScale(0)
    ScrollTrigger.disable()
  }

  /**
   * Cleanup on route change
   * Prevents animation bugs that persist between pages
   */
  const router = useRouter()
  router.beforeEach(() => {
    // Kill all running animations
    gsap.globalTimeline.clear()
    // Refresh ScrollTrigger to recalculate positions
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  })

  /**
   * Expose GSAP globally for easy access
   */
  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})
