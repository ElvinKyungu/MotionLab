<script setup lang="ts">
interface Props {
  code: string
  language?: string
  filename?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'vue',
  filename: '',
})

const copied = ref(false)

const copy = async () => {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// Map language to a short display label
const langLabel = computed(() => {
  const map: Record<string, string> = {
    vue: 'vue', ts: 'ts', bash: 'bash', css: 'css',
  }
  return map[props.language ?? ''] ?? props.language
})
</script>

<template>
  <div class="code-block">
    <!-- Toolbar -->
    <div class="code-toolbar">
      <div class="code-toolbar-left">
        <span v-if="filename" class="code-filename">{{ filename }}</span>
        <span v-else class="code-lang">{{ langLabel }}</span>
      </div>
      <button class="copy-btn" :class="{ copied }" @click="copy">
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>

    <!-- Code -->
    <div class="code-body">
      <pre><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  border-radius: 12px;
  border: 1px solid rgb(31 41 55);
  overflow: hidden;
  background: rgb(3 7 18);
}

.code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgb(31 41 55);
  background: rgb(9 15 31);
}

.code-toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-filename {
  font-size: 12px;
  font-family: 'Roboto Mono', 'Fira Code', monospace;
  color: rgb(56 189 248);
  font-weight: 500;
}

.code-lang {
  font-size: 11px;
  font-family: 'Roboto Mono', 'Fira Code', monospace;
  color: rgb(107 114 128);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-family: 'Roboto', sans-serif;
  color: rgb(107 114 128);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.copy-btn:hover {
  color: rgb(209 213 219);
  background: rgb(31 41 55);
}

.copy-btn.copied {
  color: rgb(52 211 153);
}

.code-body {
  overflow-x: auto;
  padding: 20px 24px;
}

.code-body pre {
  margin: 0;
  font-family: 'Roboto Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 13px;
  line-height: 1.7;
  color: rgb(209 213 219);
  white-space: pre;
}

.code-body code {
  font-family: inherit;
}
</style>
