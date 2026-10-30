# ScholarHub Design System & UI Blueprint (Grafana Dark Theme)

## 1. Design Philosophy
ScholarHub adopts a **Grafana-inspired dark dashboard design system**, optimized for density, visual hierarchy, low eye strain during long research sessions, and rapid status assessment. It mirrors professional monitoring consoles with crisp borders, telemetry LCD progress indicators, status dot badges, and segmented variable control bars.

- **Theme**: Dark Mode (Canvas: `#111217`, Panels: `#181b1f`, Elevated surfaces: `#22252b`).
- **Brand Accent**: Grafana Orange Gradient (`linear-gradient(to right, #ff8833, #f55f3e)`), with subtle Amber (`#fab219`) highlights.
- **Aesthetic**: Technical, data-dense monitoring dashboard with high contrast typography and tabular monospace numerics.
- **Guiding Principles**: Information density, quick scanning, distinct semantic status indicators, zero visual clutter.

---

## 2. Color Palette & Design Tokens

Tokens are defined in `tailwind.config.js` and CSS custom variables in `src/app/globals.css`.

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| Canvas Background | `#111217` | Root background for application viewport |
| Panel Background | `#181b1f` | Surface for cards, containers, sidebar, and headers |
| Elevated Surface | `#22252b` | Hover state, dropdowns, inputs, nested metric tiles |
| Panel Border | `rgba(204, 204, 220, 0.12)` | 1px border on all panels and cards |
| Subtle Border | `rgba(204, 204, 220, 0.07)` | Dividers, separators, row bottom borders |
| Active Border | `rgba(204, 204, 220, 0.25)` | Hovered cards, focused inputs |
| Text Strong | `#e6e6f0` | Headings, metric values, primary titles |
| Text Default | `#ccccdc` | Body copy, table cells, form labels |
| Text Muted | `rgba(204, 204, 220, 0.62)` | Secondary metadata, timestamps, subtitles |
| Text Subdued | `rgba(204, 204, 220, 0.38)` | Input placeholders, inactive tabs |
| Brand Primary | `#ff8833` | Brand accent, active sidebar indicator, primary action CTA |
| Brand Gradient | `linear-gradient(#ff8833, #f55f3e)` | Left indicator strip for active navigation items |

### Status Colors

| Status | Background | Text | Border | Dot Accent |
|--------|------------|------|--------|------------|
| **Open / Accepted** | `rgba(12, 163, 12, 0.12)` | `#73bf69` | `rgba(12, 163, 12, 0.35)` | `#0ca30c` |
| **Upcoming / Applied** | `rgba(61, 113, 217, 0.15)` | `#6e9fff` | `rgba(61, 113, 217, 0.40)` | `#3d71d9` |
| **Preparing / Warning** | `rgba(250, 178, 25, 0.15)` | `#fcd34d` | `rgba(250, 178, 25, 0.35)` | `#fab219` |
| **Urgent / Rejected / Closed** | `rgba(208, 59, 59, 0.15)` | `#ff7383` | `rgba(208, 59, 59, 0.35)` | `#d03b3b` |
| **Interested** | `rgba(144, 133, 233, 0.15)`| `#b4a9f8` | `rgba(144, 133, 233, 0.40)`| `#9085e9` |

---

## 3. Typography & Hierarchy
- **Font Stack**: `Inter`, `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace Stack**: `JetBrains Mono`, `ui-monospace`, `SFMono-Regular`, `Consolas`, monospace (used for dates, counts, GPA values, countdown timers, and table IDs).
- **Headings**:
  - Main Page Header: `text-xl font-bold text-[#e6e6f0]`
  - Panel Section: `text-sm font-semibold uppercase tracking-wider text-[#e6e6f0]`
  - Metric Big Number: `text-2xl font-bold font-mono text-[#e6e6f0]`
- **Body**: `text-xs text-[#ccccdc]` with line height 1.5.

---

## 4. Key Components & UI Patterns

### 1. Dashboard Shell & Collapsible Sidebar
- Sidebar is fixed on the left (240px expanded, 56px collapsed).
- Active navigation item has a `linear-gradient(#ff8833, #f55f3e)` 2px left vertical border, background `#22252b`, and text `#e6e6f0`.
- Top breadcrumb bar remains sticky with current page title and quick actions.

### 2. Segmented Variable Control Bar (`.g-var`)
Used in `/scholarships` and `/tracker` to simulate Grafana dashboard template variables:
- Compact select chips with subtle border `[rgba(204,204,220,0.15)]`.
- Search box with magnifying glass icon and clear button.
- Instant client-side or server query filter response.

### 3. Application Tracker: Kanban & List Modes
- **Kanban Mode**: Columns for `Interested`, `Preparing`, `Applied`, `Accepted`, `Rejected`. Each column features a colored indicator bar, item counter, deadline badges, task completion bar, and quick status advance dropdown.
- **List Mode**: Detailed view with checklist toggle, new task creation, and an expandable **Document & Essay Links Accordion** for Google Docs SOP links, CV drive links, and interview notes.

### 4. Master's Degree Eligibility Matrix Panel
Featured on scholarship detail pages:
- Minimum GPA requirement tile (`IPK ≥ 3.00 / 4.00`).
- English proficiency test criteria (IELTS, TOEFL iBT, PTE).
- Letter of Acceptance (LoA) policy badge (Mandatory unconditional / Optional).
- Age limit & work experience requirement.
- Coverage summary badge with funding breakdown.

### 5. Calendar Deadline Export
- Direct **Google Calendar** one-click URL generator (`getGoogleCalendarUrl`).
- Offline **iCalendar (.ics)** downloadable file generator (`generateIcsContent`) for Apple Calendar, Outlook, and mobile devices.

---

## 5. Technology Stack
- **Framework**: Next.js 15 (App Router, Server Components + Client Islands)
- **Styling**: Tailwind CSS v3 with Grafana palette tokens
- **Icons**: `lucide-react`
- **Database / ORM**: PostgreSQL (Neon Serverless) via Prisma ORM v6
- **Deployment**: Vercel (Edge CDN) + Docker Standalone Containerization
