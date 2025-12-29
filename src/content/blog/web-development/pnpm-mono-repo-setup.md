---
title: 'A Journey into Full-Stack Development: Basic Monorepo Setup'
description: Join me on my journey into full-stack development as I set up a basic monorepo for *Yaru Koto* (やること – “things to do”). Using **pnpm workspaces**, I navigated the challenges of managing frontend and backend code, sharing TypeScript types, and orchestrating builds across packages. This post covers the monorepo setup, shared package architecture, and lessons learned along the way—perfect for solo developers or anyone curious about organizing a full-stack project efficiently.
date: 2025-12-29
tags:
  [
    'pnpm',
    'monorepo',
    'typescript',
    'react',
    'vite',
    'nodejs',
    'express',
    'full-stack',
    'web-development'
  ]
---

So I decided I wanted to learn full-stack development. You know, actually build something end-to-end instead of just following tutorials. But I quickly realized that managing separate repos for frontend and backend sounded like a total nightmare - keeping types in sync, dealing with version mismatches, all that jazz.

After spending way too many late nights reading blog posts and docs (and getting confused by Nx vs. Lerna vs. Turborepo), I settled on pnpm workspaces. It felt like the sweet spot - powerful enough to handle what I needed, but not overkill for a solo developer just trying to figure things out.

This is the story of how I set up "Yaru Koto" (やること - "things to do" in Japanese), my little todo app that's basically my full-stack playground. Spoiler: it took way longer than I expected, but I'm kinda proud of it now.

## Why a Monorepo? (Or: Why I Didn't Just Make Two Separate Repos)

I know what you're thinking - "Why not just put the frontend and backend in separate repos like a normal person?" Well, let me tell you about the nightmare I was trying to avoid:

1. **Shared Code Hell**: I kept imagining myself copy-pasting TypeScript types between projects and then forgetting to update one side. Been there, done that, got the merge conflicts.

2. **Dependency Drama**: Managing versions across two repos sounded exhausting. What if my frontend is on React 18 and backend is still on 17? Chaos.

3. **Learning Excuse**: Honestly, I wanted to learn how big projects organize code. Plus it sounded impressive to say I was working in a monorepo.

4. **"What if it gets big?"**: I figured if this todo app actually takes off (lol), I won't have to do a massive refactor later.

## Project Structure Overview

```
yaru-koto/
├── client/          # React frontend
├── server/          # Express.js backend
├── shared/          # Shared packages
│   ├── constants/   # Application constants
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── package.json     # Root package configuration
└── pnpm-workspace.yaml # Workspace configuration
```

## Setting Up the Workspace Configuration

This part took me way longer than it should have. I kept reading docs and seeing different examples, and I was like "Why can't anyone just show me the exact file I need?"

The foundation of any pnpm monorepo is the `pnpm-workspace.yaml` file. Here's what mine ended up looking like after a few failed attempts:

```yaml
packages:
  - client
  - server
  - shared/*

onlyBuiltDependencies:
  - '@swc/core'
  - esbuild
  - sqlite3
```

I spent a good hour trying different variations before realizing that `packages` just needs to list the directories containing your packages. The `shared/*` part was my "aha!" moment - it automatically picks up all the packages in that folder without listing them individually.

The `onlyBuiltDependencies` section? Yeah, I copy-pasted that from somewhere and it just worked. Something about native modules needing to be built first. Honestly, I don't fully understand it yet, but I'm glad it exists.

## Root Package.json Configuration

I probably spent the most time on this root package.json. I kept adding scripts, removing them, trying different approaches. It's basically my command center now.

```json
{
  "name": "yaru-koto",
  "author": "RJ Leyva",
  "description": "Yaru Koto (やること) means \"things to do\" in Japanese...",
  "scripts": {
    "dev": "pnpm --filter client dev",
    "dev:server": "pnpm --filter server dev",
    "dev:all": "pnpm -r dev",
    "build": "pnpm --filter client build",
    "lint": "pnpm --filter client lint"
  }
}
```

The magic here is pnpm's `--filter` flag. I was so confused at first - why not just run the scripts directly? But then I got it:

- `pnpm --filter client dev` = "run the dev script, but only for the client package"
- `pnpm -r dev` = "run dev scripts for ALL packages" (the `-r` means recursive)

I love how `pnpm dev:all` starts my whole stack. No more remembering which terminal window has what.

## Shared Packages: The Heart of the Monorepo

This is where things got really interesting (and frustrating). One of the biggest advantages of a monorepo is sharing code between packages. I created three shared packages, but figuring out how they should depend on each other was a brain-twister:

### 1. Types Package (`@yaru-koto/types`)

This package contains all TypeScript type definitions used across the application:

```json
{
  "name": "@yaru-koto/types",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

The TypeScript configuration compiles to a `dist/` directory with both JavaScript and declaration files.

### 2. Constants Package (`@yaru-koto/constants`)

This package contains all application constants, including todo priorities, statuses, API endpoints, and default values:

```json
{
  "name": "@yaru-koto/constants",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### 3. Utils Package (`@yaru-koto/utils`)

This one was the trickiest. Common utility functions go here, but some of my utilities needed to use the types from the types package. I stared at this for like 20 minutes wondering if this was even allowed.

```json
{
  "name": "@yaru-koto/utils",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@yaru-koto/types": "workspace:*"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

The `"@yaru-koto/types": "workspace:*"` line was my "oh wait, this actually works?" moment. It means "use whatever version of types is in this workspace". Super simple once I figured it out, but I was overcomplicating it in my head.

## Client Configuration: React + Vite

The frontend is a modern React application using Vite for fast development:

```json
{
  "name": "@yaru-koto/client",
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "@yaru-koto/types": "workspace:*",
    "@yaru-koto/constants": "workspace:*",
    "@yaru-koto/utils": "workspace:*"
  },
  "devDependencies": {
    "@vitejs/plugin-react-swc": "^4.2.2",
    "typescript": "~5.9.3",
    "vite": "^7.3.0"
  }
}
```

Key points:

- Uses `workspace:*` to reference shared packages
- SWC for fast React compilation
- TypeScript for type safety

## Server Configuration: Express + SQLite3

The backend is a simple Express.js server with SQLite3:

```json
{
  "name": "@yaru-koto/server",
  "dependencies": {
    "express": "^5.2.1",
    "sqlite3": "^5.1.7",
    "@yaru-koto/types": "workspace:*",
    "@yaru-koto/constants": "workspace:*",
    "@yaru-koto/utils": "workspace:*"
  },
  "devDependencies": {
    "nodemon": "^3.1.11",
    "ts-node": "^10.9.2",
    "typescript": "~5.9.3"
  }
}
```

The server uses nodemon with ts-node for development, allowing hot-reloading during development.

## TypeScript Configuration Across Packages

Each package has its own `tsconfig.json`, but they share similar configurations:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

The shared packages output both JavaScript and TypeScript declaration files to their `dist/` directories.

## Development Workflow

Now that everything's set up, my development workflow is actually pretty smooth. I can:

1. **Start the entire stack**: `pnpm dev:all` (my favorite - opens everything at once)
2. **Work on frontend only**: `pnpm dev` (when I'm just tweaking the UI)
3. **Work on backend only**: `pnpm dev:server` (for API testing)
4. **Build for production**: `pnpm build` (usually works on the first try now!)
5. **Run linting**: `pnpm lint` (catches my dumb mistakes)

## Challenges and Learnings (Or: The Parts That Made Me Want to Quit)

Setting up this monorepo wasn't the smooth sailing I expected. Here are the things that actually made me sweat:

1. **Inter-package Dependencies**: I spent a full evening trying to figure out why my utils package couldn't import from types. Turns out I needed to add the dependency in package.json AND run `pnpm install`. Every. Single. Time. I made a change.

2. **Build Order Drama**: I kept getting "Cannot find module" errors because I was trying to use packages before they were built. The shared packages need to be built before the client/server can use them. I learned this the hard way after about 5 failed builds.

3. **Workspace References**: I was so confused about `workspace:*` vs `"1.0.0"` vs `"^1.0.0"`. Why would you ever NOT use workspace:\* inside a monorepo? It took me forever to understand this was for when you publish packages externally.

4. **TypeScript Path Resolution**: My IDE was happy, but `tsc` kept complaining it couldn't find the shared packages. I eventually realized I needed to build the shared packages first. Every. Single. Time. I made a change. (Did I mention that already?)

## What I Learned

This monorepo setup taught me several important concepts:

1. **Package Management**: Deep understanding of how pnpm manages workspace dependencies
2. **Shared Package Architecture**: How to structure packages that depend on each other within a monorepo
3. **Build Pipelines**: The importance of proper build ordering when packages have inter-dependencies
4. **Code Organization**: How to structure large applications with clear separation of concerns

## Future Improvements (When I Get Around to It)

Once I actually finish building the core todo functionality, I want to add:

1. **Automated Testing**: I know, I know - I should have done this first. Jest or Vitest, probably.
2. **CI/CD Pipeline**: GitHub Actions to automatically test and deploy. Sounds fancy!
3. **Docker Setup**: So I can actually deploy this thing somewhere
4. **More Shared Packages**: I'm sure I'll find more code to extract as I build features

But first, let me make sure users can actually create todos. The monorepo can wait.

## Conclusion

Wow, what a journey. Setting up this monorepo kicked my butt in ways I didn't expect. I thought I'd just follow some docs and boom - organized codebase! Instead, I learned more about package management, build processes, and TypeScript than I ever wanted to know.

But you know what? I'm actually kinda proud of myself. I now understand how big projects stay organized, and I can confidently talk about monorepos at meetups (not that anyone would ask, but still).

The pnpm workspace approach was definitely the right call for a learning project like this. It's powerful enough to handle real complexity, but simple enough that I didn't drown in configuration.

Now that I have this foundation, I can't wait to actually build features for Yaru Koto instead of fighting with the build system. Next up: making this todo app actually work!
