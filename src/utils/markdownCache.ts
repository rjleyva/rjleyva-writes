import type { RenderedContent } from '@/services/markdownRenderingService'
import { config } from './config'
import { createLogger } from './logger'

interface CacheEntry {
  content: RenderedContent
  lastAccessed: number
  accessCount: number
  expiresAt: number
}

class MarkdownLRUCache {
  private cache = new Map<string, CacheEntry>()
  private readonly maxSize: number
  private logger = createLogger('MarkdownCache')

  constructor(maxSize = 50) {
    this.maxSize = maxSize

    // Development memory monitoring (only if cache is enabled)
    if (config.features.enableCache && import.meta.env.DEV) {
      setInterval(() => {
        let totalChars = 0
        let itemCount = this.cache.size

        for (const entry of this.cache.values()) {
          try {
            // Development estimate character count monitoring
            totalChars += JSON.stringify(entry.content).length
          } catch {
            // Fallback for non-serializable content
            totalChars += 1000
          }
        }

        // Estimate MB (2 bytes/character on average)
        const sizeMB = ((totalChars * 2) / 1024 / 1024).toFixed(2)
        this.logger.cache(
          `${itemCount}/${this.maxSize} items, ~${sizeMB}MB estimated`
        )
      }, 30000) // Every 30 seconds
    }

    // Development cache invalidation on HMR
    if (config.features.enableCache && import.meta.env.DEV) {
      try {
        if (import.meta.hot) {
          import.meta.hot.accept(() => {
            this.logger.cache('Clearing due to HMR update')
            this.clear()
          })
        }
      } catch {
        // HMR not available, skip invalidation
      }
    }
  }

  private evictLRU(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  get(key: string): RenderedContent | null {
    const entry = this.cache.get(key)
    if (entry) {
      // Check if entry expired
      if (entry.expiresAt < Date.now()) {
        this.cache.delete(key)
        return null
      }
      entry.lastAccessed = Date.now()
      entry.accessCount++
      return entry.content
    }
    return null
  }

  set(key: string, content: RenderedContent, ttl = 60 * 60 * 1000): void {
    if (this.cache.size >= this.maxSize) {
      this.evictLRU()
    }

    this.cache.set(key, {
      content,
      lastAccessed: Date.now(),
      accessCount: 1,
      expiresAt: Date.now() + ttl
    })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  // Development monitoring
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    }
  }
}

export const contentCache = new MarkdownLRUCache(50)
