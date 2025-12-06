import type React from 'react'
import { getTopicDisplayName } from '@/utils/blogUtils'
import styles from './blog-posts-header.module.css'

interface BlogPostsHeaderProps {
  selectedTopic: string | null
}

const BlogPostsHeader = ({
  selectedTopic
}: BlogPostsHeaderProps): React.JSX.Element => {
  const displayName =
    selectedTopic != null ? getTopicDisplayName(selectedTopic) : null

  return (
    <header className={styles['blog-posts-header']}>
      <h1 className={styles['blog-posts-header__title']}>
        {displayName ?? 'All Posts'}
      </h1>
      <p className={styles['blog-posts-header__description']}>
        {displayName != null
          ? `Patterns, problems, and progress with ${displayName.toLowerCase()}.`
          : 'My thoughts, experiments, and real world code.'}
      </p>
    </header>
  )
}

export default BlogPostsHeader
