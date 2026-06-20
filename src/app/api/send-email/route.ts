import { NextResponse } from 'next/server';
import { Client } from '@upstash/qstash';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_xxxxxxxxx');

// QStash Client
const qstashClient = process.env.QSTASH_TOKEN
  ? new Client({
      baseUrl: process.env.QSTASH_URL || 'https://qstash.upstash.io/v2',
      token: process.env.QSTASH_TOKEN,
    })
  : null;

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    // Determine the base app URL for callback
    // 1. Try environment variable
    // 2. Fall back to host header
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    const defaultAppUrl = `${protocol}://${host}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || defaultAppUrl;

    // Check if we should bypass QStash (development mode, missing QStash token, or explicit bypass env var)
    const isDev = process.env.NODE_ENV === 'development';
    const bypassQStash = !qstashClient || isDev || process.env.BYPASS_QSTASH === 'true';

    if (bypassQStash) {
      console.log('Bypassing QStash queue: Sending email directly using Resend');
      const { data, error } = await resend.emails.send({
        from: 'Talk with Hisham <onboarding@resend.dev>',
        to,
        subject,
        html,
      });

      if (error) {
        return NextResponse.json({ error }, { status: 500 });
      }

      return NextResponse.json({ success: true, data, bypassed: true });
    }

    // Publish to QStash queue
    const callbackUrl = `${appUrl.replace(/\/$/, '')}/api/send-email/callback`;
    
    console.log(`Publishing email task to QStash. Callback URL: ${callbackUrl}`);
    const { messageId } = await qstashClient.publishJSON({
      url: callbackUrl,
      body: { to, subject, html },
      headers: {
        'Upstash-Retries': '3', // Retry up to 3 times on failure
      },
    });

    return NextResponse.json({ success: true, messageId, queued: true });
  } catch (err) {
    console.error('Error in send-email route:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
