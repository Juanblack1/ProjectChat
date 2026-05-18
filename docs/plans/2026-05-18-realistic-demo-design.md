# Realistic Public Demo Design

## Goal

Make the Vercel demo feel like the real ProjectChat product while keeping it safe for public access. The demo must avoid real backend, Firebase login, private credentials, and server-side persistence.

## Chosen Direction

Use a WhatsApp Web-like realistic experience. The demo should feel populated, interactive, and production-shaped instead of obviously mocked.

## Scope

- Upgrade login into a credible product entry screen with demo safety notes.
- Add richer demo contacts and conversation histories.
- Show realistic list metadata: latest message, time, unread badge, pinned and muted states.
- Improve empty state into a real ProjectChat Web landing panel.
- Polish chat header, message container, bubbles, footer input, search, menus, and profile modal.
- Add deeper demo-only state such as online status, labels, unread counts, and contact filtering.
- Keep all demo data in browser localStorage only.

## Non-Goals

- Do not connect the demo to the Express backend.
- Do not enable real Firebase/Google login in the public demo.
- Do not introduce real multi-user realtime behavior.
- Do not store visitor data on a server.

## Verification

- Run `NEXT_PUBLIC_DEMO_MODE=true npm run build`.
- QA locally with Playwright for login, profile, contacts, messages, reset, logout, and console errors.
- Deploy to Vercel production with `NEXT_PUBLIC_DEMO_MODE=true`.
- QA `https://projectchat-demo.vercel.app` after deploy.
