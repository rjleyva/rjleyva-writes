import type React from 'react'
import { memo } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import BlogPostContent from '@/components/ui/BlogPostContent/BlogPostContent'
import PostDetailHeader from '@/components/ui/PostDetailHeader/PostDetailHeader'
import { useGetPost } from '@/hooks/useBlog'
import { usePageTitle } from '@/hooks/usePageTitle'

const BlogPage = (): React.JSX.Element => {
  const { post, error } = useGetPost()

  const pageTitle = usePageTitle(
    error != null || !post ? 'Post Not Found' : post.title
  )

  if (error != null || !post) {
    return (
      <section>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <h1>Post Not Found</h1>
        <p>The blog post you&apos;re looking for doesn&apos;t exist.</p>
      </section>
    )
  }

  return (
    <article>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PostDetailHeader post={post} />
      <BlogPostContent content={post.content} />
    </article>
  )
}

export default memo(BlogPage)
