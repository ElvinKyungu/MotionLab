<script setup lang="ts">
import type { BaseAnimatedComponentProps } from '~/types/components'

interface Props extends BaseAnimatedComponentProps {
  strength?: number
  radius?: number
}

const props = withDefaults(defineProps<Props>(), {
  strength: 0.3,
  radius: 120,
})

const emit = defineEmits<{
  'animation-start': []
  'animation-complete': []
}>()

const buttonRef = ref<HTMLElement | null>(null)

useMagneticEffect(buttonRef, {
  strength: props.strength,
  radius: props.radius,
  onEnter: () => emit('animation-start'),
  onLeave: () => emit('animation-complete'),
})
</script>

<template>
  <button ref="buttonRef" class="magnetic-btn">
    <slot />
  </button>
</template>

<style scoped>
.magnetic-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  border: none;
  outline: none;
  will-change: transform;
  box-shadow: 0 8px 32px rgba(14, 165, 233, 0.25);
  transition: box-shadow 0.3s;
}

.magnetic-btn:hover {
  box-shadow: 0 12px 40px rgba(14, 165, 233, 0.45);
}
</style>
