import type { PostMetadata, SerializedPost } from '@/types/post'
import { processedPosts } from './generatedMetadata'

const convertProcessedPostsToMetadata = (): PostMetadata[] => {
  return (processedPosts as readonly SerializedPost[]).map(post => ({
    title: post.title,
    date: new Date(post.date),
    description: post.description,
    tags: [...post.tags],
    slug: post.slug,
    topic: post.topic,
    readingTime: post.readingTime
  }))
}

export const postsMetadata: PostMetadata[] = convertProcessedPostsToMetadata()

export const getAllPostsMetadata = (): PostMetadata[] => postsMetadata
