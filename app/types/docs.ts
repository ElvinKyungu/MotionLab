import type { ComponentMeta } from './lab'

export interface DocProp {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

export interface DocEmit {
  name: string
  payload?: string
  description: string
}

export interface DocSlot {
  name: string
  description: string
}

export interface DocCodeExample {
  title: string
  description?: string
  code: string
  filename?: string
  language?: 'vue' | 'ts' | 'bash' | 'css'
}

export interface DocEntry extends ComponentMeta {
  /** Plain text summary shown below the title */
  usage: string
  /** Raw component source (imported with ?raw) */
  source: string
  /** Code snippets shown in the Examples section */
  examples: DocCodeExample[]
  props?: DocProp[]
  emits?: DocEmit[]
  slots?: DocSlot[]
}

export interface DocTocItem {
  id: string
  label: string
  depth?: 1 | 2
}
