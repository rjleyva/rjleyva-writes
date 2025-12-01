---
title: How I Structure a React + TypeScript Blog Project (Vite Edition)
date: 2025-11-23
description: How I structure and configure a React + TypeScript blog powered by Vite.
tags: ['react', 'typescript', 'vite', 'blog', 'setup']
---

**SAMPLE POST ONLY**

## Project Structure

```bash
blog/
├── .git/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.tsx
│   │   ├── Hero/
│   │   │   └── Hero.tsx
│   │   └── icons/
│   │       └── Logo.tsx
│   ├── layouts/
│   │   └── Layout.tsx
│   ├── pages/
│   │   └── HomePage.tsx
│   ├── routes/
│   │   └── routes.tsx
│   ├── types/
│   │   ├── css-module.d.ts
│   │   └── icons.ts
│   └── main.tsx
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── AGENTS.md
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Project Initialization

### Create Project

```bash
bun create vite project-name
```

### Install Dependencies

```bash
bun install
```

### Initialize Git

```bash
git init
git add .
git commit -m 'chore(init): scaffold Vite + React + TypeScript project'
```

## Package Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\"",
    "type-check": "tsc --noEmit"
  }
}
```

## Core Dependencies

### Routing

```bash
bun add react-router
git commit -m 'feat(deps): add react-router for client-side routing'
```

### CSS Normalization

```bash
bun add modern-normalize
git commit -m 'chore(deps): add modern-normalize for cross-browser CSS consistency'
```

### MDX for Markdown Content

```bash
bun add @mdx-js/react @mdx-js/rollup @mdx-js/mdx gray-matter remark remark-gfm rehype-slug rehype-autolink-headings rehype-pretty-code shiki
git commit -m 'feat(deps): add MDX ecosystem for markdown rendering with syntax highlighting'
```

### Blog Enhancement Features

```bash
bun add date-fns reading-time feed react-helmet-async
git commit -m 'feat(deps): add date formatting, reading time, RSS feed, and SEO support'
```

## Development Tools

### Code Formatting

```bash
bun add -D prettier @ianvs/prettier-plugin-sort-imports
git commit -m 'chore(dev-deps): add prettier with import sorting plugin'
```

#### Prettier Configuration

Create `.prettierrc.json`:

```bash
{
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "endOfLine": "lf",
  "printWidth": 80,
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "plugins": ["@ianvs/prettier-plugin-sort-imports"],
  "importOrder": [
    "^react$",
    "<BUILTIN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "^types$",
    "^@types",
    "^@[a-zA-Z0-9-]+/",
    "^@/.*$",
    "^\\w+/",
    "^\\.\\.?.*$",
    "\\.css$"
  ]
}
```

```bash
git commit -m 'chore(prettier): configure code formatting and import sorting'
```

#### Prettier Ignore

Create `.prettierignore`:

```
# Dependencies
node_modules
bun.lockb
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build output
dist
build
.vite
out

# System files
.DS_Store
Thumbs.db

# Coverage
coverage
.nyc_output

# Environment
.env
.env.*
.env.*.local

# Git
.git
.gitignore

# Public assets (optional)
public

# Logs and temp files
*.log
*.tmp
*.tsbuildinfo
.cache

# IDE
.vscode
.idea
```

```bash
git commit -m 'chore(prettier): add ignore patterns for build and system files'
```

### TypeScript Configuration

Create or update `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ES2024", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "useDefineForClassFields": true,
    "noEmit": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

```bash
git commit -m 'chore(tsconfig): enable strict TypeScript settings for application code'
```

### Node Config

Create or update `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ESNext",
    "lib": ["ES2024"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "useDefineForClassFields": true,
    "noEmit": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true
  },
  "include": ["vite.config.ts", "vitest.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

```bash
git commit -m 'chore(tsconfig): enable strict TypeScript settings for Node configuration'
```

### CSS Module Types

Create `src/types/css-module.d.ts`:

```ts
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}
```

```bash
git commit -m 'chore(types): add module declaration for CSS modules'
```

### ESLint Configuration

Update `eslint.config.js`:

```js
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['dist', 'node_modules', 'build', '.vite']
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json']
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...tseslint.configs.strictTypeChecked[0].rules,
      ...tseslint.configs.stylisticTypeChecked[0].rules,
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true }
      ]
    }
  }
]
```

```bash
git commit -m 'chore(eslint): configure strict linting rules for TypeScript and React'
```

### Vite Configuration

Update `vite.config.ts`:

```ts
import { fileURLToPath, URL } from 'url'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
            keepBackground: false
          }
        ]
      ],
      providerImportSource: '@mdx-js/react'
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    host: true,
    hmr: {
      port: 3000
    }
  }
})
```

```bash
git commit -m 'chore(vite): configure server, build, and MDX processing'
git commit -m 'feat(vite): configure MDX and plugins support'
```

## Application Entry Point

Update `src/main.tsx`:

```ts
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import routes from './routes/router'
import './index.css'

const router = createBrowserRouter(routes, {
  basename: '/'
})

const rootElement = document.getElementById('root')

if (!(rootElement instanceof HTMLElement)) {
  throw new Error(
    'Failed to find root element. Cannot mount React application.'
  )
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

```bash
git commit -m 'fix(main): add null check for root element and integrate routing'
git commit -m 'refactor(main): integrate routing logic from routes.tsx'
```

## Router Configuration

Create `src/routes/router.tsx`:

```ts
import type { RouteObject } from 'react-router'
import App from '@/App'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />
  }
]

export default routes
```

```bash
git commit -m 'feat(routes): create router configuration with root route'
```

## Pages

Create `src/pages/HomePage.tsx`

```ts
import type { JSX } from 'react'
import Hero from '@/components/Hero/Hero'

const HomePage = (): JSX.Element => {
  return (
    <Hero greeting="Welcome to my blog! I'm RJ, sharing web development insights, experiments, and ideas through writing." />
  )
}

export default HomePage
```

```bash
refactor: restructure App component as HomePage in pages directory
```

## Layouts

Create `src/layouts/Layout.tsx`

```ts
import type { JSX } from 'react'
import Header from '@/components/Header/Header'

const Layout = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
    </>
  )
}

export default Layout
```

```bash
feat(layouts): implement Layout component for shared page structure

Includes:
- Wraps page content in semantic main element
- Accepts children prop for flexible content composition
- Prepares architecture for scalable multi-page blog structure
```

## Update Routes

```ts
import type { RouteObject } from 'react-router'
import App from '@/App'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />
  }
]

export default routes
```

```bash
refactor(routes): update routing to use Layout and HomePage components
```

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [MDX Documentation](https://mdxjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Prettier Documentation](https://prettier.io/)
- [ESLint Documentation](https://eslint.org/)
