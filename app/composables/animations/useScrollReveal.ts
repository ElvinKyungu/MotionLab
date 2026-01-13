/**
 * Composable for scroll-triggered reveal animation
 *
 * Animates elements when they enter the viewport using ScrollTrigger.
 * Supports stagger for animating multiple elements in sequence.
 *
 * Usage:
 * ```ts
 * const features = ref<HTMLElement[]>([])
 *
 * useScrollReveal({
 *   targets: features,
 *   stagger: 0.2
 * })
 * ```
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface UseScrollRevealOptions {
  /**
   * Target elements to animate (single or array)
   */
  targets: Ref<HTMLElement | HTMLElement[] | null>

  /**
   * Stagger delay between elements (if array)
   */
  stagger?: number

  /**
   * Vertical offset for animation start
   */
  y?: number

  /**
   * Custom ScrollTrigger config
   */
  scrollTrigger?: Partial<ScrollTrigger.Vars>
}

export const useScrollReveal = (options: UseScrollRevealOptions) => {
  const {
    targets,
    stagger = 0.2,
    y = 60,
    scrollTrigger: scrollTriggerConfig,
  } = options

  const { durations, easings, config } = useMotionConfig()

  const isTriggered = ref(false)

  useGsapContext((gsap) => {
    const elements = Array.isArray(targets.value) ? targets.value : [targets.value]

    // Only animate if we have elements
    if (!elements.length || !elements[0]) return

    gsap.from(elements, {
      scrollTrigger: {
        trigger: elements[0],
        start: scrollTriggerConfig?.start || config.scrollTrigger.start,
        onEnter: () => {
          isTriggered.value = true
        },
        ...scrollTriggerConfig,
      },
      y,
      opacity: 0,
      stagger,
      duration: durations.slow,
      ease: easings.smooth,
    })
  })

  return {
    isTriggered: readonly(isTriggered),
  }
}
