import type React from 'react'
import { useMemo, useState } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { useGetPostsMetadata, useLazyPosts } from '@/hooks/useBlog'
import { getTopicDisplayName } from '@/lib/postFormattingUtils'
import type { Post } from '@/types/post'
import BlogPostsGrid from '../BlogPostsGrid/BlogPostsGrid'
import BlogPostsSidebar from '../BlogPostsSidebar/BlogPostsSideBar'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import PostsListingHeader from '../PostsListingHeader/PostsListingHeader'
import styles from './blog-posts.module.css'

const BlogPosts = (): React.JSX.Element => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const { posts, loading, error, hasMore, loadMore } = useLazyPosts(
    12,
    selectedTopic
  )

  // Get metadata for sidebar (topics and counts)
  const allMetadata = useGetPostsMetadata()

  const postsByTopic = useMemo(() => {
    const grouped: Record<string, Post[]> = {}
    // Group by topic from metadata for sidebar counts
    for (const meta of allMetadata) {
      // Skip posts without a valid topic
      if (!meta.topic) continue
      grouped[meta.topic] ??= []
      // For sidebar, we just need the count, so we can push empty posts or use metadata
      grouped[meta.topic!]!.push({} as Post) // We just need the length, so dummy posts are fine
    }
    return grouped
  }, [allMetadata])

  const availableTopics = useMemo(() => {
    return Object.keys(postsByTopic).sort()
  }, [postsByTopic])

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Blog... | RJ Leyva&#39;s Blog</title>
        </Helmet>
        <div className={styles['blog-posts']}>
          <LoadingSpinner />
        </div>
      </>
    )
  }

  if (error != null) {
    return (
      <>
        <Helmet>
          <title>Error | RJ Leyva&#39;s Blog</title>
        </Helmet>
        <div className={styles['blog-posts']}>
          <section>
            <h1>Failed to Load Blog Posts</h1>
            <p>{error}</p>
          </section>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          {selectedTopic != null
            ? `RJ Leyva's Patterns, problems, and progress with ${getTopicDisplayName(selectedTopic)} | RJ Leyva's Blog`
            : "Blog Page | RJ Leyva's Blog"}
        </title>
        <meta
          name="description"
          content={
            selectedTopic != null
              ? `Explore RJ Leyva's insights and experiences with ${getTopicDisplayName(selectedTopic)}. Web development patterns, problems, and progress.`
              : 'Browse all blog posts by RJ Leyva covering web development, React, TypeScript, and developer tools.'
          }
        />
        <meta
          name="keywords"
          content={`web development, ${selectedTopic ?? 'blog'}, RJ Leyva, React, TypeScript, programming`}
        />
        <meta name="author" content="RJ Leyva" />

        {/* Open Graph Tags */}
        <meta
          property="og:title"
          content={
            selectedTopic != null
              ? `RJ Leyva's Patterns, problems, and progress with ${getTopicDisplayName(selectedTopic)}`
              : "Blog | RJ Leyva's Blog"
          }
        />
        <meta
          property="og:description"
          content={
            selectedTopic != null
              ? `Explore RJ Leyva's insights and experiences with ${getTopicDisplayName(selectedTopic)}. Web development patterns, problems, and progress.`
              : 'Browse all blog posts by RJ Leyva covering web development, React, TypeScript, and developer tools.'
          }
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://rjleyva-writes.pages.dev/blog${selectedTopic != null ? `?topic=${selectedTopic}` : ''}`}
        />
        <meta property="og:site_name" content="RJ Leyva's Blog" />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://rjleyva-writes.pages.dev/blog${selectedTopic != null ? `?topic=${selectedTopic}` : ''}`}
        />
      </Helmet>
      <div className={styles['blog-posts']}>
        <BlogPostsSidebar
          selectedTopic={selectedTopic}
          availableTopics={availableTopics}
          postsByTopic={postsByTopic}
          posts={allMetadata.map(() => ({}) as Post)} // Dummy posts array with correct length for total count
          onTopicSelect={setSelectedTopic}
        />

        <main className={styles['blog-posts__content']}>
          <PostsListingHeader selectedTopic={selectedTopic} />

          <BlogPostsGrid
            displayedPosts={posts}
            onTopicSelect={setSelectedTopic}
          />

          {hasMore && (
            <div className={styles['blog-posts__load-more']}>
              <button
                className={styles['load-more-button']}
                onClick={loadMore}
                disabled={loading}
              >
                Load More Posts
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default BlogPosts
