import type { Post } from '@/types/post'

export const formatPostDate = (date: Date): string => {
  return date.toLocaleDateString()
}

export const formatPostDateTime = (date: Date): string => {
  return date.toISOString()
}

export const formatReadingTime = (readingTime: number): string => {
  return `${readingTime} min read`
}

export const getPostMetadata = (
  post: Post
): { date: string; dateTime: string; readingTime: string } => {
  return {
    date: formatPostDate(post.date),
    dateTime: formatPostDateTime(post.date),
    readingTime: formatReadingTime(post.readingTime)
  }
}
