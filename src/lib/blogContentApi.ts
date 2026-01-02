import type { Post } from '@/types/post'
import { getAllPostsMetadata } from './content/contentLoader'

export const getAllPosts = async (): Promise<Post[]> => {
  const metadata = getAllPostsMetadata()

  // Load all posts concurrently
  const posts = await Promise.all(
    metadata.map(async (meta) => {
      try {
        const content = await import(`@/content/blog/${meta.topic}/${meta.slug}.md?raw`)
        return {
          ...meta,
          content: content.default
        }
      } catch (error) {
        console.warn(`Failed to load post: ${meta.topic}/${meta.slug}`, error)
        return null
      }
    })
  )

  return posts.filter((post): post is Post => post !== null)
}

export const getPostBySlug = async (topic: string, slug: string): Promise<Post | null> => {
  try {
    const content = await import(`@/content/blog/${topic}/${slug}.md?raw`)

    // Load metadata for this post
    const metadata = getAllPostsMetadata().find(
      post => post.topic === topic && post.slug === slug
    )

    if (!metadata) {
      return null
    }

    return {
      ...metadata,
      content: content.default
    }
  } catch (error) {
    console.warn(`Failed to load post: ${topic}/${slug}`, error)
    return null
  }
}

export const getRecentPosts = async (count: number = 3): Promise<Post[]> => {
  try {
    // Get all metadata and sort by date (newest first)
    const allMetadata = getAllPostsMetadata()
    const sortedMetadata = allMetadata
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count)

    // Load content only for the recent posts
    const posts = await Promise.all(
      sortedMetadata.map(async (meta) => {
        try {
          const content = await import(`@/content/blog/${meta.topic}/${meta.slug}.md?raw`)
          return {
            ...meta,
            content: content.default
          }
        } catch (error) {
          console.warn(`Failed to load recent post: ${meta.topic}/${meta.slug}`, error)
          return null
        }
      })
    )

    return posts.filter((post): post is Post => post !== null)
  } catch (error) {
    console.error('Failed to load recent posts:', error)
    return []
  }
}

export const getPostsLazy = async (limit?: number, offset: number = 0, topic?: string): Promise<Post[]> => {
  try {
    // Get all metadata and sort by date (newest first)
    const allMetadata = getAllPostsMetadata()
    let filteredMetadata = allMetadata

    // Filter by topic if specified
    if (topic != null) {
      filteredMetadata = allMetadata.filter(meta => meta.topic === topic)
    }

    const sortedMetadata = filteredMetadata
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Apply pagination to metadata first
    const paginatedMetadata = sortedMetadata.slice(offset, limit != null ? offset + limit : undefined)

    // Load content only for the paginated posts
    const posts = await Promise.all(
      paginatedMetadata.map(async (meta) => {
        try {
          const content = await import(`@/content/blog/${meta.topic}/${meta.slug}.md?raw`)
          return {
            ...meta,
            content: content.default
          }
        } catch (error) {
          console.warn(`Failed to load post: ${meta.topic}/${meta.slug}`, error)
          return null
        }
      })
    )

    return posts.filter((post): post is Post => post !== null)
  } catch (error) {
    console.error('Failed to load posts:', error)
    return []
  }
}
