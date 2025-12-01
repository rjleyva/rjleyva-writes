---
title: How I Use Jujutsu (JJ)
date: 2025-11-23
description: A personal guide on how I install, configure, and use Jujutsu (jj) as part of my development workflow.
tags: ['jujutsu', 'jj', 'version-control', 'workflow', 'setup']
---

**SAMPLE POST ONLY**

## Homebrew Installation

If you use Homebrew, you can run:

```bash
brew install jj
```

## Initial Configuration

You may want to configure your name and email so commits are made in your name.

```bash
$ jj config set --user user.name "Martin von Zweigbergk"
$ jj config set --user user.email "martinvonz@google.com"
```

## Command-line Completion

Jujutsu provides 2 different command-line completion scripts.

### Standard completions

The standard completion script provides completions for jj subcommmands and options.

### Dynamic completions¶

The dynamic completion script provides completions for jj subcommands and options, as well as additional completions,
including bookmarks, aliases, revisions, operations and files. Dynamic completions can be context aware, for example they
respect the global flags --repository and --at-operation as well as some command-specific ones like --revision, --from,
and --to.

Dynamic completions are not the default/only option since the underlying engine _is still labeled unstable._ We expect to
transition to them as the default once the engine is stabilized. Please let us know if you encounter any issues with
dynamic completions.

> Which completion script should I use?
> Generally, dynamic completions provide a much better completion experience. Although the underlying engine is deemed
> unstable, there have not been many issues in practice. Dynamic completions are the preferred option for many contributors
> and users.

> We recommend using the dynamic completion script, and falling back to the standard completion script if there are any
> issues.

#### Bash

```bash
source <(jj util completion bash) # Standard
source <(COMPLETE=bash jj) # Dynamic
```

#### Zsh

```bash
# Standard
autoload -U compinit
compinit
source <(jj util completion zsh)

# Dynamic
source <(COMPLETE=zsh jj)
```

## Cloning a Git Repository

> Note the "git" before "clone" (there is no support for cloning native jj repos yet)

```bash
jj git clone https://github.com/octocat/Hello-World
```

## Commands

```bash
jj st #(short for jj status) similar to git status
```

> Note that you didn't have to tell Jujutsu to add the change like you would with `git add`.
> To untrack a path, add it to your `.gitignore` and run jj `file untrack <path>`.

To see the diff, run

```bash
jj diff #(similar to git diff)
```

So, let's say we're now done with this change, so we create a new change:

```bash
jj new
```

If we later realize that we want to make further changes, we can make them in the working copy and then run

```bash
jj squash #(similar to git commit --amend)
```

Alternatively, we can use:

```bash
jj edit #to resume editing a commit in the working copy.
```

To view how a change has evolved over time, we can use:

```bash
jj evolog #(This records changes to the working copy, message, squashes, rebases, etc.)
```
