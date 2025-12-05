import { useCallback, useEffect, useRef, useState } from 'react'

interface UseClipboardReturn {
  copied: boolean
  copyToClipboard: (text: string) => Promise<void>
  error: string | null
}

export const useClipboard = (): UseClipboardReturn => {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return (): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      setError(null)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      await navigator.clipboard.writeText(text)
      setCopied(true)
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
        timeoutRef.current = null
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy'
      setError(errorMessage)
      console.error('Failed to copy text:', err)
    }
  }, [])

  return {
    copied,
    copyToClipboard,
    error
  }
}
