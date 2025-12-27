---
title: Security-First Markdown Processing
description: A deep dive into my restrictive markdown sanitization approach that prioritizes security while maintaining rich content features, exploring the trade-offs and implementation details.
date: 2025-12-27
tags:
  [
    'security',
    'markdown',
    'web-development',
    'sanitization',
    'content-security',
    'unified',
    'rehype'
  ]
---

# Security-First Markdown Processing

When I built my blog's markdown processing pipeline, I made a conscious decision to prioritize security over convenience. Most markdown processors take a permissive approach—allowing HTML and trusting the content source. I went the opposite direction: deny everything by default, allow only what's explicitly safe.

This approach isn't just paranoia. It's a response to real security threats in web content processing. Let me walk you through how I implemented this security-first markdown pipeline and why I made the choices I did.

## The Security Threat Landscape

Before diving into the implementation, it's worth understanding why markdown processing can be dangerous. Markdown itself is safe—it's just text with formatting syntax. But when you convert markdown to HTML, you open potential attack vectors:

**Cross-Site Scripting (XSS)**: Malicious HTML or JavaScript injected into content
**Data Exfiltration**: Scripts that steal user data or session information
**Content Injection**: Unauthorized content that manipulates page appearance or behavior
**Supply Chain Attacks**: Compromised dependencies in the processing pipeline

Even if you trust your content sources (I write all my own posts), security best practices recommend defense in depth. A single vulnerability in any part of your system could compromise everything.

## The Deny-All, Allow-Specific Model

My approach follows the principle of least privilege: deny everything by default, allow only what's explicitly permitted. Here's how this manifests in my `rehype-sanitize` configuration:

```typescript
{
  // Allow only safe HTML elements and attributes
  allowDoctypes: false,
  allowComments: false,

  // Strip dangerous attributes - be very restrictive
  attributes: {
    '*': ['className', 'id', 'lang'],
    a: ['href', 'title', 'rel'],
    code: ['className'],
    pre: ['className'],
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    h5: ['id'],
    h6: ['id']
  },

  // Allow only safe elements (no images, iframes, etc.)
  tagNames: [
    'p', 'div', 'span', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'strong', 'em',
    'del', 'a', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
  ],

  // Strip all protocols except safe ones
  protocols: {
    href: ['http', 'https', 'mailto']
  },

  // Strip any content that looks like HTML with dangerous attributes
  strip: [
    'script', 'style', 'iframe', 'object', 'embed', 'form', 'input',
    'img'
  ]
}
```

This configuration is aggressively restrictive. Let me break down the key decisions:

### Element Whitelist

I only allow elements that are essential for rich text content:

- **Text formatting**: `p`, `strong`, `em`, `del`, `br`
- **Structure**: `h1`-`h6`, `div`, `span`
- **Lists**: `ul`, `ol`, `li`
- **Links**: `a` (with restricted attributes)
- **Code**: `pre`, `code` (crucial for technical content)
- **Tables**: `table`, `thead`, `tbody`, `tr`, `th`, `td`
- **Miscellaneous**: `blockquote`, `hr`

Notice what's missing: `img`, `iframe`, `script`, `style`, `form`, `input`, `object`, `embed`. These elements are common attack vectors.

### Attribute Restrictions

Attributes are even more restricted than elements:

```typescript
attributes: {
  '*': ['className', 'id', 'lang'],  // Global attributes
  a: ['href', 'title', 'rel'],       // Link-specific
  code: ['className'],               // Code highlighting
  pre: ['className'],                // Code block styling
  'h1,h2,h3,h4,h5,h6': ['id']        // Anchor links
}
```

No `onclick`, `onload`, `style`, `data-*`, or other potentially dangerous attributes. Even CSS classes are restricted to what I explicitly allow in my styling system.

### Protocol Filtering

For links, I only allow safe protocols:

```typescript
protocols: {
  href: ['http', 'https', 'mailto']
}
```

This prevents `javascript:`, `data:`, `vbscript:`, and other executable protocol attacks.

## Why This Approach vs. Permissive Sanitization

Most markdown processors use more permissive sanitization. Libraries like `DOMPurify` or `sanitize-html` allow broader HTML support and rely on pattern matching to remove dangerous content. I chose the opposite approach for several reasons:

### Predictability

With a whitelist approach, I know exactly what can appear in my content. There's no risk of missing a new attack pattern or edge case. If an element or attribute isn't in my list, it gets stripped—period.

### Performance

Whitelist-based sanitization is faster than pattern-matching approaches. There's no complex regex or DOM manipulation—just a simple lookup table.

### Maintenance

A restrictive whitelist requires less maintenance than trying to keep up with new attack vectors. I don't need to constantly update patterns or worry about bypass techniques.

### Philosophy

This aligns with my "secure by default" philosophy. I'd rather content authors (me) work within constraints than risk security through complexity.

## Real-World Security Considerations

Implementing this security model required thinking about practical implications:

### Content Author Experience

The restrictive approach means I can't use certain markdown features:

- No images (they get stripped)
- No embedded content (YouTube, Twitter, etc.)
- No custom HTML classes beyond what I define
- No inline styles or complex formatting

For my use case, this is acceptable. I focus on text content with code examples. If I need images, I handle them outside the markdown pipeline.

### Attack Surface Reduction

By stripping dangerous elements, I eliminate entire classes of attacks:

- **No script execution**: `script`, `iframe`, `object` elements removed
- **No style injection**: `style` elements and `style` attributes stripped
- **No form manipulation**: `form`, `input` elements removed
- **No data exfiltration**: No way to inject tracking pixels or data URLs

### Dependency Security

I use the unified ecosystem (`remark`, `rehype`, `rehype-sanitize`) which has good security track records. But I still pin versions and monitor for updates, treating the processing pipeline as critical infrastructure.

## Balancing Security with Rich Content

The biggest challenge is maintaining rich content features while staying secure. Here's how I handle this:

### Code Block Handling

Code blocks are crucial for technical writing, but `pre` and `code` elements can be security risks if not handled properly. My solution:

```typescript
const createPreComponent = ({
  children,
  className
}: {
  children?: React.ReactNode
  className?: string
}): React.ReactElement => {
  return CodeBlock({ children, className })
}
```

I replace HTML `pre` elements with my custom `CodeBlock` React component during the `rehype-react` phase. This gives me complete control over how code renders and allows me to add copy-to-clipboard functionality.

The sanitization allows `className` attributes on `pre` and `code` elements, so language hints (`language-javascript`) work properly for potential future enhancements.

### Link Security

Links are powerful but dangerous. My configuration allows `href`, `title`, and `rel` attributes:

```typescript
a: ['href', 'title', 'rel']
```

I could add `noopener` and `noreferrer` to the `rel` attribute for external links, but currently handle this in my link components. The protocol filtering prevents malicious links.

### Table Support

Tables are useful for technical content but can be complex. I allow the basic table elements (`table`, `thead`, `tbody`, `tr`, `th`, `td`) with minimal attributes. This provides rich formatting without excessive complexity.

## Implementation in the Unified Pipeline

Here's how this fits into my processing pipeline:

```typescript
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm) // GitHub Flavored Markdown
  .use(remarkFrontmatter)
  .use(remarkRehype, {
    allowDangerousHtml: false // Never allow raw HTML
  })
  .use(rehypeSanitize, {
    // The restrictive configuration above
  })
  .use(rehypeSlug) // Add IDs to headings
  .use(rehypeReact, {
    Fragment: jsxRuntime.Fragment,
    jsx: jsxRuntime.jsx,
    jsxs: jsxRuntime.jsxs,
    components: {
      pre: createPreComponent // Custom code block handling
    }
  })
```

The `allowDangerousHtml: false` ensures remark never passes raw HTML to rehype, and the sanitization layer catches any edge cases.

## Trade-offs and Limitations

This approach isn't perfect:

**Content Restrictions**: I can't embed rich media or use complex HTML
**Maintenance**: I must update the whitelist if I need new features
**False Positives**: Legitimate content might get stripped if it uses unexpected attributes
**Complexity**: More complex than permissive approaches

But the security benefits outweigh these costs for my use case.

## Alternatives I Considered

**DOMPurify**: Excellent library, but relies on pattern matching rather than whitelisting
**Trusted Types**: Browser API for sanitization, but not available everywhere
**CSP**: Content Security Policy helps, but doesn't replace input sanitization
**Runtime Validation**: Checking content after processing, but misses the defense-in-depth approach

## The Result

My blog processes markdown with military-grade paranoia. Every piece of content gets stripped of potential threats before reaching the browser. This gives me confidence that my content is safe, even if dependencies get compromised or unexpected input appears.

The approach scales well and requires minimal maintenance. When I need new features, I extend the whitelist deliberately rather than opening security holes.

If you're building a content system that prioritizes security—especially for user-generated content—this deny-all, allow-specific approach is worth considering. It might feel restrictive at first, but the peace of mind is invaluable.

You can see the complete implementation in my [blog repository](https://github.com/rjleyva/rjleyva-writes). The security configuration lives in `src/lib/markdownRender.ts`, where the sanitization rules are defined alongside the unified processing pipeline.
