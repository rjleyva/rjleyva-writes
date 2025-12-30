---
title: 'Why transition: all Is Risky (CSS Transition Pitfall)'
date: 2025-12-04
description: 'A small CSS bug caused by `transition: all`, and the subtle visual flicker it introduced—along with why explicitly scoping transitions leads to more predictable UI behavior.'
tags: ['css', 'bugs', 'debugging', 'fix']
---

Hi everyone — it’s RJ. Today I want to share a small but surprisingly tricky CSS
issue I ran into while building my blog. It revolves around a single line of
CSS: `transition: all`.

# The Symptom

While working on a dark mode toggle, I noticed something subtle but irritating.
The social icons would briefly flash before snapping into their correct color
while the rest of the UI transitioned smoothly. At first glance, it looked like
a hydration issue, a delayed theme state update, or even an SVG rendering problem.
But after digging deeper, it turned out to be something much simpler.

## The Root Cause

Surprisingly, the issue wasn’t React, the theme toggle, or Vite. I spent way too
long checking React DevTools before I thought to look at the CSS. The culprit was
a single line of CSS:

```css
transition: all;
```

Because the icons used `filter` for coloring, specifying `transition: all` caused
the browser to animate every possible property. During the theme change, some of
these properties temporarily passed through invalid or intermediate visual states,
which is exactly what caused the flicker.

## The FIX

The solution was simple once I understood the problem. Instead of transitioning
every property, I limited the transition to exactly what I needed. Updating the
CSS for the social icons to:

```css
.socials__icon {
  /* Transition only filter to prevent unwanted flickers */
  transition: filter var(--transition-duration-normal);
  filter: drop-shadow(0 0 0 transparent);
}
```

Once I changed:

```css
transition: all;
```

to:

```css
transition: filter;
```

The flicker disappeared entirely.

No JavaScript changes.
No theme logic changes.
Just a scoped transition.

# A Lesson in transition: all

> `transition: all` is convenient — but often dangerous.

This experience reinforced an easy-to-forget rule. Animating all properties can
cause unintended visual glitches during state changes, trigger strange
intermediate render states, and make bugs harder to reason about. Explicitly
targeting only the properties that need animation is safer, more predictable, and
prevents subtle UI regressions.

This small bug reminded me that some of the most valuable lessons come from tiny,
almost invisible issues. It wasn’t about performance, complex architecture, or
advanced animations. It was about paying attention to the details. I'd been
careless with `transition: all` because it was quick and seemed harmless, but
that one line caused a subtle visual glitch that took way too long to track down.

## Key Takeaway

Be intentional with transitions. Target only the properties you need to animate
and avoid `transition: all` unless you really mean it. This prevents subtle
visual glitches and makes your UI more predictable.
