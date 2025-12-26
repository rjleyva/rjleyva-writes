import type React from 'react'
import { getTopicDisplayName } from '@/lib/postFormattingUtils'
import type { Post } from '@/types/post'
import styles from './blog-posts-sidebar.module.css'

interface BlogPostsSidebarProps {
  selectedTopic: string | null
  availableTopics: string[]
  postsByTopic: Record<string, Post[]>
  posts: Post[]
  onTopicSelect: (topic: string | null) => void
}

const BlogPostsSidebar = ({
  selectedTopic,
  availableTopics,
  postsByTopic,
  posts,
  onTopicSelect
}: BlogPostsSidebarProps): React.JSX.Element => {
  return (
    <aside className={styles['blog-posts-sidebar']}>
      <div className={styles['blog-posts-sidebar__header']}>
        {/* <h2 className={styles['blog-posts-sidebar__title']}>RJ Leyva</h2>
        <p className={styles['blog-posts-sidebar__subtitle']}>
          Consultant | Developer
        </p> */}
      </div>

      <nav className={styles['blog-posts-sidebar__navigation']}>
        <button
          className={`${styles['blog-posts-sidebar__nav-item']} ${selectedTopic == null ? styles['blog-posts-sidebar__nav-item--active'] : ''}`}
          onClick={() => onTopicSelect(null)}
        >
          <span className={styles['blog-posts-sidebar__nav-text']}>
            All Posts
          </span>
          <span className={styles['blog-posts-sidebar__nav-count']}>
            {posts.length}
          </span>
        </button>

        {availableTopics.map(topic => (
          <button
            key={topic}
            className={`${styles['blog-posts-sidebar__nav-item']} ${selectedTopic === topic ? styles['blog-posts-sidebar__nav-item--active'] : ''}`}
            onClick={() => onTopicSelect(topic)}
          >
            <span className={styles['blog-posts-sidebar__nav-text']}>
              {getTopicDisplayName(topic)}
            </span>
            <span className={styles['blog-posts-sidebar__nav-count']}>
              {postsByTopic[topic]?.length ?? 0}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default BlogPostsSidebar
