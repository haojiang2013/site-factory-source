/**
 * Hub — Tool Navigation & Discovery
 * Aggregated page listing all 25 free tool sites with search, categories, and stats.
 * SEO: internal cross-linking hub for the entire site network.
 */
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

const SITES = [c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,c16,c17,c18,c19,c20,c21,c22,c23,c24,c25];

// Pre-compute at module level (build time)
type ToolCard = { domain: string; brand: string; niche: string; template: string; keywords: number };
const CARDS: ToolCard[] = SITES.map(cfg => ({
  domain: cfg.domain,
  brand: cfg.designConfig.brandName,
  niche: cfg.niche,
  template: cfg.template,
  keywords: cfg.keywords?.length || 0,
}));

const stats = {
  total: CARDS.length,
  A: CARDS.filter(c => c.template === 'A').length,
  B: CARDS.filter(c => c.template === 'B').length,
  C: CARDS.filter(c => c.template === 'C').length,
};

export const metadata: Metadata = {
  title: 'Free Online Tools — 25 No-Signup Calculators, Comparisons & Guides',
  description: 'Discover 25 free tools — moving cost, mortgage, paint, concrete & flooring calculators, AI tool comparisons, game databases. No signup required. Instant results.',
  openGraph: { title: 'Free Online Tools — No Signup Needed', description: '25 free calculators, data comparisons, and game guides. No email. No signup. Just answers.', url: 'https://gomovecalc.xyz/hub', siteName: 'ToolFactory', type: 'website' },
  twitter: { card: 'summary_large_image' },
  robots: 'index, follow',
};

export default function HubPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', color: '#fff', padding: '60px 20px 50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 40px)', margin: '0 0 12px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          {stats.total} Free Tools — No Signup Needed
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.6 }}>
          Calculators, Data Comparisons & Game Guides. All free. No email. No ads. Just answers.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            [216, 'Total Pages'],
            [stats.A, 'Calculators'],
            [stats.B, 'Comparisons'],
            [stats.C, 'Guides'],
          ].map(([n, label]) => (
            <div key={label as string} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{n}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{label as string}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculators section */}
      <Section title="🧮 Calculators" subtitle="12 tools — instant math, no signup" cards={CARDS.filter(c => c.template === 'A')} />

      {/* Data & Comparisons section */}
      <Section title="📊 Data & Comparisons" subtitle="11 tools — AI tool comparisons, game data, side-by-side" cards={CARDS.filter(c => c.template === 'B')} />

      {/* Game Guides section */}
      <Section title="🎮 Game Guides & Databases" subtitle="2 tools — boss strategies, loot tables, NPC databases" cards={CARDS.filter(c => c.template === 'C')} />

      <footer style={{ textAlign: 'center', padding: '32px 20px', borderTop: '1px solid #e2e8f0', fontSize: 13, color: '#94a3b8' }}>
        Part of the <a href="https://gomovecalc.xyz/" style={{ color: '#2563eb' }}>Site Factory</a> network · 25 sites · 216+ pages · Free forever
      </footer>
    </div>
  );
}

function Section({ title, subtitle, cards }: { title: string; subtitle: string; cards: ToolCard[] }) {
  if (cards.length === 0) return null;
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{title}</h2>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>{subtitle}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {cards.map(c => (
          <a
            key={c.domain}
            href={`https://${c.domain}/`}
            target="_blank"
            rel="noopener"
            style={{
              display: 'block', background: '#fff', borderRadius: 12, padding: '18px 20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
              textDecoration: 'none', color: 'inherit',
              transition: 'box-shadow 0.15s, transform 0.15s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{c.brand}</h3>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 4,
                background: c.template === 'A' ? '#dbeafe' : c.template === 'B' ? '#fef3c7' : '#fce7f3',
                color: c.template === 'A' ? '#1e40af' : c.template === 'B' ? '#92400e' : '#9d174d',
                fontWeight: 600, whiteSpace: 'nowrap',
              }}>
                {c.template === 'A' ? 'Calc' : c.template === 'B' ? 'Data' : 'Guide'}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>{c.niche}</p>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: '#94a3b8' }}>
              <span>{c.keywords} keywords</span>
              <span style={{ flex: 1 }} />
              <span style={{ color: '#2563eb', fontWeight: 600 }}>{c.domain} ↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
