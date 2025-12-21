---
title: macOS Neovim 0.11+ Native LSP Configuration
date: 2025-12-20
description: Step by step guide on how to setup LSP in Neovim 0.11+ in macOS.
tags: ['vim', 'neovim', 'lsp', 'configuration']
---

Neovim 0.11 (released March 2025) introduced a simpler, fully native way to configure the Language Server Protocol (LSP). With this release, LSP becomes a true first-class citizen—no extra plugins required for basic setup.

You can still use Mason, a Neovim plugin that acts as a portable package manager for external development tooling such as LSP servers, DAP servers, linters, and formatters.

> NOTE: Mason itself does not configure the LSP servers for use in Neovim. It just installs and manages the binaries/tools. To wire them up with Neovim built-in LSP client, you can use mason-lspconfig.nvim together with nvim-lspconfig.

What we’ll cover today is a more manual approach. It requires installing LSP servers—such as lua-language-server—directly on your machine. This approach isn’t portable. You’ll need to reinstall the server when setting up a new machine, or automate it with a shell [script](https://github.com/rjleyva/dotfiles-macos/blob/main/scripts/dev-setup.sh).

Let's begin with installing `lua-language-server` via homebrew:

```bash
brew install lua-language-server
```

> NOTE: You can also install this via npm but I prefer to use homebrew for this instance.

### Structure Overview

The structure is based on [Marco Peluso](https://www.youtube.com/watch?v=tdhxpn1XdjQ) YouTube video.

```bash
nvim/
├── init.lua
├── lsp/
│   └── lua_ls.lua
└── lua/
    └── core/
        └── lsp.lua
```

`lsp/` contains server specifications only, while `lua/core/` is responsible for enabling and orchestrating them. This keeps configuration declarative and avoids coupling server definitions to startup logic.

### Step-by-Step Setup

Let’s start by creating the `nvim` directory:

```bash
mkdir -p ~/.config/nvim
```

Then move to the `nvim` directory by running this command:

```bash
cd ~/.config/nvim
```

Create the main `init.lua` file:

```bash
nvim init.lua
```

and add this configuration:

```lua
require('core.lsp')
```

Now let's create the `lsp` directory:

```bash
mkdir lsp
```

Then move to `lsp` directory by running this command:

```bash
cd lsp
```

Create `lua_ls.lua` by running this command:

```bash
nvim lua_ls.lua
```

Then add this to `lua_ls.lua`:

```lua
local M = {}

M.spec = {
  cmd = {
    'lua-language-server',
  },

  filetypes = {
    'lua',
  },

  root_markers = {
    '.git',
    '.luacheckrc',
    '.luarc.json',
    '.luarc.jsonc',
    '.stylua.toml',
    'selene.toml',
    'selene.yml',
  },

  settings = {
    Lua = {
      runtime = {
        version = 'LuaJIT',
      },
      diagnostics = {
        globals = { 'vim' },
      },
      hint = {
        enable = true,
        setType = true,
        paramType = true,
        -- paramName = 'All',
        -- semicolon = 'All',
        -- arrayIndex = 'All',
        -- moduleName = 'All',
      },
      telemetry = {
        enable = false,
      },
      workspace = {
        checkThirdParty = false,
        library = {},
        -- Enable if you want:
        -- Full API docs and completion for plugin development
        -- Autocompletion for all vim.api.* functions
        -- Uncomment the line below to index Neovim’s runtime and plugins:
        -- library = vim.api.nvim_get_runtime_file(),
      },
    },
  },

  single_file_support = true,
  autostart = false, -- manually enabled via vim.lsp.enable
  log_level = vim.lsp.protocol.MessageType.Warning,
}

M.name = 'lua_ls'

return M.spec
```

> NOTE: These markers define how a project root is detected. This becomes useful once you start managing multiple language servers consistently.

Go back to `nvim` directory by running this command:

```bash
cd ~/.config/nvim
```

Then create `lua` and `core` directory:

```bash
mkdir -p lua/core/
```

Then move inside `core` directory:

```bash
cd lua/core/
```

and create `lsp.lua`:

```bash
nvim lsp.lua
```

Then enable it using `vim.lsp.enable` like this:

This explicitly enables the Lua language server by name:

```lua
vim.lsp.enable({
  'lua_ls',
})
```

> NOTE: `vim.lsp.enable()` is available starting in Neovim 0.11 and replaces the need for `nvim-lspconfig` in simple setups.
> This approach works well for most setups, but more complex workflows may still benefit from `lspconfig` or Mason integrations.

Inside Neovim you can run:

```
checkhealth lsp
```

and you'll see something like this:

```
vim.lsp: Active Clients ~
- lua_ls (id: 1)
  - Version: 3.15.0
  - Root directory: ~/dotfiles-macos
  - Command: { "lua-language-server" }
  - Settings: {
      Lua = {
        diagnostics = {
          globals = { "vim" }
        },
        hint = {
          enable = true,
          paramType = true,
          setType = true
        },
        runtime = {
          version = "LuaJIT"
        },
        telemetry = {
          enable = false
        },
        workspace = {
          checkThirdParty = false,
          library = {}
        }
      }
    }
  - Attached buffers: 2, 3
```

This output confirms that `lua_ls` is running successfully.

This setup is what I currently use daily in my Neovim workflow.

### Why use native LSP in Neovim 0.11+?

My main reason for choosing this approach is simple: fewer plugins to maintain, faster startup times, and easier debugging. While manually configuring LSP takes a bit more effort, it taught me a lot about what’s actually happening behind the scenes. I’m in control of everything, and each configuration exists because I need it—not because a plugin decided for me.

### Who is this for?

This setup is ideal if you:

- Use Neovim 0.11+
- Want fewer plugins and more control
- Prefer understanding how LSP works under the hood

If you want a fully portable, zero-setup experience, Mason may still be a better fit.

This approach scales naturally as you add more language servers. In future posts, I’ll cover keymaps, diagnostics, formatting, and multi-server setups—still using Neovim’s native LSP.

You can find the full working Neovim configuration [here](https://github.com/rjleyva/dotfiles-macos).

### Next steps

- Add more language servers using the same `lsp/` pattern
- Define LSP keymaps and diagnostics
- Integrate formatting without external plugins

See you in the next post.
