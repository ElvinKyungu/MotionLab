/**
 * Centralized configuration for all animations
 *
 * This config is the single source of truth for:
 * - Animation durations
 * - Easings
 * - Delays and staggers
 * - Responsive breakpoints
 *
 * Modifying these values will affect all animations in the project.
 */

export const motionConfig = {
  /**
   * Standard durations in seconds
   * Based on Material Design and iOS HIG principles
   */
  durations: {
    instant: 0,        // No animation
    fast: 0.2,         // Micro-interactions (hover, ripple)
    normal: 0.4,       // Standard transitions
    slow: 0.6,         // Complex animations
    verySlow: 1,       // Hero sections, major reveals
  },

  /**
   * GSAP Easings
   * https://gsap.com/docs/v3/Eases/
   */
  easings: {
    linear: 'none',
    smooth: 'power2.out',           // Recommended for most cases
    smoothIn: 'power2.in',
    smoothInOut: 'power2.inOut',
    elastic: 'elastic.out(1, 0.3)', // For "playful" effects
    bounce: 'bounce.out',           // Use sparingly
    expo: 'expo.out',               // For long distances
    back: 'back.out(1.7)',          // Slight anticipation
  },

  /**
   * Delays and staggers
   */
  delays: {
    none: 0,
    micro: 0.05,      // Between each letter of text
    tiny: 0.1,        // Between each item in a short list
    small: 0.15,      // Between each card
    medium: 0.2,      // Between each section
    large: 0.3,       // Notable delay before action
  },

  /**
   * Predefined stagger values
   */
  staggers: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },

  /**
   * Breakpoints for responsive animations
   * Aligned with Tailwind CSS
   */
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  /**
   * Common transformation values
   */
  transforms: {
    scale: {
      hover: 1.05,      // Subtle hover
      active: 0.95,     // Click feedback
      large: 1.2,       // Significant zoom
    },
    rotate: {
      slight: 2,        // Slight tilt
      medium: 5,        // Visible rotation
      flip: 180,        // Complete flip
    },
    translate: {
      small: 5,         // px - Subtle offset
      medium: 10,       // px
      large: 20,        // px
    },
  },

  /**
   * Standard opacities
   */
  opacity: {
    hidden: 0,
    muted: 0.4,
    visible: 1,
  },

  /**
   * Default ScrollTrigger configuration
   */
  scrollTrigger: {
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
  },
} as const

/**
 * Helper to get duration by name
 */
export const getDuration = (key: keyof typeof motionConfig.durations): number => {
  return motionConfig.durations[key]
}

/**
 * Helper to get easing by name
 */
export const getEasing = (key: keyof typeof motionConfig.easings): string => {
  return motionConfig.easings[key]
}

/**
 * Helper to get delay by name
 */
export const getDelay = (key: keyof typeof motionConfig.delays): number => {
  return motionConfig.delays[key]
}

export type MotionConfig = typeof motionConfig
