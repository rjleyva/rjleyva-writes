import type React from 'react'
import { getAllPosts } from '@/lib/content/contentLoader'
import type { Post } from '@/types/post'
import BlogCard from '../BlogCard/BlogCard'
import styles from './recent-post.module.css'

const RecentPost = (): React.JSX.Element => {
  const recentPosts: Post[] = getAllPosts()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <section aria-label="recent-posts-heading">
      {recentPosts.length > 0 && (
        <div className={styles['recent-post']}>
          <h2 className="section-title" id="recent-posts-heading">
            Recent Posts
          </h2>
          <div className="blog-grid">
            {recentPosts.map(post => (
              <BlogCard key={`${post.topic}/${post.slug}`} post={post} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default RecentPost
