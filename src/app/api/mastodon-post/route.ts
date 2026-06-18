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
  const templates = [
    `🛠 ${brand} — ${niche}\n\n"${pain}"\n\nWe fixed that. No signup, free forever.\n\n${domain}`,
    `Tired of "${pain}"?\n\nTry ${brand}: ${niche}. Free tool, no ads, no email.\n\n👉 ${domain}`,
    `New free tool: ${brand}\n\n✅ ${niche}\n✅ No signup\n✅ Real data\n✅ Instant results\n\n${domain}`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

// Simple rotation: store last index in a global (persists across warm invocations)
let lastIndex = -1;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const token = process.env.MASTODON_TOKEN;
  const server = process.env.MASTODON_SERVER || 'https://mastodon.social';
  if (!token) return NextResponse.json({ error: 'no token' }, { status: 500 });

  // Pick next site in rotation
  lastIndex = (lastIndex + 1) % ALL.length;
  const site = ALL[lastIndex];
  const text = generatePost(site);

  try {
    const res = await fetch(`${server}/api/v1/statuses`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: text, visibility: 'public' }),
    });
    const data: any = await res.json();
    if (res.ok) {
      return NextResponse.json({ success: true, index: lastIndex, domain: site.domain, url: data.url });
    }
    return NextResponse.json({ error: data.error || 'api error', status: res.status }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
