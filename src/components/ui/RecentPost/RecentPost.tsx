import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useRoutePreloader } from '@/hooks/useRoutePreloader'
import { getRecentPosts } from '@/lib/blogContentApi'
import type { Post } from '@/types/post'
import BlogCard from '../BlogCard/BlogCard'
import styles from './recent-post.module.css'

const RecentPost = (): React.JSX.Element | null => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { preloadRoute } = useRoutePreloader()

  const handlePreloadBlogPost = useCallback(() => {
    preloadRoute('blog-post')
  }, [preloadRoute])

  useEffect(() => {
    const loadRecentPosts = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)
        const recentPosts = await getRecentPosts(3)
        setRecentPosts(recentPosts)
      } catch (err) {
        console.error('Failed to load recent posts:', err)
        setError('Failed to load recent posts')
        setRecentPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadRecentPosts()
  }, [])

  if (loading) {
    return null // Don't render anything while loading
  }

  if (error != null) {
    return null // Don't show anything if there's an error
  }

  return (
    <section aria-label="recent-posts-heading">
      {recentPosts.length > 0 && (
        <div className={styles['recent-post']}>
          <h2 className="section-title" id="recent-posts-heading">
            Recent Posts
          </h2>
          <div className="blog-grid">
            {recentPosts.map(post => (
              <BlogCard
                key={`${post.topic}/${post.slug}`}
                post={post}
                onPreload={handlePreloadBlogPost}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default RecentPost
