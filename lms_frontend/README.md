# TechLearn LMS Frontend

Production-ready React shell following the "Ocean Professional" minimalist theme with role-based routing and basic auth flow.

## Stack
- React 18 (CRA)
- react-router-dom v6
- Axios client with interceptors
- Context-based Auth with JWT storage (localStorage)
- Minimal design system (Button, Input, Card, Sidebar/Topbar)
- ESLint + Prettier
- Testing Library + Jest

## Structure
- src/app (n/a)
- src/components (layouts, ui)
- src/pages (public + role dashboards)
- src/routes (router + ProtectedRoute)
- src/styles (theme.css)
- src/hooks (useApi, useRequestId)
- src/services (apiClient, authService, coursesService)
- src/utils (sanitize)

## Getting Started
1. Copy env file:
   cp .env.example .env
   Update REACT_APP_API_BASE_URL as needed (default http://localhost:3001).

2. Install dependencies:
   npm install

3. Run dev server:
   npm start
   App runs at http://localhost:3000

4. Run tests:
   npm test

5. Build:
   npm run build

## Environment
- REACT_APP_API_BASE_URL: Backend base URL (FastAPI default http://localhost:3001)
- REACT_APP_ENABLE_MOCKS: When true, uses mock auth for UI flow
- REACT_APP_APP_NAME: Application display name

## Auth
- Simple mock login/signup persists token and user { email, role } to localStorage
- Protected routes redirect to /login if unauthenticated
- TODO: Integrate real backend endpoints for /auth/login, /auth/signup, /auth/me

## Security
- No secrets committed
- Inputs sanitized client-side (basic) to reduce XSS vectors
- Sensitive data (passwords/tokens) not logged

## Acceptance
- Navigate to /login or /signup to authenticate with a role (admin/instructor/student)
- After login, role dashboard renders under /admin, /instructor, or /student
- Courses pages show placeholder data from services

