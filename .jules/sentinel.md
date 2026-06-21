## 2026-06-21 - [Admin Auth Bypass]
**Vulnerability:** Client-side admin check relied on `user.email` match instead of a secure JWT claim.
**Learning:** Checking emails for auth on the client-side allows malicious users to impersonate an admin by overriding the frontend user object.
**Prevention:** Always use `user.app_metadata.role` or similar secure JWT claims for authorization checks on the client.
