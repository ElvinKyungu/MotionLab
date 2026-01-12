/**
 * Composable to access motion configuration
 *
 * Provides typed and reactive access to animation configuration.
 *
 * Usage:
 * ```ts
 * const { durations, easings, getDuration } = useMotionConfig()
 *
 * gsap.to(element, {
 *   duration: getDuration('normal'),
 *   ease: easings.smooth
 * })
 * ```
 */

import { motionConfig, getDuration, getEasing, getDelay } from '~/utils/motion/config'
import type { MotionConfig } from '~/utils/motion/config'

export const useMotionConfig = () => {
  /**
   * Complete configuration
   */
  const config = readonly(motionConfig as MotionConfig)

  /**
   * Direct access to frequently used values
   */
  const durations = readonly(motionConfig.durations)
  const easings = readonly(motionConfig.easings)
  const delays = readonly(motionConfig.delays)
  const transforms = readonly(motionConfig.transforms)

  /**
   * Detect "reduced motion" mode
   */
  const prefersReducedMotion = ref(false)

  if (import.meta.client) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches

    // Listen for changes
    mediaQuery.addEventListener('change', (e) => {
      prefersReducedMotion.value = e.matches
    })
  }

  /**
   * Helper to get duration adjusted according to user preferences
   */
  const getAdjustedDuration = (key: keyof typeof motionConfig.durations): number => {
    // If user prefers reduced motion, divide duration by 10
    // (very fast animations but not completely disabled)
    return prefersReducedMotion.value
      ? getDuration(key) / 10
      : getDuration(key)
  }

  /**
   * Helper to check if we should animate
   */
  const shouldAnimate = computed(() => !prefersReducedMotion.value)

  return {
    // Complete configuration
    config,

    // Direct values
    durations,
    easings,
    delays,
    transforms,

    // Helpers
    getDuration,
    getEasing,
    getDelay,
    getAdjustedDuration,

    // Accessibility
    prefersReducedMotion: readonly(prefersReducedMotion),
    shouldAnimate,
  }
}
