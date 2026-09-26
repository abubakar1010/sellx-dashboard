# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (runs on `0.0.0.0:8080`)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Preview production build:** `npm run preview`

## Architecture

This is a **React admin dashboard** for a marketplace platform. It is a Vite + React 18 SPA using Tailwind CSS for styling and Ant Design as the primary UI component library.

### State Management

- **Redux Toolkit** with **RTK Query** for API calls and caching
- `src/redux/baseApi/baseApi.js` — central RTK Query API definition; all feature APIs inject endpoints into this base. Base URL comes from `VITE_API_URL` env var (path: `/api/v1`). Auth token is auto-attached via `prepareHeaders`.
- `src/redux/features/` — each feature (auth, listings, categories, etc.) has its own API slice that injects endpoints into baseApi
- `src/redux/store.js` — Redux store with `redux-persist` persisting the auth slice (token + user) to localStorage
- Tag types for cache invalidation: `User`, `Categories`, `ComboBox`, `Boosting`, `Products`, `subscriptions`, `users`, `categories`, `listings`, `Stores`

### Routing & Auth

- `src/routes/routes.jsx` — all route definitions using `react-router-dom` v6 `createBrowserRouter`
- `src/routes/AdminRoutes.jsx` — route guard that checks `user.role === "superAdmin"` from Redux auth state; redirects to `/auth` if not admin
- Auth flow pages: SignIn → ForgetPassword → OTP → NewPassword (under `/auth/*`)

### Layout

- `src/layout/MainLayout.jsx` — dashboard shell with fixed Sidebar + Header, renders child routes via `<Outlet />`
- Sidebar collapses on mobile with overlay toggle

### Key Directories

- `src/page/` — page-level components (one folder per page)
- `src/component/Main/` — feature-specific UI components (Listings, Users, Categories, Subscriptions, etc.)
- `src/utils/` — shared utilities: `CustomButton`, `CustomInput`, `ActiveLinkwork`

### Notifications

- Uses `sonner` (Toaster) for toast notifications, positioned top-center
