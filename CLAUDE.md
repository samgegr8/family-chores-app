# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (static export to /out)
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Stack:** Next.js 15 (App Router, static export), React 19, TypeScript, Tailwind CSS v4, Firebase Firestore, deployed on Vercel.

`output: "export"` in `next.config.mjs` means this builds to static HTML/JS — no server-side rendering, no API routes.

### Data flow

All state lives in `src/lib/store.ts` via a single `useStore` hook. On mount it reads a **family code** from `localStorage`, then opens two Firestore `onSnapshot` listeners (`/families/{code}/members` and `/families/{code}/chores`) that keep local React state in sync in real time. Write operations (add/update/delete) go directly to Firestore — there is no optimistic local update. The store is exposed app-wide through a context provider (`src/lib/context.tsx`).

### Family code gate

`src/components/FamilyCodeGate.tsx` wraps all page content in `layout.tsx`. If no family code is stored in `localStorage`, it renders a code-entry screen instead of the page. All devices sharing the same code share the same Firestore subcollection — this is the only "auth" mechanism.

### Key data shapes (`src/lib/types.ts`)

- `FamilyMember` — `{ id, name, color, avatar }`
- `Chore` — `{ id, title, assignedTo (member id), date (YYYY-MM-DD), time? (HH:MM), completed, recurring? }`

Completed chores older than 30 days are dropped on load to keep storage lean.

## Environment variables

Required — set in `.env.local` for local dev and in Vercel project settings for production:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

## Firestore rules

The database is in **test mode** (open read/write). All paths follow the pattern `/families/{familyCode}/members/{id}` and `/families/{familyCode}/chores/{id}`.

## ESLint

`react-hooks/set-state-in-effect` is disabled in `eslint.config.mjs` — the localStorage hydration pattern in `store.ts` is intentional.

## Mobile

The navbar renders a **bottom tab bar on mobile** (`sm:hidden`) and a **top bar on desktop** (`hidden sm:block`). All pages add `pb-28 sm:pb-0` to avoid content sitting behind the tab bar. Inputs use `font-size: 16px` globally (in `globals.css`) to prevent iOS auto-zoom.
