import type React from 'react'
import { useMemo, useState } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { useGetPosts } from '@/hooks/useBlog'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { Post } from '@/types/post'
import { getTopicDisplayName } from '@/utils/blogUtils'
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

  const pageTitle = usePageTitle(
    selectedTopic != null
      ? `RJ Leyva's Patterns, problems, and progress with ${getTopicDisplayName(selectedTopic)}`
      : "RJ Leyva's Blog Page"
  )

  return (
    <div className={styles['blog-posts']}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Browse all blog posts by RJ Leyva on web development insights."
        />
        <link rel="canonical" href="https://rjleyva-writes.pages.dev/blog" />
      </Helmet>
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
  )
}

export default BlogPosts
