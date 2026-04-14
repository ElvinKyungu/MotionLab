<script setup lang="ts">
const route = useRoute()
const { getCategoriesWithEntries } = useDocRegistry()

const categories = computed(() => getCategoriesWithEntries())

const query = ref('')

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return categories.value
  return categories.value
    .map(cat => ({
      ...cat,
      entries: cat.entries.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.tags.some(t => t.includes(q)),
      ),
    }))
    .filter(cat => cat.entries.length > 0)
})

const isActive = (id: string) => route.path.endsWith(`/${id}`)
</script>

<template>
  <aside class="sidebar">
    <!-- Search filter -->
    <div class="sidebar-search">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        v-model="query"
        type="text"
        placeholder="Filter..."
        class="search-input"
        spellcheck="false"
      >
      <kbd class="search-kbd">/</kbd>
    </div>

    <!-- Category groups -->
    <nav class="sidebar-nav">
      <div
        v-for="category in filtered"
        :key="category.id"
        class="category-group"
      >
        <p class="category-label">{{ category.name }}</p>
        <ul class="entry-list">
          <li v-for="entry in category.entries" :key="entry.id">
            <NuxtLink
              :to="`/docs/${entry.category}/${entry.id}`"
              class="entry-link"
              :class="{ active: isActive(entry.id) }"
            >
              {{ entry.name }}
              <span class="complexity-badge" :class="entry.complexity">
                {{ entry.complexity }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <p v-if="filtered.length === 0" class="no-results">
        No results for "{{ query }}"
      </p>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 0 40px;
  overflow-y: auto;
  gap: 0;
}

/* ── Search ── */
.sidebar-search {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 16px 24px;
  background: rgb(17 24 39);
  border: 1px solid rgb(31 41 55);
  border-radius: 8px;
  padding: 0 10px;
  gap: 8px;
  transition: border-color 0.2s;
}

.sidebar-search:focus-within {
  border-color: rgb(14 165 233 / 0.5);
}

.search-icon {
  color: rgb(75 85 99);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: rgb(209 213 219);
  font-size: 13px;
  font-family: 'Roboto', sans-serif;
  padding: 8px 0;
  min-width: 0;
}

.search-input::placeholder {
  color: rgb(75 85 99);
}

.search-kbd {
  font-size: 10px;
  color: rgb(75 85 99);
  background: rgb(31 41 55);
  border: 1px solid rgb(55 65 81);
  border-radius: 4px;
  padding: 2px 5px;
  font-family: 'Roboto Mono', monospace;
  flex-shrink: 0;
}

/* ── Navigation ── */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 0 8px;
}

.category-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.category-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgb(107 114 128);
  padding: 0 8px 6px;
  margin: 0;
}

.entry-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.entry-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 13.5px;
  color: rgb(156 163 175);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
  border-left: 2px solid transparent;
}

.entry-link:hover {
  color: rgb(229 231 235);
  background: rgb(17 24 39);
}

.entry-link.active {
  color: rgb(56 189 248);
  background: rgb(14 165 233 / 0.08);
  border-left-color: rgb(56 189 248);
  font-weight: 500;
}

/* ── Complexity badge ── */
.complexity-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 20px;
  text-transform: capitalize;
  letter-spacing: 0.02em;
}

.complexity-badge.beginner {
  color: rgb(52 211 153);
  background: rgb(52 211 153 / 0.1);
}

.complexity-badge.intermediate {
  color: rgb(251 191 36);
  background: rgb(251 191 36 / 0.1);
}

.complexity-badge.advanced {
  color: rgb(248 113 113);
  background: rgb(248 113 113 / 0.1);
}

.no-results {
  font-size: 13px;
  color: rgb(75 85 99);
  padding: 8px 10px;
  margin: 0;
}
</style>
