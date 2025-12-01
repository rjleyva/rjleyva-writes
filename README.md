# rjleyva.dev

RJ Leyva's personal blog, documenting web development insights through writing.

---

## Current Project Structure

```
rjleyva.dev/
├── public/
├── src/
│   ├── components/
│   │   ├── icons/
│   │   │   ├── CheckIcon.tsx
│   │   │   ├── CopyIcon.tsx
│   │   │   ├── GithubIcon.tsx
│   │   │   ├── InstagramIcon.tsx
│   │   │   ├── LinkedinIcon.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── MoonIcon.tsx
│   │   │   └── SunIcon.tsx
│   │   └── ui/
│   │       ├── Header/
│   │       │   ├── Header.tsx
│   │       │   └── header.module.css
│   │       ├── Hero/
│   │       │   ├── Hero.tsx
│   │       │   └── hero.module.css
│   │       ├── Socials/
│   │       │   ├── Socials.tsx
│   │       │   └── socials.module.css
│   │       └── ThemeToggle/
│   │           ├── ThemeToggle.tsx
│   │           └── theme-toggle.module.css
│   ├── constants/
│   │   ├── socialLinks.ts
│   │   └── theme.ts
│   ├── contexts/
│   │   ├── themeContext.ts
│   │   └── ThemeProvider.tsx
│   ├── hooks/
│   │   └── useTheme.ts
│   ├── layouts/
│   │   ├── MainLayout.tsx
│   │   └── home-layout.module.css
│   ├── pages/
│   │   └── Home.tsx
│   ├── routes/
│   │   └── routes.tsx
│   ├── styles/
│   │   ├── globals.css
│   │   ├── themes.css
│   │   └── tokens.css
│   ├── types/
│   │   ├── css-module.d.ts
│   │   ├── icons.ts
│   │   └── theme.ts
│   └── main.tsx
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── prettier.config.ts
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
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
