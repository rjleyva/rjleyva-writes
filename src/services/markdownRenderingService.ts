import type { ReactElement } from 'react'
import type { Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import { MarkdownRenderer } from '@/lib/mardownRender'

let rendererInstance: MarkdownRenderer | null = null

const getRenderer = async (): Promise<MarkdownRenderer> => {
  rendererInstance ??= new MarkdownRenderer()
  return rendererInstance
}

export interface RenderedContent {
  dom: ReactElement | null
  mdast: MdastRoot | null
  hast: HastRoot | null
}

export const renderMarkdown = async (
  markdown: string
): Promise<RenderedContent> => {
  try {
    const renderer = await getRenderer()
    const { result: dom, mdast, hast } = await renderer.render(markdown)

    return { dom, mdast, hast }
  } catch (error) {
    console.error('Failed to render markdown:', error)
    throw new Error('Failed to render Markdown')
  }
}
