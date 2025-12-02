import { useMemo } from 'react'
import { useParams } from 'react-router'
import { getAllPosts, getPostBySlug } from '@/lib/blogContentApi'
import type { Post } from '@/types/post'

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
  const { posts, loading, error } = useMemo(() => {
    try {
      const allPosts = getAllPosts()
      const limitedPosts = limit != null ? allPosts.slice(0, limit) : allPosts
      return { posts: limitedPosts, loading: false, error: null }
    } catch (err) {
      console.error('Error loading posts:', err)
      return { posts: [], loading: false, error: 'Failed to load posts' }
    }
  }, [limit])

  return { posts, loading, error }
}

export const useGetPost = (): UsePostReturn => {
  const { topic, slug } = useParams<{ topic?: string; slug?: string }>()

  const { post, loading, error } = useMemo(() => {
    if (topic == null || slug == null) {
      return { post: null, loading: false, error: 'Invalid topic or slug' }
    }

    try {
      const postData = getPostBySlug(topic, slug)
      return { post: postData, loading: false, error: null }
    } catch (err) {
      console.error('Error loading post:', err)
      return { post: null, loading: false, error: 'Failed to load post' }
    }
  }, [topic, slug])

  return { post, loading, error }
}
