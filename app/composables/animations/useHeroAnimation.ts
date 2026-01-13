/**
 * Composable for hero section entrance animation
 *
 * Animates hero elements with a stagger reveal effect:
 * - Title slides up and fades in
 * - Subtitle follows with overlap
 * - Button appears last
 *
 * Usage:
 * ```ts
 * const title = ref(null)
 * const subtitle = ref(null)
 * const button = ref(null)
 *
 * useHeroAnimation({ title, subtitle, button })
 * ```
 */

import { gsap } from 'gsap'

interface UseHeroAnimationOptions {
  title: Ref<HTMLElement | null>
  subtitle: Ref<HTMLElement | null>
  button: Ref<HTMLElement | null>
  delay?: number
}

export const useHeroAnimation = (options: UseHeroAnimationOptions) => {
  const { title, subtitle, button, delay = 0.3 } = options
  const { durations, easings } = useMotionConfig()

  const isPlaying = ref(false)
  const isComplete = ref(false)

  useGsapContext((gsap) => {
    const tl = gsap.timeline({
      defaults: { ease: easings.smooth },
      onStart: () => {
        isPlaying.value = true
      },
      onComplete: () => {
        isPlaying.value = false
        isComplete.value = true
      },
    })

    tl.from(title.value, {
      y: 100,
      opacity: 0,
      duration: durations.verySlow,
      delay,
    })
      .from(
        subtitle.value,
        {
          y: 50,
          opacity: 0,
          duration: durations.slow,
        },
        '-=0.6', // Overlap with previous animation
      )
      .from(
        button.value,
        {
          y: 30,
          opacity: 0,
          duration: durations.normal,
        },
        '-=0.4', // Overlap with previous animation
      )
  })

  return {
    isPlaying: readonly(isPlaying),
    isComplete: readonly(isComplete),
  }
}
