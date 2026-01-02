import type React from 'react'
import { Link } from 'react-router'
import { getPostMetadata } from '@/lib/postFormattingUtils'
import type { Post } from '@/types/post'
import styles from './blog-card.module.css'

interface BlogCardProps {
  post: Post
  onPreload?: () => void
}

const BlogCard = ({ post, onPreload }: BlogCardProps): React.JSX.Element => {
  const { date, dateTime, readingTime } = getPostMetadata(post)

  return (
    <article className={styles['blog-card']}>
      <Link
        to={`/blog/${post.topic}/${post.slug}`}
        onMouseEnter={onPreload}
        onFocus={onPreload}
      >
        <h2 className={styles['blog-card__title']}>{post.title}</h2>
        <p className={styles['blog-card__description']}>{post.description}</p>
        <div className={styles['blog-card__metadata']}>
          <time
            dateTime={dateTime}
            className={styles['blog-card__publication-date']}
          >
            {date}
          </time>
          <span className={styles['blog-card__reading-time']}>
            {readingTime}
          </span>
        </div>
        {post.tags.length > 0 && (
          <div className={styles['blog-card__tags']}>
            {post.tags.map(tag => (
              <span key={tag} className={styles['blog-card__individual-tag']}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  )
}

export default BlogCard
