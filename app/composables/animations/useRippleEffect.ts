/**
 * Composable to create a ripple effect from the pointer contact point
 *
 * Spawns an absolutely positioned element that animates outward
 * with GSAP, then removes itself on completion.
 *
 * Usage:
 * ```vue
 * <script setup>
 * const btnRef = ref(null)
 * useRippleEffect(btnRef, { color: 'rgba(255,255,255,0.3)' })
 * </script>
 *
 * <template>
 *   <button ref="btnRef" style="position:relative;overflow:hidden">
 *     Click me
 *   </button>
 * </template>
 * ```
 */

import { gsap } from 'gsap'
import { motionConfig } from '~/utils/motion/config'

interface RippleEffectOptions {
  /** Ripple fill color — any valid CSS color, rgba recommended */
  color?: string
  /** Animation duration in seconds */
  duration?: number
  /** GSAP easing string */
  ease?: string
  /** Fired when a ripple starts */
  onStart?: () => void
  /** Fired when a ripple animation completes */
  onComplete?: () => void
}

export const useRippleEffect = (
  target: Ref<HTMLElement | null>,
  options: RippleEffectOptions = {}
) => {
  const {
    color = 'rgba(255, 255, 255, 0.35)',
    duration = motionConfig.durations.slow,
    ease = motionConfig.easings.smooth,
    onStart,
    onComplete,
  } = options

  const isAnimating = ref(false)

  const createRipple = (e: PointerEvent) => {
    const element = target.value
    if (!element) return

    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const size = Math.max(rect.width, rect.height) * 2.5

    const ripple = document.createElement('span')
    Object.assign(ripple.style, {
      position: 'absolute',
      borderRadius: '50%',
      background: color,
      width: `${size}px`,
      height: `${size}px`,
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      pointerEvents: 'none',
      transform: 'scale(0)',
      opacity: '1',
    })

    element.appendChild(ripple)
    isAnimating.value = true
    onStart?.()

    gsap.to(ripple, {
      scale: 1,
      opacity: 0,
      duration,
      ease,
      onComplete: () => {
        ripple.remove()
        isAnimating.value = false
        onComplete?.()
      },
    })
  }

  const enable = () => {
    target.value?.addEventListener('pointerdown', createRipple)
  }

  const disable = () => {
    target.value?.removeEventListener('pointerdown', createRipple)
  }

  onMounted(() => enable())
  onBeforeUnmount(() => disable())

  return {
    isAnimating: readonly(isAnimating),
    enable,
    disable,
  }
}
