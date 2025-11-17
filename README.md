# TechLearn LMS - Frontend (React + Vite)

Minimal vertical slice to interact with the FastAPI backend using Supabase Auth.

## Quick start
1) cd lms_frontend
2) cp .env.example .env and set:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_KEY
   - VITE_API_BASE_URL (e.g., http://localhost:3001)
3) npm install
4) npm run dev

Pages:
- /login: Sign in with Supabase (email/password)
- /dashboard: Shows current user via backend /api/v1/auth/me
- /courses: Lists courses via backend /api/v1/courses
- /courses/new: Create a course (requires instructor/admin role and DB enabled)

Environment:
- No secrets are hardcoded; all config via .env
- Uses Authorization: Bearer <supabase_access_token> for API calls
