---
trigger: always_on
description: Project-specific rules for ScholarHub coding agents
globs: **/*
---

# ScholarHub Agent Rules

## Project Identity

- ScholarHub is a scholarship monitoring dashboard for Indonesian students.
- Preserve the existing MVP assumptions unless the user explicitly asks to change them: single default user, scholarship catalog, application tracker, university browser, and admin scholarship management.
- Treat `README.md` and `design.md` as living documentation. Update them when architecture, features, setup, or visual conventions materially change.

## Architecture

- Use the Next.js App Router structure under `src/app`.
- Keep reusable business and data-access logic in `src/services`.
- Keep shared helpers, labels, enums, class merging, and date utilities in `src/lib/utils.ts`.
- Use `src/lib/db.ts` for Prisma access; do not instantiate `PrismaClient` elsewhere.
- Prefer server components for read-only pages that can fetch through services.
- Use client components only for interactive UI that needs hooks, browser state, or API calls.
- API routes should be thin adapters that parse requests, call services, and return `NextResponse.json`.

## Data And Persistence

- The active datasource is PostgreSQL through Prisma and `DATABASE_URL`.
- Do not treat `prisma/dev.db` as the active database; it is a legacy artifact.
- Keep Prisma model field naming consistent with the schema: camelCase in TypeScript, mapped snake_case in the database.
- Preserve the current status values from `src/lib/utils.ts` unless a migration and UI update are part of the task.
- Checklists are stored as JSON strings in text columns. API handlers may accept arrays but must stringify before saving.
- Date strings are generally `YYYY-MM-DD`; be careful with timezone-sensitive date logic.
- The MVP user id is `default-user`. Do not introduce auth-specific behavior unless the task includes authentication work.

## UI And Design

- Follow the light slate/indigo dashboard style from `design.md`.
- Use Tailwind utility classes for styling; avoid adding custom CSS unless there is a clear reusable need.
- Standard page shell: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`.
- Standard cards: `bg-white rounded-xl border border-slate-200 shadow-sm`.
- Use `lucide-react` for icons.
- Use indigo for primary actions and brand accents, slate for neutral surfaces/text, and semantic colors for statuses.
- Keep UI readable, spacious, and consistent with the current dashboard aesthetic rather than introducing unrelated visual themes.

## Feature Conventions

- Scholarship filtering lives in `src/services/scholarships.ts` and is exposed through `/api/scholarships`.
- Scholarship detail pages should load by slug and call `notFound()` when no record exists.
- Application tracking should go through `/api/applications` and `src/services/applications.ts`.
- University browsing and detail views should go through `src/services/universities.ts`.
- When adding new categories, provider types, degree levels, funding types, application statuses, or link types, update `src/lib/utils.ts`, Prisma/seed data if needed, and UI labels together.

## Code Quality

- Use TypeScript interfaces or inferred Prisma types for data shapes; avoid broad `any`.
- Keep route handlers defensive and return useful JSON errors for failed writes.
- Avoid duplicating constants or label maps inside pages when they belong in `src/lib/utils.ts`.
- Keep components focused. Extract repeated UI only when it meaningfully reduces duplication.
- Run `npm run lint` after code changes when feasible.
- Run `npm run build` for larger changes, especially schema, routing, or server/client boundary changes.

## Documentation Expectations

- If setup changes, update the Quick Start and database notes in `README.md`.
- If the design system changes, update `design.md`.
- If agent workflow expectations change, update this rules file.
