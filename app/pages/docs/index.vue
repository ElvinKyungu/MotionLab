<script setup lang="ts">
definePageMeta({ layout: 'docs' })

const { getCategoriesWithEntries } = useDocRegistry()

// Redirect to the first available component
const categories = getCategoriesWithEntries()
const first = categories[0]?.entries[0]

if (first) {
  await navigateTo(`/docs/${first.category}/${first.id}`, { replace: true })
}
</script>

<template>
  <div />
</template>
