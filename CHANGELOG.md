# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-08-08

### Changed

- Upgraded Next.js from 14.2.x to 15.5.23 and aligned `eslint-config-next` to the same version.
- Updated dynamic route handlers and pages to use async `params` (`Promise<{ … }>`) required by Next.js 15.
- Added `.js` extensions to `eslint-config-next` imports in `eslint.config.mjs`.
- Replaced literal credential examples in `DEPLOYMENT.md` with placeholders and added guidance to keep `.env` gitignored.

### Security

- Added npm `overrides` for transitive dependency advisories (`brace-expansion`, `defu`, `flatted`, `js-yaml`, `nanoid`, `picomatch`, `sharp`, and `postcss` under `next`).
- Bumped `@prisma/client` and `prisma` to 6.19.3 and `postcss` to 8.5.26.

## [0.1.0] - 2026-06-05

### Added

- Added project-specific agent rules for ScholarHub architecture, data handling, UI conventions, feature boundaries, and documentation expectations.
- Added reusable PR summary and changelog writer agent rules.
- Added a multi-root VS Code workspace for ScholarHub and HiredPath.

### Changed

- Reworked the README with current setup steps, PostgreSQL database notes, architecture, project structure, feature coverage, data model details, design conventions, implementation notes, and roadmap.
