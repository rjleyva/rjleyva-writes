---
title: My WezTerm Terminal Setup (Zen Mode)
date: 2025-12-05
description: Strip away distractions and let your code shine.
tags: ['wezterm', 'terminal', 'productivity', 'setup']
---

# Cutting the Noise

I spend hours in my terminal. Let's skip the `brew install` tutorial and jump straight into my questionable choices.

## The Settings

- Keeps the interface distraction-free. I only focus on the current task.

```lua
enable_tab_bar = false
```

- Gives you just enough window frame to resize, but not enough to feel like your terminal is trying to compete with Photoshop. Minimalist vibes only.

```lua
window_decorations = "RESIZE"
```

- Adds a subtle macOS blur to your background. Makes your terminal feel dreamy and cinematic… like you're the lead in a hacker indie film nobody asked for.

```lua
macos_window_background_blur = 10
```

- Skip the transparency. My GPU doesn't need extra cardio just so my terminal can cosplay as glass.

```lua
window_background_opacity = 1.0,
```

- Font and size that actually respect your eyes—big enough for long sessions.

```lua
font = wezterm.font_with_fallback({ "Lilex Nerd Font" })
font_size = 18
```

- Scrollback lines set to 10,000 because logs have commitment issues. Sometimes they stretch forever and you just want to find that one typo without a time machine.

```lua
scrollback_lines = 10000
```

- Colors designed for long ChatGPT sessions... I mean coding sessions.

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

# Copy and Paste

Here's the full setup in case you just want to copy and go.

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

---

_Crafted with questionable coffee decisions and a healthy disregard for transparency._

_Generated with help from [ChatGPT](https://chat.openai.com)_ ooppsss.
