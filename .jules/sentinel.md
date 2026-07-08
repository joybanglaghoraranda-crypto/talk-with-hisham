## 2026-07-07 - [Remove Hardcoded Email]
**Vulnerability:** A specific admin email address was hardcoded in `src/components/profile/MyMessages.tsx` instead of using the central `ADMIN_EMAIL` configuration from `@/lib/constants`.
**Learning:** Hardcoded sensitive configurations in frontend components can lead to security issues, bypass central configurations, and make updates error-prone.
**Prevention:** Always use centralized configuration files for sensitive data, such as admin emails or API keys.
