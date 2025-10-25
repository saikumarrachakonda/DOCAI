# IDVision AI

Full-stack example app: React (Vite + TS) frontend + Node/Express backend + PostgreSQL + Claude 3 integration.

Quick setup

1. Backend

 - cd backend
 - copy `.env.example` to `.env` and fill `ANTHROPIC_API_KEY` and Postgres credentials if different
 - npm install
 - Create DB table: `psql -U postgres -d postgres -f create_table.sql`
 - npm run dev (or `npm start`)

2. Frontend

 - cd frontend
 - npm install
 - npm run dev

The frontend dev server proxies `/api` to `http://localhost:5000` (see `vite.config.ts`).

Notes

- The backend saves uploaded files to `/backend/uploads` temporarily.
- Claude 3 key should be stored in `ANTHROPIC_API_KEY`.
- The backend attempts to parse a JSON blob from the Claude response. Depending on API changes you may need to adapt parsing.
