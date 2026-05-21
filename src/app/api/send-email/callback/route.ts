import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_xxxxxxxxx');

async function handler(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      console.error('QStash callback: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    console.log(`QStash callback: Sending email to ${to} with subject "${subject}"`);
    const { data, error } = await resend.emails.send({
      from: 'Talk with Hisham <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend API error in QStash callback:', error);
      // Return 500 so QStash knows it failed and will retry
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Internal error in QStash callback:', err);
    // Return 500 so QStash knows it failed and will retry
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Wrap the handler with QStash signature verification.
// This ensures only authentic requests from your QStash queue can invoke this endpoint.
// We use fallback dummy keys for build-time compatibility if they are not defined in the environment.
export const POST = verifySignatureAppRouter(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "dummy_current_signing_key_for_build",
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "dummy_next_signing_key_for_build",
});
