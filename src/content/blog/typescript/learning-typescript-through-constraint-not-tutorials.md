---
title: Learning TypeScript Through Constraints, Not Tutorials
description: How I approach learning TypeScript as a JavaScript developer by starting with strict tooling and letting constraints guide my understanding.
date: 2025-12-23
tags:
  [
    'typescript',
    'tooling',
    'learning',
    'developer-experience',
    'personal-growth'
  ]
---

When I decided to learn TypeScript, I didn’t start with a tutorial or a cheat sheet.
I started by turning on strict mode.

Not because I understood what every option did—but because I wanted the language to push back. I wanted the compiler and my tooling to surface the gaps in my understanding instead of letting them slip quietly into production.

As someone new to TypeScript but not new to JavaScript, I’ve learned that comfort is rarely a good teacher. Loose configurations let you move fast, but they also let misunderstandings hide. Strict configurations do the opposite—they interrupt you, slow you down, and force you to be explicit.

So instead of easing into TypeScript, I chose to begin with a strict tsconfig and a conservative ESLint setup. Not to be “correct” from day one, but to create a feedback loop where every warning meant something I didn’t yet understand.

This meant setting up my tooling in a way that wouldn’t let me “accidentally” write unsafe code. I wanted ESLint and TypeScript to be noisy—especially early on—so every warning became a prompt to learn, not something to ignore.

Here’s an example of how I configure my `eslint.config.js` in a Vite + React + TypeScript blog.

> NOTE: This isn’t a recommendation to copy this config wholesale. The value isn’t in the exact rules — it’s in choosing constraints that make incorrect assumptions impossible to ignore.

```javascript
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
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
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,

      ...jsxA11y.configs.recommended.rules,

      ...reactHooks.configs.recommended.rules,

      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',

      ...tseslint.configs.strictTypeChecked[0].rules,
      ...tseslint.configs.stylisticTypeChecked[0].rules,

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

This setup is intentionally strict. Some of these rules slowed me down at first, and that was the point. Each error forced me to ask _why_ TypeScript was unhappy—and that question is where the learning happened.

After setting up strict linting, I carried the same philosophy into my TypeScript configuration. Rather than using a single `tsconfig` for everything, I split my setup into two: one for the browser-facing app and one for Node-based tooling.

The goal wasn’t completeness—it was clarity. Each environment should fail loudly in ways that actually matter to it.

And this is how I setup `tsconfig.app.json`

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
    "allowImportingTsExtensions": false,
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
  "include": ["src", "prettier.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Turning on `strict` was non-negotiable. It ensured that TypeScript would always assume the least about my code unless I proved otherwise.

`exactOptionalPropertyTypes` forced me to be honest about my data models. Optional didn’t mean “sometimes undefined”—it meant _truly optional_.

Another excellent choice is `noUncheckedIndexedAccess`, Arrays are objects stop feeling "safe", this helps me learn defensive access pattern naturally.

`*noPropertyAccessFromIndexSignature` subtly teaches me about structural typing, why loose onjects are dangerous and when to model with records vs interfaces.

`verbatimModuleSyntax + isolatedModules` These options pushed me to write code that behaves the same way at runtime as it does in my head—no hidden transformations, no surprises.

The way I handle Node `tsconfig.node.json` is strict in the same way but scoped differently.

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
    "allowImportingTsExtensions": false,
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
  "include": ["vite.config.ts", "vitest.config.ts", "scripts/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

The Node config mirrors most of the same constraints, but removes anything browser-specific. Keeping them aligned helps me build a consistent mental model while still respecting the environment I’m targeting.

I didn’t understand all of these options upfront. Some of them only made sense _after_ they broke my assumptions. That breakage is what made them valuable.

Constraints are free. The compiler doesn’t care how you learned — only whether your assumptions hold.

I also came across a great extension to learn TypeScript [Total TypeScript](https://www.totaltypescript.com/vscode-extension), I'm still figuring out how use this inside Neovim, but for the time being I installed [VSCode](https://code.visualstudio.com/) to experiment with TypeScript and use it alongside [Pretty TypeScript Errors](https://open-vsx.org/extension/yoavbls/pretty-ts-errors)

Here's how I use it on my own Vite + React + TypeScript [Blog](https://github.com/rjleyva/rjleyva-writes).
