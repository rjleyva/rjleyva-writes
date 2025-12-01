export interface Post {
  title: string
  date: Date
  description: string
  tags: string[]
  slug: string
  topic: string
  content: string
  htmlContent: string
  readingTime: number
}

export interface PostFrontmatter {
  title: string
  date: string | Date
  description: string
  tags?: string[]
}
