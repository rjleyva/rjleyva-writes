import type React from 'react'
import { useGetPosts } from '@/hooks/useBlog'
import BlogCard from '../BlogCard/BlogCard'
import styles from './blog-posts.module.css'

const BlogList = (): React.JSX.Element => {
  const { posts } = useGetPosts()

  return (
    <section className={styles['blog-posts']}>
      <h2 className="title-large-gradient">
        A space where I share my ideas and experiences.
      </h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="blog-grid">
          {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  )
}

export default BlogList
