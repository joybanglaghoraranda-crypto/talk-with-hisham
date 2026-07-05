## 2025-03-05 - Fix Serverless Email Open Relay & Profile XSS
**Vulnerability:** The `/api/send-email` route allowed unauthenticated POST requests to relay arbitrary emails via Resend to any recipient. Furthermore, user messages were directly embedded in HTML without sanitization, leading to an XSS risk. Finally, an admin email was hardcoded in `MyMessages.tsx`.
**Learning:** Next.js App Router API routes must explicitly establish session context using `createServerClient` and `supabase.auth.getUser()`, as they do not automatically inherit client authentication state. Hardcoded email addresses are also security vulnerabilities as they may bypass intended application flow or leak PII.
**Prevention:**
1. Always authenticate and enforce scope restrictions (e.g., non-admins can only send emails to the configured admin email) on backend mailer endpoints.
2. Use fail-secure logic `(!adminEmail || to !== adminEmail)` instead of fail-open.
3. Use a custom `escapeHtml` utility function when rendering user input into HTML payloads on both the client and server.
4. Retrieve email targets from environment variables (e.g., `process.env.NEXT_PUBLIC_ADMIN_EMAIL`) instead of hardcoding them.
