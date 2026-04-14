/**
 * Central registry for documentation entries
 *
 * Each component registers its full doc metadata here:
 * props, emits, slots, code examples, and raw source.
 *
 * The raw source is imported via Vite's `?raw` suffix so the code
 * shown in the docs is always the real file — never manually maintained.
 */

import type { DocEntry } from '~/types/docs'
import type { ComponentCategory } from '~/types/lab'

// Raw source imports — always in sync with the actual component files
import MagneticButtonSource from '~/components/ui/buttons/MagneticButton.vue?raw'
import RippleButtonSource from '~/components/ui/buttons/RippleButton.vue?raw'

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const DOC_REGISTRY: DocEntry[] = [
  // ── Buttons ───────────────────────────────────────────────────────────────
  {
    id: 'magnetic-button',
    name: 'Magnetic Button',
    category: 'buttons',
    description: 'A button that attracts toward the cursor with a smooth magnetic effect, activated when the pointer enters the configured radius.',
    tags: ['hover', 'mouse', 'interactive', 'gsap'],
    complexity: 'intermediate',
    animationType: ['hover'],
    gsapFeatures: ['timeline'],
    component: () => import('~/components/ui/buttons/MagneticButton.vue'),
    source: MagneticButtonSource,
    usage: 'Wrap any label or icon inside MagneticButton. The element will smoothly follow the cursor while it stays within the detection radius, then spring back with an elastic ease when it leaves.',
    examples: [
      {
        title: 'Basic usage',
        filename: 'App.vue',
        language: 'vue',
        code: `<template>
  <MagneticButton>Hover me</MagneticButton>
</template>`,
      },
      {
        title: 'Custom strength & radius',
        description: 'Increase the pull strength and widen the detection zone.',
        filename: 'App.vue',
        language: 'vue',
        code: `<template>
  <MagneticButton :strength="0.6" :radius="200">
    Strong magnet
  </MagneticButton>
</template>`,
      },
      {
        title: 'Listening to events',
        filename: 'App.vue',
        language: 'vue',
        code: `<script setup lang="ts">
const onEnter = () => console.log('Cursor entered radius')
const onLeave = () => console.log('Button returned to origin')
</script>

<template>
  <MagneticButton
    @animation-start="onEnter"
    @animation-complete="onLeave"
  >
    Track me
  </MagneticButton>
</template>`,
      },
    ],
    props: [
      {
        name: 'strength',
        type: 'number',
        default: '0.3',
        description: 'Intensity of the magnetic pull. Range: 0 (no movement) → 1 (full cursor tracking).',
      },
      {
        name: 'radius',
        type: 'number',
        default: '120',
        description: 'Detection radius in pixels. The effect activates only when the cursor is within this distance from the element center.',
      },
      {
        name: 'disableAnimation',
        type: 'boolean',
        default: 'false',
        description: 'When true, the magnetic effect is completely disabled.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '—',
        description: 'Overrides the default animation duration (seconds) from motionConfig.',
      },
      {
        name: 'ease',
        type: 'string',
        default: '—',
        description: 'Overrides the default GSAP easing string from motionConfig.',
      },
      {
        name: 'delay',
        type: 'number',
        default: '—',
        description: 'Delay in seconds before the animation starts.',
      },
    ],
    emits: [
      {
        name: 'animation-start',
        description: 'Emitted when the cursor enters the magnetic radius.',
      },
      {
        name: 'animation-complete',
        description: 'Emitted when the button finishes returning to its original position.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Button content — text, icon, or any inline element.',
      },
    ],
  },

  {
    id: 'ripple-button',
    name: 'Ripple Button',
    category: 'buttons',
    description: 'A button that spawns a ripple wave from the pointer contact point, giving satisfying tactile click feedback.',
    tags: ['click', 'interactive', 'feedback', 'gsap'],
    complexity: 'beginner',
    animationType: ['click'],
    gsapFeatures: ['timeline'],
    component: () => import('~/components/ui/buttons/RippleButton.vue'),
    source: RippleButtonSource,
    usage: 'Use as a drop-in replacement for any standard button. Each pointer-down event spawns a new ripple that expands and fades out independently.',
    examples: [
      {
        title: 'Basic usage',
        filename: 'App.vue',
        language: 'vue',
        code: `<template>
  <RippleButton>Click me</RippleButton>
</template>`,
      },
      {
        title: 'Custom ripple color',
        description: 'Pass any rgba value to control the ripple appearance.',
        filename: 'App.vue',
        language: 'vue',
        code: `<template>
  <RippleButton ripple-color="rgba(6, 182, 212, 0.5)">
    Cyan ripple
  </RippleButton>
</template>`,
      },
      {
        title: 'Listening to events',
        filename: 'App.vue',
        language: 'vue',
        code: `<script setup lang="ts">
const onStart = () => console.log('Ripple started')
const onDone  = () => console.log('Ripple finished')
</script>

<template>
  <RippleButton
    @animation-start="onStart"
    @animation-complete="onDone"
  >
    Track me
  </RippleButton>
</template>`,
      },
    ],
    props: [
      {
        name: 'rippleColor',
        type: 'string',
        default: "'rgba(255, 255, 255, 0.35)'",
        description: 'Fill color of the ripple wave. Accepts any valid CSS color — rgba recommended for opacity control.',
      },
      {
        name: 'disableAnimation',
        type: 'boolean',
        default: 'false',
        description: 'When true, no ripple is created on click.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '—',
        description: 'Overrides the default ripple duration (seconds) from motionConfig.',
      },
      {
        name: 'ease',
        type: 'string',
        default: '—',
        description: 'Overrides the default GSAP easing string from motionConfig.',
      },
    ],
    emits: [
      {
        name: 'animation-start',
        description: 'Emitted on pointer-down, when the ripple element is inserted.',
      },
      {
        name: 'animation-complete',
        description: 'Emitted when the ripple animation fully completes and the element is removed.',
      },
    ],
    slots: [
      {
        name: 'default',
        description: 'Button label or inner content.',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Category metadata
// ---------------------------------------------------------------------------

interface CategoryMeta {
  id: ComponentCategory
  name: string
  description: string
}

const CATEGORY_META: Record<ComponentCategory, CategoryMeta> = {
  buttons:    { id: 'buttons',    name: 'Buttons',    description: 'Interactive buttons with micro-interactions' },
  cards:      { id: 'cards',      name: 'Cards',      description: 'Cards with hover effects and transitions' },
  sections:   { id: 'sections',   name: 'Sections',   description: 'Hero sections with entrance animations' },
  forms:      { id: 'forms',      name: 'Forms',      description: 'Inputs and forms with animated feedback' },
  text:       { id: 'text',       name: 'Text',       description: 'Typographic effects and text animations' },
  navigation: { id: 'navigation', name: 'Navigation', description: 'Menus and navigation with transitions' },
  overlays:   { id: 'overlays',   name: 'Overlays',   description: 'Modals, drawers and animated overlays' },
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

export const useDocRegistry = () => {
  const getAll = (): DocEntry[] => DOC_REGISTRY

  const getById = (id: string): DocEntry | undefined =>
    DOC_REGISTRY.find(e => e.id === id)

  const getByCategory = (category: ComponentCategory): DocEntry[] =>
    DOC_REGISTRY.filter(e => e.category === category)

  /** Returns only categories that have at least one registered component */
  const getCategoriesWithEntries = () =>
    Object.values(CATEGORY_META)
      .map(meta => ({
        ...meta,
        entries: getByCategory(meta.id),
      }))
      .filter(cat => cat.entries.length > 0)

  const getAllCategories = () => Object.values(CATEGORY_META)

  const search = (query: string): DocEntry[] => {
    const q = query.toLowerCase().trim()
    if (!q) return DOC_REGISTRY
    return DOC_REGISTRY.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.tags.some(t => t.includes(q)),
    )
  }

  return {
    getAll,
    getById,
    getByCategory,
    getCategoriesWithEntries,
    getAllCategories,
    search,
  }
}
