# Backend Integration TODOs

- Replace mock implementations in:
  - src/services/authService.js (login, signup, me)
  - src/services/coursesService.js (list, get, create)

- Implement token refresh flow in src/services/apiClient.js response interceptor (401 handling).
- Add error boundary and centralized toast notifications for API errors.
- Wire real endpoints according to FastAPI OpenAPI spec once available.
