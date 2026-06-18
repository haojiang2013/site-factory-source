import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const redirectUri = process.env.GSC_REDIRECT_URI;
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  if (error) return NextResponse.json({ error }, { status: 400 });
  if (!code) return NextResponse.redirect(new URL('/api/gsc-auth', req.url));
  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: 'OAuth credentials not configured' }, { status: 500 });
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    });

    const tokens = await tokenRes.json() as any;
    if (tokens.error) return NextResponse.json({ error: tokens.error_description || tokens.error }, { status: 400 });

    return NextResponse.json({ success: true, refresh_token: tokens.refresh_token });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
