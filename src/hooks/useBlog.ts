import { useMemo } from 'react'
import { useParams } from 'react-router'
import { getAllPosts, getPostBySlug } from '@/lib/blogContentApi'
import type { Post } from '@/types/post'
import { handleError } from '@/utils/errorHandler'

interface UsePostsReturn {
  posts: Post[]
  error: string | null
}

interface UsePostReturn {
  post: Post | null
  error: string | null
}

export const useGetPosts = (limit?: number): UsePostsReturn => {
  const { posts, error } = useMemo(() => {
    try {
      const allPosts = getAllPosts()
      const limitedPosts = limit != null ? allPosts.slice(0, limit) : allPosts
      return { posts: limitedPosts, error: null }
    } catch (err) {
      const appError = handleError(err, 'useGetPosts')
      return { posts: [], error: appError.message }
    }
  }, [limit])

  return { posts, error }
}

export const useGetPost = (): UsePostReturn => {
  const { topic, slug } = useParams<{ topic?: string; slug?: string }>()

  const { post, error } = useMemo(() => {
    if (topic == null || slug == null) {
      return { post: null, error: 'Invalid topic or slug' }
    }

    try {
      const postData = getPostBySlug(topic, slug)
      return { post: postData, error: null }
    } catch (err) {
      const appError = handleError(err, 'useGetPost')
      return { post: null, error: appError.message }
    }
  }, [topic, slug])

  return { post, error }
}
