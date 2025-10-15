# Mamadgram Frontend

Modern React app with a clean, feature-first architecture. Built with Vite, React 19, TypeScript, Tailwind CSS 4, React Query, and Redux Toolkit.

## Architecture Overview

```
src/
  app/                 # app shell (TODO: future) — router, providers, error boundary
  shared/              # reusable primitives/utilities across features
    api/               # http client and error mapping
      http.ts
    config/            # environment accessors
      env.ts
    lib/               # generic utilities (e.g., phone normalization)
      phone.ts
    ui/                # UI primitives (Button, TextInput, DataTable, FormError)
      Button.tsx
      TextInput.tsx
      DataTable.tsx
      FormError.tsx
  features/
    auth/
      api/            # request functions per auth
        (in api.ts)
      ui/             # screens: Login, Mobile, Otp, Signup
        LoginPage.tsx
        MobilePage.tsx
        OtpPage.tsx
        SignupPage.tsx
      routes.tsx       # exported auth route objects
      RequireAuth.tsx  # route guard component
    dashboard/
      ui/             # screens and layout for dashboard
        DashboardLayout.tsx
        DashboardOverviewPage.tsx
        DashboardUsersPage.tsx
        DashboardOrdersPage.tsx
      routes.tsx       # exported dashboard route objects
  store/               # Redux Toolkit store
    index.ts
    hooks.ts
    slices/
      uiSlice.ts
      sessionSlice.ts
  App.tsx              # incorporates feature routes with lazy loading
  main.tsx             # providers (Redux + React Query) and app mount
  index.css            # Tailwind and global styles
```

Key principles:
- Organize by feature, not by file type.
- Separate concerns: UI (React) vs. data (http/api) vs. domain (types/logic).
- Reuse primitives from `shared/ui` and utilities from `shared/lib`.
- Normalize errors and environment access centrally.

## Implemented Changes

- Shared config and HTTP gateway
  - `shared/config/env.ts`: single source of truth for `VITE_API_BASE_URL` and mode
  - `shared/api/http.ts`: `httpJson`, `getErrorInfo`, `getErrorMessage`

- Auth feature
  - `features/auth/api.ts`: `sendCode`, `verifyCode`, `signup`
  - `features/auth/RequireAuth.tsx`: guard for protected routes
  - `features/auth/ui/*`: Login, Mobile, Otp, Signup pages
  - `features/auth/routes.tsx`: route objects for auth paths

- Dashboard feature
  - `features/dashboard/ui/*`: `DashboardLayout` + overview/users/orders pages
  - `features/dashboard/routes.tsx`: protected dashboard route tree

- State management
  - `store/slices/sessionSlice.ts`: token/mobile session state
  - `store/slices/uiSlice.ts`: theme and global message

- Routing
  - `App.tsx`: lazy-loads and composes routes from features

- UI primitives and utilities
  - Moved to `shared/ui` and `shared/lib` and updated all imports

- Cleanup
  - Removed legacy `src/pages`, `src/components`, `src/services`, `src/layouts`, and old `src/lib`

## Environment

- `VITE_API_BASE_URL` — e.g. `http://localhost:8000/api/v1/admin`
- Fallback base URL is present for development convenience.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Conventions

- Server state: React Query; App state: Redux Toolkit.
- Feature routes are defined in each feature and imported in `App.tsx`.
- Keep DTOs and mapping inside feature `api/`; surface typed data to UI.
- `RequireAuth` checks session token; extend with real auth storage/refresh if needed.

## Next Steps (Optional)

- Add `app/` shell: error boundary, Suspense fallback, provider composition.
- Persist session (e.g., localStorage or cookies) and implement logout.
- Add `features/*/model` and `features/*/hooks` for richer domain boundaries.
- Centralize query keys and add MSW for API testing.

