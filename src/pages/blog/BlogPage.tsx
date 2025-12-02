import type React from 'react'
import { useEffect, useState } from 'react'
import { useGetPost } from '@/hooks/useBlog'
import { getPostMetadata } from '@/lib/postFormattingUtlis'
import { renderMarkdown } from '@/services/markdownRenderingService'
import styles from './blog-page.module.css'

const BlogPage = (): React.JSX.Element => {
  const { post, loading, error } = useGetPost()
  const [enhancedDom, setEnhancedDom] = useState<React.JSX.Element | null>(null)
  const [contentError, setContentError] = useState<Error | null>(null)

  useEffect(() => {
    if (post?.content == null) return

    const enhanceContent = async (): Promise<void> => {
      try {
        setContentError(null)
        const { dom: enhancedContent } = await renderMarkdown(post.content)
        setEnhancedDom(enhancedContent)
      } catch (err) {
        const errorMessage = err instanceof Error ? err : new Error(String(err))
        console.error(`Failed to enhance content: ${errorMessage.message}`)
        setContentError(errorMessage)
        setEnhancedDom(null)
      }
    }

    enhanceContent()
  }, [post?.content])

  if (loading) {
    return (
      <article>
        <div>Loading post...</div>
      </article>
    )
  }

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
        <div className="markdown-content">
          {contentError ? (
            <div className="error-message">
              Failed to render content: {contentError.message}
            </div>
          ) : (
            (enhancedDom ?? (
              <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
            ))
          )}
        </div>
      </div>
    </article>
  )
}

export default BlogPage
