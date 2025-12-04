import type React from 'react'
import { useMemo, useState } from 'react'
import { useGetPosts } from '@/hooks/useBlog'
import type { Post } from '@/types/post'
import BlogPostsGrid from '../BlogPostsGrid/BlogPostsGrid'
import BlogPostsHeader from '../BlogPostsHeader/BlogPostsHeader'
import BlogPostsSidebar from '../BlogPostsSidebar/BlogPostsSideBar'
import styles from './blog-posts.module.css'

const BlogPosts = (): React.JSX.Element => {
  const { posts } = useGetPosts()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const postsByTopic = useMemo(() => {
    return posts.reduce(
      (acc, post) => {
        const topic = post.topic
        const existingPosts = acc[topic] ?? []
        acc[topic] = [...existingPosts, post]
        return acc
      },
      {} as Record<string, Post[]>
    )
  }, [posts])

  const availableTopics = Object.keys(postsByTopic).sort()

  const displayedPosts =
    selectedTopic != null ? (postsByTopic[selectedTopic] ?? []) : posts

  return (
    <div className={styles['blog-posts']}>
      <BlogPostsSidebar
        selectedTopic={selectedTopic}
        availableTopics={availableTopics}
        postsByTopic={postsByTopic}
        posts={posts}
        onTopicSelect={setSelectedTopic}
      />

      <main className={styles['blog-posts__content']}>
        <BlogPostsHeader selectedTopic={selectedTopic} />

        <BlogPostsGrid
          displayedPosts={displayedPosts}
          onTopicSelect={setSelectedTopic}
        />
      </main>
    </div>
  )
}

export default BlogPosts
