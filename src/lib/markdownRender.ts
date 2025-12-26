import type { Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import rehypeReact from 'rehype-react'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import CodeBlock from '@/components/ui/CodeBlock/CodeBlock'
import * as jsxRuntime from 'react/jsx-runtime'

const createPreComponent = ({
  children,
  className
}: {
  children?: React.ReactNode
  className?: string
}): React.ReactElement => {
  return CodeBlock({ children, className })
}

export class MarkdownRenderer {
  processor: Awaited<ReturnType<typeof this.createProcessor>> | null = null

  createProcessor(): ReturnType<typeof unified> {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkFrontmatter)
      .use(remarkRehype, {
        allowDangerousHtml: false
      })
      .use(rehypeSanitize, {
        // Allow only safe HTML elements and attributes
        allowDoctypes: false,
        allowComments: false,
        // Strip dangerous attributes - be very restrictive
        attributes: {
          '*': ['className', 'id', 'lang'],
          a: ['href', 'title', 'rel'],
          code: ['className'],
          pre: ['className'],
          h1: ['id'],
          h2: ['id'],
          h3: ['id'],
          h4: ['id'],
          h5: ['id'],
          h6: ['id']
        },
        // Allow only safe elements (no images, iframes, etc.)
        tagNames: [
          'p',
          'div',
          'span',
          'br',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'ul',
          'ol',
          'li',
          'blockquote',
          'pre',
          'code',
          'strong',
          'em',
          'del',
          'a',
          'hr',
          'table',
          'thead',
          'tbody',
          'tr',
          'th',
          'td'
        ],
        // Strip all protocols except safe ones
        protocols: {
          href: ['http', 'https', 'mailto']
        },
        // Additional safety: strip any content that looks like HTML with dangerous attributes
        strip: [
          'script',
          'style',
          'iframe',
          'object',
          'embed',
          'form',
          'input',
          'img'
        ]
      })
      .use(rehypeSlug)
      .use(rehypeReact, {
        Fragment: jsxRuntime.Fragment,
        jsx: jsxRuntime.jsx,
        jsxs: jsxRuntime.jsxs,
        components: {
          pre: createPreComponent
        }
      })

    this.processor = processor
    return processor
  }

  getProcessor(): ReturnType<typeof unified> {
    if (this.processor != null) return this.processor
    return this.createProcessor()
  }

  render(markdown: string): {
    result: React.ReactElement
    mdast: MdastRoot | null
    hast: HastRoot | null
  } {
    const processor = this.getProcessor()
    const file = processor.processSync(markdown)
    const result = file.result as React.ReactElement

    return {
      result,
      mdast: null,
      hast: null
    }
  }
}
