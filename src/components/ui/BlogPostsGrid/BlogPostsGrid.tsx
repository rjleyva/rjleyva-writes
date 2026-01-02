import type React from 'react'
import { useCallback } from 'react'
import { useRoutePreloader } from '@/hooks/useRoutePreloader'
import type { Post } from '@/types/post'
import BlogCard from '../BlogCard/BlogCard'
import styles from './blog-posts-grid.module.css'

interface BlogPostsGridProps {
  displayedPosts: Post[]
  onTopicSelect: (topic: string | null) => void
}

const BlogPostsGrid = ({
  displayedPosts,
  onTopicSelect
}: BlogPostsGridProps): React.JSX.Element => {
  const { preloadRoute } = useRoutePreloader()

  const handlePreloadBlogPost = useCallback(() => {
    preloadRoute('blog-post')
  }, [preloadRoute])

  return (
    <div className={styles['blog-posts-grid']}>
      {displayedPosts.length === 0 ? (
        <div className={styles['blog-posts-grid__empty']}>
          <p>No documentation found for this topic.</p>
          <button
            className={styles['blog-posts-grid__empty-action']}
            onClick={() => onTopicSelect(null)}
          >
            View All Documentation
          </button>
        </div>
      ) : (
        displayedPosts.map((post, index) => (
          <BlogCard
            key={`${post.topic}/${post.slug}`}
            post={post}
            {...(index < 3 ? { onPreload: handlePreloadBlogPost } : {})} // Only preload first 3 posts
          />
        ))
      )}
    </div>
  )
}

export default BlogPostsGrid
