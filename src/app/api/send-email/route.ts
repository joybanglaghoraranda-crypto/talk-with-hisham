import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API Key from environment variables.
// The user should add RESEND_API_KEY=re_xxxxxxxxx to their .env.local file.
const resend = new Resend(process.env.RESEND_API_KEY || 're_xxxxxxxxx');

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Talk with Hisham <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
