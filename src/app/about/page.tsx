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
  if (!cfg) return { title: 'About' };
  const brand = cfg.designConfig.brandName;
  return { title: `About ${brand} — Free ${cfg.niche}` };
}

function nicheDesc(cfg: any): string {
  const n = cfg.niche;
  if (n.includes('moving')) return 'estimating moving costs';
  if (n.includes('mortgage')) return 'calculating mortgage overpayment savings';
  if (n.includes('paint')) return 'estimating paint coverage';
  if (n.includes('AI writing') || n.includes('AI coding') || n.includes('AI design') || n.includes('AI marketing') || n.includes('AI video') || n.includes('AI productivity') || n.includes('AI audio') || n.includes('AI data')) return 'comparing AI tools side-by-side';
  if (n.includes('game loot') || n.includes('game item') || n.includes('game weapon') || n.includes('game NPC')) return 'searching game data and stats';
  if (n.includes('boss') || n.includes('guide')) return 'finding boss strategies and guides';
  if (n.includes('concrete')) return 'estimating concrete needs and costs';
  if (n.includes('flooring')) return 'calculating flooring material and installation costs';
  if (n.includes('renovation')) return 'estimating renovation costs';
  if (n.includes('electrical')) return 'calculating electrical loads';
  if (n.includes('garden') || n.includes('soil')) return 'estimating garden soil needs';
  if (n.includes('cleaning')) return 'estimating house cleaning costs';
  if (n.includes('solar')) return 'calculating solar panel needs and savings';
  if (n.includes('HVAC')) return 'sizing HVAC systems';
  if (n.includes('game character build') || n.includes('game build')) return 'planning game character builds';
  return `using our free ${n}`;
}

function storyIntro(brand: string, niche: string, domain: string): string {
  const pain = ALL.find(c => c.domain === domain)?.keywords?.[0]?.userComplaints?.[0] || 'signup forms and hidden fees';
  return `Most ${niche} tools ${pain}. ${brand} was built to fix that — a clean, fast, free tool that respects your time and privacy.`;
}

export default async function AboutPage() {
  const heads = await headers();
  const host = (heads.get('x-forwarded-host') || heads.get('host') || '').replace(/:\d+$/, '');
  const cfg = ALL.find(c => c.domain === host) || ALL[0];
  const brand = cfg.designConfig.brandName;
  const niche = cfg.niche;
  const domain = cfg.domain;
  const story = storyIntro(brand, niche, domain);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', lineHeight: 1.7, color: '#334155' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>About {brand}</h1>
      <p style={{ fontSize: 18, color: '#64748b', marginBottom: 32 }}>Free {niche} — no signup, no email, no catch.</p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Why {brand} Exists</h2>
        <p>{story}</p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Who Built This</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <img
            src="https://github.com/haojiang2013.png"
            alt="stevenkuep"
            width={64}
            height={64}
            style={{ borderRadius: '50%', border: '2px solid #e2e8f0' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#0f172a' }}>stevenkuep</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Indie developer · Built 25 free tools</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              <a href="https://github.com/haojiang2013" target="_blank" rel="noopener" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>🐙 GitHub</a>
              <a href="https://x.com/stevenkuep" target="_blank" rel="noopener" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>🐦 X / Twitter</a>
            </div>
          </div>
        </div>
        <p>{brand} is part of a network of <strong>25 free utility tools</strong> built and maintained by stevenkuep — an indie developer who believes useful tools should be free, fast, and private.</p>
        <p style={{ marginTop: 8 }}>Every tool follows the same principles: <strong>no signup required, no email gates, no ads, no tracking.</strong> Just instant answers. Built in public. <a href="https://x.com/stevenkuep" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Follow the journey on X →</a></p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>How {brand} Works</h2>
        <p>Unlike most {niche} tools that hide results behind email forms or paywalls, {brand} gives you instant results. Enter your details and see answers immediately — no waiting, no signup, no spam.</p>
        <p style={{ marginTop: 8 }}>Our data comes from publicly available industry sources, updated regularly. For details on specific data sources and methodology, see the information provided alongside each tool.</p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Contact</h2>
        <p>Questions, feedback, or suggestions? We welcome them.</p>
        <p style={{ marginTop: 8 }}>📧 <a href={`mailto:hello@${domain}`} style={{ color: '#2563eb' }}>hello@{domain}</a></p>
        <p>🔗 <a href="/hub" style={{ color: '#2563eb' }}>Browse all 25 free tools →</a></p>
      </section>

      <footer style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid #e2e8f0', fontSize: 12, color: '#94a3b8' }}>
        <p>Part of the <strong>Site Factory</strong> network. 25 free tools. No signup. No email. Just answers.</p>
      </footer>
    </div>
  );
}
