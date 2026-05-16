# ProjectChat

ProjectChat is a WhatsApp-style chat UI built with Next.js, Firebase Auth on the client, and an Express + Socket.IO backend.

## Public demo

The public demo runs in safe demo mode on Vercel:

https://projectchat-demo.vercel.app

Demo mode uses mock contacts and browser-only messages stored in the visitor's own browser. It does not ask for Google login, does not connect to the Express backend, and does not store private user data on a server.

## What is included

- Next.js client in `Client/`
- Express API and Socket.IO server in `Server/`
- Prisma schema using SQLite for local development
- Firebase Auth support for the real login flow
- Vercel configuration for the safe public demo

## Repository structure

```text
ProjectChat/
  Client/   Next.js frontend
  Server/   Express, Socket.IO, Prisma backend
```

## Run the client locally

```bash
cd Client
npm ci
$env:NEXT_PUBLIC_DEMO_MODE="true"
npm run dev
```

Open `http://localhost:3000`.

On macOS/Linux, use:

```bash
NEXT_PUBLIC_DEMO_MODE=true npm run dev
```

## Run the backend locally

```bash
cd Server
npm install
npx prisma generate
npx prisma migrate dev
npm start
```

Create `Server/.env` locally:

```env
PORT=3005
DATABASE_URL="file:./dev.db"
```

Do not commit `.env` files.

## Client environment variables

For safe demo mode:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

For the real Firebase login flow:

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=http://localhost:3005
NEXT_PUBLIC_FIREBASE_API_KEY=<firebase-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<bucket>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<app-id>
```

Firebase web config values are public identifiers, but they should still be managed through environment variables so the app can switch environments safely.

## Deploy the public demo to Vercel

```bash
cd Client
npx vercel deploy --prod --yes --build-env NEXT_PUBLIC_DEMO_MODE=true --env NEXT_PUBLIC_DEMO_MODE=true
```

The project uses `Client/vercel.json` to force the Next.js preset and `npm ci`. Without this, Vercel may classify the app as `Other` and publish a 404 page.

## Privacy and production notes

- The Vercel demo uses mock data and persists demo messages only in the visitor's local browser storage.
- The backend currently uses local SQLite and local upload folders, which are not suitable for serverless production hosting.
- For a real public production chat, move the backend to a persistent runtime such as Cloud Run, Fly.io, Render, Railway, or a VM.
- Replace SQLite with a managed database such as Postgres.
- Move uploaded images/audio to object storage such as Firebase Storage, S3, or Vercel Blob.
- Configure CORS with the deployed frontend URL instead of `localhost`.
- Never commit `.env`, Firebase service accounts, database URLs, API tokens, or deployment bypass secrets.

## Current limitations

- The Vercel link is a safe frontend demo, not a full multi-user real-time backend deployment.
- Demo messages, image attachments, and audio messages are local to each browser.
- Calls require the real-time backend/WebRTC path before production use.
