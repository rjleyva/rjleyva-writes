import type React from 'react'
import { memo } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import BlogPostContent from '@/components/ui/BlogPostContent/BlogPostContent'
import PostDetailHeader from '@/components/ui/PostDetailHeader/PostDetailHeader'
import { useGetPost } from '@/hooks/useBlog'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getTopicDisplayName } from '@/utils/blogUtils'

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
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta name="author" content="RJ Leyva" />

        {/* Open Graph Tags (basic ones without image) */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://rjleyva-writes.pages.dev/blog/${post.topic}/${post.slug}`}
        />
        <meta property="og:site_name" content="RJ Leyva's Blog" />

        <link
          rel="canonical"
          href={`https://rjleyva-writes.pages.dev/blog/${post.topic}/${post.slug}`}
        />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            author: {
              '@type': 'Person',
              name: 'RJ Leyva'
            },
            publisher: {
              '@type': 'Person',
              name: 'RJ Leyva'
            },
            datePublished: post.date.toISOString(),
            dateModified: post.date.toISOString(),
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://rjleyva-writes.pages.dev/blog/${post.topic}/${post.slug}`
            },
            articleSection: getTopicDisplayName(post.topic),
            keywords: post.tags.join(', ')
          })}
        </script>
      </Helmet>
      <PostDetailHeader post={post} />
      <BlogPostContent content={post.content} />
    </article>
  )
}

export default memo(BlogPage)
