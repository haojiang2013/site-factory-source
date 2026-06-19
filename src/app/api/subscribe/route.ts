/**
 * Newsletter subscribe API v3
 * POST /api/subscribe { email: string }
 * Mailchimp Marketing API integration
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}));
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const mailchimpKey = process.env.MAILCHIMP_API_KEY;
  const mailchimpList = process.env.MAILCHIMP_LIST_ID;
  const mailchimpServer = process.env.MAILCHIMP_SERVER || 'us11';

  if (mailchimpKey && mailchimpList) {
    try {
      const res = await fetch(
        `https://${mailchimpServer}.api.mailchimp.com/3.0/lists/${mailchimpList}/members`,
        {
          method: 'POST',
          headers: {
            'Authorization': `apikey ${mailchimpKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            tags: ['site-factory'],
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        return NextResponse.json({ success: true, method: 'mailchimp' });
      }
      if (data?.title === 'Member Exists') {
        return NextResponse.json({ success: true, method: 'mailchimp', alreadySubscribed: true });
      }
      console.log('[SUBSCRIBE] MC error:', JSON.stringify(data).substring(0, 100));
      return NextResponse.json({ success: true, method: 'fallback_log' });
    } catch (e) {
      console.log('[SUBSCRIBE] MC unreachable:', (e as Error).message);
      return NextResponse.json({ success: true, method: 'fallback_log' });
    }
  }

  console.log('[SUBSCRIBE]', email, new Date().toISOString());
  return NextResponse.json({ success: true, method: 'log' });
}
