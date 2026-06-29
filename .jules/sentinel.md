## 2025-06-29 - [Authenticated Open Relay in Email Serverless Function]
**Vulnerability:** The `/api/send-email/route.ts` endpoint allowed any user (unauthenticated or authenticated) to send emails to any arbitrary email address using the application's email provider, essentially acting as an open relay.
**Learning:** Serverless functions handling sensitive operations (like sending emails) must validate both the sender's identity and their authorization to perform the specific action (e.g., who they are allowed to send emails to).
**Prevention:** Implement strict authentication using Supabase's server client (`createServerClient`) and enforce role-based restrictions on the recipient scope (e.g., non-admins can only send emails to the configured admin email).
