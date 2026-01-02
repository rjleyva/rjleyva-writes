import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router'
import { getAllPosts, getPostBySlug, getPostsLazy } from '@/lib/blogContentApi'
import { getAllPostsMetadata } from '@/lib/content/contentLoader'
import type { Post, PostMetadata } from '@/types/post'
import { handleError } from '@/utils/errorHandler'

interface UsePostsReturn {
  posts: Post[]
  loading: boolean
  error: string | null
}

interface UsePostReturn {
  post: Post | null
  loading: boolean
  error: string | null
}

export const useGetPosts = (limit?: number): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)
        const allPosts = await getAllPosts()
        const limitedPosts = limit != null ? allPosts.slice(0, limit) : allPosts
        setPosts(limitedPosts)
      } catch (err) {
        const appError = handleError(err, 'useGetPosts')
        setError(appError.message)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [limit])

  return { posts, loading, error }
}

export const useGetPost = (): UsePostReturn => {
  const { topic, slug } = useParams<{ topic?: string; slug?: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPost = async (): Promise<void> => {
      if (topic == null || slug == null) {
        setPost(null)
        setError('Invalid topic or slug')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const postData = await getPostBySlug(topic, slug)
        setPost(postData)
      } catch (err) {
        const appError = handleError(err, 'useGetPost')
        setError(appError.message)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [topic, slug])

  return { post, loading, error }
}

// Hook for getting post metadata (non-lazy)
export const useGetPostsMetadata = (limit?: number): PostMetadata[] => {
  return useMemo(() => {
    const metadata = getAllPostsMetadata()
    return limit != null ? metadata.slice(0, limit) : metadata
  }, [limit])
}

interface UseLazyPostsReturn {
  posts: Post[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  totalCount: number
}

export const useLazyPosts = (pageSize: number = 10, topic?: string | null): UseLazyPostsReturn => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(() => {
    // Get total count from metadata
    const allMetadata = getAllPostsMetadata()
    return topic != null ? allMetadata.filter(meta => meta.topic === topic).length : allMetadata.length
  })

  // Use ref to track if a request is currently in progress
  const isLoadingRef = useRef(false)

  const loadPosts = useCallback(async (currentOffset: number, append: boolean = false, currentTopic?: string | null, requestPageSize: number): Promise<void> => {
    // Use the provided pageSize (required parameter)

    // Prevent concurrent requests
    if (isLoadingRef.current) {
      return
    }

    isLoadingRef.current = true

    try {
      if (!append) {
        setLoading(true)
        setError(null)
      }

      const newPosts = await getPostsLazy(requestPageSize, currentOffset, currentTopic ?? undefined)

      if (append) {
        setPosts(prevPosts => [...prevPosts, ...newPosts])
      } else {
        setPosts(newPosts)
      }

      // Update total count when topic changes
      const allMetadata = getAllPostsMetadata()
      const filteredCount = currentTopic != null ? allMetadata.filter(meta => meta.topic === currentTopic).length : allMetadata.length
      setTotalCount(filteredCount)

      setHasMore(newPosts.length === requestPageSize && currentOffset + newPosts.length < filteredCount)
    } catch (err) {
      const appError = handleError(err, 'useLazyPosts')
      setError(appError.message)
      if (!append) {
        setPosts([])
      }
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [])

  useEffect(() => {
    setOffset(0) // Reset offset when topic changes
    loadPosts(0, false, topic, pageSize)
  }, [topic, loadPosts, pageSize])

  const loadMore = (): void => {
    if (!loading && hasMore && !isLoadingRef.current) {
      const newOffset = offset + pageSize
      setOffset(newOffset)
      loadPosts(newOffset, true, topic, pageSize)
    }
  }

  return { posts, loading, error, hasMore, loadMore, totalCount }
}
