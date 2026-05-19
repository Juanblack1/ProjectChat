# ProjectChat

ProjectChat is a WhatsApp-style chat app built with a Next.js client and Supabase for real email/password auth, contacts, Postgres message storage, and realtime updates.

## Public App

https://projectchat-demo.vercel.app

## Test Account

Use this account to try the public app:

```text
Email: projectchat.test@example.com
Password: ProjectChat@2026
```

The production deployment should run with `NEXT_PUBLIC_DEMO_MODE=false` and public Supabase environment variables. The older browser-only demo mode still exists as a local fallback, but the intended public flow is real Supabase login and chat between registered accounts.

## What Is Included

- Next.js client in `Client/`
- Supabase schema and RLS policies in `supabase/schema.sql`
- Real auth with Supabase email/password
- Automatic contacts from Supabase `profiles`
- Realtime message updates from Supabase `messages`
- Built-in `ProjectChat AI` contact powered by Google models
- Legacy Express/Socket.IO server in `Server/` kept for reference, not used by the Vercel public flow

## Supabase Setup

Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor before using the real chat flow.

Required client environment variables:

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
GOOGLE_GENERATIVE_AI_API_KEY=<google-generative-ai-api-key>
```

Only use the public Supabase anon key in the browser. Never commit or expose the Postgres password, connection string, JWT secret, service role key, Google API key, or any other server-side secret.

## AI Contact

`ProjectChat AI` appears as a pinned contact in the chat list. Messages to this contact stay local to the browser, while AI responses are generated through the server-side `/api/ai/chat` route.

AI stack:

- Frontend: React, Assistant UI adapter, and Tailwind CSS
- Backend: Node.js on Vercel Functions with Hono
- AI orchestration: Vercel AI SDK and Mastra Agent definition
- Models: Google Gemini text cascade and Google Gemini image cascade

Text model fallback order:

1. `gemini-2.5-flash`
2. `gemini-2.0-flash`
3. `gemini-1.5-flash`

Image model fallback order:

1. `gemini-2.5-flash-image`
2. `gemini-3.1-flash-image-preview`
3. `gemini-3-pro-image-preview`

## Run Locally

```bash
cd Client
npm ci
$env:NEXT_PUBLIC_DEMO_MODE="false"
$env:NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="<supabase-anon-key>"
$env:GOOGLE_GENERATIVE_AI_API_KEY="<google-generative-ai-api-key>"
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
GOOGLE_GENERATIVE_AI_API_KEY=<google-generative-ai-api-key>
```

Then deploy the `Client/` app. The project uses `Client/vercel.json` to force the Next.js preset and `npm ci`.

## Current Limitations

- Voice/video call buttons are still demonstrative.
- Image and audio attachments are stored as message bodies for this lightweight realtime build; production storage should move to Supabase Storage or another object store.
- AI chat history is stored locally per browser user; it is not currently shared across devices.
- The legacy `Server/` app is not part of the public Vercel deployment.

## Security Notes

- RLS is enabled for `profiles` and `messages` in `supabase/schema.sql`.
- Users can read profiles, but can only create/update their own profile.
- Users can read messages only when they are sender or receiver.
- Users can insert messages only as themselves.
- Do not commit `.env`, database URLs, service role keys, API tokens, or deployment bypass secrets.
- If an API key is pasted into chat or logs, rotate or restrict it immediately in the provider dashboard.
