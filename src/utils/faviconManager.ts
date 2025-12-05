class FaviconManager {
  private faviconLinkElement: HTMLLinkElement | null = null

  constructor() {
    this.initFaviconElement()
  }

  private initFaviconElement(): void {
    this.faviconLinkElement = document.querySelector(
      'link[rel="icon"]'
    ) as HTMLLinkElement | null
  }

  public setFaviconForTheme(isDarkTheme: boolean): void {
    // Ensure favicon element reference is cached
    if (!this.faviconLinkElement) {
      this.initFaviconElement()
    }

    if (!this.faviconLinkElement) return

    // Mapping logic:
    // Both favicons use accent blue (#3a70d6) which has sufficient contrast on both light and dark backgrounds.
    // This ensures favicon visibility regardless of macOS system theme (light/dark) or blog theme (light/dark).
    // Cache-busting query parameter forces browser to reload favicon and prevents stale favicon display.
    // The href change triggers favicon update when theme changes.
    this.faviconLinkElement.href = isDarkTheme
      ? '/favicons/favicon-light.svg?theme=dark'
      : '/favicons/favicon-dark.svg?theme=light'
  }
}

export const faviconManager = new FaviconManager()
export default FaviconManager
