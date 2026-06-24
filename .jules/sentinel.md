## 2024-06-24 - [Open Relay and HTML Injection in Email Templates]
**Vulnerability:**
1. The `/api/send-email` endpoint had no authentication check, allowing anyone to send emails. Furthermore, even with authentication, there was no authorization check restricting where emails could be sent, turning it into an authenticated open relay (phishing risk).
2. The `MyMessages.tsx` component directly embedded user input (`messageContent` and `user.email`) into the `html` payload for emails without escaping it, allowing for HTML injection/XSS inside the emails received by the admin.

**Learning:**
1. Serverless functions acting as email relays must strictly validate the sender's identity and limit the recipient scope unless they are designed to send to arbitrary addresses (which is rare).
2. Content sent to third-party services (like Resend via QStash) is still vulnerable to injection attacks if the payload contains unsanitized user input embedded into HTML.

**Prevention:**
1. Always implement `@supabase/ssr` authentication in API routes that perform sensitive actions. Enforce strict checks on the `to` address for non-admin users.
2. Ensure any user input embedded into HTML email templates is escaped using a utility like `escapeHtml` to prevent HTML injection.
