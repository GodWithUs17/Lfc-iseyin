# Backend (Node.js + Express + Prisma + Supabase)

Quick start

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `SUPABASE_URL`, and `SUPABASE_KEY`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Initialize Prisma and run migrations:

```bash
npx prisma generate
# Edit schema.prisma if needed, then:
npx prisma migrate dev --name init
```

4. Run the dev server:

```bash
npm run dev
```

Notes

- This scaffold uses Prisma to manage a PostgreSQL database. You can use
  Supabase as the hosted Postgres (set `DATABASE_URL` to the Supabase DB URL),
  or point `DATABASE_URL` to any Postgres instance.
- The server will not call `npm install` or run migrations automatically; allow
  the agent to perform those steps when you confirm.

Deployment
----------

Render (recommended for Express apps)

- Create a new Web Service on Render and connect your repo.
- Set the `Build Command` to `npm ci` and the `Start Command` to `npm start`.
- Add environment variables in the Render dashboard:
  - `DATABASE_URL` — use the Supabase Postgres connection string (Project Settings → Database → Connection String).
  - `SUPABASE_URL` and `SUPABASE_KEY` — for Supabase client features.
  - `PORT` is optional; Render provides one automatically.

Docker (portable)

- This repo includes a `Dockerfile` in the `backend/` folder. To build and run locally:

```bash
cd backend
docker build -t lfc-backend .
docker run -e DATABASE_URL="$DATABASE_URL" -e SUPABASE_URL="$SUPABASE_URL" -e SUPABASE_KEY="$SUPABASE_KEY" -p 4000:4000 lfc-backend
```

Vercel

- Vercel prefers Serverless Functions. To deploy the Express app to Vercel you can either:
  - Convert endpoints to Vercel Serverless functions under an `api/` directory, or
  - Deploy a containerized app using a Dockerfile via another provider (Render is simpler for full Express apps).

Environment variables
---------------------

- `DATABASE_URL` — use the Supabase session pooler connection string for the app runtime.
- `DIRECT_URL` — use the direct Postgres connection string for Prisma migrations and introspection.
- `SUPABASE_URL` and `SUPABASE_KEY` — required if you use Supabase client features in the app.

Recommended flow
----------------

1. In Supabase: copy the Postgres `Session Pooler` connection string for `DATABASE_URL` and keep the `Direct` connection string as `DIRECT_URL`.
2. On your machine: run `npx prisma generate` then `npx prisma migrate dev --name init` to create the DB tables locally (or run migrations on Render using `npx prisma migrate deploy`).
3. Run `npm run seed` to insert sample data.

