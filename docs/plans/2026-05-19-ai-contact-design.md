# ProjectChat AI Contact Design

## Goal

Add a built-in AI contact that behaves like a person in the existing chat UI. Users can open `ProjectChat AI`, send messages, receive text answers, and request generated images.

## Architecture

- Keep Supabase for real user auth, contacts, and human-to-human messages.
- Add one local virtual contact, `ProjectChat AI`, in the contact list.
- Store AI conversation history in browser `localStorage` per signed-in user.
- Route AI requests through a server-side Vercel function at `/api/ai/chat`.
- Use Hono on the API route, Vercel AI SDK for Google model calls, and a Mastra Agent definition for assistant identity/instructions.
- Keep the Google API key only in `GOOGLE_GENERATIVE_AI_API_KEY`; never expose it to the browser or commit it.

## Model Fallback

Text requests try Google models in order:

1. `gemini-2.5-flash`
2. `gemini-2.0-flash`
3. `gemini-1.5-flash`

Image requests try Google image models in order:

1. `gemini-2.5-flash-image`
2. `gemini-3.1-flash-image-preview`
3. `gemini-3-pro-image-preview`

If all models fail, the endpoint returns a generic localized error without leaking provider details.

## UI Flow

- `ProjectChat AI` appears at the top of the chat list.
- Selecting it loads the local AI thread.
- Sending a text message appends the user bubble immediately.
- The frontend calls `/api/ai/chat` with recent AI-thread context.
- The response is appended as either a text bubble or image bubble.

## Security

- API key stays server-side.
- README uses placeholders only.
- The key that was pasted in chat should be rotated or restricted in Google Cloud because it has been exposed in conversation history.

## Verification

- Run `npm run lint`.
- Run `npm run build`.
- Validate `/login` and the AI contact in the deployed app.
