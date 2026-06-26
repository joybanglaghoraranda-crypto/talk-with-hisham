
## 2024-05-27 - [Fix Unauthenticated Open Relay & HTML Injection]
**Vulnerability:** The `/api/send-email/route.ts` endpoint allowed any unauthenticated user to send emails to arbitrary addresses. Additionally, the `MyMessages.tsx` component had a hardcoded admin email and did not escape user input before placing it in the email HTML template, creating a potential XSS vulnerability for the recipient.
**Learning:** Even internal API routes used primarily by authenticated components (like `MyMessages.tsx`) must enforce authorization checks on the backend. Client-side input must always be treated as untrusted and sanitized before being embedded in HTML templates, even for server-to-server emails. Supabase's `getUser()` should be used instead of `getSession()` for secure server-side validation.
**Prevention:**
1. Always validate `user` session via `supabase.auth.getUser()` in API endpoints.
2. Restrict recipient scopes (e.g., non-admins can only email the admin).
3. Use a utility like `escapeHtml` to sanitize all dynamic user inputs before injecting them into HTML email bodies.
4. Use environment variables for all email addresses and API keys.
