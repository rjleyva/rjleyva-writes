export interface PostMetadata {
  title: string
  date: Date
  description: string
  tags: string[]
  slug: string
  topic: string
  readingTime: number
}

export interface Post extends PostMetadata {
  content: string
}

export interface SerializedPost {
  title: string
  date: string
  description: string
  tags: string[]
  slug: string
  topic: string
  readingTime: number
  content: string
}

export interface PostFrontmatter {
  title: string
  date: string | Date
  description: string
  tags?: string[]
}
