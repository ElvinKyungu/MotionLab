<script setup lang="ts">
const { items, activeId, setActive } = useDocToc()

// Observe section headings and update activeId
onMounted(() => {
  if (!items.value.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActive(entry.target.id)
          break
        }
      }
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
  )

  items.value.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <aside v-if="items.length" class="toc">
    <p class="toc-title">On this page</p>
    <nav>
      <ul class="toc-list">
        <li
          v-for="item in items"
          :key="item.id"
          :class="['toc-item', `depth-${item.depth ?? 1}`]"
        >
          <a
            :href="`#${item.id}`"
            class="toc-link"
            :class="{ active: activeId === item.id }"
            @click.prevent="
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              setActive(item.id)
            "
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.toc {
  padding: 32px 0 40px;
}

.toc-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgb(107 114 128);
  margin: 0 0 14px;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-link {
  display: block;
  font-size: 13px;
  color: rgb(107 114 128);
  text-decoration: none;
  padding: 4px 0 4px 12px;
  border-left: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
  line-height: 1.4;
}

.toc-link:hover {
  color: rgb(209 213 219);
}

.toc-link.active {
  color: rgb(56 189 248);
  border-left-color: rgb(56 189 248);
}

.toc-item.depth-2 .toc-link {
  padding-left: 24px;
  font-size: 12.5px;
}
</style>
