import type React from 'react'
import { memo, useEffect, useRef, useState } from 'react'
import { useGetPost } from '@/hooks/useBlog'
import { getPostMetadata } from '@/lib/postFormattingUtils'
import { renderMarkdown } from '@/services/markdownRenderingService'
import styles from './blog-page.module.css'

const BlogContentRenderer = memo(
  ({ content }: { content: string }): React.JSX.Element => {
    const [contentState, setContentState] = useState<{
      content: React.JSX.Element | null
      error: string | null
    }>({ content: null, error: null })
    const currentContentRef = useRef<string>('')

    useEffect(() => {
      const contentKey = content
      currentContentRef.current = contentKey

      renderMarkdown(content)
        .then(({ dom }) => {
          // Only update if this is still the current content
          if (currentContentRef.current === contentKey) {
            setContentState({ content: dom, error: null })
          }
        })
        .catch(err => {
          // Only update if this is still the current content
          if (currentContentRef.current === contentKey) {
            console.error('Failed to render markdown:', err)
            setContentState({
              content: null,
              error: 'Failed to render content'
            })
          }
        })
    }, [content])

    return (
      <div className="markdown-content">
        {contentState.error != null ? (
          <div className="error-message">{contentState.error}</div>
        ) : (
          (contentState.content ?? <div>Content loading...</div>)
        )}
      </div>
    )
  }
)

BlogContentRenderer.displayName = 'BlogContentRenderer'

const BlogPage = (): React.JSX.Element => {
  const { post, error } = useGetPost()

  if (error != null || !post) {
    return (
      <section>
        <h1>Post Not Found</h1>
        <p>The blog post you&apos;re looking for doesn&apos;t exist.</p>
      </section>
    )
  }

  const { date, dateTime, readingTime } = getPostMetadata(post)

  return (
    <article>
      <header className={styles['blog-page__header']}>
        <h1 className={`${styles['blog-page__title']} title-large-gradient`}>
          {post.title}
        </h1>
        <div className={styles['blog-page__metadata']}>
          <time dateTime={dateTime} className={styles['blog-page__date']}>
            {date}
          </time>
          <span className={styles['blog-page__reading-time']}>
            {readingTime}
          </span>
        </div>
      </header>

      <div className={styles['blog-page__content']}>
        {post.content.trim() !== '' ? (
          <BlogContentRenderer content={post.content} key={post.slug} />
        ) : (
          <div className="markdown-content">
            <div>No content available</div>
          </div>
        )}
      </div>
    </article>
  )
}

export default memo(BlogPage)
