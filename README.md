# ProjectChat

ProjectChat is a WhatsApp-style chat app built with a Next.js client and Supabase for real email/password auth, contacts, Postgres message storage, and realtime updates.

## Public App

https://projectchat-demo.vercel.app

The production deployment should run with `NEXT_PUBLIC_DEMO_MODE=false` and public Supabase environment variables. The older browser-only demo mode still exists as a local fallback, but the intended public flow is real Supabase login and chat between registered accounts.

## What Is Included

- Next.js client in `Client/`
- Supabase schema and RLS policies in `supabase/schema.sql`
- Real auth with Supabase email/password
- Automatic contacts from Supabase `profiles`
- Realtime message updates from Supabase `messages`
- Legacy Express/Socket.IO server in `Server/` kept for reference, not used by the Vercel public flow

## Supabase Setup

Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor before using the real chat flow.

Required client environment variables:

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

Only use the public Supabase anon key in the browser. Never commit or expose the Postgres password, connection string, JWT secret, or service role key.

## Run Locally

```bash
cd Client
npm ci
$env:NEXT_PUBLIC_DEMO_MODE="false"
$env:NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="<supabase-anon-key>"
npm run dev
```

Open `http://localhost:3000`.

On macOS/Linux, use inline envs or a local `.env.local` file.

## Deploy To Vercel

Set these Vercel environment variables for production:

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

Then deploy the `Client/` app. The project uses `Client/vercel.json` to force the Next.js preset and `npm ci`.

## Current Limitations

- Voice/video call buttons are still demonstrative.
- Image and audio attachments are stored as message bodies for this lightweight realtime build; production storage should move to Supabase Storage or another object store.
- The legacy `Server/` app is not part of the public Vercel deployment.

## Security Notes

- RLS is enabled for `profiles` and `messages` in `supabase/schema.sql`.
- Users can read profiles, but can only create/update their own profile.
- Users can read messages only when they are sender or receiver.
- Users can insert messages only as themselves.
- Do not commit `.env`, database URLs, service role keys, API tokens, or deployment bypass secrets.
