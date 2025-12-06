import type React from 'react'
import { memo, useEffect, useRef, useState } from 'react'
import { renderMarkdown } from '@/services/markdownRenderingService'
import styles from './blog-post-content.module.css'

interface BlogPostContentProps {
  content: string
}

const BlogPostContent = memo(
  ({ content }: BlogPostContentProps): React.JSX.Element => {
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
          if (currentContentRef.current === contentKey) {
            setContentState({ content: dom, error: null })
          }
        })
        .catch(err => {
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
      <div className={`${styles['blog-post-content']} markdown-content`}>
        {contentState.error != null ? (
          <div className={styles['blog-post-content__error']}>
            {contentState.error}
          </div>
        ) : (
          (contentState.content ?? (
            <div className={styles['blog-post-content__loading']}>
              Content loading...
            </div>
          ))
        )}
      </div>
    )
  }
)

BlogPostContent.displayName = 'BlogPostContent'

export default BlogPostContent
