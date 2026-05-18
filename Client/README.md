# ProjectChat Client

Next.js frontend for ProjectChat.

## Quick start

```bash
npm ci
$env:NEXT_PUBLIC_DEMO_MODE="false"
$env:NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="<supabase-anon-key>"
npm run dev
```

Open `http://localhost:3000`.

Before running the real chat flow, apply `../supabase/schema.sql` in the Supabase SQL Editor.

For the full project documentation, deployment notes, privacy rules, and backend setup, see `../README.md`.
