<script setup lang="ts">
import type { BaseAnimatedComponentProps } from '~/types/components'

interface Props extends BaseAnimatedComponentProps {
  rippleColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  rippleColor: 'rgba(255, 255, 255, 0.35)',
})

const emit = defineEmits<{
  'animation-start': []
  'animation-complete': []
}>()

const buttonRef = ref<HTMLElement | null>(null)

useRippleEffect(buttonRef, {
  color: props.rippleColor,
  onStart: () => emit('animation-start'),
  onComplete: () => emit('animation-complete'),
})
</script>

<template>
  <button ref="buttonRef" class="ripple-btn">
    <slot />
  </button>
</template>

<style scoped>
.ripple-btn {
  position: relative;
  overflow: hidden;
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
  box-shadow: 0 8px 32px rgba(14, 165, 233, 0.25);
  transition: box-shadow 0.3s, transform 0.15s;
  user-select: none;
}

.ripple-btn:active {
  transform: scale(0.97);
}
</style>
