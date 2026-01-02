import type { ReactElement } from 'react'
import { MarkdownRenderer } from '@/lib/markdownRender'
import { getContentHash } from '@/utils/contentHash'
import { contentCache } from '@/utils/markdownCache'
import { createLogger } from '@/utils/logger'
import { handleError } from '@/utils/errorHandler'

let rendererInstance: MarkdownRenderer | null = null

const getRenderer = (): MarkdownRenderer => {
  rendererInstance ??= new MarkdownRenderer()
  return rendererInstance
}

export interface RenderedContent {
  dom: ReactElement | null
}

export const renderMarkdown = async (
  markdown: string
): Promise<RenderedContent> => {
  const logger = createLogger('MarkdownRenderer')
  const contentHash = getContentHash(markdown)

  // Check cache first
  try {
    const cached = contentCache.get(contentHash)
    if (cached) {
      logger.cache(`HIT for content: ${contentHash.slice(0, 8)}...`)
      return cached
    }
  } catch (error) {
    logger.warn('Cache read failed, falling back to normal rendering', error)
  }

  try {
    const renderer = getRenderer()
    const { result: dom } = renderer.render(markdown)
    const rendered: RenderedContent = { dom }

    // Cache the result
    try {
      // Use different TTL for development vs production
      const ttl = import.meta.env.DEV ? 5 * 60 * 1000 : 60 * 60 * 1000 // 5 min dev, 1 hour production
      contentCache.set(contentHash, rendered, ttl)
      logger.cache(`SET for content: ${contentHash.slice(0, 8)}...`)
    } catch (cacheError) {
      logger.warn('Cache write failed, continuing without caching', cacheError)
    }

    return rendered
  } catch (error) {
    const appError = handleError(error, 'renderMarkdown')
    throw new Error(appError.message)
  }
}
