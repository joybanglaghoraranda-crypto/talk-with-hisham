
## 2024-07-02 - [Unauthenticated Open Relay]
**Vulnerability:** The `/api/send-email/route.ts` endpoint lacked authentication and authorization checks, allowing anyone (including unauthenticated users) to make POST requests and send arbitrary emails to any address via the application's email service.
**Learning:** Any API route that interacts with external services (like Resend or QStash) must verify the caller's identity, even if it's an internal helper route. Frontend hiding is not security.
**Prevention:** Always verify user identity using `supabase.auth.getUser()` (via `createServerClient` in SSR context) in serverless API routes. Enforce recipient scope restrictions (e.g., non-admin users can only email the administrator).
