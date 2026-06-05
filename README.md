# ScholarHub - Scholarship Monitoring Dashboard

ScholarHub is a Next.js dashboard for Indonesian students to discover scholarships, monitor deadlines, browse related universities, and track personal application progress. The app is currently built as an MVP with a single default user and a service-layer architecture that keeps database logic separate from pages and API routes.

## Quick Start

### Prerequisites

- Node.js 18+; the project has been run with Node 18.20.8.
- npm.
- A PostgreSQL database URL in `DATABASE_URL`.

### Installation

```bash
npm install
```

### Database Setup

The Prisma schema uses PostgreSQL. The old `prisma/dev.db` SQLite file is a legacy artifact and is not the active datasource.

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### Development

```bash
npm run dev
```

Open http://localhost:3000.

## Tech Stack

- **Framework:** Next.js 14 App Router with React 18 and TypeScript.
- **Styling:** Tailwind CSS 3 with a light slate/indigo dashboard visual system.
- **Database:** PostgreSQL through Prisma ORM 6.
- **Icons:** `lucide-react`.
- **Utilities:** `clsx`, `tailwind-merge`, and `date-fns`.
- **Package manager:** npm with `package-lock.json`.

## Architecture

ScholarHub follows a service-layer pattern inside the Next.js App Router:

- **Routes and pages** in `src/app` render UI and expose API endpoints.
- **Services** in `src/services` hold reusable business/data-access workflows.
- **Prisma** in `src/lib/db.ts` is exposed through a singleton client to avoid duplicate clients during local hot reload.
- **Shared constants and formatting helpers** live in `src/lib/utils.ts`.
- **Database models and seed data** live in `prisma/`.

Most read-heavy pages use server components where possible, while interactive catalog, tracker, admin, and tracking controls use client components that call the API routes.

## Project Structure

```text
.
├── prisma/
│   ├── schema.prisma          # PostgreSQL Prisma models
│   ├── seed.ts                # Seed data for scholarships, universities, links, users
│   └── migrations/            # Prisma migration history
├── src/
│   ├── app/
│   │   ├── api/               # JSON API routes for scholarships, universities, applications
│   │   ├── admin/             # Scholarship management page
│   │   ├── scholarships/      # Catalog, detail page, track button
│   │   ├── tracker/           # Application progress tracker
│   │   ├── universities/      # University list and detail pages
│   │   ├── layout.tsx         # Root layout and navbar shell
│   │   ├── page.tsx           # Dashboard overview
│   │   └── globals.css        # Tailwind directives and base colors
│   ├── components/
│   │   └── Navbar.tsx         # Top navigation
│   ├── lib/
│   │   ├── db.ts              # Prisma singleton
│   │   └── utils.ts           # Class merging, dates, labels, status constants
│   └── services/
│       ├── applications.ts    # Tracking, status, checklist, application stats
│       ├── scholarships.ts    # Catalog filters, CRUD, stats, deadlines
│       ├── universities.ts    # University CRUD and scholarship joins
│       └── integrations/      # Future scraper/API integration types
├── design.md                  # Current UI style guide
├── DEPLOYMENT.md              # Deployment notes
└── .agents/rules/             # Universal AI-agent rules for this project
```

## Key Features

- **Dashboard overview:** Counts open, upcoming, and closed scholarships; shows upcoming deadlines, tracked applications, and recently added scholarships.
- **Scholarship catalog:** Client-side filter UI backed by `/api/scholarships` for status, provider type, degree level, funding type, search, and sort.
- **Scholarship details:** Server-rendered detail pages with timeline, resources, related universities, key info, and a track-status control.
- **Application tracker:** Single-user MVP tracker for statuses, checklists, progress percentages, notes, deadlines, and deletion.
- **University browser:** Searchable university list and university detail pages linked to scholarship records.
- **Admin scholarship management:** Client-side page for creating and deleting scholarships through API routes.
- **REST-like API routes:** Scholarship, university, and application CRUD endpoints plus query-param actions for stats/deadlines.

## Data Model

The core Prisma models are:

- `Scholarship`: Main scholarship entity with slug, provider/funding/degree/status fields, dates, links, related universities, and default checklist JSON stored as text.
- `ScholarshipDate`: Timeline milestones for a scholarship.
- `ScholarshipLink`: Resource links such as official pages, guides, forums, videos, documents, and social media.
- `University` and `UniversityLink`: University records and external links.
- `ScholarshipUniversity`: Join table between scholarships and universities.
- `UserProfile`: MVP user profile data.
- `UserApplication`: A user scholarship tracking record with status, notes, applied timestamp, and checklist JSON stored as text.

## Design Style

The current UI follows the style documented in `design.md`:

- Light mode with `slate-50` page backgrounds, white cards, `slate-200` borders, and `slate-900` text.
- Indigo is the primary accent for brand, icons, focus rings, and primary actions.
- Semantic badge colors: emerald for open/accepted, blue for upcoming/applied, amber for warning/preparing, red for closed/rejected, slate for neutral states.
- Layouts use `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`.
- Cards usually use `bg-white rounded-xl border border-slate-200 p-5 shadow-sm`.
- Icons come from `lucide-react`; header icons are generally `w-7 h-7 text-indigo-500`.

## Supporting Files

- `design.md`: Source of truth for UI style, spacing, component conventions, badges, buttons, and icon usage.
- `DEPLOYMENT.md`: Deployment-oriented setup notes.
- `tailwind.config.js`: Tailwind content configuration for `src/**/*`.
- `eslint.config.mjs`: ESLint setup.
- `next.config.mjs`: Next.js configuration.
- `postcss.config.js`: Tailwind/PostCSS integration.
- `.agents/rules/scholarhub-project.md`: Project-specific AI-agent coding rules.
- `.agents/rules/pr-generator-rule.mdc`: PR-summary helper rule for staged or full git diffs.
- `.agents/rules/write-changelog.mdc`: Changelog writer rule for release notes from git diffs.

## Important Implementation Notes

- `DEFAULT_USER_ID` is currently hardcoded as `default-user` in application routes and server pages. Do not assume multi-user auth exists yet.
- Checklist fields are stored as JSON strings in Prisma text columns. API routes stringify checklist arrays before persistence.
- Date values such as `openDate`, `closeDate`, and `ScholarshipDate.dateValue` are stored as strings in `YYYY-MM-DD` style and formatted in the UI.
- `src/lib/utils.ts` is the canonical place for status arrays, labels, badge mappings, date helpers, and slug generation.
- Use the service layer for Prisma access rather than querying Prisma directly from client components.

## Roadmap

- Add authentication and replace the hardcoded default user.
- Add Google Calendar or notification integration for deadlines.
- Add scraper/API integrations for scholarship providers.
- Expand admin editing beyond create/delete.
- Add validation and stronger typed request payloads for API routes.
