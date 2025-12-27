---
title: Implementing Dynamic Favicons
description: A comprehensive exploration of building a theme-aware favicon system that adapts to both user preferences and system settings, including performance optimizations, browser compatibility considerations, and architectural trade-offs.
date: 2025-12-25
tags:
  [
    'web-development',
    'accessibility',
    'performance',
    'browser-api',
    'theme-system',
    'typescript',
    'user-experience'
  ]
---

Building a modern web application often involves subtle details that significantly impact user experience. One such detail is the favicon—the small icon that appears in browser tabs. When I added theme switching to my blog, I realized my favicon needed to adapt too. What started as a simple enhancement evolved into a sophisticated system that handles browser preferences, theme changes, and performance optimizations.

In this post, I'll walk through how I implemented a dynamic favicon manager that automatically switches between light and dark variants based on user preferences, with careful attention to performance, accessibility, and browser compatibility.

## The Problem: Static Favicons in a Dynamic World

Traditional favicons are static—they don't change based on user preferences or application state. But modern web applications often support multiple themes, and users increasingly expect visual consistency across their entire browsing experience.

Consider these scenarios:

- A user switches their operating system to dark mode
- A user manually toggles between light and dark themes in your application
- The favicon becomes invisible against the browser's tab background
- Users struggle to identify your tab among dozens of open tabs

The solution? Dynamic favicons that adapt to theme changes in real-time.

## Core Architecture: The FaviconManager Class

My implementation centers around a singleton `FaviconManager` class that handles all favicon-related logic. Here's the complete implementation:

```typescript
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

export const initializeFaviconManager = (): void => {
  faviconManager.initialize()
}
```

## Key Design Decisions and Trade-offs

### Browser Preference vs. Application Theme

One of the most critical decisions was whether to base the favicon on the application's theme or the browser's system preference. I chose browser preference for several reasons:

**Why Browser Preference?**

- **Tab Background Consistency**: Browser tabs have their own background colors that match the system theme, not your application's theme
- **User Expectations**: Users expect visual elements to match their system-wide theme settings
- **Reduced Complexity**: No need to coordinate between theme state and favicon state

**The Trade-off**: This means the favicon might not always match your application's theme, but it will always be visible against the tab background.

### Singleton Pattern with Lazy Initialization

The `faviconManager` is exported as a singleton instance with lazy initialization:

```typescript
export const faviconManager = new FaviconManager()

export const initializeFaviconManager = (): void => {
  faviconManager.initialize()
}
```

**Benefits:**

- **Controlled Setup**: Initialization happens when explicitly called, providing better control
- **Predictable State**: Single source of truth for favicon state
- **Better Error Handling**: Initialization can be wrapped with error boundaries

**Considerations:**

- **Manual Initialization Required**: Must be explicitly called during app startup
- **Global State**: Can make testing more complex

### Defensive Programming and Error Handling

The implementation includes several defensive programming techniques:

```typescript
private updateFavicon(): void {
  // Ensure favicon element reference is cached
  if (!this.faviconLinkElement) {
    this.initFaviconElement()
  }

  if (!this.faviconLinkElement) return
  // ... rest of logic
}
```

This handles cases where:

- The favicon link element might not exist
- The DOM might not be ready during initialization
- The element might be removed or modified by other scripts

### Cache Busting with Timestamps

The favicon URLs include timestamps to prevent caching issues:

```typescript
const timestamp = Date.now()
this.faviconLinkElement.href = prefersDark
  ? `/favicons/favicon-light.svg?theme=dark&t=${timestamp}`
  : `/favicons/favicon-dark.svg?theme=light&t=${timestamp}`
```

This ensures browsers always fetch the new favicon when the theme changes, preventing stale cached versions from showing incorrect icons.

## Browser API Integration

### MediaQueryList and Event Listeners

The system leverages the `MediaQueryList` API to detect system theme changes:

```typescript
private setupMediaQueryListener(): void {
  this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  this.mediaQuery.addEventListener('change', () => {
    this.updateFavicon()
  })
  // Set initial favicon based on current preference
  this.updateFavicon()
}
```

**Why `addEventListener` instead of `addListener`?**

- `addEventListener` is the modern standard
- `addListener` is deprecated in favor of event listeners
- Better consistency with other DOM APIs

### Browser Compatibility Considerations

The `prefers-color-scheme` media query has excellent support:

- **Chrome/Edge**: Full support since version 76
- **Firefox**: Full support since version 67
- **Safari**: Full support since version 12.1
- **Mobile browsers**: Well supported across iOS Safari and Android Chrome

For older browsers, the system gracefully degrades—the favicon simply won't change with system theme preferences.

## Integration with the Theme System

The favicon manager integrates seamlessly with my theme provider:

```typescript
// In ThemeProvider.tsx
import { faviconManager } from '@/utils/faviconManager'

useLayoutEffect(() => {
  // ... theme setup logic

  faviconManager.setFaviconForTheme(theme === THEMES.DARK)
}, [theme])
```

Interestingly, the `setFaviconForTheme` method now ignores the parameter and uses browser preference instead. This maintains backward compatibility while implementing the improved logic.

### Module Import Strategy

The favicon manager uses lazy initialization and must be explicitly initialized:

```typescript
// In main.tsx
import { initializeFaviconManager } from './utils/faviconManager'

initializeFaviconManager()
```

This approach provides more control over when the favicon system initializes and allows for proper error handling during the initialization process.

## Performance Optimizations

### Minimal DOM Queries

The implementation caches the favicon link element to avoid repeated DOM queries:

```typescript
private faviconLinkElement: HTMLLinkElement | null = null

private initFaviconElement(): void {
  this.faviconLinkElement = document.querySelector(
    'link[rel="icon"]'
  ) as HTMLLinkElement | null
}
```

### Efficient Event Handling

The media query listener only triggers when the system preference actually changes, minimizing unnecessary updates.

### Memory Management

The singleton pattern ensures only one instance exists, preventing memory leaks from multiple listeners or duplicate DOM references.

## Alternative Approaches I Considered

### CSS-Based Favicon Switching

Using CSS custom properties to dynamically change favicon colors:

```html
<link
  rel="icon"
  href="data:image/svg+xml,<svg>...</svg>"
  type="image/svg+xml"
/>
```

**Pros:** Pure CSS solution
**Cons:** Complex SVG encoding, limited browser support, harder to maintain

### Multiple Link Elements

Pre-defining multiple favicon link elements and toggling their `disabled` attribute:

```html
<link
  rel="icon"
  href="/favicon-light.svg"
  media="(prefers-color-scheme: light)"
/>
<link
  rel="icon"
  href="/favicon-dark.svg"
  media="(prefers-color-scheme: dark)"
/>
```

**Pros:** Declarative, no JavaScript required
**Cons:** Limited browser support, no dynamic switching capability

### Theme-Aware Asset URLs

Generating favicon URLs based on current theme state:

```typescript
const getFaviconUrl = (theme: Theme) => `/favicons/favicon-${theme}.svg`
```

**Pros:** Simple and direct
**Cons:** Doesn't account for system preferences, can cause visibility issues

## Testing and Quality Assurance

### Manual Testing Scenarios

The implementation requires testing across multiple scenarios:

1. **System Theme Changes**: Switch OS theme while the app is running
2. **Page Reloads**: Verify favicon persists across navigation
3. **Browser Compatibility**: Test in different browsers and versions
4. **Network Conditions**: Ensure cache busting works offline

### Automated Testing Considerations

```typescript
// Example test setup
describe('FaviconManager', () => {
  let manager: FaviconManager
  let mockLink: HTMLLinkElement

  beforeEach(() => {
    mockLink = document.createElement('link')
    mockLink.rel = 'icon'
    document.head.appendChild(mockLink)

    manager = new FaviconManager()
  })

  it('should update favicon based on system preference', () => {
    // Test implementation
  })
})
```

## Future Enhancements

### User Preference Overrides

Add support for users to manually choose favicon behavior:

- Always use light favicon
- Always use dark favicon
- Follow system preference (current behavior)

### Reduced Motion Support

Respect `prefers-reduced-motion` for smoother transitions:

```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches
```

### Favicon Animations

For special states (loading, notifications), consider animated favicons using canvas or CSS animations.

## Performance Impact and Monitoring

### Bundle Size

The favicon manager adds minimal overhead:

- **Code size**: ~2KB minified
- **Runtime memory**: Single object instance
- **Network requests**: Only when theme changes (with cache busting)

### Monitoring Setup

Consider adding performance monitoring:

```typescript
// Track favicon update performance
const startTime = performance.now()
// ... favicon update logic
const duration = performance.now() - startTime
console.log(`Favicon update took ${duration}ms`)
```

## Conclusion

Building a theme-aware favicon system required balancing user experience, performance, and technical constraints. The solution I implemented prioritizes visibility and accessibility by following browser preferences rather than application themes.

Key takeaways:

- **User Experience First**: Favicons should always be visible against tab backgrounds
- **Defensive Programming**: Handle edge cases and browser inconsistencies
- **Performance Matters**: Minimize DOM interactions and optimize for quick updates
- **Future-Proof**: Use modern APIs while maintaining backward compatibility

The implementation demonstrates how small details can significantly impact overall user experience. While favicons might seem trivial, their proper implementation shows attention to detail that users appreciate.

You can see the complete implementation in my [blog repository](https://github.com/rjleyva/rjleyva-writes). The favicon manager runs automatically, ensuring users always have optimal visual feedback in their browser tabs.
