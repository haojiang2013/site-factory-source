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
  return { title: cfg ? `Terms of Use — ${cfg.designConfig.brandName}` : 'Terms of Use' };
}

export default async function TermsPage() {
  const heads = await headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');
  const cfg = ALL.find(c => c.domain === host) || ALL[0];
  const brand = cfg.designConfig.brandName;
  const domain = cfg.domain;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', lineHeight: 1.8, color: '#334155' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Terms of Use</h1>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 32 }}>Last updated: June 2026 · Applies to {domain} and all {brand} services</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 28 }}>1. Disclaimer</h2>
      <p>The tools and calculators on {brand} provide estimates for informational purposes only. Actual costs may vary by ±15% or more depending on your specific circumstances. We are not responsible for decisions made based on these estimates. Always verify with qualified professionals before making financial, construction, or purchasing decisions.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 28 }}>2. No Professional Advice</h2>
      <p>Content on {domain} does not constitute professional advice — financial, legal, construction, or otherwise. Calculator results are estimates based on publicly available data and industry formulas. Always consult licensed professionals for your specific situation.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 28 }}>3. Limitation of Liability</h2>
      <p>{brand} and its operators shall not be liable for any damages, losses, or costs arising from the use of or inability to use this website, its tools, or its content. Use at your own discretion.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 28 }}>4. Third-Party Links & Affiliates</h2>
      <p>This site may contain links to third-party websites and affiliate links. If you make a purchase through an affiliate link, we may earn a commission at no extra cost to you. We only link to products and services we believe are relevant to the content.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 28 }}>5. Intellectual Property</h2>
      <p>The tool code, site design, and original content are the property of {brand}. Calculator formulas are based on publicly available industry standards and are free to use. Third-party trademarks and product names belong to their respective owners.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 28 }}>6. Changes to Terms</h2>
      <p>We may update these terms at any time. Continued use of the site after changes constitutes acceptance. Check this page periodically for updates.</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginTop: 28 }}>7. Contact</h2>
      <p>For questions about these terms, contact us at <a href={`mailto:hello@${domain}`} style={{ color: '#2563eb' }}>hello@{domain}</a> or visit our <a href="/contact" style={{ color: '#2563eb' }}>Contact page</a>.</p>
    </div>
  );
}
