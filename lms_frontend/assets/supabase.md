# Supabase Integration (Frontend)

This frontend uses Supabase for authentication via email/password. No secrets are hardcoded; configuration is read from environment variables.

Environment variables (must be provided by orchestrator in `.env`):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_SITE_URL (optional; used as emailRedirectTo for sign-up email confirmations; falls back to window.location.origin)
- REACT_APP_API_BASE or REACT_APP_API_BASE_URL (for backend API base)
- REACT_APP_BACKEND_URL (optional fallback)

Client creation:
- src/core/clients/supabaseClient.js uses `createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY)` and enables session persistence.
- AuthContext (src/core/auth/AuthContext.jsx) initializes from `supabase.auth.getSession()`, subscribes to `onAuthStateChange`, and exposes:
  - signIn(email, password)
  - signOut()
  - signUp(email, password, emailRedirectTo?)

Email/password sign-in:
```js
import { getSupabaseClient } from '../core/clients/supabaseClient';

const supabase = getSupabaseClient();
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) throw error;
// data.user and data.session available; AuthContext also updates via onAuthStateChange
```

Sign up (email confirmation flow):
```js
const supabase = getSupabaseClient();
const emailRedirectTo = process.env.REACT_APP_SITE_URL || window.location.origin;
await supabase.auth.signUp({
  email,
  password,
  options: { emailRedirectTo }
});
```

Configuration in Supabase Dashboard:
- Go to Auth -> URL Configuration
  - Set "Site URL" to your deployed frontend (e.g., https://app.example.com)
  - Add any additional "Redirect URLs" used in development or staging

Security Notes:
- Do not log tokens or PII.
- Ensure the site is served over HTTPS in production.
- Configure allowed redirect URLs in Supabase project settings.
- Ensure REACT_APP_SUPABASE_KEY is the public anon key (not service role).
- The app emits console.warn if REACT_APP_SITE_URL is not defined; it will fallback to window.location.origin for email redirects on sign-up confirmation.

Role Handling (Frontend-only persistence for now):
- The Login page includes a required Role selector (Admin, Instructor, Student).
- The selected role is stored in localStorage under 'techlearn.role' and can be read by the app (e.g., to conditionally navigate to '/admin' when the feature flag REACT_APP_FEATURE_FLAGS includes 'roleBasedRedirect').
- No secrets are altered and no sensitive data is stored; once roles are available in Supabase (e.g., as JWT claims in app_metadata), update client guards to read role from user/app_metadata instead of localStorage.

---

## Courses Table (Expected Schema) and RLS

To enable the Admin UI's course creation form, create the following table in your Supabase project.

Suggested SQL:

```sql
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  category text,
  level text,
  price numeric,
  is_free boolean default false,
  description text,
  thumbnail_url text,
  status text default 'draft' check (status in ('draft','published')),
  created_at timestamp with time zone default now(),
  created_by uuid references auth.users (id)
);

-- Enable RLS
alter table public.courses enable row level security;

-- Example policy: allow admins to insert
-- Replace the role-check with your actual approach once you set up roles.
-- For example, if you store role in auth.jwt() claims:
--   (auth.jwt() ->> 'role') = 'admin'
create policy "allow_admin_insert"
on public.courses
for insert
with check (
  -- TODO: update to your real admin role condition
  (auth.jwt() ->> 'role') = 'admin'
);
```

How to run this SQL:
1) Open Supabase Dashboard -> SQL Editor.
2) Paste the SQL and Run.
3) Verify the `courses` table exists and RLS is enabled.

Temporary Local Behavior:
- The current frontend allows any signed-in user to access /admin and create courses, but inserts will fail unless your RLS policy authorizes the user. The UI shows friendly error messages if the table is missing or permission is denied.

Production Role-Based Access:
- Once roles are configured in Supabase, update:
  - RLS policy to check for the Admin role in JWT claims or a user->role mapping table.
  - Frontend guard in App.js (AdminProtectedRoute) to block non-admins client-side:
    Example:
    const isAdmin = user?.app_metadata?.role === 'admin';
    if (!isAdmin) return <Navigate to="/student/overview" replace />;

Notes:
- Avoid hardcoding secrets. REACT_APP_SUPABASE_KEY must be the public anon key.
- Do not log access tokens or PII.

---

## Admin Courses – Frontend CRUD Integration

New admin pages were added under `/admin` routes:

- /admin/courses → CourseList.jsx
  - Uses courseService.listCourses({ search, status, page, pageSize })
  - Displays id, title, status, created_at, created_by
  - Simple search by title (ILIKE), filter by status, sort by created_at desc
  - Actions: Edit, View (opens catalog for now), Delete (with confirm)
- /admin/courses/:id/edit → CourseEdit.jsx
  - Loads a single course by id via courseService.getCourseById(id)
  - Editable fields: title, subtitle, category, level, price, is_free, description, thumbnail_url, status
  - Save → courseService.updateCourse(id, payload)
  - Delete → courseService.deleteCourse(id)

Service layer (src/core/services/courseService.js) now includes:
- listCourses(supabase, { search, status, page, pageSize })
- getCourseById(supabase, id)
- updateCourse(supabase, id, payload)
- deleteCourse(supabase, id)

These use `supabase.from('courses')` with appropriate filters, order, and pagination (range + count).

### Recommended DB Schema Enhancements

Add helpful indexes for admin queries:

```sql
-- if not already present
create index if not exists courses_created_at_idx on public.courses (created_at desc);
create index if not exists courses_status_idx on public.courses (status);
create index if not exists courses_title_trgm_idx on public.courses using gin (title gin_trgm_ops);

-- denormalized audit
create index if not exists courses_created_by_idx on public.courses (created_by);
```

Recommended to enable the pg_trgm extension for case-insensitive search performance:

```sql
create extension if not exists pg_trgm;
```

Consider using an enum for status:

```sql
do $$ begin
  create type course_status as enum ('draft', 'published');
exception
  when duplicate_object then null;
end $$;

alter table public.courses
  alter column status type course_status using status::course_status;
```

### RLS Considerations (Admin-only CRUD)

Enable RLS and create specific policies for admins:

- For read (list/get): allow if role is admin.
- For update/delete: only admin.
- For insert: only admin (already in this file above).

Example policy sketches (adjust to your JWT claims model):

```sql
-- Replace with your actual JWT claim or mapping table lookup
create policy "admin_select"
  on public.courses for select
  using ((auth.jwt() ->> 'role') = 'admin');

create policy "admin_update"
  on public.courses for update
  using ((auth.jwt() ->> 'role') = 'admin');

create policy "admin_delete"
  on public.courses for delete
  using ((auth.jwt() ->> 'role') = 'admin');
```

Client-side guard and admin layout:
- Admin has a dedicated layout and navigation separate from student UI.
- All `/admin/*` routes render inside `src/layouts/AdminLayout.jsx`.
- Guard: any signed-in user can access admin for now (placeholder). Once roles are available in Supabase JWT (e.g., `user.app_metadata.role`), update the AdminProtectedRoute in `src/App.js` to enforce admin-only access.

Error handling:
- The service normalizes common Supabase errors:
  - Missing table → instructs to create using SQL in this document.
  - RLS/permission issues → guides to configure policies for Admin role.
