import type { ReactElement } from 'react'
import type { Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import { MarkdownRenderer } from '@/lib/markdownRender'
import { getContentHash } from '@/utils/contentHash'
import { contentCache } from '@/utils/markdownCache'

let rendererInstance: MarkdownRenderer | null = null

const getRenderer = (): MarkdownRenderer => {
  rendererInstance ??= new MarkdownRenderer()
  return rendererInstance
}

export interface RenderedContent {
  dom: ReactElement | null
  mdast: MdastRoot | null
  hast: HastRoot | null
}

export const renderMarkdown = async (
  markdown: string
): Promise<RenderedContent> => {
  const contentHash = getContentHash(markdown)

  // Check cache first
  try {
    const cached = contentCache.get(contentHash)
    if (cached) {
      if (import.meta.env.DEV) {
        console.log(`Cache HIT for content: ${contentHash.slice(0, 8)}...`)
      }
      return cached
    }
  } catch (error) {
    console.warn('Cache read failed, falling back to normal rendering:', error)
  }

  try {
    const renderer = getRenderer()
    const { result: dom, mdast, hast } = renderer.render(markdown)
    const rendered: RenderedContent = { dom, mdast, hast }

    // Cache the result
    try {
      // Use different TTL for development vs production
      const ttl = import.meta.env.DEV ? 5 * 60 * 1000 : 60 * 60 * 1000 // 5 min dev, 1 hour production
      contentCache.set(contentHash, rendered, ttl)
      if (import.meta.env.DEV) {
        console.log(`Cache SET for content: ${contentHash.slice(0, 8)}...`)
      }
    } catch (cacheError) {
      console.warn(
        'Cache write failed, continuing without caching:',
        cacheError
      )
    }

    return rendered
  } catch (error) {
    console.error('Failed to render markdown:', error)
    throw new Error('Failed to render Markdown')
  }
}
