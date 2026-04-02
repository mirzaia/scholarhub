# ScholarHub Design System & UI Blueprint

## 1. Design Philosophy
ScholarHub is designed to be a clean, professional, and highly readable platform for searching and tracking scholarships. It follows the visual aesthetic of the NVQA dashboard, prioritizing white space, clear typography, and subtle modern accents.

- **Theme**: Light Mode / Slate-based.
- **Aesthetic**: Minimalist "Dashboard" look, using high-quality vector iconography and subtle shadows.
- **Guiding Principles**: Clarity, consistency, and a premium educational feel.

---

## 2. Color Palette
Colors are managed through Tailwind CSS utility classes and CSS variables in `globals.css`.

| Token | Color | Usage |
|-------|-------|-------|
| Background | `slate-50` (#f8fafc) | Main page background |
| Foreground | `slate-900` (#0f172a) | Primary text and headings |
| Primary Accent | `indigo-500` / `indigo-600` | Branding, main icons, primary buttons |
| Border | `slate-200` | Card borders and divider lines |
| Secondary Text | `slate-500` / `slate-400` | Descriptions and secondary info |
| Navbar BG | `slate-900` | Top navigation bar |

---

## 3. Typography
- **Font Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Headings**: `font-bold text-slate-900` (Title: 2xl, Section: lg, Card: base)
- **Body**: `text-sm text-slate-600` for primary content, `text-xs` for metadata.

---

## 4. Components & UI Patterns

### Page Layout
Standard outer container for all pages:
```jsx
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Header */}
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
      <Icon className="w-7 h-7 text-indigo-500" />
      Page Title
    </h1>
    <p className="text-slate-500 mt-1 text-sm">Description text goes here</p>
  </div>
  {/* Content */}
</main>
```

### Cards
Used for listing scholarships, universities, and detail sections.
- **Style**: `bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all`

### Badges
Pill-shaped status indicators with semantic coloring.
- **Status Open**: `bg-emerald-100 text-emerald-700`
- **Status Closed**: `bg-red-100 text-red-700`
- **Status Upcoming**: `bg-blue-100 text-blue-700`
- **Generic/Pill**: `bg-slate-100 text-slate-600` / `bg-indigo-50 text-indigo-600`

### Buttons
- **Primary**: `bg-indigo-600 hover:bg-indigo-700 text-white`
- **Secondary**: `bg-white border border-slate-200 text-slate-700 hover:bg-slate-50`
- **Shape**: `rounded-lg font-medium shadow-sm transition-colors`

---

## 5. Iconography
All icons are imported from **`lucide-react`**.
- Standard icon size for details/metadata: `w-4 h-4` or `w-3.5 h-3.5`.
- Standard header icon size: `w-7 h-7`.
- Primary icons should use `text-indigo-500`.

---

## 6. Technology Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Utility-first, zero custom CSS beyond base)
- **Icons**: Lucide React
- **ORM**: Prisma (PostgreSQL)
