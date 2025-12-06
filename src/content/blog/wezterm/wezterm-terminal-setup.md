---
title: WezTerm Terminal Setup (Zen Mode)
date: 2025-12-05
description: Strip away distractions and let your code shine.
tags: ['wezterm', 'terminal', 'productivity', 'setup']
---

# Cutting the noise

I won’t pretend I spend hours in my terminal every day. Just kidding,
I absolutely do. Let’s skip the boring tutorial intro `brew install --cask wezterm`
and jump straight into my questionable choices.

## Breaking Down

- Keeps the interface distraction-free. I only focus on the current task and you
  might as well, so go on, press the copy button while it’s still free.

```lua
enable_tab_bar = false
```

- Gives you just enough window frame to resize, but not enough to feel like your
  terminal is trying to compete with Photoshop. Minimalist vibes only.

```lua
window_decorations = "RESIZE"
```

- Adds a subtle macOS blur to your background. Makes your terminal feel dreamy
  and cinematic… like you’re the lead in a hacker indie film nobody asked for.

```lua
macos_window_background_blur = 10
```

Skip the transparency. My GPU doesn’t need extra cardio just so my terminal can
cosplay as glass.

```lua
window_background_opacity = 1.0,
```

- Font and size that actually respect your eyes, big
  enough for your tired eyeballs.

```lua
font = wezterm.font_with_fallback({ "Lilex Nerd Font" })
font_size = 18
```

- Scrollback lines set to 10,000 because logs have commitment issues. Sometimes
  they stretch forever and you just want to find that one typo without a time
  machine.

```lua
scrollback_lines = 10000
```

- Colors designed for long ChatGPT sessions, I mean coding sessions.

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

Here’s the full setup in case you just want to copy and go.

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

_Generated with help from [ChatGPT](https://chat.openai.com) — oppppssss typo…
I meant **crafted with vibes and questionable coffee decisions**._
