/**
 * Composable to manage a GSAP context with automatic cleanup
 *
 * This composable encapsulates the gsap.context() pattern recommended by GSAP.
 * It guarantees that all animations created within the context
 * are automatically cleaned up when the component is destroyed.
 *
 * Usage:
 * ```ts
 * const { ctx } = useGsapContext((gsap) => {
 *   gsap.to('.element', { x: 100 })
 * })
 * ```
 */

import { gsap } from 'gsap'

interface UseGsapContextOptions {
  /**
   * Scope to limit selectors to a parent element
   */
  scope?: Ref<HTMLElement | null> | HTMLElement

  /**
   * Function called when context is cleaned up
   */
  onRevert?: () => void
}
type Context = ReturnType<typeof gsap.context>

export const useGsapContext = (
  setup?: (gsap: typeof import('gsap').gsap) => void,
  options: UseGsapContextOptions = {}
) => {
  let ctx: Context | null = null
  const isReady = ref(false)

  /**
   * Initialize GSAP context
   */
  const init = () => {
    const scope = unref(options.scope) || undefined

    ctx = gsap.context(() => {
      if (setup) {
        setup(gsap)
      }
    }, scope)

    isReady.value = true
  }


  /**
   * Clean up context
   */
  const revert = () => {
    if (ctx) {
      ctx.revert()
      ctx = null
      isReady.value = false
      options.onRevert?.()
    }
  }

  /**
   * Add animation to existing context
   */
  const add = (animation: (gsap: typeof import('gsap').gsap) => void) => {
    if (ctx) {
      ctx.add(() => animation(gsap))
    } else {
      console.warn('[useGsapContext] Context not initialized')
    }
  }

  /**
   * Lifecycle hooks
   */
  onMounted(() => {
    init()
  })

  onBeforeUnmount(() => {
    revert()
  })

  return {
    ctx: readonly(computed(() => ctx)),
    isReady: readonly(isReady),
    add,
    revert,
  }
}
