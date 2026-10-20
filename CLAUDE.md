# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

`my-expense-app` is a mobile-first Expo (React Native) app for tracking personal expenses. It targets iOS, Android, and web from one codebase.

Current state: this is early-stage. The project is still the Expo starter template plus a working auth gate. The setup screen asks the user to paste a personal API key, which is stored on the device. There are no expense screens, data models, or backend calls yet. The intended backend is a Payload CMS instance that will hold the user's expense data.

Expect new work to add expense entry and listing screens, and API calls to Payload authenticated with the stored key.

## Behavior Guidelines

- Always present your plan and wait for confirmation before making any changes.
- Before starting any task that touches more than one file, summarize your plan in bullet points and wait for confirmation.
- Use TypeScript's strict mode conventions throughout. No `any` types without a comment explaining why.
- When adding new functions, include a JSDoc comment with param types and return type.
- Add unit tests for every new function and integration tests for every new component. Put all tests under the root `__tests__/` folder, mirroring the `src/` path and named `[filename].test.ts` or `[filename].test.tsx` (e.g. `src/auth/payload.ts` → `__tests__/auth/payload.test.ts`, `src/app/setup.tsx` → `__tests__/app/setup.test.tsx`). Don't colocate tests under `src/app/`, since Expo Router treats every file there as a route.
- Keep responses short. No preamble. Get to the output.
- If a task is ambiguous, ask one clarifying question — not five.

## Hard Rules

- Never modify anything in /src/auth/ without explicit confirmation. Auth changes require a separate review step.
- Don't install new npm packages without asking first. List what you'd install and why, then wait.
<!-- - Never write inline styles. All styling goes through the design system tokens in /src/styles/tokens.ts. -->
- Don't delete files. Mark them as deprecated with a comment instead, and flag them for manual removal.

## Commands

Package manager is pnpm (`pnpm-lock.yaml`). Scripts are thin wrappers around `expo`.

- `pnpm start` — Expo dev server; press `a`, `i`, or `w` in the terminal to open a target.
- `pnpm android` / `pnpm ios` / `pnpm web` — start with a specific target.
- Type check: `pnpm exec tsc --noEmit` (currently passes clean). This is the only verification tool that works today.
- `pnpm lint` does not work yet: there is no ESLint config and no ESLint dependency, so `expo lint` will prompt for setup.
- `pnpm test` runs Jest (`jest-expo` preset). Single file: `pnpm test -- path/to/file.test.ts`. Pattern: `pnpm test -- -t "name"`.
- `pnpm reset-project` moves the starter code out of `src/app`. Don't run it unless the user asks.

## Architecture

**Routing.** expo-router with file-based routes under `src/app`. `package.json` sets `main` to `expo-router/entry`. `app.json` enables `typedRoutes` and `reactCompiler`. `src/app/index.tsx` and `src/app/explore.tsx` are still starter-template screens.

**Auth gate (the core flow).** `src/app/_layout.tsx` reads the SecureStore key `payload_api_key` once, on mount:

- No key: renders `<Slot />` and redirects to `/setup` (`src/app/setup.tsx`), which saves the key to SecureStore.
- Key present: renders `<AppTabs />` (`src/components/app-tabs.tsx`, a `NativeTabs` with `index` and `explore`) and redirects away from `/setup`.
- Setup verifies the key with `verifyApiKey()` (`src/auth/payload.ts`) before saving it. On success it calls `useApiKeySaved()` (`src/auth/api-key-context.tsx`), which the layout provides to set `hasKey` immediately, so no restart is needed.
- The verify endpoint (`/api/verify-user`) is a placeholder until the Payload route exists.

**Backend.** The backend is Payload CMS. The app reads `EXPO_PUBLIC_BACKEND_URL` from `.env`; Expo only exposes `EXPO_PUBLIC_*` variables to client code. Currently only `verifyApiKey()` calls it, and the app has no other API calls.

**Theming and platform split.**

- Design tokens live in `src/constants/theme.ts` (`Colors`, `Spacing`, `MaxContentWidth`, `BottomTabInset`).
- Use `useTheme()` from `src/hooks/use-theme.ts` and the `ThemedText` / `ThemedView` components rather than hardcoded colors.
- Platform-specific code uses `.web.ts` / `.web.tsx` siblings (e.g. `use-color-scheme`, `app-tabs`, `animated-icon`). Metro picks the right file per platform.

**Path aliases.** `@/*` maps to `src/*` and `@/assets/*` maps to `assets/*` (see `tsconfig.json`).
