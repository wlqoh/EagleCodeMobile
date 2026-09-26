# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project-specific overrides to AGENTS.md

- **Routes live in `app/` at the repo root, not `src/app/`.** All non-route code lives in `src/` and is imported via the `@/*` → `src/*` alias (tsconfig + jest `moduleNameMapper`).
- The project uses **npm** (`package-lock.json`), so use `npx`, not `bunx`.
- Expo SDK is **57** — versioned docs: https://docs.expo.dev/versions/v57.0.0/

## Commands

```bash
npm start                      # expo start
npm run typecheck              # tsc --noEmit
npm run lint                   # expo lint
npm test                       # jest (jest-expo preset)
npx jest src/core/__tests__/MockDataClient.test.ts   # single file
npx jest -t "persists a submitted application"       # single test by name
```

`jest.setup.ts` mocks AsyncStorage and `expo-secure-store` globally. Tests live in `__tests__/` next to the code; core logic is tested against `memoryStore()` from `src/core/storage.ts` rather than real storage.

## What this app is

EagleCode Sport — the **participant-only** mobile cabinet for a web app that lives in the sibling repo `../EagleCode` (React web + Django `backend/`). Landing page and admin panel stay on the web: an admin who logs in is redirected to `app/admin-only.tsx`. The UI language is Russian; code comments are mostly Russian too. The full design plan is `../EagleCode/MOBILE_APP_PLAN.md` (source comments that cite "docs/PLAN.md" refer to this file).

## Architecture

**Data layer (`src/core/`) is copied from the web app, not shared.** Files carry a `// Источник: EagleCode/...` header naming their web origin. When the API or types change, the same change must be made in `../EagleCode/src/types.ts` / `HttpDataClient.ts` and here (`src/core/types.ts` / `HttpDataClient.ts`), and both projects' tests run.

- `DataClient` is the single interface for all data access. Two implementations:
  - `MockDataClient` — full in-app fake backend. Persists a `MockDatabase` (seeded from `seed.ts`) as JSON in AsyncStorage under `eaglecode.mock.v1`. Demo logins: `athlete@eaglecode.ru` / `admin@eaglecode.ru`, password `demo123`.
  - `HttpDataClient` — Django REST client. JWT access/refresh tokens in `expo-secure-store` via `TokenStore`; on 401 it does a **single-flight** refresh (the backend rotates and blacklists refresh tokens, so concurrent refreshes must not happen), and on final failure calls `onAuthExpired`.
- Storage is abstracted behind `KeyValueStore` / `TokenStore` (`src/core/storage.ts`) so clients are testable without native modules.
- `src/services/client.ts` picks the implementation from `EXPO_PUBLIC_DATA_SOURCE` (`mock` default, or `api` with `EXPO_PUBLIC_API_BASE_URL`; see `.env.example` for emulator/device URLs) and exports the singleton `dataClient` plus `authEvents` (the auth-expired bus).
- `src/core/placeholders.ts` holds hardcoded demo numbers ported 1:1 from the web UI for parity. They are intentionally not derived from data; don't "fix" them to compute values unless asked.

**Server state** goes through TanStack Query. Read hooks are in `src/hooks/useData.ts` (query keys are plain resource names: `['athletes']`, `['athlete', id]`, …). Mutations are written inline in screens with `useMutation` and invalidate the matching keys. The `QueryClient` is created in `app/_layout.tsx` (`staleTime` 30s, `retry: 0`; no offline persistence by design).

**Auth** (`src/contexts/AuthContext.tsx`): the `SessionUser` is cached in AsyncStorage (`eaglecode.session.v1`). In api mode it is revalidated on startup via `getCurrentUser()`. `authEvents` or `logout` clears the session and the whole query cache.

**Navigation guards** are layout-level redirects, not middleware:
- `app/index.tsx` routes by auth state and role.
- `app/(auth)/_layout.tsx` bounces logged-in users to `/`.
- `app/(app)/_layout.tsx` requires a non-admin user and declares the stack screens (titles, modals) on top of `(app)/(tabs)` (Profile · Rating · Competitions · Map · More).
- `app/city-picker.tsx` is a root-level modal. It returns its selection through the tiny external store `src/state/cityPick.ts` (`useSyncExternalStore`), not through route params.

**Styling**: plain `StyleSheet` + tokens from `src/theme/tokens.ts` (`colors`, `space`, `radius`, `font`; ported from the web CSS variables), plus in-house primitives in `src/components/ui` (barrel `index.ts`). Don't use NativeWind or UI kits. Dark theme only; portrait phones only. Fonts (Inter / Geist / JetBrains Mono) load in the root layout via `src/theme/fonts.ts` before the splash hides. Charts and the Dagestan map are hand-drawn with `react-native-svg` (`src/components/features/`). Icons come from `lucide-react-native`.
