# rjleyva-writes

RJ Leyva's personal blog, documenting web development insights through writing.

---

## Current Status (WIP)

### Home Page

![rjleyva-home-page-screenshot](./images/home-page-screenshot.jpeg)

### Blog Page

![rjleyva-blog-page-screenshot](./images/blog-page-screenshot.jpeg)

### Sample Post

![rjleyva-sample-post-screenshot](./images/sample-post-screenshot.jpeg)

## Current Project Structure

```
rjleyva-writes/
| .git/
| .jj/
| dist/
| images/
| | blog-page-screenshot.jpeg
| | home-page-screenshot.jpeg
| node_modules/
| public/
| | favicons/
| | | favicon-dark.svg
| | | favicon-light.svg
| | fonts/
| | | inter-extrabold.woff2
| | | inter-regular.woff2
| | | inter-semibold.woff2
| scripts/
| | generateContentImports.ts
| src/
| | components/
| | | icons/
| | | | ArrowIcon.tsx
| | | | CheckIcon.tsx
| | | | CopyIcon.tsx
| | | | GithubIcon.tsx
| | | | InstagramIcon.tsx
| | | | LinkedinIcon.tsx
| | | | Logo.tsx
| | | | MoonIcon.tsx
| | | | SunIcon.tsx
| | | ui/
| | | | BlogCard/
| | | | BlogPosts/
| | | | BlogPostsGrid/
| | | | BlogPostsHeader/
| | | | BlogPostsSidebar/
| | | | CodeBlock/
| | | | Header/
| | | | Hero/
| | | | LoadingSpinner/
| | | | RecentPost/
| | | | SeeAllPostsLink/
| | | | Socials/
| | | | ThemeToggle/
| | constants/
| | | socialLinks.ts
| | | theme.ts
| | content/
| | | blog/
| | | | jj/
| | | | | how-i-use-jujutsu.md                 # Sample Post
| | | | react/
| | | | | how-i-structure-a-vite-react-blog.md # Sample Post
| | contexts/
| | | ThemeProvider.tsx
| | | themeContext.ts
| | hooks/
| | | useBlog.ts
| | | useClipboard.ts
| | | useTheme.ts
| | layouts/
| | | MainLayout.tsx
| | | home-layout.module.css
| | lib/
| | | content/
| | | | contentLoader.ts
| | | | generatedContent.ts
| | | blogContentApi.ts
| | | mardownRender.ts
| | | postFormattingUtlis.ts
| | pages/
| | | blog/
| | | | BlogPage.tsx
| | | | blog-page.module.css
| | | home/
| | | | HomePage.tsx
| | routes/
| | | routes.tsx
| | services/
| | | markdownRenderingService.ts
| | styles/
| | | fonts.css
| | | globals.css
| | | themes.css
| | | tokens.css
| | types/
| | | css-module.d.ts
| | | icons.ts
| | | post.ts
| | | theme.ts
| | utils/
| | | blogUtils.ts
| | | faviconManager.ts
| | | reactNodeUtils.ts
| | main.tsx
| | vite-env.d.ts
| .gitignore
| LICENSE
| README.md
| eslint.config.js
| index.html
| package.json
| pnpm-lock.yaml
| prettier.config.ts
| tsconfig.app.json
| tsconfig.json
| tsconfig.node.json
| vite.config.ts
```

## Tech Stack

### Core Framework & Language

- React 19+
- TypeScript 5+
- Vite 7+

### Routing

- React Router v7 (data-mode)

### Styling

- Modern Normalize
- CSS Modules with BEM methodology
- CSS custom properties for theming

### Development Tools

- ESLint with React plugins
- Prettier with import sorting
- TypeScript for type checking

### Key Dependencies

- @vitejs/plugin-react
- eslint-plugin-react-refresh
- modern-normalize

## License

MIT License.

If you find this project helpful, please consider giving it a ⭐.
