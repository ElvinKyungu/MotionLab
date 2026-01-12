/**
 * Central registry for all laboratory components
 *
 * This composable is the heart of the navigation system.
 * Each new component must be registered here with its metadata.
 *
 * Dynamic routing uses this registry to:
 * - Generate category pages
 * - Display components in the playground
 * - Provide metadata (description, tags, etc.)
 */

import type { ComponentMeta, ComponentCategory } from '~/types/lab'

/**
 * Definition of all available components
 */
const COMPONENT_REGISTRY: ComponentMeta[] = [
  // Example registered component
  // {
  //   id: 'magnetic-button',
  //   name: 'Magnetic Button',
  //   category: 'buttons',
  //   description: 'Button that follows cursor with magnetic effect based on distance',
  //   tags: ['hover', 'mouse', 'interactive'],
  //   complexity: 'intermediate',
  //   animationType: ['hover'],
  //   gsapFeatures: ['timeline'],
  //   component: () => import('~/components/ui/buttons/MagneticButton.vue'),
  // },
]

/**
 * Structure to organize components by category
 */
interface CategoryInfo {
  id: ComponentCategory
  name: string
  description: string
  icon?: string
  count: number
}

export const useComponentRegistry = () => {
  /**
   * Get all components
   */
  const getAllComponents = (): ComponentMeta[] => {
    return COMPONENT_REGISTRY
  }

  /**
   * Get components by specific category
   */
  const getByCategory = (category: ComponentCategory): ComponentMeta[] => {
    return COMPONENT_REGISTRY.filter(c => c.category === category)
  }

  /**
   * Get component by ID
   */
  const getById = (id: string): ComponentMeta | undefined => {
    return COMPONENT_REGISTRY.find(c => c.id === id)
  }

  /**
   * Get components by tags
   */
  const getByTags = (tags: string[]): ComponentMeta[] => {
    return COMPONENT_REGISTRY.filter(c =>
      tags.some(tag => c.tags.includes(tag))
    )
  }

  /**
   * Get components by complexity
   */
  const getByComplexity = (complexity: ComponentMeta['complexity']): ComponentMeta[] => {
    return COMPONENT_REGISTRY.filter(c => c.complexity === complexity)
  }

  /**
   * Get all categories with their info
   */
  const getAllCategories = (): CategoryInfo[] => {
    const categories: Record<ComponentCategory, Omit<CategoryInfo, 'count'>> = {
      buttons: {
        id: 'buttons',
        name: 'Buttons',
        description: 'Interactive buttons with micro-interactions',
      },
      cards: {
        id: 'cards',
        name: 'Cards',
        description: 'Cards with hover effects and transitions',
      },
      sections: {
        id: 'sections',
        name: 'Sections',
        description: 'Hero sections and layouts with entrance animations',
      },
      forms: {
        id: 'forms',
        name: 'Forms',
        description: 'Inputs and forms with animated feedback',
      },
      text: {
        id: 'text',
        name: 'Text',
        description: 'Typographic effects and text animations',
      },
      navigation: {
        id: 'navigation',
        name: 'Navigation',
        description: 'Menus and navigation with transitions',
      },
      overlays: {
        id: 'overlays',
        name: 'Overlays',
        description: 'Modals, drawers and animated overlays',
      },
    }

    return Object.entries(categories).map(([key, value]) => ({
      ...value,
      count: getByCategory(key as ComponentCategory).length,
    }))
  }

  /**
   * Get all unique tags
   */
  const getAllTags = (): string[] => {
    const tags = new Set<string>()
    COMPONENT_REGISTRY.forEach(c => {
      c.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }

  /**
   * Search components by query term
   */
  const search = (query: string): ComponentMeta[] => {
    const lowerQuery = query.toLowerCase()
    return COMPONENT_REGISTRY.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  return {
    getAllComponents,
    getByCategory,
    getById,
    getByTags,
    getByComplexity,
    getAllCategories,
    getAllTags,
    search,
  }
}
