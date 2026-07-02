import { NextResponse } from 'next/server';
import { Client } from '@upstash/qstash';
import { Resend } from 'resend';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
    // SECURITY FIX: Verify the user's identity before allowing email submission
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if setAll is called from a Server Component / middleware context
            }
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Unauthorized email attempt:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    // SECURITY FIX: Enforce recipient scope restriction
    const isAdmin = user.app_metadata?.role === 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'joybanglaghoraranda@gmail.com';

    // If user is not an admin, they can ONLY send to the admin email
    if (!isAdmin && to !== adminEmail) {
      console.error(`User ${user.id} attempted to send email to unauthorized recipient: ${to}`);
      return NextResponse.json({ error: 'Forbidden: You can only send messages to the administrator.' }, { status: 403 });
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
    // SECURITY FIX: Only allow bypassing QStash in development mode
    const bypassQStash = isDev && (!qstashClient || process.env.BYPASS_QSTASH === 'true');

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

    // SECURITY FIX: In production, require QStash client to be configured
    if (!qstashClient) {
      console.error('QStash client not configured in production mode');
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      );
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
  } catch (err: any) {
    console.error('Error in send-email route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
