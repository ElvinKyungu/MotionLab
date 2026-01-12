/**
 * Shared props between UI components
 */
export interface BaseAnimatedComponentProps {
  /**
   * Disable animation
   */
  disableAnimation?: boolean

  /**
   * Animation duration (overrides global config)
   */
  duration?: number

  /**
   * Animation easing (overrides global config)
   */
  ease?: string

  /**
   * Delay before animation starts
   */
  delay?: number
}

/**
 * Events emitted by animated components
 */
export interface AnimatedComponentEmits {
  (e: 'animation-start'): void
  (e: 'animation-complete'): void
  (e: 'animation-reverse'): void
}

/**
 * Configuration for components with hover
 */
export interface HoverAnimationConfig {
  scale?: number
  rotate?: number
  duration?: number
  ease?: string
  stagger?: boolean
}

/**
 * Configuration for components with scroll
 */
export interface ScrollAnimationConfig {
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean
  anticipatePin?: number
}
