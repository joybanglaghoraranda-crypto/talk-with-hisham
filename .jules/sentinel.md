## 2025-03-09 - Client-Side Authorization via Mutable User Email
**Vulnerability:** Client-side admin authorization checked `user.email === ADMIN_EMAIL` instead of checking a secure backend role claim.
**Learning:** Checking `user.email` for authorization on the frontend is insecure as emails might be spoofed, modified, or otherwise bypass validation depending on identity provider settings. Relying on mutable properties is an authorization bypass risk.
**Prevention:** Always use secure, immutable custom JWT claims (`app_metadata.role`) configured securely by backend triggers/functions to authorize users in frontend applications, not mutable user-provided data.
