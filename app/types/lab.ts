import type { Component } from 'vue'

/**
 * Metadata for a component in the laboratory
 */
export interface ComponentMeta {
  id: string
  name: string
  category: ComponentCategory
  description: string
  tags: string[]
  complexity: Complexity
  animationType: AnimationType[]
  gsapFeatures: GsapFeature[]
  component: () => Promise<Component>
}

/**
 * Component categories
 */
export type ComponentCategory =
  | 'buttons'
  | 'cards'
  | 'sections'
  | 'forms'
  | 'text'
  | 'navigation'
  | 'overlays'

/**
 * Complexity level
 */
export type Complexity = 'beginner' | 'intermediate' | 'advanced'

/**
 * Animation types
 */
export type AnimationType =
  | 'hover'
  | 'scroll'
  | 'click'
  | 'entrance'
  | 'exit'
  | 'loop'
  | 'stagger'

/**
 * GSAP features used
 */
export type GsapFeature =
  | 'timeline'
  | 'scrollTrigger'
  | 'splitText'
  | 'draggable'
  | 'morphSVG'
  | 'customEase'

/**
 * Playground controls configuration
 */
export interface PlaygroundControl {
  id: string
  label: string
  type: 'slider' | 'select' | 'toggle' | 'color'
  defaultValue: number | string | boolean
  min?: number
  max?: number
  step?: number
  options?: Array<{ label: string; value: string | number }>
}

/**
 * Playground state
 */
export interface PlaygroundState {
  theme: 'light' | 'dark'
  containerSize: 'mobile' | 'tablet' | 'desktop' | 'full'
  isPlaying: boolean
  currentTime: number
  controlValues: Record<string, number | string | boolean>
}
