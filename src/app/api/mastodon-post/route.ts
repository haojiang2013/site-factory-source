/**
 * Mastodon daily auto-post endpoint
 * Called by Vercel Cron Job (vercel.json)
 * Protected by CRON_SECRET to prevent abuse
 */
import { NextRequest, NextResponse } from 'next/server';
import c1 from '@/data/site-001-moving-calculator/config.json'; import c2 from '@/data/site-002-mortgage-calc/config.json'; import c3 from '@/data/site-003-paint-calc/config.json';
import c4 from '@/data/site-004-ai-tools/config.json'; import c5 from '@/data/site-005-game-guide/config.json'; import c6 from '@/data/site-006-concrete-calc/config.json';
import c7 from '@/data/site-007-flooring-calc/config.json'; import c8 from '@/data/site-008-ai-coding/config.json'; import c9 from '@/data/site-009-reno-calc/config.json';
import c10 from '@/data/site-010-boss-guide/config.json'; import c11 from '@/data/site-011-ai-design/config.json'; import c12 from '@/data/site-012-ai-marketing/config.json';
import c13 from '@/data/site-013-ai-video/config.json'; import c14 from '@/data/site-014-game-items/config.json'; import c15 from '@/data/site-015-game-builds/config.json';
import c16 from '@/data/site-016-electrical/config.json'; import c17 from '@/data/site-017-garden/config.json'; import c18 from '@/data/site-018-cleaning/config.json';
import c19 from '@/data/site-019-solar/config.json'; import c20 from '@/data/site-020-hvac/config.json'; import c21 from '@/data/site-021-ai-productivity/config.json';
import c22 from '@/data/site-022-ai-audio/config.json'; import c23 from '@/data/site-023-ai-data/config.json'; import c24 from '@/data/site-024-game-weapons/config.json';
import c25 from '@/data/site-025-game-npcs/config.json';

const ALL = [c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,c16,c17,c18,c19,c20,c21,c22,c23,c24,c25];

function generatePost(cfg: any): string {
  const pain = cfg.keywords?.[0]?.userComplaints?.[0] || '';
  const domain = cfg.domain;
  const brand = cfg.designConfig.brandName;
  const niche = cfg.niche;
  const kw = cfg.keywords?.[0]?.keyword || niche;
  const complaint = pain.substring(0, 80);
  const templates = [
    `🛠️ ${brand} — Free ${niche}\n\nMost "${kw}" tools ask for your email. Ours doesn't.\n\nNo signup. No ads. Just answers.\n\n🔗 ${domain}`,
    `${complaint ? `People keep saying: "${complaint}"\n\n` : ''}We built ${brand} to fix that. Free ${niche} tool.\n\n✅ No email\n✅ Instant results\n✅ Real data\n\n${domain}`,
    `Just shipped: ${brand}\n\n${niche.charAt(0).toUpperCase() + niche.slice(1)} — no signup, no paywall, no BS.\n\nTry it: ${domain}`,
    `Why does every ${niche} tool hide results behind a paywall? 🤔\n\n${brand} doesn't. Free forever.\n\n${domain}`,
    `Built because Reddit asked for it:\n\n${kw.replace(/best | calculator| comparison/gi, '').trim()}\n\n100% free at ${domain}`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// Simple rotation: store last index in a global (persists across warm invocations)
let lastIndex = -1;

async function postToMastodon(text: string, token: string, server: string) {
  const res = await fetch(`${server}/api/v1/statuses`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: text, visibility: 'public' }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    return { ok: false, error: e.error || res.status };
  }
  const data = await res.json();
  return { ok: true, url: data.url };
}

function oauth1a(method: string, url: string, consumerKey: string, consumerSecret: string, token: string, tokenSecret: string): string {
  const crypto = require('crypto');
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const params: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_token: token,
    oauth_version: '1.0',
  };

  // Build signature base string
  const paramStr = Object.keys(params).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
  const baseStr = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramStr)}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(baseStr).digest('base64');

  params.oauth_signature = signature;
  return 'OAuth ' + Object.keys(params).sort().map(k => `${k}="${encodeURIComponent(params[k])}"`).join(', ');
}

async function postToTwitter(text: string) {
  const apiKey = process.env.TWITTER_API_KEY || '';
  const apiSecret = process.env.TWITTER_API_SECRET || '';
  const accessToken = process.env.TWITTER_ACCESS_TOKEN || '';
  const accessSecret = process.env.TWITTER_ACCESS_SECRET || '';
  if (!apiKey || !accessToken) return { ok: false, error: 'Twitter not configured' };

  try {
    const url = 'https://api.twitter.com/2/tweets';
    const auth = oauth1a('POST', url, apiKey, apiSecret, accessToken, accessSecret);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      return { ok: false, error: JSON.stringify(e).substring(0, 100) };
    }
    const data = await res.json();
    return { ok: true, url: `https://x.com/i/status/${data.data?.id}` };
  } catch (e: any) {
    return { ok: false, error: e.message?.substring(0, 60) };
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const mastodonToken = process.env.MASTODON_TOKEN;
  const mastodonServer = process.env.MASTODON_SERVER || 'https://mastodon.social';

  // Pick next site in rotation
  lastIndex = (lastIndex + 1) % ALL.length;
  const site = ALL[lastIndex];
  const text = generatePost(site);

  // Post to both platforms in parallel
  const results: any = { index: lastIndex, domain: site.domain };

  const [mastoResult, twitterResult] = await Promise.allSettled([
    mastodonToken ? postToMastodon(text, mastodonToken, mastodonServer) : Promise.resolve({ ok: false as const, error: 'no token' }),
    postToTwitter(text),
  ]);

  const mv = mastoResult.status === 'fulfilled' ? mastoResult.value : null;
  results.mastodon = mv?.ok ? (mv as any).url : `FAIL: ${(mv as any)?.error || 'rejected'}`;

  const tv = twitterResult.status === 'fulfilled' ? twitterResult.value : null;
  if (tv && !(tv.error as string)?.includes('not configured')) {
    results.twitter = tv.ok ? (tv as any).url : `FAIL: ${tv.error}`;
  }

  return NextResponse.json({ success: true, ...results });
}
