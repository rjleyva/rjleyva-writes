---
title: My WezTerm Terminal Setup
date: 2025-12-05
description: How I tuned my terminal for long, focused coding sessions by reducing visual noise and prioritizing ergonomics.
tags: ['wezterm', 'terminal', 'productivity', 'setup']
---

# Finding Zen in My Terminal

I spend most of my day in the terminal. At first, I didn’t notice the small UI
details that quietly distracted me—tab bars, window chrome, slight background
clutter. Over time, I realized these little things were adding noise and making
long coding sessions more tiring than they needed to be.

This is the story of how I stripped my terminal down to just what I need,
creating a setup that lets me focus for hours without friction.

> This isn’t a “best practices” guide. It’s just what works for me.

## Saying Goodbye to the Tab Bar

Once I leaned on TMUX for splits and layouts, the tab bar became redundant. I
turned it off:

```lua
enable_tab_bar = false
```

It was like decluttering my desk. Suddenly, there was nothing in my way but the
text.

## Minimal but Practical

I also wanted to keep the window frame minimal but practical. I don’t need full
window chrome, just enough to resize the terminal when I need it:

```lua
window_decorations = "RESIZE"
```

## A Subtle Blur for Separation (macOS)

On macOS, I added a subtle blur behind the terminal. I experimented with
transparency and different blur levels until I landed on something gentle:

```lua
macos_window_background_blur = 10
```

It gives a slight separation from the desktop without making the text fuzzy—just
enough breathing room to reduce eye fatigue.

## Full Opacity for Comfort

I used to play with transparency, but in the end, full opacity won. The text
feels more consistent and easier on the eyes:

```lua
window_background_opacity = 1.0
```

## Choosing a Font That Works

Fonts are surprisingly important. I went with Lilex Nerd Font because it’s
readable and has great glyph coverage. I also bumped the size up—comfort over
cramming as many lines as possible:

```lua
font = wezterm.font_with_fallback({ "Lilex Nerd Font" })
font_size = 18
```

## Scrollback That Actually Works

Scrollback is another small tweak that makes a big difference. A deeper buffer
means I can review long logs or retrace commands without frustration:

```lua
scrollback_lines = 10000
```

## Colors That Don’t Tire Your Eyes

Finally, colors. I use the solarized-osaka palette because it’s easy on the eyes
for long sessions. Nothing flashy, nothing harsh:

```lua
colors = {
  foreground = "#839395",
  background = "#001419",

  cursor_bg = "#839395",
  cursor_border = "#839395",
  cursor_fg = "#001419",

  selection_bg = "#1a6397",
  selection_fg = "#839395",

  ansi = {
    "#001014",
    "#db302d",
    "#849900",
    "#b28500",
    "#268bd3",
    "#d23681",
    "#29a298",
    "#9eabac",
  },

  brights = {
    "#001419",
    "#db302d",
    "#849900",
    "#b28500",
    "#268bd3",
    "#d23681",
    "#29a298",
    "#839395",
  },
},
```

## The Full Zen Configuration

```lua
local wezterm = require("wezterm")

local M = {}

M.spec = {
  enable_tab_bar = false,
  window_decorations = "RESIZE",
  window_background_opacity = 1.0,
  macos_window_background_blur = 10,
  font = wezterm.font_with_fallback({ "Lilex Nerd Font" }),
  font_size = 18,
  scrollback_lines = 10000,

  colors = {
    foreground = "#839395",
    background = "#001419",

    cursor_bg = "#839395",
    cursor_border = "#839395",
    cursor_fg = "#001419",

    selection_bg = "#1a6397",
    selection_fg = "#839395",

    ansi = {
      "#001014",
      "#db302d",
      "#849900",
      "#b28500",
      "#268bd3",
      "#d23681",
      "#29a298",
      "#9eabac",
    },

    brights = {
      "#001419",
      "#db302d",
      "#849900",
      "#b28500",
      "#268bd3",
      "#d23681",
      "#29a298",
      "#839395",
    },
  },
}

return M.spec
```

Over time, I realized that small adjustments—fonts, colors, scrollback, even
subtle blur—compound in impact. Each tweak reduces friction, letting the terminal
fade into the background so I can focus on code.

This setup is my “zen mode.” It’s not perfect and it will probably evolve, but
for now, it transforms the terminal from a tool I wrestle with into a space I can
inhabit for hours, fully immersed in work.
