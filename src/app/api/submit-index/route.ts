/**
 * Index submission endpoint — runs Google sitemap ping + IndexNow from Vercel cloud
 * GET /api/submit-index?secret=CRON_SECRET
 */
import { NextRequest, NextResponse } from 'next/server';

const ALL_DOMAINS = [
  'gomovecalc.xyz','payitoff.xyz','paintwise.xyz','aitoolshelf.xyz','lootcove.xyz',
  'pourtrue.8zla.com','floorfound.8zla.com','devtooltrove.8zla.com','renowise.8zla.com',
  'bossbreak.8zla.com','designtooltrove.8zla.com','markettooltrove.8zla.com','videotooltrove.8zla.com',
  'itemarchive.8zla.com','buildcraft.8zla.com','voltwise.8zla.com','soilwise.8zla.com',
  'cleancalc.8zla.com','solarwise.8zla.com','hvacwise.8zla.com','prodtooltrove.8zla.com',
  'wavecraft.8zla.com','datatooltrove.8zla.com','weaponwise.8zla.com','npcvault.8zla.com',
];

async function pingGoogle(domain: string): Promise<{ ok: boolean; status: number; body: string }> {
  try {
    const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(`https://${domain}/sitemap.xml`)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    return { ok: res.ok, status: res.status, body: (await res.text()).substring(0, 100) };
  } catch (e: any) {
    return { ok: false, status: 0, body: e.message?.substring(0, 100) || 'unknown' };
  }
}

async function submitIndexNow(domain: string): Promise<{ ok: boolean; status: number; body: string }> {
  const apiKey = 'fa71c99a2cd5449fbbfc0c37f2cf6080';
  try {
    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: domain,
        key: apiKey,
        keyLocation: `https://${domain}/indexnow-${apiKey}.txt`,
        urlList: [
          `https://${domain}/`,
          `https://${domain}/about`,
          `https://${domain}/contact`,
          `https://${domain}/privacy`,
          `https://${domain}/terms`,
        ],
      }),
      signal: AbortSignal.timeout(15000),
    });
    return { ok: res.ok, status: res.status, body: (await res.text()).substring(0, 100) };
  } catch (e: any) {
    return { ok: false, status: 0, body: e.message?.substring(0, 100) || 'unknown' };
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Fire ALL requests in parallel (25 Google + 25 IndexNow = 50 concurrent)
  const googlePromises = ALL_DOMAINS.map(d => pingGoogle(d));
  const googleSettled = await Promise.allSettled(googlePromises);

  const results = googleSettled.map((s, i) => {
    const r = s.status === 'fulfilled' ? s.value : { ok: false, status: 0, body: 'rejected' };
    return { domain: ALL_DOMAINS[i], google: r.ok ? `OK ${r.status}` : `FAIL ${r.status}`, indexnow: 'pending' };
  });

  const indexNowPromises = ALL_DOMAINS.map(d => submitIndexNow(d));
  const ixSettled = await Promise.allSettled(indexNowPromises);
  ixSettled.forEach((s, i) => {
    const r = s.status === 'fulfilled' ? s.value : { ok: false, status: 0, body: 'rejected' };
    results[i].indexnow = r.ok ? `OK ${r.status}` : `FAIL ${r.status}`;
  });

  const googleOk = results.filter(r => r.google?.startsWith('OK')).length;
  const indexnowOk = results.filter(r => r.indexnow?.startsWith('OK')).length;

  return NextResponse.json({
    success: true,
    total: ALL_DOMAINS.length,
    google: `${googleOk}/${ALL_DOMAINS.length} OK`,
    indexnow: `${indexnowOk}/${ALL_DOMAINS.length} OK`,
    results,
  });
}
