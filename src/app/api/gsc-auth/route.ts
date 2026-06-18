import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GSC_CLIENT_ID;
  const redirectUri = process.env.GSC_REDIRECT_URI;
  const scope = 'https://www.googleapis.com/auth/webmasters.readonly';

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'GSC_CLIENT_ID or GSC_REDIRECT_URI not configured' }, { status: 500 });
  }

  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&access_type=offline` +
    `&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
