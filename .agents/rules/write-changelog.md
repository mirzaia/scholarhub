---
description: "Update CHANGELOG.md (Keep a Changelog). On attach: run immediately — draft or update entry from git diff unless user says preview-only."
alwaysApply: false
---

# Changelog writer

## On attach (required)

**As soon as this rule is included in context** (user @-mentioned it, attached it in Rules, or selected it manually), **run the full workflow below in this turn**. Do not wait for the user to say "write changelog", "update CHANGELOG", or similar.

1. Find `CHANGELOG.md` at the **git repository root** of the **target repository** (the app repo you are releasing, not necessarily `working-with-agents` unless you are changing this rules repo). In a multi-root workspace, use the repo the user is working on or the folder named in the prompt.
2. If missing, ask whether to create one or stop.
3. Run `git diff` (staged vs `HEAD` by default; if the user's message includes `-all`, include unstaged too).
4. Read the latest entry at the top of `CHANGELOG.md` for version/date pattern.
5. **Default:** Propose or apply an update under the correct version section using the categories below. If the user message says `preview only` / `do not edit`, show the proposed block only without writing the file.
6. Otherwise edit `CHANGELOG.md` when the user attached this rule for execution (treat attach as approval to update unless they said preview-only).

**Do not** run this workflow on unrelated turns unless the user attaches this rule again or explicitly asks for changelog work.

## Structure

### Order

- Newest release at the **top** of the file.

### Categories (one-word headings)

- Added, Changed, Fixed, Removed, Deprecated, Security

### Release header

```md
## [x.y.z] - YYYY-MM-DD
```

Use ISO 8601 dates. Bump version logically from the latest entry if the user did not specify a version.

## Writing rules

- User-facing, concise bullets.
- Match tone and granularity of existing entries in that project's `CHANGELOG.md`.
- Do not invent changes not supported by the diff.

## Optional modifiers (same turn as attach)

| User includes | Behavior |
|---------------|----------|
| `-all` | Consider staged + unstaged diff vs `HEAD` |
| `preview only` / `no commit` | Show proposed markdown only; do not write file |
