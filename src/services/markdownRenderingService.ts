import type { ReactElement } from 'react'
import type { Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import { MarkdownRenderer } from '@/lib/markdownRender'

let rendererInstance: MarkdownRenderer | null = null

const getRenderer = (): MarkdownRenderer => {
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
    const renderer = getRenderer()
    const { result: dom, mdast, hast } = renderer.render(markdown)

    return { dom, mdast, hast }
  } catch (error) {
    console.error('Failed to render markdown:', error)
    throw new Error('Failed to render Markdown')
  }
}
