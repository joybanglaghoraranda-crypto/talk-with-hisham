import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ADMIN_EMAIL } from '@/lib/constants';

export async function GET() {
  const cookieStore = await cookies();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ isAdmin: false });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ isAdmin: false });
    }

    const isEmailConfirmed = user.email_confirmed_at != null;
    const isOAuth = user.app_metadata?.provider !== 'email';

    // As a best effort, verify the email hasn't been spoofed unconfirmed
    const isVerified = isEmailConfirmed || isOAuth;

    const isAdmin = user.email === ADMIN_EMAIL && isVerified;

    return NextResponse.json({ isAdmin });
  } catch (err) {
    console.error('Error checking admin status:', err);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
