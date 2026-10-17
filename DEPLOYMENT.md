# ScholarHub Deployment Guide: Vercel vs. Docker

This document provides a comparative analysis and actionable deployment guides for **ScholarHub**, addressing whether to maintain Vercel deployment or containerize with Docker.

---

## 1. Architectural Verdict: Vercel vs. Docker

### Comparative Analysis Matrix

| Criterion | Vercel (Current Serverless) | Docker Container (Self-Hosted / Cloud Run) |
| :--- | :--- | :--- |
| **Operational Overhead** | **Zero Ops**: Fully managed CI/CD, automatic SSL, preview environments for pull requests. | **Medium to High**: Requires managing a VPS/cluster, reverse proxy (Nginx/Caddy), SSL cert renewals (Certbot), container updates, and OS security patches. |
| **Cost** | **Free tier / $20/mo Pro**: Inexpensive for personal/MVP use. Serverless database (Neon) stays asleep when idle. | **$5 - $15/mo** for a basic VPS (Hetzner, DigitalOcean) or pay-per-request on Google Cloud Run / AWS ECS. |
| **Performance & Cold Starts** | Slight cold starts on rarely accessed dynamic API routes (mitigated by Next.js Server Components and edge caching). | Constant warm server, 0ms container cold starts on long-running instances. |
| **Database Connection** | Connects to Neon PostgreSQL via connection pooler (`DATABASE_URL`). Connection limits are handled automatically. | Can connect to Neon remote or run an isolated PostgreSQL container via `docker-compose.yml`. |
| **Portability & Vendor Lock-in** | Next.js features are tightly optimized for Vercel, but standalone mode removes lock-in. | **100% Portable**: Can run identically on any Linux server, Kubernetes, GCP Cloud Run, AWS ECS, Fly.io, or offline laptop. |

### Final Recommendation

> [!TIP]
> **Keep Vercel as your primary production deployment** and use **Docker for local development, staging, or self-hosted disaster recovery.**
> 
> Moving away completely from Vercel to a raw Docker container for this application is **overkill** if your goal is low maintenance and personal tracking. Next.js App Router and Neon Postgres are purpose-built for Vercel's serverless pipeline. However, with `output: "standalone"` enabled and our multi-stage `Dockerfile`, ScholarHub is now **100% cloud-portable**—you are never locked into Vercel and can migrate to a $5 VPS or GCP Cloud Run in minutes.

---

## 2. Option A: Production Deployment on Vercel (Recommended)

ScholarHub is pre-configured for instant zero-configuration deployment on Vercel.

### 1. Prerequisites
- A GitHub repository containing the ScholarHub codebase.
- A Neon PostgreSQL serverless database.

### 2. Configure Environment Variables in Vercel
In the Vercel Project Dashboard (`Settings > Environment Variables`), add:

```env
DATABASE_URL="postgresql://<user>:<password>@<neon-host>/scholarhub?sslmode=require"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

> [!IMPORTANT]
> When using Neon Postgres with Prisma, do **not** append `&channel_binding=require` to `DATABASE_URL`, as Node.js OpenSSL / Prisma engine does not support SCRAM channel binding and will trigger a connection error (`P1001`). Keep `sslmode=require`.

### 3. Build & Output Settings
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build` (or leave default `npm run build` as configured in `package.json`).
- **Install Command**: `npm ci`
- **Output Directory**: `.next`

---

## 3. Option B: Docker Container Deployment

ScholarHub includes an optimized, multi-stage `Dockerfile` and a `docker-compose.yml` for running the app standalone.

### 1. Multi-Stage Docker Build
The provided `Dockerfile` leverages Next.js `output: 'standalone'`:
- Strips unused dev dependencies.
- Embeds only the minimal Node runtime and required production modules.
- Compresses image size to under ~150MB.
- Runs as a non-privileged user (`nextjs:nodejs`, UID 1001) for container security.

### 2. Running with Docker Compose (With Local Postgres)

To launch ScholarHub along with a local PostgreSQL 16 database without any external cloud dependencies:

```bash
# 1. Start the services in detached mode
docker compose up -d

# 2. Apply database migrations to the local postgres container
docker compose exec app npx prisma db push

# 3. Seed realistic 2026 Indonesian scholarship and university data
docker compose exec app npx prisma db seed

# 4. Open in your browser
open http://localhost:3000
```

### 3. Running with Remote Database (Neon Postgres)

If you wish to run only the application container connected to your remote Neon PostgreSQL database:

```bash
# Build the standalone container
docker build -t scholarhub:latest .

# Run container with remote DATABASE_URL
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://<user>:<password>@<neon-host>/scholarhub?sslmode=require" \
  -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  --name scholarhub-instance \
  scholarhub:latest
```

---

## 4. Database Migrations & Seeding in Production

Whenever database schema changes are made:

- **Push Schema changes to Neon**:
  ```bash
  npx prisma db push
  ```
- **Re-generate Prisma Client**:
  ```bash
  npx prisma generate
  ```
- **Re-seed data (optional)**:
  ```bash
  npx prisma db seed
  ```
