# rjleyva.dev

RJ Leyva's personal blog, documenting web development insights through writing.

---

## Current Status (WIP)

![rjleyva.dev-screen-shot](./images/rjleyva-dev-sc.jpeg)

## Current Project Structure

```
rjleyva.dev/
| .git/
| .jj/
| dist/
| node_modules/
| scripts/
| | generateContentImports.ts
| src/
| | components/
| | | icons/
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
| | | | | BlogCard.tsx
| | | | | blog-card.module.css
| | | | CodeBlock/
| | | | | CodeBlock.tsx
| | | | | code-block.module.css
| | | | Header/
| | | | | Header.tsx
| | | | | header.module.css
| | | | Hero/
| | | | | Hero.tsx
| | | | | hero.module.css
| | | | RecentPost/
| | | | | RecentPost.tsx
| | | | | recent-post.module.css
| | | | Socials/
| | | | | Socials.tsx
| | | | | socials.module.css
| | | | ThemeToggle/
| | | | | ThemeToggle.tsx
| | | | | theme-toggle.module.css
| | constants/
| | | socialLinks.ts
| | | theme.ts
| | content/
| | | blog/
| | | | jj/
| | | | | how-i-use-jujutsu.md                   # Sample Post
| | | | react/
| | | | | how-i-structure-a-vite-react-blog.md   # Sample Post
| | contexts/
| | | ThemeProvider.tsx
| | | themeContext.ts
| | hooks/
| | | useClipboard.ts
| | | useTheme.ts
| | layouts/
| | | MainLayout.tsx
| | | home-layout.module.css
| | lib/
| | | content/
| | | | generatedContent.ts
| | | mardownRender.ts
| | | postFormattingUtlis.ts
| | main.tsx
| | pages/
| | | Home.tsx
| | routes/
| | | routes.tsx
| | styles/
| | | globals.css
| | | themes.css
| | | tokens.css
| | types/
| | | css-module.d.ts
| | | icons.ts
| | | post.ts
| | | theme.ts
| | utils/
| | | reactNodeUtils.ts
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
