## 2025-02-28 - Unauthenticated Open Relay in Email API
**Vulnerability:** The `/api/send-email` endpoint was completely unauthenticated and allowed any HTTP client to send arbitrary emails to any address via the application's configured Resend account.
**Learning:** Next.js API routes must explicitly authenticate requests, especially when wrapping external services like email or SMS providers. Just hiding the service behind a frontend route does not secure it against direct HTTP requests.
**Prevention:** Implement `createServerClient` in API routes to validate the user session, and restrict the `to` field for non-admin users to prevent sending emails to third parties.
