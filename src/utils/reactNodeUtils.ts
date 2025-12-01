import { isValidElement, type ReactNode } from 'react'

export const extractTextContent = (node: ReactNode): string => {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractTextContent).join('')
  if (isValidElement(node)) {
    const nodeProps = node.props as { children?: ReactNode }
    if (nodeProps.children !== null) {
      return extractTextContent(nodeProps.children)
    }
  }
  return ''
}
