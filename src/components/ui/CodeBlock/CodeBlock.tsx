import type React from 'react'
import type { ReactNode } from 'react'
import { useClipboard } from '@/hooks/useClipboard'
import { extractTextContent } from '@/utils/reactNodeUtils'
import CheckIcon from '../../icons/CheckIcon'
import CopyIcon from '../../icons/CopyIcon'
import styles from './code-block.module.css'

interface CodeBlockProps {
  children?: ReactNode
  className?: string | undefined
}

const CodeBlock = ({
  children,
  className
}: CodeBlockProps): React.JSX.Element => {
  const { copied, copyToClipboard } = useClipboard()

  const handleCopy = async (): Promise<void> => {
    if (children === null || children === undefined) return

    const code = extractTextContent(children).replace(/\n$/, '')
    await copyToClipboard(code)
  }

  return (
    <div
      className={`${styles['code-block-container']} action-button-container`}
    >
      <button
        onClick={handleCopy}
        className="action-button"
        aria-label="Copy code to clipboard"
        title="Copy code"
      >
        {copied ? (
          <CheckIcon size={16} ariaLabel="Copied" title="Copied!" />
        ) : (
          <CopyIcon size={16} ariaLabel="Copy code" title="Copy code" />
        )}
      </button>
      <pre className={className}>{children}</pre>
    </div>
  )
}

export default CodeBlock
