import { headers } from 'next/headers';
import type { Metadata } from 'next';
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

export async function generateMetadata(): Promise<Metadata> {
  const heads = await headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');
  const cfg = ALL.find(c => c.domain === host);
  return { title: cfg ? `Contact ${cfg.designConfig.brandName}` : 'Contact' };
}

export default async function ContactPage() {
  const heads = await headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');
  const cfg = ALL.find(c => c.domain === host) || ALL[0];
  const brand = cfg.designConfig.brandName;
  const domain = cfg.domain;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', lineHeight: 1.7, color: '#334155' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Contact {brand}</h1>
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>Questions, feedback, bug reports, or suggestions — all welcome.</p>
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Email</h2>
        <p>📧 <a href={`mailto:hello@${domain}`} style={{ color: '#2563eb' }}>hello@{domain}</a></p>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>About This Tool</h2>
        <p>{brand} is a free {cfg.niche}. No signup required. No email gates. Part of a network of 25 free utility tools.</p>
      </section>
      <section><p style={{ fontSize: 12, color: '#94a3b8' }}>We aim to respond within 48 hours.</p></section>
    </div>
  );
}
