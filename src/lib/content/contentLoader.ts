import type { Post, SerializedPost } from '@/types/post'
import { processedPosts } from './generatedContent'

const convertProcessedPosts = (): Post[] => {
  return (processedPosts as readonly SerializedPost[]).map(post => ({
    ...post,
    date: new Date(post.date),
    tags: [...post.tags]
  }))
}

export const posts: Post[] = convertProcessedPosts()

export const getAllPosts = (): Post[] => posts

export const getPostBySlug = (topic: string, slug: string): Post | null => {
  return posts.find(post => post.topic === topic && post.slug === slug) ?? null
}
