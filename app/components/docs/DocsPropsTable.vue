<script setup lang="ts">
import type { DocProp, DocEmit, DocSlot } from '~/types/docs'

interface Props {
  props?: DocProp[]
  emits?: DocEmit[]
  slots?: DocSlot[]
}

defineProps<Props>()
</script>

<template>
  <div class="api-tables">
    <!-- Props -->
    <section v-if="props?.length" id="props" class="api-section">
      <h3 class="api-section-title">Props</h3>
      <div class="table-wrapper">
        <table class="api-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prop in props" :key="prop.name">
              <td>
                <code class="prop-name">{{ prop.name }}</code>
                <span v-if="prop.required" class="required-badge">required</span>
              </td>
              <td><code class="prop-type">{{ prop.type }}</code></td>
              <td><code v-if="prop.default" class="prop-default">{{ prop.default }}</code><span v-else class="text-muted">—</span></td>
              <td class="prop-desc">{{ prop.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Emits -->
    <section v-if="emits?.length" id="emits" class="api-section">
      <h3 class="api-section-title">Emits</h3>
      <div class="table-wrapper">
        <table class="api-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emit in emits" :key="emit.name">
              <td><code class="prop-name">{{ emit.name }}</code></td>
              <td><code v-if="emit.payload" class="prop-type">{{ emit.payload }}</code><span v-else class="text-muted">—</span></td>
              <td class="prop-desc">{{ emit.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Slots -->
    <section v-if="slots?.length" id="slots" class="api-section">
      <h3 class="api-section-title">Slots</h3>
      <div class="table-wrapper">
        <table class="api-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in slots" :key="slot.name">
              <td><code class="prop-name">{{ slot.name }}</code></td>
              <td class="prop-desc">{{ slot.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.api-tables {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.api-section-title {
  font-size: 15px;
  font-weight: 600;
  color: rgb(156 163 175);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 12px 0;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid rgb(31 41 55);
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.api-table thead {
  background: rgb(9 15 31);
}

.api-table th {
  padding: 10px 16px;
  text-align: left;
  font-weight: 500;
  color: rgb(107 114 128);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid rgb(31 41 55);
  white-space: nowrap;
}

.api-table tbody tr {
  border-bottom: 1px solid rgb(17 24 39);
  transition: background 0.15s;
}

.api-table tbody tr:last-child {
  border-bottom: none;
}

.api-table tbody tr:hover {
  background: rgb(17 24 39 / 0.5);
}

.api-table td {
  padding: 12px 16px;
  vertical-align: top;
  color: rgb(209 213 219);
}

.prop-name {
  font-family: 'Roboto Mono', ui-monospace, monospace;
  font-size: 12.5px;
  color: rgb(56 189 248);
  background: rgb(14 165 233 / 0.08);
  padding: 2px 6px;
  border-radius: 4px;
}

.prop-type {
  font-family: 'Roboto Mono', ui-monospace, monospace;
  font-size: 12.5px;
  color: rgb(167 139 250);
  background: rgb(139 92 246 / 0.08);
  padding: 2px 6px;
  border-radius: 4px;
}

.prop-default {
  font-family: 'Roboto Mono', ui-monospace, monospace;
  font-size: 12.5px;
  color: rgb(52 211 153);
  background: rgb(52 211 153 / 0.08);
  padding: 2px 6px;
  border-radius: 4px;
}

.prop-desc {
  color: rgb(156 163 175);
  line-height: 1.6;
}

.required-badge {
  margin-left: 6px;
  font-size: 10px;
  font-weight: 600;
  color: rgb(251 146 60);
  background: rgb(251 146 60 / 0.1);
  border: 1px solid rgb(251 146 60 / 0.2);
  padding: 1px 5px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  vertical-align: middle;
}

.text-muted {
  color: rgb(75 85 99);
}
</style>
