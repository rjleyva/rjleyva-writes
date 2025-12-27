---
title: Build-Time Content Generation
description: A deep dive into my custom build-time content processing system that transforms markdown files into type-safe TypeScript modules, including the trade-offs and design decisions.
date: 2025-12-24
tags:
  [
    'build-tools',
    'typescript',
    'markdown',
    'performance',
    'developer-experience',
    'content-management'
  ]
---

# How I Process Blog Posts at Compile Time

When I started building my personal blog, I wanted something that felt both fast and maintainable. Most static site generators handle content at build time, but I found myself wanting more control over the process. Instead of using a framework's content layer, I built my own build-time content generation system.

It started simple—a script to read markdown files and generate some TypeScript—but evolved into a sophisticated pipeline that validates content, calculates reading times, and creates type-safe imports. The result is a blog that loads instantly while giving me complete control over how content flows from markdown to the browser.

## The Problem I Was Solving

Traditional static site generators like Next.js or Astro handle content processing automatically. But I wanted:

- **Type safety**: Content should be validated at build time, not runtime
- **Performance**: No content parsing during page loads
- **Flexibility**: Full control over how markdown gets transformed
- **Developer experience**: Clear error messages and validation

My blog posts live as markdown files with YAML frontmatter:

```yaml
---
title: 'Build-Time Content Generation'
description: 'A deep dive into my custom build system'
date: '2025-12-24'
tags: ['typescript', 'build-tools']
---
```

The challenge was transforming these files into something my React components could use efficiently.

## The Solution: Build-Time Processing

Instead of parsing markdown at runtime, I created a build script that runs during compilation. Here's how it works:

### File Discovery

The system recursively scans my content directory, finding all `.md` files:

```typescript
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
```

This creates a flat list of all markdown files, preserving their relative paths.

### Frontmatter Validation

Each file gets parsed for YAML frontmatter with strict validation:

```typescript
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

  // ... date and description validation continues
}
```

I built this validation because I wanted to catch content errors during builds, not in production. Every post must have a title, date, and description.

### Content Processing

For each valid file, the system extracts metadata and processes the content:

```typescript
const blogPost = {
  title: parsedFile.frontmatter.title,
  date: dateValue.toISOString(), // Serialized for JSON compatibility
  description: parsedFile.frontmatter.description,
  tags: parsedFile.frontmatter.tags ?? [],
  slug: slugFromFilename,
  topic: topicFromPath, // Extracted from directory structure
  content: parsedFile.markdownBody,
  readingTime: estimatedReadingTimeMinutes
}
```

The reading time calculation uses a simple but effective formula:

```typescript
const wordCount = parsedFile.markdownBody
  .split(/\s+/)
  .filter(word => word.trim().length > 0).length

const estimatedReadingTimeMinutes =
  wordCount === 0 ? 0 : Math.ceil(wordCount / 200) // 200 WPM
```

### Type-Safe Module Generation

The most interesting part is how this generates actual TypeScript code:

```typescript
const generateContentLoaderModule = (markdownFilePaths: string[]): string => {
  const importStatements: string[] = []
  const moduleMappings: string[] = []
  const processedBlogPosts: SerializedPost[] = []

  for (const relativeFilePath of markdownFilePaths) {
    const importVariableName =
      relativeFilePath.replace(/[^a-zA-Z0-9]/g, '_') + '_content'

    const viteImportPath = `@/content/blog/${relativeFilePath}?raw`

    importStatements.push(
      `import ${importVariableName} from '${viteImportPath}'`
    )

    moduleMappings.push(
      `  '@/content/blog/${relativeFilePath}': ${importVariableName}`
    )
  }

  // Generate the complete module...
}
```

This creates a file that looks like:

```typescript
// Auto-generated content imports - do not edit manually
import css_fix_social_icon_flicker_md_content from '@/content/blog/css/fix-social-icon-flicker-on-theme-toggle.md?raw'
import typescript_learning_typescript_md_content from '@/content/blog/typescript/learning-typescript-through-constraint-not-tutorials.md?raw'
import type { SerializedPost } from '@/types/post'

export const contentModules = {
  '@/content/blog/css/fix-social-icon-flicker-on-theme-toggle.md':
    css_fix_social_icon_flicker_md_content,
  '@/content/blog/typescript/learning-typescript-through-constraint-not-tutorials.md':
    typescript_learning_typescript_md_content
}

export const processedPosts: SerializedPost[] = [
  {
    title: 'Fix Social Icon Flicker on Theme Toggle',
    date: '2025-12-04T00:00:00.000Z',
    description: 'How I fixed a subtle CSS transition bug...'
    // ... complete post metadata
  }
] as const
```

### Runtime Usage

At runtime, the content is immediately available:

```typescript
import { processedPosts } from './generatedContent'

const convertProcessedPosts = (): Post[] => {
  return processedPosts.map(post => ({
    ...post,
    date: new Date(post.date), // Convert back to Date objects
    tags: [...post.tags]
  }))
}

export const posts: Post[] = convertProcessedPosts()
```

## Why This Approach?

### The Benefits

**Performance**: Content loads instantly because it's processed at build time. No runtime parsing means faster page loads and better SEO.

**Type Safety**: TypeScript validates content structure during compilation. If I forget a required field, the build fails with a clear error message.

**Developer Experience**: Writing posts feels natural—just create markdown files. The build system handles the rest, with helpful error messages when something goes wrong.

**Flexibility**: I control exactly how content gets transformed. Want to add a new metadata field? Just update the types and validation logic.

**Caching**: Vite's import system means content gets bundled efficiently. No duplicate processing or unnecessary re-renders.

### The Trade-offs

**Build Complexity**: This system adds complexity to the build process. A simple static site generator would handle this automatically.

**No Hot Reload for Content**: Changing a blog post requires a full rebuild. During development, this means waiting for the content generation script to run.

**Maintenance Overhead**: I have to maintain this custom code. If Vite or TypeScript changes how imports work, I need to update my system.

**Learning Curve**: New contributors need to understand this custom system instead of a standard framework approach.

## Alternatives I Considered

**Runtime Processing**: Parse markdown in the browser or server. This would be simpler but slower, especially for large blogs.

**Static Site Generators**: Use Next.js, Astro, or Eleventy. These handle content processing automatically but give less control.

**Headless CMS**: Contentful or Sanity would provide a nice editing experience but add external dependencies and API calls.

**File-Based CMS**: Something like Contentlayer that generates types from content. This would be similar to my approach but more opinionated.

## The Result

My blog now builds content once and serves it instantly. The system catches content errors during development, provides excellent TypeScript support, and gives me complete control over the content pipeline.

The trade-off is complexity—I maintain more code than I would with a standard framework. But the performance benefits and developer experience make it worthwhile for my use case.

If you're building a blog and want maximum control over your content pipeline, this approach might work for you too. Just be prepared to maintain the build tooling alongside your content.

You can see the complete implementation in my [blog repository](https://github.com/rjleyva/rjleyva-writes). The content generation script runs automatically during builds, transforming markdown into type-safe TypeScript that my React components can import directly.

What do you think—would you build something similar for your own blog, or stick with a more conventional approach?
