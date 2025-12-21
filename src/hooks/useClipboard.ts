import { useCallback, useEffect, useRef, useState } from 'react'
import { handleError } from '@/utils/errorHandler'

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
      const appError = handleError(err, 'copyToClipboard')
      setError(appError.message)
    }
  }, [])

  return {
    copied,
    copyToClipboard,
    error
  }
}
