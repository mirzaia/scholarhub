# ScholarHub - Master's Scholarship Monitoring Dashboard

ScholarHub is a high-density, **Grafana-inspired dark dashboard** for Indonesian students to discover Master's degree scholarships, monitor intake deadlines, verify GPA/LoA/English eligibility criteria, browse partner universities, and track personal application milestones with a Kanban board and document link repository.

---

## Key Features

- **Grafana Dark Dashboard Interface**: Technical, high-density monitoring aesthetic with low eye-strain dark theme (`#111217` canvas, `#181b1f` panels, orange gradient accents, LCD progress bars, and monospace metrics).
- **Indonesian Master's Degree Catalog**: Curated for Indonesian applicants targeting top international and domestic postgraduate funding schemes (LPDP Beasiswa Reguler, LPDP PTUD, Chevening UK, Australia Awards, DAAD Germany, Erasmus Mundus, MEXT Japan, GKS Korea, Turkiye Burslari, Fulbright, and more).
- **Eligibility Criteria Matrix**: Real-time filtering and detail verification for:
  - Undergraduate GPA (IPK S1 minimums)
  - English proficiency requirements (IELTS, TOEFL iBT, Duolingo, PTE)
  - Letter of Acceptance (LoA) requirements (*Mandatory Unconditional* vs *Optional*)
  - Age limits & required work experience
  - Full funding vs partial coverage summaries
- **Application Tracker (Dual Mode)**:
  - **Kanban Board**: Drag/advance cards across `Interested`, `Preparing`, `Applied`, `Accepted`, `Rejected` columns.
  - **Detailed List View**: Interactive task checklist with completion progress bar.
  - **Document & Essay Repository**: Save and launch Google Docs links for Statements of Purpose, CV/Resume drive links, and interview notes per application.
- **Calendar Deadline Sync**:
  - One-click **Add to Google Calendar** with prefilled event details, link, and reminders.
  - Downloadable **iCalendar (.ics)** file for Apple Calendar, Microsoft Outlook, and mobile devices.
- **University Directory**: Explore destination universities mapped directly to scholarship eligibility (e.g., LPDP PTUD Top 25 universities).
- **Cloud & Container Portability**: Ready for instant serverless deployment on Vercel or multi-stage standalone containerization via Docker.

---

## Quick Start

### Prerequisites
- Node.js 18+ (tested on Node 20+)
- npm
- PostgreSQL database URL (Neon Serverless Postgres recommended)

### 1. Installation
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
DATABASE_URL="postgresql://user:password@host/scholarhub?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Migration & Seeding
```bash
# Push schema changes to PostgreSQL
npx prisma db push

# Seed realistic 2026 scholarship and university data
npx prisma db seed
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Docker Containerization

ScholarHub includes a multi-stage production `Dockerfile` and a `docker-compose.yml` for local offline development or VPS deployment.

### Run with Docker Compose (App + Local PostgreSQL 16)
```bash
# 1. Start containers
docker compose up -d

# 2. Push schema and seed database inside container
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed

# 3. Open in browser
open http://localhost:3000
```

### Build Standalone Image
```bash
docker build -t scholarhub:latest .
```

For deployment comparisons and tradeoffs (Vercel vs. Docker), refer to [DEPLOYMENT.md](file:///Users/mirzaaziz/workspace/scholarhub/DEPLOYMENT.md).

---

## Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router with Server Components and Client Islands)
- **Styling**: Tailwind CSS v3 with custom Grafana palette tokens
- **Database / ORM**: PostgreSQL via Prisma ORM v6
- **UI Components & Icons**: `lucide-react`
- **Output Mode**: `standalone` for minimal Docker footprint (<150MB)
- **Linting**: ESLint 9 with `@eslint/eslintrc` FlatCompat

### Directory Layout
```text
.
├── prisma/
│   ├── schema.prisma          # PostgreSQL Prisma models
│   └── seed.ts                # 2026 Seed data (22 scholarships, 15 universities)
├── src/
│   ├── app/
│   │   ├── api/               # JSON REST API routes (scholarships, universities, applications)
│   │   ├── admin/             # Scholarship administration page
│   │   ├── scholarships/      # Catalog, detail page, track button, calendar export
│   │   ├── tracker/           # Dual-mode Kanban & List application tracker
│   │   ├── universities/      # University browser and detail pages
│   │   ├── layout.tsx         # Root dark layout with DashboardShell
│   │   ├── page.tsx           # Dashboard overview metrics & deadline table
│   │   └── globals.css        # Grafana dark theme variables & utility classes
│   ├── components/
│   │   └── DashboardShell.tsx # Collapsible navigation sidebar & top breadcrumb bar
│   ├── lib/
│   │   ├── db.ts              # Prisma singleton client
│   │   └── utils.ts           # Status styles, calendar .ics/Google Cal helpers, date utils
│   └── services/
│       ├── applications.ts    # Application tracker CRUD, checklist, document links
│       ├── scholarships.ts    # Scholarship filtering, GPA/LoA criteria, mutations
│       └── universities.ts    # University querying and scholarship joins
├── design.md                  # Grafana dark design system documentation
├── DEPLOYMENT.md              # Vercel vs Docker comparative deployment guide
└── Dockerfile                 # Multi-stage production Dockerfile
```

---

## License
MIT
