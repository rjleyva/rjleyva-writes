import type React from 'react'
import { useMemo, useState } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { useGetPosts } from '@/hooks/useBlog'
import { getTopicDisplayName } from '@/lib/postFormattingUtils'
import type { Post } from '@/types/post'
import BlogPostsGrid from '../BlogPostsGrid/BlogPostsGrid'
import BlogPostsSidebar from '../BlogPostsSidebar/BlogPostsSideBar'
import PostsListingHeader from '../PostsListingHeader/PostsListingHeader'
import styles from './blog-posts.module.css'

const groupPostsByTopic = (posts: Post[]): Record<string, Post[]> => {
  const postsGroupedByTopic: Record<string, Post[]> = {}

  for (const post of posts) {
    const topic = post.topic
    postsGroupedByTopic[topic] ??= []
    postsGroupedByTopic[topic].push(post)
  }

  return postsGroupedByTopic
}

const BlogPosts = (): React.JSX.Element => {
  const { posts } = useGetPosts()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const postsByTopic = useMemo(() => {
    return groupPostsByTopic(posts)
  }, [posts])

  const availableTopics = useMemo(() => {
    return Object.keys(postsByTopic).sort()
  }, [postsByTopic])

  const displayedPosts = useMemo(() => {
    if (selectedTopic == null) {
      return posts
    }

    const topicPosts = postsByTopic[selectedTopic]
    return topicPosts ?? []
  }, [selectedTopic, posts, postsByTopic])

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
          posts={posts}
          onTopicSelect={setSelectedTopic}
        />

        <main className={styles['blog-posts__content']}>
          <PostsListingHeader selectedTopic={selectedTopic} />

          <BlogPostsGrid
            displayedPosts={displayedPosts}
            onTopicSelect={setSelectedTopic}
          />
        </main>
      </div>
    </>
  )
}

export default BlogPosts
