# Architecture Guide - MotionLab

This document explains architectural decisions in detail and provides a guide for next implementation steps.

---

## Architecture Overview

### Architectural Goals

1. **Scalability**: Add 50+ components without increasing complexity
2. **Maintainability**: Modify one animation without breaking everything
3. **Reusability**: Isolated and testable animation logic
4. **Performance**: No memory leaks, automatic cleanup
5. **DX**: Nuxt auto-imports, strict TypeScript, hot-reload

### Design Principles

#### 1. Single Source of Truth (SSOT)

**Problem**: In a typical project, durations/easings are scattered across every component.

```ts
// ❌ Problem: hardcoded values everywhere
// ButtonA.vue
gsap.to(el, { duration: 0.3, ease: 'power2.out' })

// ButtonB.vue
gsap.to(el, { duration: 0.35, ease: 'power2.out' }) // Inconsistency!
```

**Solution**: `utils/motion/config.ts` as SSOT

```ts
// ✅ Solution: centralized config
import { motionConfig } from '~/utils/motion/config'

gsap.to(el, {
  duration: motionConfig.durations.fast,
  ease: motionConfig.easings.smooth
})
```

**Benefit**: Changing `durations.fast` from 0.2 to 0.25 updates all animations.

#### 2. Separation of Concerns

**UI Components** do NOT contain GSAP logic:

```vue
<!-- ✅ Good: delegates to composable -->
<script setup>
const buttonRef = ref(null)
useMagneticEffect(buttonRef)
</script>

<!-- ❌ Bad: GSAP logic in component -->
<script setup>
const buttonRef = ref(null)
onMounted(() => {
  buttonRef.value.addEventListener('mousemove', (e) => {
    // 50 lines of calculation...
    gsap.to(buttonRef.value, { x: ..., y: ... })
  })
})
</script>
```

**Why**: The composable is testable, reusable, and can evolve without touching the UI.

#### 3. Convention over Configuration

The component registry automatically generates routes:

```ts
// Registration
{
  id: 'magnetic-button',
  category: 'buttons',
  component: () => import('~/components/ui/buttons/MagneticButton.vue')
}

// → Automatically generates:
// - Route: /lab/buttons/magnetic-button
// - Navigation: Button in "Buttons" list
// - Metadata: Accessible via useComponentRegistry()
```

**Benefit**: Adding a component = 1 registry entry, no manual routing.

---

## Technical Details by Layer

### 1. Configuration Layer (`utils/motion/`)

#### `config.ts` - The Source of Truth

```ts
export const motionConfig = {
  durations: { ... },
  easings: { ... },
  delays: { ... },
  transforms: { ... }
}
```

**Rules**:
- Always use via `useMotionConfig()` (no direct import)
- Values in readonly to prevent accidental mutations
- Document each value with a comment explaining its usage

**Extension example**:

```ts
// Add a new easing
easings: {
  // ... existing
  springy: 'elastic.out(1, 0.5)',  // For "playful" buttons
}
```

### 2. Composables Layer (`composables/`)

#### Structure of an Animation Composable

Each composable follows this template:

```ts
export const useMyAnimation = (
  target: Ref<HTMLElement | null>,
  options: MyAnimationOptions = {}
) => {
  // 1. Destructure options with defaults
  const {
    duration = motionConfig.durations.normal,
    ease = motionConfig.easings.smooth,
    // ... other options
  } = options

  // 2. Reactive state
  const isPlaying = ref(false)

  // 3. GSAP logic in useGsapContext
  const { ctx } = useGsapContext((gsap) => {
    // GSAP animation here
  }, { scope: target })

  // 4. Public methods
  const play = () => { ... }
  const pause = () => { ... }
  const reset = () => { ... }

  // 5. Automatic cleanup via useGsapContext
  // (no need for onBeforeUnmount)

  // 6. API return
  return {
    isPlaying: readonly(isPlaying),
    play,
    pause,
    reset,
  }
}
```

**Critical points**:

- **Always** wrap in `useGsapContext` for cleanup
- **Expose** reactive state (isPlaying, progress, etc.)
- **Provide** control methods (play, pause, reset)
- **Accept** a Vue ref, not a selector string
- **Type** options strictly

#### Complete Example: `useRippleEffect.ts`

```ts
import { gsap } from 'gsap'
import { motionConfig } from '~/utils/motion/config'

interface RippleEffectOptions {
  color?: string
  duration?: number
  ease?: string
  maxScale?: number
}

export const useRippleEffect = (
  target: Ref<HTMLElement | null>,
  options: RippleEffectOptions = {}
) => {
  const {
    color = 'rgba(255, 255, 255, 0.5)',
    duration = motionConfig.durations.fast,
    ease = motionConfig.easings.smooth,
    maxScale = 2,
  } = options

  const { ctx } = useGsapContext((gsap) => {
    const element = target.value
    if (!element) return

    element.addEventListener('click', (e) => {
      // Create ripple element
      const ripple = document.createElement('span')
      ripple.classList.add('ripple')

      const rect = element.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.style.backgroundColor = color

      element.appendChild(ripple)

      // Animation
      gsap.fromTo(ripple,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: maxScale,
          opacity: 0,
          duration,
          ease,
          onComplete: () => {
            ripple.remove()
          }
        }
      )
    })
  }, { scope: target })

  return {
    // Can expose controls if needed
  }
}
```

**Associated CSS** (add globally or scoped):

```css
.ripple {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
```

### 3. Components Layer (`components/`)

#### UI Component Structure

```vue
<!-- components/ui/buttons/RippleButton.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  rippleColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

const buttonRef = ref<HTMLElement | null>(null)

// Component delegates all logic to composable
useRippleEffect(buttonRef, {
  color: props.rippleColor,
})
</script>

<template>
  <button
    ref="buttonRef"
    :class="[`variant-${variant}`, `size-${size}`]"
    class="ripple-button"
  >
    <slot />
  </button>
</template>

<style scoped>
.ripple-button {
  position: relative;
  overflow: hidden;
  /* Base styles */
}

/* Variants */
.variant-primary { /* ... */ }
.variant-secondary { /* ... */ }

/* Sizes */
.size-sm { /* ... */ }
.size-md { /* ... */ }
.size-lg { /* ... */ }
</style>
```

**Rules**:
- Typed props with TypeScript
- Use `withDefaults` for default values
- Complete delegation of animation to composable
- Scoped styles to avoid conflicts
- Slot for flexibility

#### Lab Component Structure

```vue
<!-- components/lab/LabPreview.vue -->
<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  component: Component
  theme?: 'light' | 'dark'
  size?: 'mobile' | 'tablet' | 'desktop' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  size: 'desktop',
})

const emit = defineEmits<{
  'update:theme': [theme: 'light' | 'dark']
  'update:size': [size: string]
}>()

const containerClasses = computed(() => ({
  [`theme-${props.theme}`]: true,
  [`size-${props.size}`]: true,
}))
</script>

<template>
  <div class="lab-preview">
    <!-- Controls -->
    <div class="controls">
      <button @click="emit('update:theme', theme === 'light' ? 'dark' : 'light')">
        {{ theme === 'light' ? '🌙' : '☀️' }}
      </button>
      <!-- Size selector -->
    </div>

    <!-- Preview area -->
    <div class="preview-container" :class="containerClasses">
      <component :is="component" />
    </div>
  </div>
</template>

<style scoped>
/* Lab styles */
</style>
```

### 4. Pages Layer (`pages/`)

#### Dynamic Route: `pages/lab/[category]/[component].vue`

```vue
<script setup lang="ts">
const route = useRoute()
const { getById } = useComponentRegistry()

const componentId = computed(() => route.params.component as string)
const meta = computed(() => getById(componentId.value))

// Handle case where component doesn't exist
if (!meta.value) {
  throw createError({
    statusCode: 404,
    message: `Component "${componentId.value}" not found`
  })
}

const componentInstance = ref<Component | null>(null)

// Lazy load component
onMounted(async () => {
  if (meta.value?.component) {
    const module = await meta.value.component()
    componentInstance.value = module.default || module
  }
})
</script>

<template>
  <div class="component-detail">
    <!-- Header with metadata -->
    <header>
      <h1>{{ meta.name }}</h1>
      <p>{{ meta.description }}</p>
      <div class="tags">
        <span v-for="tag in meta.tags" :key="tag">{{ tag }}</span>
      </div>
    </header>

    <!-- Playground -->
    <LabContainer>
      <LabPreview
        v-if="componentInstance"
        :component="componentInstance"
      />

      <LabCodeViewer
        :component-id="componentId"
      />

      <LabExplanation
        :meta="meta"
      />
    </LabContainer>
  </div>
</template>
```

---

## Patterns and Best Practices

### Pattern 1: Complex Timeline

For multi-step animations:

```ts
export const useStaggerReveal = (
  targets: Ref<HTMLElement[]>,
  options = {}
) => {
  const { ctx } = useGsapContext((gsap) => {
    const tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: motionConfig.durations.normal,
        ease: motionConfig.easings.smooth,
      }
    })

    tl.from(targets.value, {
      y: 50,
      opacity: 0,
      stagger: motionConfig.staggers.normal,
    })
    .from('.title', {
      scale: 0.8,
      opacity: 0,
    }, '<0.2') // 0.2s overlap

    return tl
  })

  return {
    play: () => ctx.value?.play(),
    reverse: () => ctx.value?.reverse(),
  }
}
```

### Pattern 2: ScrollTrigger

```ts
export const useScrollReveal = (
  target: Ref<HTMLElement | null>,
  options = {}
) => {
  const { ctx } = useGsapContext((gsap) => {
    gsap.from(target.value, {
      y: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: target.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        markers: import.meta.dev,
      }
    })
  }, { scope: target })

  return {}
}
```

### Pattern 3: Hover Animation (enter/leave)

```ts
export const useHoverScale = (
  target: Ref<HTMLElement | null>,
  options = {}
) => {
  const isHovered = ref(false)

  const { ctx } = useGsapContext((gsap) => {
    const element = target.value
    if (!element) return

    element.addEventListener('mouseenter', () => {
      isHovered.value = true
      gsap.to(element, {
        scale: 1.1,
        duration: motionConfig.durations.fast,
        ease: motionConfig.easings.back,
      })
    })

    element.addEventListener('mouseleave', () => {
      isHovered.value = false
      gsap.to(element, {
        scale: 1,
        duration: motionConfig.durations.fast,
        ease: motionConfig.easings.smooth,
      })
    })
  }, { scope: target })

  return {
    isHovered: readonly(isHovered),
  }
}
```

---

## Next Implementation Steps

### Step 1: Finalize Lab Infrastructure

#### 1.1 Create Base Lab Components

**HIGH PRIORITY**

Files to create:

1. `components/lab/LabContainer.vue`
   - Grid layout (preview / code / controls)
   - Responsive (mobile: vertical stack)

2. `components/lab/LabPreview.vue`
   - Preview area with iframe or isolated container
   - Theme toggle (light/dark)
   - Size selector (mobile/tablet/desktop)

3. `components/lab/LabCodeViewer.vue`
   - Tabs: Component / Composable / Config
   - Syntax highlighting (use Shiki)
   - "Copy code" button

4. `components/lab/LabExplanation.vue`
   - Sections: UX rationale / Technical / Use cases
   - Markdown support for content

#### 1.2 Create Navigation Pages

1. `pages/index.vue`: Landing page
   - Animated hero (use `useStaggerReveal` to create)
   - CTA to `/lab`

2. `pages/lab/index.vue`: Overview
   - Category grid (buttons, cards, etc.)
   - Use `getAllCategories()` from registry

3. `pages/lab/[category]/index.vue`: List by category
   - Grid of all components in category
   - Filters by tags, complexity

4. `pages/lab/[category]/[component].vue`: Component detail
   - Already described above

### Step 2: Create First Demo Components

#### 2.1 Buttons (3 components to start)

**MagneticButton** (composable already created)
- Create UI component
- Register in registry
- Test in playground

**RippleButton**
- Composable: `useRippleEffect.ts`
- Component: `RippleButton.vue`
- Registration

**MorphButton**
- Composable: `useMorphShape.ts`
- Component: `MorphButton.vue` (button that morphs on hover)
- Registration

#### 2.2 Cards (2 components)

**FlipCard**
- Composable: `use3DFlip.ts`
- Component: `FlipCard.vue`
- 3D flip with perspective on hover

**HoverCard**
- Composable: `useRevealContent.ts`
- Component: `HoverCard.vue`
- Content slides from bottom on hover

#### 2.3 Text (2 components)

**SplitText**
- Composable: `useSplitText.ts` (split by letter/word/line)
- Component: `SplitText.vue`
- Stagger reveal of letters

**TypeWriter**
- Composable: `useTypewriter.ts`
- Component: `TypeWriter.vue`
- Typewriter effect

### Step 3: Code Extraction System

Create `composables/lab/useCodeExtractor.ts`:

```ts
export const useCodeExtractor = (componentId: string) => {
  const componentCode = ref('')
  const composableCode = ref('')
  const configCode = ref('')

  const extractCode = async () => {
    // Read source files (via import.meta.glob or fetch)
    // Parse and format code
    // Return code with syntax highlighting
  }

  return {
    componentCode,
    composableCode,
    configCode,
    extractCode,
  }
}
```

### Step 4: Polish and Optimization

1. **Performance**:
   - Lazy loading of components
   - Code splitting by category
   - Animation optimization (will-change, transform)

2. **Accessibility**:
   - Respect prefers-reduced-motion
   - Keyboard navigation
   - ARIA labels

3. **SEO**:
   - Dynamic meta tags per component
   - Open Graph for sharing
   - Auto-generated sitemap.xml

---

## Startup Checklist

- [x] Architecture defined
- [x] TypeScript types created
- [x] Centralized motion config
- [x] GSAP plugin with cleanup
- [x] `useGsapContext` composable
- [x] `useMagneticEffect` composable
- [x] `useMotionConfig` composable
- [x] Component registry

**Immediate next actions**:

- [ ] Create `LabContainer.vue`
- [ ] Create `LabPreview.vue`
- [ ] Create `LabCodeViewer.vue`
- [ ] Create `LabExplanation.vue`
- [ ] Create `pages/index.vue` (landing)
- [ ] Create `pages/lab/index.vue`
- [ ] Create first complete UI component (MagneticButton)
- [ ] Test complete flow in browser

---

## Reference Resources

### GSAP

- [GSAP Context](https://gsap.com/docs/v3/GSAP/gsap.context())
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Timeline](https://gsap.com/docs/v3/GSAP/Timeline/)

### Nuxt 4

- [Auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports)
- [File-based routing](https://nuxt.com/docs/guide/directory-structure/pages)
- [Composables](https://nuxt.com/docs/guide/directory-structure/composables)

### TypeScript

- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

---

**This architecture is scalable and designed to grow with the project. Every decision was made to maximize maintainability and scalability.**
