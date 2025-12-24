import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse as parseYaml } from 'yaml'
import type { PostFrontmatter, SerializedPost } from '../src/types/post'

// Custom error for frontmatter validation failures - preserves file context for debugging
class FrontmatterValidationError extends Error {
  filePath: string

  constructor(message: string, filePath: string) {
    super(`Frontmatter validation failed for ${filePath}: ${message}`)
    this.name = 'FrontmatterValidationError'
    this.filePath = filePath
  }
}

// Strict frontmatter validation - fails fast on invalid data to prevent downstream issues
// Trade-off: Strict validation reduces runtime errors but requires complete frontmatter in all posts
const validateFrontmatter = (
  frontmatter: Partial<PostFrontmatter> | null | undefined,
  filePath: string
): PostFrontmatter => {
  if (!frontmatter) {
    throw new FrontmatterValidationError(
      'Missing frontmatter block. Add YAML frontmatter between --- markers at the top of the file with title, date, and description fields.',
      filePath
    )
  }

  if (
    typeof frontmatter.title !== 'string' ||
    frontmatter.title.trim() === ''
  ) {
    throw new FrontmatterValidationError(
      'Invalid title field. Title must be a non-empty string that will be displayed as the post headline.',
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
      'Invalid date field. Date must be a valid ISO string (e.g., "2025-12-05") or JavaScript Date object for proper chronological sorting.',
      filePath
    )
  }

  if (
    typeof frontmatter.description !== 'string' ||
    frontmatter.description.trim() === ''
  ) {
    throw new FrontmatterValidationError(
      'Invalid description field. Description must be a non-empty string that summarizes the post content for RSS feeds and previews.',
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
        `Unparseable date "${dateValue}". Use ISO format (e.g., "2025-12-05") or JavaScript Date constructor compatible string.`,
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

// Parsed content structure - separates metadata from body for independent processing
interface ParsedMarkdownFile {
  readonly frontmatter: PostFrontmatter
  readonly markdownBody: string
}

// Build-time path resolution - relative to script location for reliable execution from any directory
const SCRIPT_DIRECTORY: string = path.dirname(fileURLToPath(import.meta.url))
const BLOG_CONTENT_DIRECTORY: string = path.join(
  SCRIPT_DIRECTORY,
  '../src/content/blog'
)
const THEMES_CSS_PATH: string = path.join(
  SCRIPT_DIRECTORY,
  '../src/styles/themes.css'
)
const TOKENS_CSS_PATH: string = path.join(
  SCRIPT_DIRECTORY,
  '../src/styles/tokens.css'
)

// Content processing constants - chosen based on RSS reader behavior and performance trade-offs
const MAX_RSS_ITEMS = 20 // Balance between freshness and feed size
const WORDS_PER_MINUTE = 200 // Industry standard for technical content reading speed
const DEFAULT_PRODUCTION_URL = 'https://rjleyva-writes.pages.dev'

// Single-pass markdown parsing - extracts frontmatter and content in one regex operation
// Avoids multiple string operations for better performance on large content files
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
      'Frontmatter delimiter not found. File must start with --- followed by YAML frontmatter and another ---.',
      filePath
    )
  }

  markdownContent = rawFileContent.replace(frontmatterPattern, '')

  const frontmatterText = frontmatterMatch[1]
  if (frontmatterText == null || frontmatterText.trim() === '') {
    throw new FrontmatterValidationError(
      'Frontmatter block is empty. Add YAML content between the --- delimiters with at least title, date, and description.',
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
      `YAML parsing failed: ${error instanceof Error ? error.message : String(error)}. Check YAML syntax and indentation.`,
      filePath
    )
  }

  return {
    frontmatter: parsedFrontmatter,
    markdownBody: markdownContent
  }
}

// File discovery using synchronous recursion - simple and predictable for build-time operations
// Trade-off: Synchronous I/O blocks but is acceptable for build scripts where parallelism isn't critical
const discoverMarkdownFiles = (): readonly string[] => {
  if (!fs.existsSync(BLOG_CONTENT_DIRECTORY)) {
    throw new Error(
      `Blog content directory not found: ${BLOG_CONTENT_DIRECTORY}. Ensure src/content/blog exists with markdown files.`
    )
  }

  const discoveredFiles: string[] = []

  // Recursive directory traversal - maintains relative paths for consistent slug generation
  // Depth-first ensures predictable file ordering across different filesystems
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

// Content processing pipeline - transforms raw markdown into structured post data
// Single-threaded processing chosen for simplicity; could be parallelized if build performance becomes bottleneck
const getProcessedPosts = (): readonly SerializedPost[] => {
  const discoveredMarkdownFiles = discoverMarkdownFiles()
  const processedBlogPosts: SerializedPost[] = []

  // Fail-fast on first invalid post - prevents partial RSS generation that could mask content issues
  for (const relativeFilePath of discoveredMarkdownFiles) {
    try {
      const absoluteFilePath = path.join(
        BLOG_CONTENT_DIRECTORY,
        relativeFilePath
      )
      const rawFileContent = fs.readFileSync(absoluteFilePath, 'utf-8')
      const parsedFile = parseMarkdownFile(rawFileContent, relativeFilePath)

      // Normalize path separators to forward slashes for cross-platform compatibility
      const normalizedPath = relativeFilePath.replace(/\\/g, '/')
      const pathSegments = normalizedPath.split('/')
      // Extract topic from parent directory (e.g., 'css' from 'css/post.md')
      const topicFromPath = pathSegments[pathSegments.length - 2] ?? ''
      const filename = pathSegments[pathSegments.length - 1] ?? ''
      const slugFromFilename = filename.replace('.md', '')

      // Reading time estimation - 200 WPM is industry standard for technical content
      // Ceiling function ensures we never underestimate reading time, reducing user frustration
      const wordCount: number =
        parsedFile.markdownBody.trim() === ''
          ? 0
          : parsedFile.markdownBody
              .split(/\s+/)
              .filter((word: string): boolean => word.trim().length > 0).length
      const estimatedReadingTimeMinutes: number =
        wordCount === 0 ? 0 : Math.ceil(wordCount / WORDS_PER_MINUTE)

      const dateValue =
        parsedFile.frontmatter.date instanceof Date
          ? parsedFile.frontmatter.date
          : new Date(parsedFile.frontmatter.date + 'T00:00:00.000Z')

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

  return processedBlogPosts
}

// RSS generation - dual output strategy serves both machines (XML) and humans (HTML preview)
// Production URL prioritization ensures feed links work in deployed environment
const generateRssFeed = (): void => {
  // Environment-specific URL resolution - RSS feeds must point to live site for reader functionality
  const blogBaseUrl =
    process.env['VITE_PRODUCTION_URL'] ?? DEFAULT_PRODUCTION_URL

  const processedPosts = getProcessedPosts()

  if (processedPosts.length === 0) {
    console.warn('No blog posts found. RSS feed will be empty.')
    // Continue processing to generate valid (empty) RSS structure
  }

  // Content curation strategy - chronological ordering maximizes reader engagement
  // MAX_RSS_ITEMS limit balances freshness with performance; RSS readers typically fetch incrementally
  const rssItemElements: readonly string[] = [...processedPosts]
    .sort(
      (a: SerializedPost, b: SerializedPost) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, MAX_RSS_ITEMS)
    .map((post: SerializedPost): string => {
      // Topic-based URL structure enables scalable content organization and SEO-friendly paths
      const fullPostUrl = `${blogBaseUrl}/blog/${post.topic}/${post.slug}`
      // RSS standard requires UTC timestamps for consistent timezone handling across readers
      const rssFormattedDate = new Date(post.date).toUTCString()

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${fullPostUrl}</link>
      <guid>${fullPostUrl}</guid>
      <pubDate>${rssFormattedDate}</pubDate>
      ${post.tags.map((tag: string) => `<category><![CDATA[${tag}]]></category>`).join('\n      ')}
    </item>`
    })

  // Build complete RSS XML with required channel metadata
  const completeRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RJ Leyva's Blog</title>
    <description>RJ Leyva's personal blog documenting web development insights through writing.</description>
    <link>${blogBaseUrl}</link>
    <atom:link href="${blogBaseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>RJ Leyva's Blog</generator>
${rssItemElements.join('\n')}
  </channel>
</rss>`

  // HTML preview generation - accessibility layer for RSS content in web browsers
  // Duplicate sorting ensures consistency between XML and HTML outputs
  const htmlPreviewItems: readonly string[] = [...processedPosts]
    .sort(
      (a: SerializedPost, b: SerializedPost) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, MAX_RSS_ITEMS)
    .map((post: SerializedPost): string => {
      const fullPostUrl = `${blogBaseUrl}/blog/${post.topic}/${post.slug}`
      const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      })

      return `    <article class="post">
      <h2 class="post-title">
        <a href="${fullPostUrl}">${post.title}</a>
      </h2>
      <div class="post-meta">
        <time datetime="${post.date}">${formattedDate}</time>
        <span class="reading-time"> • ${post.readingTime} min read</span>
      </div>
      <p class="post-description">${post.description}</p>
      <div class="post-tags">
        ${post.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join(' ')}
      </div>
    </article>`
    })

  // Read theme and token CSS files
  const themesCss = fs.readFileSync(THEMES_CSS_PATH, 'utf-8')
  const tokensCss = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8')

  const htmlPreview = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RJ Leyva's Blog - RSS Feed</title>
  <style>
    ${themesCss}
    ${tokensCss}

    /* RSS-specific styles using theme variables */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      line-height: 1.6;
      color: var(--text);
      background-color: var(--base);
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      background: var(--surface);
      padding: 2rem;
      border-radius: var(--border-radius-medium);
      margin-bottom: 2rem;
      box-shadow: var(--shadow-elevation-small);
      text-align: center;
      border: var(--border-width-hairline) solid var(--border);
    }

    .header h1 {
      color: var(--text);
      margin-bottom: 0.5rem;
      font-size: 2rem;
      font-weight: 700;
    }

    .header p {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .rss-info {
      background: var(--surface-secondary);
      border: var(--border-width-hairline) solid var(--accent);
      border-radius: var(--border-radius-medium);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .rss-info h2 {
      color: var(--accent);
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .rss-url {
      background: var(--surface);
      border: var(--border-width-hairline) solid var(--border);
      border-radius: var(--border-radius-small);
      padding: 0.75rem;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9rem;
      word-break: break-all;
      margin: 0.5rem 0;
      color: var(--text);
    }

    .post {
      background: var(--surface);
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      border-radius: var(--border-radius-medium);
      box-shadow: var(--shadow-elevation-small);
      border: var(--border-width-hairline) solid var(--border);
      transition: all var(--transition-duration-normal);
    }

    .post:hover {
      transform: var(--hover-scale-subtle);
      box-shadow: var(--shadow-elevation-medium);
    }

    .post-title {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    .post-title a {
      color: var(--text);
      text-decoration: none;
      font-weight: 600;
    }

    .post-title a:hover {
      color: var(--accent);
      text-decoration: underline;
    }

    .post-meta {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .post-description {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .post-tags {
      margin-top: 1rem;
    }

    .tag {
      display: inline-block;
      background: var(--surface-secondary);
      color: var(--text-muted);
      padding: 0.25rem 0.75rem;
      border-radius: var(--border-radius-large);
      font-size: 0.8rem;
      margin-right: 0.5rem;
      margin-bottom: 0.25rem;
      border: var(--border-width-hairline) solid var(--border);
      transition: all var(--transition-duration-fast);
    }

    .tag:hover {
      background: var(--accent);
      color: var(--surface);
      transform: var(--hover-scale-interactive);
    }

    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: var(--border-width-hairline) solid var(--border);
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .footer a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 500;
    }

    .footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      body {
        padding: 15px;
      }

      .header {
        padding: 1.5rem;
      }

      .post {
        padding: 1rem;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>RJ Leyva's Blog</h1>
    <p>RJ Leyva's personal blog documenting web development insights through writing.</p>
  </header>

  <section class="rss-info">
    <h2>Subscribe to this feed</h2>
    <p>This is a browser-friendly view of the RSS feed. To subscribe in an RSS reader:</p>
    <div class="rss-url">${blogBaseUrl}/rss.xml</div>
    <p><em>Raw XML feed:</em> <a href="${blogBaseUrl}/rss.xml">${blogBaseUrl}/rss.xml</a></p>
  </section>

  <main>
${htmlPreviewItems.join('\n')}
  </main>

  <footer class="footer">
    <p>Generated by RJ Leyva's Blog • <a href="${blogBaseUrl}">Visit RJ Leyva's Blog</a></p>
  </footer>
</body>
</html>`

  // Atomic file writes to public directory - ensures feed availability during static site generation
  // Public directory chosen for direct web server access without additional routing complexity
  const publicDirectory = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDirectory)) {
    fs.mkdirSync(publicDirectory, { recursive: true })
  }

  const rssFilePath = path.join(publicDirectory, 'rss.xml')
  fs.writeFileSync(rssFilePath, completeRssXml, 'utf-8')

  const htmlFilePath = path.join(publicDirectory, 'rss-viewer.html')
  fs.writeFileSync(htmlFilePath, htmlPreview, 'utf-8')

  console.log(
    `Generated RSS feed with ${rssItemElements.length} items at ${rssFilePath}`
  )
  console.log(`Generated HTML preview at ${htmlFilePath}`)
}

generateRssFeed()
