# ScholarHub — Scholarship Monitoring Dashboard

ScholarHub is a comprehensive technical solution designed to aggregate and monitor scholarships specifically for Indonesian students. It provides a centralized dashboard to track application progress, manage checklists, and monitor upcoming deadlines.

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (The project currently runs on Node 18.20.8)
- npm or yarn

### 2. Installation
```bash
git clone <your-repo-url>
cd education-dashboard
npm install
```

### 3. Database Setup
The project uses Prisma ORM with SQLite for the MVP.
```bash
# Generate Prisma Client
npx prisma generate

# Create the database and run migrations
npx prisma migrate dev --name init

# Seed the database with realistic scholarship data
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the results.

---

## 🏗️ System Architecture

ScholarHub follows a modular **Service-Layer Architecture** integrated within the Next.js App Router framework.

- **Frontend:** Next.js 14, React 18, and custom CSS variables for a premium dark-mode design system.
- **Service Layer:** Decoupled business logic in `src/services` to ensure easy maintenance and future integration of scrapers/external APIs.
- **Data Access Layer:** Prisma ORM for type-safe database queries.
- **State Management:** React hooks and Server Actions/Components for data fetching.

---

## 📂 Project Structure

```text
├── prisma/                 # Database schema and seed scripts
│   ├── schema.prisma       # Database model definitions
│   └── seed.ts             # Realistic sample data (10+ scholarships)
├── src/
│   ├── app/                # Next.js App Router (Pages & API Routes)
│   │   ├── api/            # RESTful API Endpoints
│   │   ├── scholarships/   # Scholarship Catalog & Details
│   │   ├── tracker/        # Application Progress Tracking
│   │   └── admin/          # Management Dashboard
│   ├── components/         # Reusable UI components (Sidebar, etc.)
│   ├── lib/                # Shared utilities and DB singleton
│   ├── services/           # Core Business Logic (The "Service Layer")
│   └── styles/             # Global CSS & Design Tokens
└── public/                 # Static assets and images
```

### Folder Breakdown
- **`src/app/api`**: Handles CRUD for Scholarships, Universities, and User Applications.
- **`src/services`**: Contains logic for data filtering, statistics calculation, and application status management. This layer is designed to be "scraper-ready."
- **`src/lib/db.ts`**: Ensures a singleton instance of the Prisma client to prevent connection pooling issues.
- **`src/app/globals.css`**: Defines the "ScholarHub Design System" using CSS variables for colors, spacing, and animations.

---

## 🛠️ Key Functionalities

1.  **Scholarship Catalog:** Advanced filtering (Status, Funding, Degree Level) and real-time search.
2.  **Deadline Monitor:** Automatic calculation of days remaining with color-coded urgency alerts.
3.  **Application Tracker:** Users can track status (Interested, Applied, etc.) and manage dynamic 5-step checklists.
4.  **University Browser:** Aggregated view of global universities linked to Indonesian scholarships.
5.  **Admin Portal:** Internal tools for manually adding or updating scholarship entries.

---

## 📈 Roadmap
- [ ] Integration with Google Calendar API for deadline notifications.
- [ ] Automated web scrapers for LPDP and Chevening sites.
- [ ] User authentication via NextAuth.
- [ ] Migration to PostgreSQL for production scaling.
