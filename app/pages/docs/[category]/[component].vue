<script setup lang="ts">
import type { DocTocItem } from '~/types/docs'

definePageMeta({ layout: 'docs' })

const route = useRoute()
const { getById } = useDocRegistry()
const { setToc } = useDocToc()

const entry = computed(() => getById(route.params.component as string))

// 404 if component not found
if (!entry.value) {
  throw createError({ statusCode: 404, statusMessage: 'Component not found' })
}

// Build TOC dynamically from what the entry exposes
const tocItems = computed<DocTocItem[]>(() => {
  if (!entry.value) return []
  const items: DocTocItem[] = [
    { id: 'usage',    label: 'Usage',    depth: 1 },
    { id: 'source',   label: 'Source',   depth: 1 },
  ]
  if (entry.value.examples?.length) {
    items.push({ id: 'examples', label: 'Examples', depth: 1 })
  }
  if (entry.value.props?.length || entry.value.emits?.length || entry.value.slots?.length) {
    items.push({ id: 'api', label: 'API', depth: 1 })
    if (entry.value.props?.length)  items.push({ id: 'props', label: 'Props',   depth: 2 })
    if (entry.value.emits?.length)  items.push({ id: 'emits', label: 'Emits',   depth: 2 })
    if (entry.value.slots?.length)  items.push({ id: 'slots', label: 'Slots',   depth: 2 })
  }
  return items
})

watch(tocItems, (items) => setToc(items), { immediate: true })

useHead({
  title: computed(() => entry.value ? `${entry.value.name} — MotionLab Docs` : 'Docs'),
})

// Live preview — resolve async component
const PreviewComponent = computed(() =>
  entry.value ? defineAsyncComponent(entry.value.component) : null,
)

const complexityColor: Record<string, string> = {
  beginner:     'text-emerald-400 bg-emerald-400/10',
  intermediate: 'text-amber-400 bg-amber-400/10',
  advanced:     'text-red-400 bg-red-400/10',
}
</script>

<template>
  <article v-if="entry" class="doc-page">
    <!-- ── Breadcrumb ── -->
    <nav class="breadcrumb">
      <NuxtLink to="/docs" class="breadcrumb-link">Components</NuxtLink>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">{{ entry.category }}</span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current active">{{ entry.name }}</span>
    </nav>

    <!-- ── Title block ── -->
    <div class="title-block">
      <div class="title-row">
        <h1 class="page-title">{{ entry.name }}</h1>
        <div class="title-badges">
          <span class="badge" :class="complexityColor[entry.complexity]">
            {{ entry.complexity }}
          </span>
          <span
            v-for="type in entry.animationType"
            :key="type"
            class="badge anim-badge"
          >
            {{ type }}
          </span>
        </div>
      </div>
      <p class="page-description">{{ entry.description }}</p>
      <div class="tag-list">
        <span v-for="tag in entry.tags" :key="tag" class="tag">#{{ tag }}</span>
      </div>
    </div>

    <!-- ── Live Preview ── -->
    <div class="preview-block">
      <div class="preview-label">Preview</div>
      <div class="preview-stage">
        <ClientOnly>
          <component :is="PreviewComponent" v-if="PreviewComponent">
            Try me
          </component>
        </ClientOnly>
      </div>
    </div>

    <!-- ── Usage ── -->
    <section id="usage" class="doc-section">
      <h2 class="section-title">Usage</h2>
      <p class="section-text">{{ entry.usage }}</p>
    </section>

    <!-- ── Source ── -->
    <section id="source" class="doc-section">
      <h2 class="section-title">Source</h2>
      <DocsCodeBlock
        :code="entry.source"
        language="vue"
        :filename="`${entry.name.replace(/ /g, '')}.vue`"
      />
    </section>

    <!-- ── Examples ── -->
    <section v-if="entry.examples?.length" id="examples" class="doc-section">
      <h2 class="section-title">Examples</h2>
      <div class="examples-list">
        <div
          v-for="example in entry.examples"
          :key="example.title"
          class="example-item"
        >
          <h3 class="example-title">{{ example.title }}</h3>
          <p v-if="example.description" class="example-desc">
            {{ example.description }}
          </p>
          <DocsCodeBlock
            :code="example.code"
            :language="example.language ?? 'vue'"
            :filename="example.filename"
          />
        </div>
      </div>
    </section>

    <!-- ── API ── -->
    <section
      v-if="entry.props?.length || entry.emits?.length || entry.slots?.length"
      id="api"
      class="doc-section"
    >
      <h2 class="section-title">API</h2>
      <DocsPropsTable
        :props="entry.props"
        :emits="entry.emits"
        :slots="entry.slots"
      />
    </section>
  </article>
</template>

<style scoped>
.doc-page {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

/* ── Breadcrumb ── */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.breadcrumb-link {
  color: rgb(56 189 248);
  text-decoration: none;
  transition: color 0.15s;
}

.breadcrumb-link:hover { color: rgb(125 211 252); }

.breadcrumb-sep {
  color: rgb(55 65 81);
}

.breadcrumb-current {
  color: rgb(75 85 99);
  text-transform: capitalize;
}

.breadcrumb-current.active {
  color: rgb(156 163 175);
}

/* ── Title ── */
.title-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid rgb(17 24 39);
  padding-bottom: 32px;
}

.title-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 700;
  color: rgb(243 244 246);
  margin: 0;
  line-height: 1.1;
}

.title-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding-top: 6px;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  text-transform: capitalize;
}

.anim-badge {
  color: rgb(107 114 128);
  background: rgb(31 41 55);
}

.page-description {
  font-size: 16px;
  color: rgb(107 114 128);
  line-height: 1.7;
  margin: 0;
  max-width: 600px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11.5px;
  color: rgb(75 85 99);
  font-family: 'Roboto Mono', monospace;
}

/* ── Preview ── */
.preview-block {
  border: 1px solid rgb(31 41 55);
  border-radius: 12px;
  overflow: hidden;
}

.preview-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgb(75 85 99);
  padding: 10px 16px;
  border-bottom: 1px solid rgb(31 41 55);
  background: rgb(9 15 31);
}

.preview-stage {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  background: rgb(3 7 18);
}

/* ── Sections ── */
.doc-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  scroll-margin-top: 24px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: rgb(229 231 235);
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid rgb(17 24 39);
}

.section-text {
  font-size: 15px;
  color: rgb(107 114 128);
  line-height: 1.75;
  margin: 0;
}

/* ── Examples ── */
.examples-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.example-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.example-title {
  font-size: 15px;
  font-weight: 600;
  color: rgb(209 213 219);
  margin: 0;
}

.example-desc {
  font-size: 13.5px;
  color: rgb(107 114 128);
  line-height: 1.6;
  margin: 0;
}
</style>
