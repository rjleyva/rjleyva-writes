class FaviconManager {
  private faviconLinkElement: HTMLLinkElement | null = null
  private mediaQuery: MediaQueryList | null = null
  private isInitialized: boolean = false

  constructor() {}

  public initialize(): void {
    if (this.isInitialized) return
    this.initFaviconElement()
    this.setupMediaQueryListener()
    this.isInitialized = true
  }

  private initFaviconElement(): void {
    // Try to find favicon link element with various possible selectors
    this.faviconLinkElement ??= document.querySelector(
      'link[rel="icon"]'
    ) as HTMLLinkElement | null

    // Fallback to shortcut icon for older browsers
    this.faviconLinkElement ??= document.querySelector(
      'link[rel="shortcut icon"]'
    ) as HTMLLinkElement | null
  }

  private setupMediaQueryListener(): void {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.mediaQuery.addEventListener('change', () => {
      this.updateFaviconForSystemTheme()
    })
    // Set initial favicon based on current system preference
    this.updateFaviconForSystemTheme()
  }

  private updateFaviconForSystemTheme(): void {
    // Ensure favicon element reference is cached
    if (!this.faviconLinkElement) {
      this.initFaviconElement()
    }

    if (!this.faviconLinkElement) {
      console.warn('FaviconManager: Could not find favicon link element')
      return
    }

    // Update favicon based on current system theme preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const timestamp = Date.now()
    this.faviconLinkElement.href = prefersDark
      ? `/favicons/favicon-light.svg?theme=dark&t=${timestamp}`
      : `/favicons/favicon-dark.svg?theme=light&t=${timestamp}`
  }

  public setFaviconForTheme(isDarkTheme: boolean): void {
    this.updateFaviconForTheme(isDarkTheme)
  }

  private updateFaviconForTheme(_isDarkTheme: boolean): void {
    // Ensure favicon element reference is cached
    if (!this.faviconLinkElement) {
      this.initFaviconElement()
    }

    if (!this.faviconLinkElement) {
      console.warn('FaviconManager: Could not find favicon link element')
      return
    }

    // Mapping logic:
    // Use BROWSER preference to determine favicon color for visibility
    // against browser tab background, not app theme
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

export const initializeFaviconManager = (): void => {
  faviconManager.initialize()
}

export default FaviconManager
