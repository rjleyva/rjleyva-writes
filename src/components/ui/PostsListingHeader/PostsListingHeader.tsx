import type React from 'react'
import { getTopicDisplayName } from '@/lib/postFormattingUtils'
import styles from './posts-listing-header.module.css'

interface PostsListingHeaderProps {
  selectedTopic: string | null
}

const PostsListingHeader = ({
  selectedTopic
}: PostsListingHeaderProps): React.JSX.Element => {
  const displayName =
    selectedTopic != null ? getTopicDisplayName(selectedTopic) : null

  return (
    <header className={styles['posts-listing-header']}>
      <h1 className={styles['posts-listing-header__title']}>
        {displayName ?? 'All Posts'}
      </h1>
      <p className={styles['posts-listing-header__description']}>
        {displayName != null
          ? `Patterns, problems, and progress with ${displayName.toLowerCase()}.`
          : 'My thoughts, experiments, and real world code.'}
      </p>
    </header>
  )
}

export default PostsListingHeader
