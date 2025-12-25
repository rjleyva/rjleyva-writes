class FaviconManager {
  private faviconLinkElement: HTMLLinkElement | null = null
  private mediaQuery: MediaQueryList | null = null

  constructor() {
    this.initFaviconElement()
    this.setupMediaQueryListener()
  }

  private initFaviconElement(): void {
    this.faviconLinkElement = document.querySelector(
      'link[rel="icon"]'
    ) as HTMLLinkElement | null
  }

  private setupMediaQueryListener(): void {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.mediaQuery.addEventListener('change', () => {
      this.updateFavicon()
    })
    // Set initial favicon based on current preference
    this.updateFavicon()
  }

  public setFaviconForTheme(_isDarkTheme: boolean): void {
    // This method is kept for backward compatibility but now uses browser preference
    this.updateFavicon()
  }

  private updateFavicon(): void {
    // Ensure favicon element reference is cached
    if (!this.faviconLinkElement) {
      this.initFaviconElement()
    }

    if (!this.faviconLinkElement) return

    // Mapping logic:
    // Use browser/system theme preference to determine favicon color for visibility
    // against the browser tab background, not the website's theme
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const timestamp = Date.now()
    this.faviconLinkElement.href = prefersDark
      ? `/favicons/favicon-light.svg?theme=dark&t=${timestamp}`
      : `/favicons/favicon-dark.svg?theme=light&t=${timestamp}`
  }
}

export const faviconManager = new FaviconManager()
export default FaviconManager
