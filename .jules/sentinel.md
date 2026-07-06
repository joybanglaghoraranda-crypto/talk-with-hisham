## 2024-05-18 - [XSS] HTML Injection in Email Template
**Vulnerability:** User inputs (`user.email` and `messageContent`) were being directly interpolated into an HTML string sent out as an email without sanitization, leading to XSS vulnerabilities and potential code execution in the email client.
**Learning:** Always sanitize user input when injecting it into HTML contexts. Simple string replacement for `&`, `<`, `>`, `"`, and `'` is necessary for emails since DOMPurify and similar front-end tools are not always available on the server.
**Prevention:** Implement and enforce the use of `escapeHtml(text: string)` utility function defined in `src/lib/utils.ts` for any user-generated content that enters an HTML template.
