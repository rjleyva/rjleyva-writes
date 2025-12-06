import type React from 'react'
import { getPostMetadata } from '@/lib/postFormattingUtils'
import type { Post } from '@/types/post'
import styles from './post-detail-header.module.css'

interface PostDetailHeaderProps {
  post: Post
}

const PostDetailHeader = ({
  post
}: PostDetailHeaderProps): React.JSX.Element => {
  const { date, dateTime, readingTime } = getPostMetadata(post)

  return (
    <header className={styles['post-detail-header']}>
      <h1
        className={`${styles['post-detail-header__title']} title-large-gradient`}
      >
        {post.title}
      </h1>
      <div className={styles['post-detail-header__metadata']}>
        <time
          dateTime={dateTime}
          className={styles['post-detail-header__date']}
        >
          {date}
        </time>
        <span className={styles['post-detail-header__reading-time']}>
          {readingTime}
        </span>
      </div>
    </header>
  )
}

export default PostDetailHeader
