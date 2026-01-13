# MotionLab

**A UI animation laboratory to master GSAP and motion design in Nuxt 4.**

MotionLab is not a component library. It's a learning tool that breaks down, explains, and demonstrates how to architect performant and maintainable web animations.

---

## Why MotionLab Exists

### The Problem

Most frontend developers copy-paste animations without understanding:
- How they actually work
- Why certain durations or easings are chosen
- How to structure them for reusability
- How to avoid memory leaks and performance bugs

Tutorials often show isolated examples without architectural context. UI libraries hide animation logic behind abstractions that prevent learning.

### The Solution

MotionLab exposes **all animation logic**:
- Complete source code of each component
- Reusable GSAP composables
- Centralized configuration (durations, easings, timings)
- UX explanations for each technical choice

Every animation can be replayed, inspected, and modified in real-time in an interactive playground.

---

## Tech Stack

| Technology | Role | Justification |
|------------|------|---------------|
| **Nuxt 4** | Frontend framework | File-based routing, auto-imports, TypeScript by default |
| **GSAP** | Animation engine | Industry standard for complex animations (timelines, ScrollTrigger, etc.) |
| **TypeScript** | Static typing | Ensure consistency of animation configurations |
| **Nuxt UI** | Design system | Base non-animated components (buttons, basic inputs) |

### Why GSAP and not CSS?

**CSS is used** for simple transitions (hover on a basic button).

**GSAP is used** when:
- Animation depends on scroll (ScrollTrigger)
- We need complex sequences (timelines)
- We want precise timing control (pause, reverse, seek)
- We animate properties not supported by CSS (SVG morphing, etc.)

GSAP also offers automatic cleanup via `gsap.context()`, avoiding memory leaks in an SPA.

---

## Project Architecture

### Philosophy

**Strict separation of concerns**:

```
UI Components      →   Call composables
   ↓
Composables        →   Contain GSAP logic
   ↓
Utils/Config       →   Define values (durations, easings)
```

No UI component contains GSAP code directly. All animation logic is isolated in reusable composables.

### Folder Structure

```
app/
├── pages/                                  # Nuxt routing
│   ├── index.vue                          # Landing page
│   └── lab/
│       ├── index.vue                      # Overview (category grid)
│       └── [category]/
│           ├── index.vue                  # Category component list
│           └── [component].vue            # Component detail
│
├── components/
│   ├── ui/                                # Animated components (project core)
│   │   ├── buttons/
│   │   │   ├── MagneticButton.vue        # Button with magnetic effect
│   │   │   └── RippleButton.vue          # Button with ripple effect
│   │   ├── cards/
│   │   │   └── FlipCard.vue              # Card that flips on hover
│   │   ├── sections/
│   │   │   └── HeroReveal.vue            # Hero section with stagger reveal
│   │   ├── forms/
│   │   │   └── AnimatedInput.vue         # Input with floating label
│   │   └── text/
│   │       └── SplitText.vue             # Text animated letter by letter
│   │
│   └── lab/                               # Playground infrastructure
│       ├── LabContainer.vue               # Main lab layout
│       ├── LabPreview.vue                 # Preview area + controls
│       ├── LabCodeViewer.vue              # Code display with syntax highlighting
│       └── LabExplanation.vue             # Explanation panel
│
├── composables/
│   ├── animations/                        # Reusable GSAP logic
│   │   ├── useGsapContext.ts             # Wrapper for gsap.context() with auto cleanup
│   │   ├── useMagneticEffect.ts          # Generic magnetic effect
│   │   ├── useScrollTrigger.ts           # ScrollTrigger with auto cleanup
│   │   └── useSplitText.ts               # Text splitting for animations
│   │
│   ├── lab/                               # Playground logic
│   │   ├── useComponentRegistry.ts       # Central component registry
│   │   └── useAnimationControls.ts       # Play/pause/reset animations
│   │
│   └── useMotionConfig.ts                 # Access to motion config
│
├── utils/
│   └── motion/
│       └── config.ts                      # ⭐ Single source of truth
│                                          # Centralized durations, easings, delays
│
├── types/
│   ├── motion.ts                          # Types for animations
│   ├── lab.ts                             # Types for playground
│   └── components.ts                      # Types for UI components
│
└── plugins/
    └── gsap.client.ts                     # GSAP config (client-only)
```

### Critical Architecture Points

#### 1. Centralized Configuration (`utils/motion/config.ts`)

**Problem solved**: Animations have inconsistent durations/easings if each component defines its own values.

**Solution**: All values in `motionConfig`:

```ts
export const motionConfig = {
  durations: {
    fast: 0.2,      // Micro-interactions
    normal: 0.4,    // Standard transitions
    slow: 0.6,      // Complex animations
  },
  easings: {
    smooth: 'power2.out',    // 90% of cases
    elastic: 'elastic.out',  // "Playful" effects
  }
}
```

Changing `durations.normal` updates all animations using it.

#### 2. Animation Composables (`composables/animations/`)

**Problem solved**: Duplicated GSAP code in every component.

**Solution**: Isolated and testable logic.

Example with `useMagneticEffect`:

```vue
<!-- components/ui/buttons/MagneticButton.vue -->
<script setup>
const buttonRef = ref(null)
const { isActive } = useMagneticEffect(buttonRef, {
  strength: 0.3,
  speed: 0.5
})
</script>

<template>
  <button ref="buttonRef">
    <slot />
  </button>
</template>
```

The composable handles:
- Offset calculations
- GSAP animation
- Automatic cleanup (`onBeforeUnmount`)

#### 3. Component Registry (`useComponentRegistry`)

**Problem solved**: Adding a new component requires touching multiple files (route, navigation, etc.).

**Solution**: One place to register a component.

```ts
const COMPONENT_REGISTRY: ComponentMeta[] = [
  {
    id: 'magnetic-button',
    name: 'Magnetic Button',
    category: 'buttons',
    description: 'Button that follows cursor with magnetic effect',
    tags: ['hover', 'interactive'],
    complexity: 'intermediate',
    component: () => import('~/components/ui/buttons/MagneticButton.vue'),
  },
]
```

Dynamic routing does the rest:
- Generates `/lab/buttons/magnetic-button`
- Displays component in playground
- Provides metadata for navigation

#### 4. Client-only GSAP Plugin (`plugins/gsap.client.ts`)

**Problem solved**: GSAP doesn't work in SSR (no `window`).

**Solution**: `.client.ts` suffix for client-only execution.

The plugin:
- Registers GSAP plugins (ScrollTrigger, etc.)
- Detects `prefers-reduced-motion` for accessibility
- Cleans up animations on route changes

---

## Animation Philosophy

### Applied UX Principles

Every animation in MotionLab follows these rules:

#### 1. No Gratuitous Animation

An animation without a UX purpose is visual noise. Every animation has a role:

| Animation | UX Goal |
|-----------|---------|
| Magnetic Button | Give feedback before click (affordance) |
| Ripple Effect | Visually confirm click point |
| Stagger Reveal | Guide the eye in reading order |
| Floating Label | Save vertical space while keeping context |

#### 2. Context-Appropriate Durations

```ts
durations: {
  instant: 0,        // State changes without transition
  fast: 0.2,         // Hover, micro-interactions (must be instant)
  normal: 0.4,       // State transitions (neither too fast nor slow)
  slow: 0.6,         // Animations that tell a story
  verySlow: 1,       // Hero sections, important reveals
}
```

**Rule**: The further an element moves or the more drastically it changes, the longer the duration.

#### 3. Intentional Easings

```ts
easings: {
  smooth: 'power2.out',     // Default - natural deceleration
  elastic: 'elastic.out',   // Playful effect - CTA buttons
  expo: 'expo.out',         // Long distance - slideshows
  back: 'back.out(1.7)',    // Slight anticipation - modals
}
```

**power2.out** is used 90% of the time (smooth, natural deceleration).

**elastic/bounce** only for elements that need to grab attention (CTAs, notifications).

#### 4. Performance First

- Animate only `transform` and `opacity` (GPU-accelerated)
- Avoid `width`, `height`, `top`, `left` (trigger reflow)
- Use `will-change` for complex animations
- `gsap.context()` to avoid memory leaks

---

## Component Organization

### Anatomy of an Animated Component

Using a magnetic button as an example:

**1. The Composable** (`composables/animations/useMagneticEffect.ts`)

```ts
export const useMagneticEffect = (target, options) => {
  // Pure logic:
  // - Offset calculations
  // - GSAP animation
  // - Automatic cleanup

  return {
    isActive,
    enable,
    disable,
  }
}
```

**2. The UI Component** (`components/ui/buttons/MagneticButton.vue`)

```vue
<script setup>
const buttonRef = ref(null)

// Component contains NO GSAP logic
// Delegates everything to the composable
const { isActive } = useMagneticEffect(buttonRef, {
  strength: 0.3,
  speed: 0.5
})
</script>

<template>
  <button ref="buttonRef" :class="{ active: isActive }">
    <slot />
  </button>
</template>
```

**3. Registration** (in `useComponentRegistry`)

```ts
{
  id: 'magnetic-button',
  name: 'Magnetic Button',
  category: 'buttons',
  component: () => import('~/components/ui/buttons/MagneticButton.vue'),
}
```

**Result**:
- Composable is testable in isolation
- Component is readable and maintainable
- Registration automatically generates route

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| UI Component | PascalCase + descriptive | `MagneticButton.vue` |
| Animation Composable | `use` + effect | `useMagneticEffect.ts` |
| Lab Composable | `use` + feature | `useComponentRegistry.ts` |
| Type | PascalCase + suffix | `AnimationConfig` |
| Config | camelCase | `motionConfig` |

---

## Playground Features

### Overview

The playground lets you explore each component with:

1. **Interactive Preview**: Component in action
2. **Controls**: Modify duration, easing, etc. in real-time
3. **Source Code**: Component code + composable used
4. **Explanation**: Why this animation, how it works

### Playground Architecture

```
LabContainer
├── LabPreview          → Preview area + display controls
│   ├── Theme toggle    → Light/Dark
│   └── Size selector   → Mobile/Tablet/Desktop
│
├── LabCodeViewer       → Source code with syntax highlighting
│   ├── Component tab   → Vue component code
│   ├── Composable tab  → GSAP composable code
│   └── Config tab      → Motion config extract
│
├── LabControls         → Sliders to modify animation
│   ├── Duration        → Adjust duration
│   ├── Easing          → Change easing
│   └── Custom params   → Specific params (strength, etc.)
│
└── LabExplanation      → Textual explanations
    ├── UX rationale    → Why this animation
    ├── Technical       → How it works
    └── Use cases       → When to use it
```

### Example User Flow

1. **Navigation**: `/lab/buttons` → lists all animated buttons
2. **Selection**: Click "Magnetic Button" → `/lab/buttons/magnetic-button`
3. **Exploration**:
   - Preview: Hover button, see magnetic effect
   - Controls: Modify strength (0.1 → 0.8), see difference
   - Code: Understand how `useMagneticEffect` works
   - Explanation: Read why this effect improves affordance

---

## Project Roadmap

### Phase 1: Foundations (Current)

- [x] Base architecture
- [x] Dynamic routing system
- [x] Centralized motion config
- [x] GSAP plugin with auto cleanup
- [ ] First composable: `useMagneticEffect`
- [ ] First component: `MagneticButton`
- [ ] Playground layout (`LabContainer`, `LabPreview`, etc.)

### Phase 2: Base Library

**Goal**: 15-20 components covering most common patterns.

**Buttons** (5 components)
- MagneticButton
- RippleButton
- MorphButton (button that changes shape)
- GooeyButton (gooey blob effect)
- ParticleButton (particles on click)

**Cards** (4 components)
- FlipCard (3D flip on hover)
- HoverCard (content reveals)
- TiltCard (3D parallax on mouse move)
- ExpandCard (expanding card)

**Text** (4 components)
- SplitText (letters/words animated one by one)
- TypeWriter (typewriter effect)
- ScrambleText (text scramble/reveal)
- GlitchText (glitch effect on hover)

**Sections** (3 components)
- HeroReveal (hero with stagger reveal)
- ParallaxSection (parallax backgrounds)
- ScrollReveal (scroll-triggered reveal)

**Forms** (3 components)
- FloatingLabel (label floats on focus)
- AnimatedInput (input with animated feedback)
- StepIndicator (animated progress indicator)

### Phase 3: Advanced Features

- [ ] Code export (copy component + composable)
- [ ] "Compare" mode (see two animations side by side)
- [ ] Variant saving (save custom configs)
- [ ] Timeline scrubber (navigate frame by frame)
- [ ] Performance profiler (measure FPS, reflows)

### Phase 4: Community

- [ ] Contribution system (propose components)
- [ ] Shareable playground (URLs with serialized state)
- [ ] Collections (create component playlists)
- [ ] Challenges (reproduce a given animation)

---

## Learning Objectives

By exploring MotionLab, developers learn to:

### 1. Think of Animation as a UX Tool

- Identify when animation improves UX (and when it degrades it)
- Choose durations and easings appropriate to context
- Respect user preferences (`prefers-reduced-motion`)

### 2. Architect Animations in Nuxt

- Isolate animation logic in composables
- Manage lifecycle (automatic cleanup)
- Avoid memory leaks and SSR bugs
- Centralize configuration for consistency

### 3. Master GSAP

- Use `gsap.context()` for cleanup
- Create complex timelines
- Integrate ScrollTrigger
- Optimize performance (GPU, will-change)

### 4. Create Reusable Components

- Expose props for configuration
- Provide slots for flexibility
- Emit events for integrations
- Document use cases

---

## Target Audience

### Intermediate Frontend Developers

You know Vue/Nuxt and CSS, but want to level up with advanced animations.

**What you'll learn**:
- How to think about animation before coding it
- How to structure maintainable GSAP code
- Architectural patterns for animations

### Senior Developers Looking to Upskill

You master frontend development, but animations remain a weak point.

**What you'll learn**:
- UX principles behind each animation type
- Performance best practices
- How to evaluate animation quality

### Recruiters and Hiring Managers

MotionLab demonstrates:
- Deep understanding of frontend architecture
- Ability to create reusable abstractions
- Attention to UX and accessibility
- Mastery of TypeScript, Nuxt 4, and GSAP

---

## Installation and Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm, pnpm, yarn or bun

### Installation

```bash
# Clone repository
git clone https://github.com/ElvinKyungu/MotionLab.git
cd MotionLab

# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

Hot-reload is enabled. All changes are immediately visible.

### Production Build

```bash
# Generate optimized build
npm run build

# Preview build
npm run preview
```

---

## Future Evolution Possibilities

### 1. "Builder" Mode

A visual editor to create animations:
- Drag & drop keyframes on a timeline
- Visual adjustment of bezier curves (easings)
- Export generated GSAP code

**Educational value**: Understand the relationship between visual controls and GSAP code.

### 2. Storybook Integration

Expose components as Storybook stories:
- Facilitates integration in other projects
- Allows testing components in isolation
- Automatically generates documentation

### 3. Nuxt Plugin

Transform MotionLab into a Nuxt plugin:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@motionlab/nuxt']
})
```

Components become auto-imported in any Nuxt project.

### 4. Interactive Courses

Add "Learn" mode with guided tutorials:
- "Create your first animation composable"
- "Master GSAP timelines"
- "ScrollTrigger from A to Z"

Each course includes exercises with automatic validation.

### 5. Generation API

Generate animated components via API:

```ts
const { component } = await $fetch('/api/generate', {
  method: 'POST',
  body: {
    type: 'button',
    animation: 'magnetic',
    config: { strength: 0.5 }
  }
})
```

Useful for no-code tools or headless CMS.

---

## Important Technical Details

### SSR Handling

GSAP doesn't work in SSR (no access to `window`, `document`).

**Solution**:
- Plugin suffixed `.client.ts` for client-only execution
- Composables check `import.meta.client` before accessing DOM
- Use `onMounted` for entrance animations

```ts
// ✅ Correct
onMounted(() => {
  gsap.to(element.value, { x: 100 })
})

// ❌ Incorrect (SSR crash)
gsap.to(element.value, { x: 100 })
```

### Cleanup and Memory Leaks

Every GSAP timeline must be cleaned up to avoid memory leaks.

**Solution**: Use `gsap.context()` which cleans automatically:

```ts
const { ctx } = useGsapContext((gsap) => {
  gsap.to('.element', { x: 100 })
})

// onBeforeUnmount, ctx is automatically reverted
```

### Animation Performance

**Strict rules**:
- Animate only `transform` and `opacity` (GPU-accelerated)
- Use `will-change` for long animations
- Avoid complex selectors (`document.querySelectorAll`)
- Prefer Vue refs (`ref` / `$refs`)

```ts
// ✅ Performant
gsap.to(element.value, {
  x: 100,           // transform: translateX(100px)
  opacity: 0.5,
  duration: 0.3
})

// ❌ Slow (triggers reflow)
gsap.to(element.value, {
  width: 200,       // Triggers reflow
  height: 100,
  duration: 0.3
})
```

### Accessibility

The GSAP plugin detects `prefers-reduced-motion`:

```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(0)  // Disable all animations
  ScrollTrigger.disable()
}
```

All composables respect this preference via `useMotionConfig`.

---

## Contributing

This project is currently in initial development phase. Contributions will be open once the base is stable (end of Phase 1).

**For early adopters**:
- Issues are open to report bugs or suggest improvements
- Discussions are welcome to suggest components or features

---

## License

MIT License - Free to use, modify, and distribute.

MotionLab's goal is to share knowledge. Use it, learn from it, and share it forward.

---

## Additional Resources

### Official Documentation

- [GSAP Documentation](https://gsap.com/docs/v3/)
- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### UX/Motion Principles

- [Material Design Motion](https://m3.material.io/styles/motion/overview)
- [iOS Human Interface Guidelines - Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [The UX of Animation](https://uxdesign.cc/the-ultimate-guide-to-proper-use-of-animation-in-ux-10bd98614fa9)

### Inspiration

- [Codrops](https://tympanus.net/codrops/) - Advanced animation tutorials
- [Awwwards](https://www.awwwards.com/) - Sites with exceptional animations
- [CodePen](https://codepen.io/tag/gsap) - Community GSAP examples

---

**Built with passion to democratize motion design on the web.**
