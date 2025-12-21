import type React from 'react'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { renderMarkdown } from '@/services/markdownRenderingService'
import { getContentHash } from '@/utils/contentHash'
import { handleError } from '@/utils/errorHandler'
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
    const contentHash = useMemo(() => getContentHash(content), [content])

    useEffect(() => {
      const contentKey = contentHash
      currentContentRef.current = contentKey

      renderMarkdown(content)
        .then(({ dom }) => {
          if (currentContentRef.current === contentKey) {
            setContentState({ content: dom, error: null })
          }
        })
        .catch(err => {
          if (currentContentRef.current === contentKey) {
            const appError = handleError(err, 'BlogPostContent.renderMarkdown')
            setContentState({
              content: null,
              error: appError.message
            })
          }
        })
    }, [content, contentHash])

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
