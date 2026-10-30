---
description: "PR summary from git diff (plain text, Bitbucket/SourceTree). On attach: run immediately — staged vs HEAD unless user message includes -all."
alwaysApply: false
---

# PR summary generator

## On attach (required)

**As soon as this rule is included in context** (user @-mentioned it, attached it in Rules, or selected it manually), **run the full workflow below in this turn**. Do not wait for the user to say "write PR", "PR summary", or similar.

1. Detect git root of the **target repository** (the app repo you are committing in, or the repo open in the workspace). In a multi-root workspace, use the repo the user is working on or the folder named in the prompt.
2. Determine scope from the **user's message in this chat** (if any):
   - Contains `-all` → compare working tree to `HEAD` (staged + unstaged).
   - Contains `-stage` or no scope flag → compare **staged** index to `HEAD` (default).
3. Run `git diff` for that scope (and `git diff --cached` / status as needed).
4. Output the PR summary in the format below (single code block, plain text).

If there is no git repo or no changes, say so briefly and stop.

**Do not** run this workflow on unrelated turns unless the user attaches this rule again or explicitly asks for a PR summary.

## Analysis

- **Strict diff:** Describe only technical "what." No "why," no business context, no inference.
- **Minimalism:** Single-line bullet points only.

## Output format (SourceTree & Bitbucket)

- **Container:** One code block for one-click copy.
- **Style:** Pure plain text. No markdown headers (#), bold (**), or italics (*) inside the block.
- **Structure:**

```
Summary: [One sentence technical summary]

Removed:
- [Item 1]

Added:
- [Item 1]
```

(Omit empty Removed or Added sections.)

## Optional modifiers (same turn as attach)

| User includes | Scope |
|---------------|--------|
| `-all` | Working directory vs `HEAD` |
| `-stage` or (none) | Staged vs `HEAD` |
