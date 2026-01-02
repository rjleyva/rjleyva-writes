import { useCallback } from 'react'

// Cache for tracking preloaded routes
const preloadCache = new Set<string>()

/**
 * Hook for preloading critical routes to improve navigation performance
 * @returns Object with preloadRoute function
 */
export const useRoutePreloader = (): {
  preloadRoute: (routeId: string) => Promise<void>
} => {
  const preloadRoute = useCallback(async (routeId: string) => {
    // Skip if already preloaded
    if (preloadCache.has(routeId)) {
      return
    }

    try {
      switch (routeId) {
        case 'blog-listing': {
          // Preload the BlogPosts component
          void (await import('@/components/ui/BlogPosts/BlogPosts'))
          preloadCache.add(routeId)
          break
        }
        case 'blog-post': {
          // Preload the BlogPage component
          void (await import('@/pages/blog/BlogPage'))
          preloadCache.add(routeId)
          break
        }
        default:
          console.warn(`Unknown route ID for preloading: ${routeId}`)
      }
    } catch (error) {
      console.error(`Failed to preload route ${routeId}:`, error)
    }
  }, [])

  return { preloadRoute }
}
