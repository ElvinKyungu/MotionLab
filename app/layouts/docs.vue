<script setup lang="ts">
const sidebarOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => { sidebarOpen.value = false })
</script>

<template>
  <div class="docs-shell">
    <!-- ── Header ── -->
    <header class="docs-header">
      <div class="header-inner">
        <div class="header-left">
          <!-- Hamburger (mobile only) -->
          <button
            class="hamburger"
            aria-label="Toggle sidebar"
            @click="sidebarOpen = !sidebarOpen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <NuxtLink to="/" class="header-logo">MotionLab</NuxtLink>
          <span class="header-divider" />
          <span class="header-section">Docs</span>
        </div>

        <nav class="header-nav">
          <NuxtLink to="/" class="header-link">Home</NuxtLink>
          <NuxtLink to="/lab" class="header-link">Lab</NuxtLink>
          <a
            href="https://github.com/ElvinKyungu/MotionLab"
            target="_blank"
            rel="noopener"
            class="header-link header-github"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </nav>
      </div>
    </header>

    <!-- ── Body (sidebar + content + toc) ── -->
    <div class="docs-body">
      <!-- Mobile overlay -->
      <Transition name="fade">
        <div
          v-if="sidebarOpen"
          class="sidebar-overlay"
          @click="sidebarOpen = false"
        />
      </Transition>

      <!-- Left sidebar -->
      <aside class="docs-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <DocsSidebar />
      </aside>

      <!-- Main scrollable content -->
      <main class="docs-main">
        <div class="docs-content">
          <slot />
        </div>
      </main>

      <!-- Right TOC -->
      <aside class="docs-toc">
        <DocsToc />
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* ── Shell: fills the full viewport height ── */
.docs-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: rgb(3 7 18);
  color: rgb(209 213 219);
  font-family: 'Roboto', sans-serif;
}

/* ── Header ── */
.docs-header {
  flex-shrink: 0;
  height: 56px;
  background: rgb(3 7 18 / 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgb(31 41 55);
  z-index: 50;
}

.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hamburger {
  display: none;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgb(107 114 128);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.15s;
}

.hamburger:hover { color: rgb(209 213 219); }

.header-logo {
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #38bdf8, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  white-space: nowrap;
}

.header-divider {
  width: 1px;
  height: 16px;
  background: rgb(31 41 55);
}

.header-section {
  font-size: 13px;
  color: rgb(75 85 99);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.header-link {
  font-size: 13.5px;
  color: rgb(107 114 128);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.header-link:hover {
  color: rgb(209 213 219);
  background: rgb(17 24 39);
}

.header-github {
  display: flex;
  align-items: center;
  padding: 6px 8px;
}

/* ── Body: 3-column flex row ── */
.docs-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

/* ── Sidebar ── */
.docs-sidebar {
  width: 256px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid rgb(17 24 39);
  background: rgb(3 7 18);
}

/* ── Main ── */
.docs-main {
  flex: 1;
  overflow-y: auto;
  min-width: 0;
}

.docs-content {
  max-width: 780px;
  padding: 48px 48px 96px;
}

/* ── TOC ── */
.docs-toc {
  width: 220px;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 0 24px;
  border-left: 1px solid rgb(17 24 39);
}

/* ── Mobile overlay ── */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.6);
  z-index: 39;
}

/* ── Transitions ── */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 1280px) {
  .docs-toc { display: none; }
  .docs-content { max-width: none; padding: 40px 40px 80px; }
}

@media (max-width: 768px) {
  .hamburger { display: flex; }

  .docs-sidebar {
    position: fixed;
    top: 56px;
    left: 0;
    bottom: 0;
    z-index: 40;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    border-right-color: rgb(31 41 55);
  }

  .docs-sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-overlay { display: block; }

  .docs-content { padding: 24px 20px 64px; }
}
</style>
