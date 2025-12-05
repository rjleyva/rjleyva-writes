import type { PostFrontmatter } from '@/types/post'

export class FrontmatterValidationError extends Error {
  constructor(
    message: string,
    readonly filePath: string
  ) {
    super(`Frontmatter validation failed for ${filePath}: ${message}`)
    this.name = 'FrontmatterValidationError'
  }
}

const isTitleValid = (title: unknown): title is string => {
  return typeof title === 'string' && title.trim().length > 0
}

const isDateTypeValid = (date: unknown): boolean => {
  return (
    typeof date === 'string' ||
    date instanceof Date ||
    (typeof date === 'number' && !Number.isNaN(date))
  )
}

const isDescriptionValid = (description: unknown): description is string => {
  return typeof description === 'string' && description.trim().length > 0
}

const parseDateValue = (dateValue: string | number | Date): Date => {
  if (dateValue instanceof Date) {
    return dateValue
  }

  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date parsing')
  }

  return parsed
}

export const validateFrontmatter = (
  frontmatter: Partial<PostFrontmatter> | null | undefined,
  filePath: string
): PostFrontmatter => {
  if (!frontmatter) {
    throw new FrontmatterValidationError(
      'No frontmatter found. Please add YAML frontmatter with required fields (title, date, description)',
      filePath
    )
  }

  if (!isTitleValid(frontmatter.title)) {
    throw new FrontmatterValidationError(
      'Missing or invalid "title" field. Title must be a non-empty string',
      filePath
    )
  }

  if (!isDateTypeValid(frontmatter.date)) {
    throw new FrontmatterValidationError(
      'Missing or invalid "date" field. Date must be a valid date string',
      filePath
    )
  }

  if (!isDescriptionValid(frontmatter.description)) {
    throw new FrontmatterValidationError(
      'Missing or invalid "description" field. Description must be a non-empty string',
      filePath
    )
  }

  let parsedDate: Date
  try {
    parsedDate = parseDateValue(frontmatter.date as string | number | Date)
  } catch {
    throw new FrontmatterValidationError(
      `Invalid date "${frontmatter.date}". Please use a valid date format`,
      filePath
    )
  }

  return {
    title: frontmatter.title.trim(),
    date: parsedDate,
    description: frontmatter.description.trim(),
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : []
  }
}
