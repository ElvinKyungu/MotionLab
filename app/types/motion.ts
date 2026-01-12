/**
 * Types for animation configuration
 */
export interface AnimationConfig {
  duration: number
  ease: string
  delay?: number
}

export interface TimelineOptions {
  paused?: boolean
  repeat?: number
  repeatDelay?: number
  yoyo?: boolean
  onComplete?: () => void
  onStart?: () => void
  onUpdate?: () => void
}

export interface ScrollTriggerConfig {
  trigger: string | HTMLElement
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean
  markers?: boolean
  toggleActions?: string
}

export interface StaggerConfig {
  amount?: number
  from?: 'start' | 'center' | 'end' | 'edges' | 'random' | number
  grid?: [number, number]
  axis?: 'x' | 'y'
  ease?: string
}

/**
 * Types for configuration values
 */
export type Duration = 'instant' | 'fast' | 'normal' | 'slow' | 'verySlow'
export type Easing = 'linear' | 'smooth' | 'elastic' | 'bounce' | 'expo'
export type AnimationState = 'idle' | 'playing' | 'paused' | 'completed'
