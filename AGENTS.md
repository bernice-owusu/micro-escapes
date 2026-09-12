# AGENTS.md

Micro Escapes — React 19 SPA (Vite + Tailwind v4 + PWA) with a minimal Express backend (TypeScript, run via `tsx`). An AI Studio / Gemini app.

## Commands

- `npm run dev` — single process: Express server + Vite middleware on `http://0.0.0.0:3000`. No separate Vite dev server.
- `npm run build` — `vite build` + bundle `server.ts` to `dist/server.cjs`; `npm start` runs the production server (`node dist/server.cjs`).
- `npm run lint` — **typecheck only** (`tsc --noEmit`). There is no style linter and no test suite. Run this before finishing changes.
- `npm run preview` — `vite preview` (SPA only, no API).
- No `.env.local` exists. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`. The app also runs without it (heuristic fallbacks).

## Architecture

- **No database and no server-side state.** All content is hardcoded data in `src/data/` (`curatedEscapes.ts`, `curatedEvents.ts`, `loyaltyData.ts`), typed by `src/types.ts`. The `Experience` shape is rich — updates must keep every field populated.
- **App state lives in `src/App.tsx`** via local state + prop drilling. No router, no state library, no API client.
- **Server (`server.ts`) is thin:** `GET /api/health`, `POST /api/ai/parse-intent`, `POST /api/ai/build-my-day`. AI endpoints call gemini-2.5-flash but degrade to `src`-side heuristic parsers when `GEMINI_API_KEY` is missing or a call fails — keep fallbacks working.
- **Recommendation logic** is in `src/utils/recommendationEngine.ts` (weighted scoring over `Experience` fields).

## Gotchas

- **The `@/*` path alias is broken** — it resolves to the repo root, not `src/`, and is never used. Use relative imports like all existing code (`../types`, `./data/...`).
- Tailwind v4 via `@tailwindcss/vite` (so `index.css` has `@import "tailwindcss"`, no `tailwind.config`). Fonts: Outfit (headings) / Plus Jakarta Sans (body).
- `vite.config.ts` honors `DISABLE_HMR` (disables HMR + file watching to avoid flicker during agent edits in AI Studio). Don't remove it.
- Server listens on `PORT = 3000` (not `process.env.PORT`).