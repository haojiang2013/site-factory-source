import c1 from '@/data/site-001-moving-calculator/config.json'; import c2 from '@/data/site-002-mortgage-calc/config.json'; import c3 from '@/data/site-003-paint-calc/config.json';
import c4 from '@/data/site-004-ai-tools/config.json'; import c5 from '@/data/site-005-game-guide/config.json'; import c6 from '@/data/site-006-concrete-calc/config.json';
import c7 from '@/data/site-007-flooring-calc/config.json'; import c8 from '@/data/site-008-ai-coding/config.json'; import c9 from '@/data/site-009-reno-calc/config.json';
import c10 from '@/data/site-010-boss-guide/config.json'; import c11 from '@/data/site-011-ai-design/config.json'; import c12 from '@/data/site-012-ai-marketing/config.json';
import c13 from '@/data/site-013-ai-video/config.json'; import c14 from '@/data/site-014-game-items/config.json'; import c15 from '@/data/site-015-game-builds/config.json';
import c16 from '@/data/site-016-electrical/config.json'; import c17 from '@/data/site-017-garden/config.json'; import c18 from '@/data/site-018-cleaning/config.json';
import c19 from '@/data/site-019-solar/config.json'; import c20 from '@/data/site-020-hvac/config.json'; import c21 from '@/data/site-021-ai-productivity/config.json';
import c22 from '@/data/site-022-ai-audio/config.json'; import c23 from '@/data/site-023-ai-data/config.json'; import c24 from '@/data/site-024-game-weapons/config.json';
import c25 from '@/data/site-025-game-npcs/config.json';

const SITE_LIST = [c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,c16,c17,c18,c19,c20,c21,c22,c23,c24,c25];

export default function HubPage() {
  const sites = SITE_LIST.map(cfg => ({
    domain: cfg.domain,
    brand: cfg.designConfig.brandName,
    niche: cfg.niche,
    template: cfg.template,
    color: cfg.designConfig.colorScheme,
    kws: cfg.keywords?.length || 0,
  }));

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>ToolFactory — {sites.length} Free Tools</h1>
      <p style={{ color: '#666', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
        Free, no-signup tools. Real data. No spam.<br />
        We build tools that solve real problems — discovered by searching Reddit for what users actually complain about.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Tools', value: sites.length },
          { label: 'Calculators', value: sites.filter(s => s.template === 'A').length },
          { label: 'Data Comparisons', value: sites.filter(s => s.template === 'B').length },
          { label: 'Game Guides', value: sites.filter(s => s.template === 'C').length },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 16px', border: '1px solid #e8e8e8' }}>
            <span style={{ fontWeight: 700, fontSize: 20, color: '#2563eb' }}>{stat.value}</span>
            <span style={{ fontSize: 12, color: '#888', marginLeft: 6 }}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {sites.map(s => (
          <div key={s.domain} style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 16 }}>{s.brand}</h2>
                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: s.template === 'A' ? '#dbeafe' : s.template === 'B' ? '#dcfce7' : '#fef3c7', color: '#555' }}>
                  {s.template === 'A' ? 'Calc' : s.template === 'B' ? 'Data' : 'Guide'}
                </span>
              </div>
              <p style={{ margin: 0, color: '#888', fontSize: 12 }}>{s.niche} · {s.kws} keywords</p>
            </div>
            <a href={`https://${s.domain}`} target="_blank" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
              {s.domain} ↗
            </a>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #eee', fontSize: 12, color: '#ccc', textAlign: 'center' }}>
        Built with AI agents. No human writes these pages — but real humans use them. · <a href="/dashboard" style={{ color: '#2563eb' }}>Dashboard</a>
      </footer>
    </div>
  );
}
