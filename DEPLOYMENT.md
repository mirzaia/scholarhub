# ScholarHub Deployment Guide

This guide covers how to deploy the ScholarHub Next.js application to a production hosting environment so others can access it. We recommend using **Vercel** for hosting the application because it is the most reliable, widely-used, and affordable (free tier available) platform for Next.js apps.

Since ScholarHub uses a database (Prisma + SQLite by default for local development), you cannot use SQLite on a serverless platform like Vercel (as it requires a persistent filesystem). You will need to switch to a hosted PostgreSQL database.

## 🟢 Step 1: Set up a Hosted PostgreSQL Database

We recommend using one of these free, highly reliable database hosts:
1. **[Neon.tech](https://neon.tech/)** (Serverless Postgres - Highly recommended)
2. **[Supabase](https://supabase.com/)** (Postgres)

### Instructions for Neon:
1. Go to [Neon](https://neon.tech/) and sign up.
2. Create a new Project.
3. On the dashboard, find your **Connection String**. It looks like a Postgres URI with your Neon user, password, host, and database name (for example: `postgresql://<user>:<password>@<host>/<dbname>?sslmode=require`).
4. Copy this URL into a secret store or local `.env` — never commit real credentials.

## 🟢 Step 2: Update Your Code for Postgres

Locally, you need to change your Prisma schema to use PostgreSQL instead of SQLite so Vercel can connect to your new hosted database.

1. Open `prisma/schema.prisma`.
2. Change the `provider` in the `datasource` block from `"sqlite"` to `"postgresql"`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Open your `.env` file and update the `DATABASE_URL` with the one you got from Neon/Supabase (keep `.env` gitignored):
```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"
```

4. Run the following commands to initialize the new remote database and seed your data:
```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

*(Note: Don't forget to push these code changes to your GitHub repository!)*

## 🟢 Step 3: Deploy to Vercel

Vercel provides seamless integration with GitHub.

1. Go to **[Vercel](https://vercel.com/)** and sign up using your GitHub account.
2. Click **Add New** -> **Project**.
3. Import your `education-dashboard` GitHub repository.
4. **Important Configuration:**
   - Framework Preset: Vercel will auto-detect **Next.js**.
   - Build Command: Leave as default (`npm run build`).
   - Install Command: Leave as default (`npm install`).
   - **Environment Variables**: Add a new environment variable named `DATABASE_URL` and paste the connection string you got from Neon in Step 1.
5. Click **Deploy**.

## 🟢 Step 4: Add Post-install Script (Required for Prisma on Vercel)

To ensure Prisma generates the client during Vercel's build process, update your `package.json` file. Ensure your `postinstall` script looks like this:

```json
"scripts": {
  "dev": "next dev",
  "build": "prisma generate && prisma db push && next build",
  "start": "next start",
  "lint": "next lint",
  "postinstall": "prisma generate"
}
```

This tells Vercel to generate the Prisma Client and keep the database schema in sync automatically during deployments.

## Summary of Costs
- **Vercel**: $0 / month (Hobby tier includes plenty of bandwidth for typical sites).
- **Neon / Supabase**: $0 / month (Free tier includes enough storage for thousands of applications).

Your dashboard will now be live on a secure `https://your-project.vercel.app` URL and fully accessible to others online!
