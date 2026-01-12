/**
 * Composable to create a magnetic effect on an element
 *
 * The element follows the mouse cursor with smooth interpolation.
 * The effect strength depends on the distance between cursor and element center.
 *
 * Usage:
 * ```vue
 * <script setup>
 * const buttonRef = ref(null)
 * const { strength } = useMagneticEffect(buttonRef, {
 *   strength: 0.3,
 *   speed: 0.5
 * })
 * </script>
 *
 * <template>
 *   <button ref="buttonRef">Hover me</button>
 * </template>
 * ```
 */

import { gsap } from 'gsap'
import { motionConfig } from '~/utils/motion/config'

interface MagneticEffectOptions {
  /**
   * Magnetic effect strength (0 to 1)
   * Higher value = more movement
   */
  strength?: number

  /**
   * Animation speed (in seconds)
   */
  speed?: number

  /**
   * Effect radius in pixels
   * If cursor is beyond, no effect
   */
  radius?: number

  /**
   * Animation easing
   */
  ease?: string

  /**
   * Callback when effect is activated
   */
  onEnter?: () => void

  /**
   * Callback when effect is deactivated
   */
  onLeave?: () => void
}

export const useMagneticEffect = (
  target: Ref<HTMLElement | null>,
  options: MagneticEffectOptions = {}
) => {
  const {
    strength = 0.3,
    speed = motionConfig.durations.normal,
    radius = 100,
    ease = motionConfig.easings.smooth,
    onEnter,
    onLeave,
  } = options

  const isActive = ref(false)
  let animationFrame: number | null = null

  /**
   * Calculate cursor position relative to element center
   */
  const calculateOffset = (
    element: HTMLElement,
    mouseX: number,
    mouseY: number
  ): { x: number; y: number; distance: number } => {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = mouseX - centerX
    const deltaY = mouseY - centerY
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

    return {
      x: deltaX * strength,
      y: deltaY * strength,
      distance,
    }
  }

  /**
   * Mouse move handler
   */
  const handleMouseMove = (e: MouseEvent) => {
    const element = target.value
    if (!element) return

    const { x, y, distance } = calculateOffset(element, e.clientX, e.clientY)

    // If cursor is too far, no effect
    if (distance > radius) {
      handleMouseLeave()
      return
    }

    if (!isActive.value) {
      isActive.value = true
      onEnter?.()
    }

    // Smooth animation with GSAP
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }

    animationFrame = requestAnimationFrame(() => {
      gsap.to(element, {
        x,
        y,
        duration: speed,
        ease,
      })
    })
  }

  /**
   * Mouse leave handler
   */
  const handleMouseLeave = () => {
    const element = target.value
    if (!element) return

    isActive.value = false
    onLeave?.()

    // Return to initial position
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: speed,
      ease,
    })
  }

  /**
   * Enable magnetic effect
   */
  const enable = () => {
    const element = target.value
    if (!element) return

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
  }

  /**
   * Disable magnetic effect
   */
  const disable = () => {
    const element = target.value
    if (!element) return

    element.removeEventListener('mousemove', handleMouseMove)
    element.removeEventListener('mouseleave', handleMouseLeave)

    // Reset position
    gsap.set(element, { x: 0, y: 0 })
    isActive.value = false

    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }

  /**
   * Lifecycle
   */
  onMounted(() => {
    enable()
  })

  onBeforeUnmount(() => {
    disable()
  })

  return {
    isActive: readonly(isActive),
    enable,
    disable,
    // Allow strength modification in real-time
    strength: ref(strength),
  }
}
