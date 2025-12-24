import { useEffect } from 'react'

export const usePageTitle = (
  title: string | null,
  fallback: string = 'rjleyva.dev'
): void => {
  useEffect(() => {
    document.title = title != null ? `${title} | rjleyva.dev` : fallback
  }, [title, fallback])
}
