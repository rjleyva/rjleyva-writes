import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse as parseYaml } from 'yaml'
import type { PostFrontmatter, SerializedPost } from '@/types/post'

class FrontmatterValidationError extends Error {
  filePath: string

  constructor(message: string, filePath: string) {
    super(`Frontmatter validation failed for ${filePath}: ${message}`)
    this.name = 'FrontmatterValidationError'
    this.filePath = filePath
  }
}

const validateFrontmatter = (
  frontmatter: Partial<PostFrontmatter> | null | undefined,
  filePath: string
): PostFrontmatter => {
  if (!frontmatter) {
    throw new FrontmatterValidationError(
      'No frontmatter found. Please add YAML frontmatter with required fields (title, date, description)',
      filePath
    )
  }

  if (
    typeof frontmatter.title !== 'string' ||
    frontmatter.title.trim() === ''
  ) {
    throw new FrontmatterValidationError(
      'Missing or invalid "title" field. Title must be a non-empty string',
      filePath
    )
  }

  const dateValue = frontmatter.date
  const isValidDate =
    typeof dateValue === 'string' ||
    dateValue instanceof Date ||
    (typeof dateValue === 'number' && !Number.isNaN(dateValue))

  if (!isValidDate) {
    throw new FrontmatterValidationError(
      'Missing or invalid "date" field. Date must be a valid date string (e.g., "2025-12-05")',
      filePath
    )
  }

  if (
    typeof frontmatter.description !== 'string' ||
    frontmatter.description.trim() === ''
  ) {
    throw new FrontmatterValidationError(
      'Missing or invalid "description" field. Description must be a non-empty string',
      filePath
    )
  }

  // Normalize date to Date object for consistent type handling
  let parsedDate: Date
  if (dateValue instanceof Date) {
    parsedDate = dateValue
  } else {
    parsedDate = new Date(dateValue as string | number)
    if (Number.isNaN(parsedDate.getTime())) {
      throw new FrontmatterValidationError(
        `Invalid date "${dateValue}". Please use a valid date format (e.g., "2025-12-05")`,
        filePath
      )
    }
  }

  return {
    title: frontmatter.title.trim(),
    date: parsedDate,
    description: frontmatter.description.trim(),
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : []
  }
}

interface ParsedMarkdownFile {
  frontmatter: PostFrontmatter
  markdownBody: string
}

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url))
const BLOG_CONTENT_DIRECTORY = path.join(
  SCRIPT_DIRECTORY,
  '../src/content/blog'
)

const parseMarkdownFile = (
  rawFileContent: string,
  filePath: string
): ParsedMarkdownFile => {
  // Match YAML frontmatter delimited by --- markers
  const frontmatterPattern = /^---\n([\s\S]*?)\n---(?:\n|$)/
  const frontmatterMatch = rawFileContent.match(frontmatterPattern)

  let parsedFrontmatter: PostFrontmatter

  let markdownContent = rawFileContent

  if (frontmatterMatch == null) {
    throw new FrontmatterValidationError(
      'No frontmatter found. Please add YAML frontmatter with required fields (title, date, description)',
      filePath
    )
  }

  markdownContent = rawFileContent.replace(frontmatterPattern, '')

  const frontmatterText = frontmatterMatch[1]
  if (frontmatterText == null || frontmatterText.trim() === '') {
    throw new FrontmatterValidationError(
      'Frontmatter is empty. Please provide YAML frontmatter with required fields (title, date, description)',
      filePath
    )
  }

  try {
    const parsed = parseYaml(frontmatterText) as Partial<PostFrontmatter>
    parsedFrontmatter = validateFrontmatter(parsed, filePath)
  } catch (error) {
    if (error instanceof FrontmatterValidationError) {
      throw error
    }
    throw new FrontmatterValidationError(
      `Invalid YAML in frontmatter: ${error instanceof Error ? error.message : String(error)}`,
      filePath
    )
  }

  return {
    frontmatter: parsedFrontmatter,
    markdownBody: markdownContent
  }
}

const discoverMarkdownFiles = (): string[] => {
  const discoveredFiles: string[] = []

  const scanDirectoryRecursively = (
    absoluteDirectoryPath: string,
    relativePathFromContentRoot = ''
  ): void => {
    const directoryEntries = fs.readdirSync(absoluteDirectoryPath, {
      withFileTypes: true
    })

    for (const entry of directoryEntries) {
      const fullEntryPath = path.join(absoluteDirectoryPath, entry.name)
      const relativeEntryPath = path.join(
        relativePathFromContentRoot,
        entry.name
      )

      if (entry.isDirectory()) {
        scanDirectoryRecursively(fullEntryPath, relativeEntryPath)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        discoveredFiles.push(relativeEntryPath)
      }
    }
  }

  scanDirectoryRecursively(BLOG_CONTENT_DIRECTORY)
  return discoveredFiles
}

const generateContentLoaderModule = (markdownFilePaths: string[]): string => {
  const importStatements: string[] = []
  const moduleMappings: string[] = []
  const processedBlogPosts: SerializedPost[] = []

  for (const relativeFilePath of markdownFilePaths) {
    // Sanitize file path to valid JS identifier for import variable
    const importVariableName =
      relativeFilePath.replace(/[^a-zA-Z0-9]/g, '_') + '_content'
    const viteImportPath = `@/content/blog/${relativeFilePath}?raw`

    importStatements.push(
      `import ${importVariableName} from '${viteImportPath}'`
    )

    moduleMappings.push(
      `  '@/content/blog/${relativeFilePath}': ${importVariableName}`
    )

    try {
      const absoluteFilePath = path.join(
        BLOG_CONTENT_DIRECTORY,
        relativeFilePath
      )
      const rawFileContent = fs.readFileSync(absoluteFilePath, 'utf-8')
      const parsedFile = parseMarkdownFile(rawFileContent, relativeFilePath)

      const pathSegments = relativeFilePath.split('/')
      // Extract topic from parent directory (e.g., 'css' from 'css/post.md')
      const topicFromPath = pathSegments[pathSegments.length - 2] ?? ''
      const filename = pathSegments[pathSegments.length - 1] ?? ''
      const slugFromFilename = filename.replace('.md', '')

      // Calculate reading time at 200 words per minute
      const wordCount =
        parsedFile.markdownBody.trim() === ''
          ? 0
          : parsedFile.markdownBody
              .split(/\s+/)
              .filter(word => word.trim().length > 0).length
      const estimatedReadingTimeMinutes =
        wordCount === 0 ? 0 : Math.ceil(wordCount / 200)

      const dateValue =
        parsedFile.frontmatter.date instanceof Date
          ? parsedFile.frontmatter.date
          : new Date(parsedFile.frontmatter.date)

      const blogPost = {
        title: parsedFile.frontmatter.title,
        // Serialize date as ISO string for JSON compatibility
        date: dateValue.toISOString(),
        description: parsedFile.frontmatter.description,
        tags: parsedFile.frontmatter.tags ?? [],
        slug: slugFromFilename,
        topic: topicFromPath,
        content: parsedFile.markdownBody,
        readingTime: estimatedReadingTimeMinutes
      }

      processedBlogPosts.push(blogPost)
    } catch (error) {
      if (error instanceof FrontmatterValidationError) {
        console.error(`\n❌ ${error.message}\n`)
        process.exit(1)
      }
      throw error
    }
  }

  const generatedModuleContent = `// Auto-generated content imports - do not edit manually
// Generated by scripts/generateContentImports.ts
// This file provides type-safe access to all blog content at build time

import type { SerializedPost } from '@/types/post'

${importStatements.join('\n')}

// Raw markdown content accessible by file path
export const contentModules = {
${moduleMappings.join(',\n')}
}

// Processed blog posts with metadata and content
// Note: dates are serialized as ISO strings and must be converted to Date objects
export const processedPosts: SerializedPost[] = ${JSON.stringify(processedBlogPosts, null, 2)} as const
`

  return generatedModuleContent
}

const executeContentGeneration = (): void => {
  console.log('Discovering markdown files...')
  const discoveredMarkdownFiles = discoverMarkdownFiles()

  console.log('Processing content and generating TypeScript module...')
  const generatedContentModule = generateContentLoaderModule(
    discoveredMarkdownFiles
  )

  const outputFilePath = path.join(
    SCRIPT_DIRECTORY,
    '../src/lib/content/generatedContent.ts'
  )

  fs.writeFileSync(outputFilePath, generatedContentModule)

  console.log(
    `Generated content loader for ${discoveredMarkdownFiles.length} files`
  )
  discoveredMarkdownFiles.forEach(filePath => {
    console.log(`  ${filePath}`)
  })
}

executeContentGeneration()
