import type { Post } from '@/types/post'
import {
  getAllPosts as getAllPostsFromLoader,
  getPostBySlug as getPostBySlugFromLoader
} from './content/contentLoader'

export const getAllPosts = (): Post[] => {
  return getAllPostsFromLoader()
}

export const getPostBySlug = (topic: string, slug: string): Post | null => {
  return getPostBySlugFromLoader(topic, slug)
}
