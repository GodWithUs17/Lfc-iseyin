# Living Faith Church Iseyin

This repository contains the current church website and backend for Living Faith Church, Iseyin. It is structured as a monorepo with a frontend client and a backend API, so the church site, admin tools, and data services can evolve independently while staying in one project.

## Current project state

- Frontend: React 19 + Vite + Tailwind CSS
- Backend: Node.js + Express + Prisma + PostgreSQL/Supabase
- Admin dashboard: password-protected internal admin screen for managing the site
- Content model: site config, live sermon data, events, ministries, and contact information
- API layer: auth, sermons, live service, events, and contact endpoints
- Deployment setup: frontend and API can run together locally with a single root command

## Tech stack

### Client
- React 19
- Vite 8
- Tailwind CSS 4
- Hash-based navigation for home and admin views

### Server
- Express 4
- Prisma ORM
- PostgreSQL-compatible database
- Supabase integration support
- JWT-based auth flow for admin access

## Repository structure

```bash
lfc-iseyin-react/
├── client/                     # React frontend
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express + Prisma backend
│   ├── src/
│   ├── prisma/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── ARCHITECTURE.md
├── README.md
├── package.json
└── package-lock.json
```

## Quick start

From the project root:

```bash
cd lfc-iseyin-react
npm install
npm run dev
```

This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

You can also run each side separately:

```bash
npm run dev:client
npm run dev:server
```

## Production build

```bash
npm run build
```

This builds the client app for production. The server is started separately with:

```bash
npm run start:server
```

## Backend environment setup

The server expects environment variables in `server/.env`.

```bash
cd server
cp .env.example .env
```

Then update the values for your database and app secrets. The current default setup includes:
- `PORT=5001`
- `CLIENT_URL=http://localhost:5173`
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Admin access

The app includes an admin view via hash routing:
- URL: `/#admin`
- Default password: `winners2026`

This is configured from the frontend site config and should be changed before production use.

## Key app areas

### Client app
- Main church landing page with sections for mission, services, ministries, sermons, events, giving, and contact
- Central site configuration in `client/src/config/site.js`
- Content-driven layouts powered by the site data context and local data files
- Admin dashboard with protected access

### API
The backend exposes routes under `/api` for:
- auth
- sermons
- live
- events
- contact

The main health check is available at:

```bash
http://localhost:5001/api/health
```

## Common commands

```bash
# run both frontend and backend together
npm run dev

# run only frontend
npm run dev:client

# run only backend
npm run dev:server

# build client only
npm run build

# start backend in production mode
npm run start:server
```

## Notes

- The frontend and backend are intentionally separated, but they are designed to work together during local development.
- The church website is configurable through the frontend site config and JSON-based content, making it easier to update information without touching the app structure.
- The backend is ready for PostgreSQL-backed persistence and Supabase integration for production deployments.

## Deployment

### Frontend
The client is a standard Vite app and can be deployed to:
- Vercel
- Netlify
- any static hosting provider

### Backend
The server is an Express app and is best suited for deployment on:
- Render
- Railway
- VPS/container hosting
- Docker-based environments

## Useful references

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [server/README.md](server/README.md)
- [client/src/config/site.js](client/src/config/site.js)
