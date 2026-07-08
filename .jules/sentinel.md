## 2024-05-18 - [HTML Injection/XSS in Email Templates]
**Vulnerability:** User input (`user.email`, `messageContent`) was being directly embedded into HTML templates sent via Resend API without any escaping.
**Learning:** React handles escaping JSX, but when constructing strings manually for API endpoints, escaping must be done explicitly.
**Prevention:** Always use an `escapeHtml` utility when constructing raw HTML strings from user input.
