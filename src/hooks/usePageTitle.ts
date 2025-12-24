import { useEffect } from 'react'

export const usePageTitle = (
  title: string | null,
  fallback: string = "RJ Leyva's Modern Docs"
): void => {
  useEffect(() => {
    document.title =
      title != null ? `${title} | RJ Leyva's Modern Docs` : fallback
  }, [title, fallback])
}
