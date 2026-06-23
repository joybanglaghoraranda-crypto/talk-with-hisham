
## 2024-06-23 - [HIGH] HTML Injection/XSS in Email Notifications
**Vulnerability:** The application was directly interpolating unsanitized user input (`messageContent` and `user.email`) into an HTML string sent via email to administrators in `MyMessages.tsx`.
**Learning:** Even though the data is not rendered directly in the application's DOM, sending unsanitized HTML in an email body presents an HTML Injection / XSS risk. An attacker could craft a malicious message that, when viewed by an admin in their email client, could execute arbitrary code or trick the admin via phishing links.
**Prevention:** Always sanitize or escape user input before embedding it into HTML templates, including email bodies. We added an `escapeHtml` utility function to `src/lib/utils.ts` and applied it to all user-controlled variables interpolated into the HTML email.
