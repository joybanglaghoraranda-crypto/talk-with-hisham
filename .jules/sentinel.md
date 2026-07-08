## 2025-02-13 - [Authenticated Open Relay & HTML Injection in Email Flow]
**Vulnerability:** The `/api/send-email/route.ts` API route lacked authentication and authorization, functioning as an open relay allowing any user to send emails to any address using the platform's Resend credentials. Additionally, user inputs (`user.email` and `messageContent`) in `MyMessages.tsx` were directly embedded into the email's HTML body without sanitization, leading to HTML injection/XSS inside email clients.
**Learning:** Serverless functions that trigger side-effects like sending emails must strictly validate the user session using cryptographic methods (`supabase.auth.getUser()`) rather than relying on client-side constraints. Furthermore, any user input embedded into an HTML context (even inside an email template) must be explicitly escaped to prevent injection attacks.
**Prevention:**
1. Always wrap API routes handling sensitive operations with `createServerClient` and verify sessions using `supabase.auth.getUser()`.
2. Restrict the scope of the operation (e.g., non-admins can only send emails to the configured admin address).
3. Always sanitize/escape user input before embedding it into HTML strings using the `escapeHtml` utility in `src/lib/utils.ts`.
