import c1 from '@/data/site-001-moving-calculator/config.json'; import p1 from '@/data/site-001-moving-calculator/pages.json';
import c2 from '@/data/site-002-mortgage-calc/config.json'; import p2 from '@/data/site-002-mortgage-calc/pages.json';
import c3 from '@/data/site-003-paint-calc/config.json'; import p3 from '@/data/site-003-paint-calc/pages.json';
import c4 from '@/data/site-004-ai-tools/config.json'; import p4 from '@/data/site-004-ai-tools/pages.json';
import c5 from '@/data/site-005-game-guide/config.json'; import p5 from '@/data/site-005-game-guide/pages.json';
import c6 from '@/data/site-006-concrete-calc/config.json'; import p6 from '@/data/site-006-concrete-calc/pages.json';
import c7 from '@/data/site-007-flooring-calc/config.json'; import p7 from '@/data/site-007-flooring-calc/pages.json';
import c8 from '@/data/site-008-ai-coding/config.json'; import p8 from '@/data/site-008-ai-coding/pages.json';
import c9 from '@/data/site-009-reno-calc/config.json'; import p9 from '@/data/site-009-reno-calc/pages.json';
import c10 from '@/data/site-010-boss-guide/config.json'; import p10 from '@/data/site-010-boss-guide/pages.json';
import c11 from '@/data/site-011-ai-design/config.json'; import p11 from '@/data/site-011-ai-design/pages.json';
import c12 from '@/data/site-012-ai-marketing/config.json'; import p12 from '@/data/site-012-ai-marketing/pages.json';
import c13 from '@/data/site-013-ai-video/config.json'; import p13 from '@/data/site-013-ai-video/pages.json';
import c14 from '@/data/site-014-game-items/config.json'; import p14 from '@/data/site-014-game-items/pages.json';
import c15 from '@/data/site-015-game-builds/config.json'; import p15 from '@/data/site-015-game-builds/pages.json';
import c16 from '@/data/site-016-electrical/config.json'; import p16 from '@/data/site-016-electrical/pages.json';
import c17 from '@/data/site-017-garden/config.json'; import p17 from '@/data/site-017-garden/pages.json';
import c18 from '@/data/site-018-cleaning/config.json'; import p18 from '@/data/site-018-cleaning/pages.json';
import c19 from '@/data/site-019-solar/config.json'; import p19 from '@/data/site-019-solar/pages.json';
import c20 from '@/data/site-020-hvac/config.json'; import p20 from '@/data/site-020-hvac/pages.json';
import c21 from '@/data/site-021-ai-productivity/config.json'; import p21 from '@/data/site-021-ai-productivity/pages.json';
import c22 from '@/data/site-022-ai-audio/config.json'; import p22 from '@/data/site-022-ai-audio/pages.json';
import c23 from '@/data/site-023-ai-data/config.json'; import p23 from '@/data/site-023-ai-data/pages.json';
import c24 from '@/data/site-024-game-weapons/config.json'; import p24 from '@/data/site-024-game-weapons/pages.json';
import c25 from '@/data/site-025-game-npcs/config.json'; import p25 from '@/data/site-025-game-npcs/pages.json';

type SiteRow = [any, any[], string];
const ALL: SiteRow[] = [
  [c1,p1,'001-moving'],[c2,p2,'002-mortgage'],[c3,p3,'003-paint'],[c4,p4,'004-ai-tools'],[c5,p5,'005-game-guide'],
  [c6,p6,'006-concrete'],[c7,p7,'007-flooring'],[c8,p8,'008-ai-coding'],[c9,p9,'009-reno'],[c10,p10,'010-boss-guide'],
  [c11,p11,'011-ai-design'],[c12,p12,'012-ai-marketing'],[c13,p13,'013-ai-video'],[c14,p14,'014-game-items'],[c15,p15,'015-game-builds'],
  [c16,p16,'016-electrical'],[c17,p17,'017-garden'],[c18,p18,'018-cleaning'],[c19,p19,'019-solar'],[c20,p20,'020-hvac'],
  [c21,p21,'021-ai-productivity'],[c22,p22,'022-ai-audio'],[c23,p23,'023-ai-data'],[c24,p24,'024-game-weapons'],[c25,p25,'025-game-npcs'],
];

export default function DashboardPage() {
  const sites = ALL.map(([cfg, pages, slug]) => {
    const subPages = pages.slice(1); // pages beyond index 0
    return {
      slug, brand: cfg.designConfig.brandName, niche: cfg.niche,
      domain: cfg.domain, template: cfg.template,
      colorScheme: cfg.designConfig.colorScheme,
      totalPages: pages.length,
      subPages: subPages.map((p: any) => ({ slug: p.slug || '', h1: p.h1 || '' })),
      keywords: cfg.keywords?.length || 0,
    };
  });

  const totalPages = sites.reduce((s, x) => s + x.totalPages, 0);
  const templateA = sites.filter(s => s.template === 'A').length;
  const templateB = sites.filter(s => s.template === 'B').length;
  const templateC = sites.filter(s => s.template === 'C').length;
  const xyzDomains = sites.filter(s => s.domain.endsWith('.xyz')).length;
  const subDomains = sites.filter(s => s.domain.endsWith('.8zla.com')).length;

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, margin: 0 }}>Site Factory Dashboard</h1>
          <p style={{ color: '#666', marginTop: 4 }}>{sites.length} sites · {totalPages} pages · deployed</p>
        </div>
        <a href="/" style={{ color: '#2563eb', fontSize: 14 }}>← Home</a>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Sites', value: sites.length, color: '#2563eb' },
          { label: 'Total Pages', value: totalPages, color: '#7c3aed' },
          { label: 'Calculator (A)', value: templateA, color: '#059669' },
          { label: 'Data (B)', value: templateB, color: '#d97706' },
          { label: 'Guide (C)', value: templateC, color: '#dc2626' },
          { label: '.xyz Domains', value: xyzDomains, color: '#0891b2' },
          { label: '.8zla.com Subs', value: subDomains, color: '#4f46e5' },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 120px', background: '#fff', borderRadius: 8, padding: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Site cards with sub-pages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
        {sites.map(s => (
          <div key={s.slug} style={{ background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>{s.brand}</h2>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: s.template === 'A' ? '#dbeafe' : s.template === 'B' ? '#fef3c7' : '#fce7f3', color: s.template === 'A' ? '#1e40af' : s.template === 'B' ? '#92400e' : '#9d174d' }}>
                {s.template === 'A' ? 'Calc' : s.template === 'B' ? 'Data' : 'Guide'}
              </span>
            </div>
            <p style={{ color: '#666', fontSize: 12, margin: '0 0 8px 0' }}>{s.niche}</p>
            <div style={{ fontSize: 11, color: '#999', marginBottom: 8 }}>
              🎨 {s.colorScheme} · {s.totalPages} pages · {s.keywords} keywords
            </div>
            <div style={{ marginBottom: 8 }}>
              <a href={`https://${s.domain}`} target="_blank" style={{ color: '#2563eb', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                {s.domain} ↗
              </a>
            </div>
            {/* Sub-pages */}
            {s.subPages.length > 0 && (
              <details style={{ fontSize: 11 }}>
                <summary style={{ cursor: 'pointer', color: '#888', marginBottom: 4 }}>
                  {s.subPages.length} sub-pages ▸
                </summary>
                <div style={{ maxHeight: 120, overflow: 'auto', background: '#f9fafb', borderRadius: 6, padding: '6px 10px' }}>
                  {s.subPages.map((p, i) => (
                    <div key={i} style={{ marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <a href={`https://${s.domain}/${p.slug}/`} target="_blank" style={{ color: '#4b5563', textDecoration: 'none' }}>
                        /{p.slug}
                      </a>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: '#ccc', fontSize: 11, marginTop: 32 }}>
        Site Factory · {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
}
