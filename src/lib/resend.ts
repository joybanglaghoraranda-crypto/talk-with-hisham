/**
 * Client-side helper to send emails via our Next.js API route.
 * This keeps the API key secure on the server.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || result.error || 'Failed to send email');
    }
    return result;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
}
