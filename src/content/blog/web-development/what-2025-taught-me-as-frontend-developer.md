---
title: What 2025 Taught Me as a Frontend Developer
description: 'A personal reflection on my 2025 frontend journey—navigating growth, setbacks, and lessons learned from building, refactoring, and rethinking how I approach development.'
date: 2026-01-03
tags:
  [
    'frontend',
    'web-development',
    'react',
    'typescript',
    'dev-journey',
    'growth',
    'reflection',
    'career'
  ]
---

Hi everyone — it's RJ. Today I want to share my 2025 web development journey.

## January: The Tool Obsession

> The time you enjoy wasting is not wasted - John Lennon

Let's go back to January 2025. Instead of diving into HTML, CSS, and JavaScript, I spent three months obsessing over my development environment. After countless YouTube tutorials, I finally built a comfortable [Neovim configuration](https://github.com/rjleyva/dotfiles-macos).

It was a minimal setup—no fancy plugins like statusline, lualine, dashboard, mason, or nvim-lspconfig. I learned to configure LSP servers manually, and when Neovim 0.11 launched in March, I rewrote my LSP setup using the native approach.

## March: JavaScript Fundamentals

This is where my actual coding journey began. I started with basic JavaScript concepts I'd need for React. After familiarizing myself with the fundamentals through tutorials, I jumped into React—and immediately hit a wall.

The problem? I knew too little JavaScript, which made React's concepts (hooks, state management) feel impossible. Instead of retreating to JavaScript basics, I pushed through React while comparing it to vanilla JavaScript. It was slow and frustrating—I couldn't understand the docs.

That's when I turned to AI (ChatGPT, specifically) for explanations. I used the free tier to understand hooks, SEO optimization, lazy loading, and performance patterns. I never fully grasped the concepts, so I resorted to pasting code and asking, "How would a senior React dev implement this?"

Without realizing it, I was learning patterns without understanding the underlying decisions. But it worked—after 4-5 months, I felt comfortable with React basics.

## August: The Barrier

August was my toughest month. I couldn't figure out how to fetch and render local markdown files. React's documentation focused on API calls, not local file handling.

I jumped to Astro, where markdown is a first-class citizen. In two months, I built a blog and discovered `import.meta.glob`. That's when I realized I should check Vite docs, not React docs, for local data fetching.

But instead of returning to React, I tried SvelteKit after seeing a tutorial. That's where I encountered mdsvex and shiki—powerful tools for markdown processing and syntax highlighting. Finally, I had the pieces I needed for React.

## October: Settling the Score

Astro and SvelteKit were tempting, but I had unfinished business with React. Armed with my framework-hopping knowledge, I returned to the library.

I felt ready—comfortably building components and styling with CSS. But when it came time to implement markdown processing, I froze. I knew `import.meta.glob`, shiki for syntax highlighting, and that MDX was React's equivalent of mdsvex.

Then I watched a devaslife [YouTube video](https://www.youtube.com/watch?v=4g26x6FzuBU) about building an animated table of contents with Bun, Framer Motion, and Zustand. It inspired me to learn markdown processing from scratch.

I spent another month studying unified, understanding compile-time vs. runtime processing. By October, I deployed my [blog](https://github.com/rjleyva/rjleyva-writes) in Cloudflare. It wasn't perfect—messy, with AI-generated sections—but it worked.

## 2026: The Next Chapter

This year, I'm rewriting my blog as a full-stack application. The tech stack: Vite + React or Next.js in a pnpm workspace monorepo. I'll learn SQL, PostgreSQL, and Node.js/Express.js to add comments, reactions, authentication, and Resend for email newsletters.

I'm also incorporating AI into my terminal workflow. I'm exploring OpenCode, learning jj (jujutsu) for version control with Git, and Docker.

---

## Looking Back, Moving Forward

2025 taught me that the most valuable lessons often come from the detours. That Neovim obsession? It taught me patience and the importance of a comfortable development environment. The framework hopping? It gave me perspective on when to stick with a tool versus when to explore alternatives.

The struggles with React weren't failures—they were necessary steps in understanding the ecosystem. And that messy blog deployment? It was proof that done beats perfect every time.

Most importantly, 2025 showed me that AI isn't a crutch—it's a collaborator. When used thoughtfully, it accelerates learning without replacing the critical thinking that makes us developers.

As I look ahead to building more complex systems, I'm carrying these lessons: embrace the confusion, learn from the mistakes, and remember that every "waste" of time might be exactly what you need.

Here's to more messy projects, unexpected discoveries, and code that works. What's your 2025 story?
