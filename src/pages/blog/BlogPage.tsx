import type React from 'react'
import { memo } from 'react'
import BlogPostContent from '@/components/ui/BlogPostContent/BlogPostContent'
import PostDetailHeader from '@/components/ui/PostDetailHeader/PostDetailHeader'
import { useGetPost } from '@/hooks/useBlog'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getTopicDisplayName } from '@/utils/blogUtils'
import { config } from '@/utils/config'

const BlogPage = (): React.JSX.Element => {
  const { post, error } = useGetPost()

  usePageTitle(error != null || !post ? 'Post Not Found' : post.title)

  if (error != null || !post) {
    return (
      <section>
        <h1>Post Not Found</h1>
        <p>The blog post you&apos;re looking for doesn&apos;t exist.</p>
      </section>
    )
  }

  return (
    <article>
      <meta name="description" content={post.description} />
      <meta name="keywords" content={post.tags.join(', ')} />
      <meta name="author" content="RJ Leyva" />

      {/* Open Graph Tags (basic ones without image) */}
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.description} />
      <meta property="og:type" content="article" />
      <meta
        property="og:url"
        content={`${config.urls.production}/blog/${post.topic}/${post.slug}`}
      />
      <meta property="og:site_name" content="RJ Leyva's Blog" />

      <link
        rel="canonical"
        href={`${config.urls.production}/blog/${post.topic}/${post.slug}`}
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
            '@id': `${config.urls.production}/blog/${post.topic}/${post.slug}`
          },
          articleSection: getTopicDisplayName(post.topic),
          keywords: post.tags.join(', ')
        })}
      </script>
      <PostDetailHeader post={post} />
      <BlogPostContent content={post.content} />
    </article>
  )
}

export default memo(BlogPage)
