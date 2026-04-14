/**
 * Shared TOC state between the docs page and the docs layout
 *
 * The page populates the items via setToc(), the layout reads them
 * and highlights the active section via IntersectionObserver.
 */

import type { DocTocItem } from '~/types/docs'

export const useDocToc = () => {
  const items = useState<DocTocItem[]>('doc-toc-items', () => [])
  const activeId = useState<string>('doc-toc-active', () => '')

  const setToc = (tocItems: DocTocItem[]) => {
    items.value = tocItems
    activeId.value = tocItems[0]?.id ?? ''
  }

  const setActive = (id: string) => {
    activeId.value = id
  }

  return { items, activeId, setToc, setActive }
}
