export const usePageTitle = (
  title: string | null,
  fallback: string = 'rjleyva.dev'
): string => {
  return title != null ? `${title} | rjleyva.dev` : fallback
}
