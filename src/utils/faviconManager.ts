class FaviconManager {
  private faviconLink: HTMLLinkElement | null = null

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    // Reuse existing favicon link or create one for dynamic updates
    this.faviconLink = document.querySelector(
      'link[rel="icon"]'
    ) as HTMLLinkElement | null

    if (!this.faviconLink) {
      this.faviconLink = document.createElement('link')
      this.faviconLink.rel = 'icon'
      this.faviconLink.type = 'image/svg+xml'
      document.head.appendChild(this.faviconLink)
    }

    this.updateFavicon()

    // Sync with system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => this.updateFavicon())
  }

  private updateFavicon(): void {
    if (!this.faviconLink) return

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    this.faviconLink.href = prefersDark
      ? '/favicon-dark.svg'
      : '/favicon-light.svg'
  }

  /** Override system preference for manual theme switching */
  public setFavicon(isDark: boolean): void {
    if (!this.faviconLink) return
    this.faviconLink.href = isDark ? '/favicon-dark.svg' : '/favicon-light.svg'
  }
}

export const faviconManager = new FaviconManager()
export default FaviconManager
