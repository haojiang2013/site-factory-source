import c1 from '@/data/site-001-moving-calculator/config.json';
import p1 from '@/data/site-001-moving-calculator/pages.json';
import t1 from '@/data/site-001-moving-calculator/tool-code.json';
import c2 from '@/data/site-002-mortgage-calc/config.json';
import p2 from '@/data/site-002-mortgage-calc/pages.json';
import t2 from '@/data/site-002-mortgage-calc/tool-code.json';
import c3 from '@/data/site-003-paint-calc/config.json';
import p3 from '@/data/site-003-paint-calc/pages.json';
import t3 from '@/data/site-003-paint-calc/tool-code.json';
import c4 from '@/data/site-004-ai-tools/config.json';
import p4 from '@/data/site-004-ai-tools/pages.json';
import t4 from '@/data/site-004-ai-tools/tool-code.json';
import c5 from '@/data/site-005-game-guide/config.json';
import p5 from '@/data/site-005-game-guide/pages.json';
import t5 from '@/data/site-005-game-guide/tool-code.json';
import c6 from '@/data/site-006-concrete-calc/config.json';
import p6 from '@/data/site-006-concrete-calc/pages.json';
import t6 from '@/data/site-006-concrete-calc/tool-code.json';
import c7 from '@/data/site-007-flooring-calc/config.json';
import p7 from '@/data/site-007-flooring-calc/pages.json';
import t7 from '@/data/site-007-flooring-calc/tool-code.json';
import c8 from '@/data/site-008-ai-coding/config.json';
import p8 from '@/data/site-008-ai-coding/pages.json';
import t8 from '@/data/site-008-ai-coding/tool-code.json';
import c9 from '@/data/site-009-reno-calc/config.json';
import p9 from '@/data/site-009-reno-calc/pages.json';
import t9 from '@/data/site-009-reno-calc/tool-code.json';
import c10 from '@/data/site-010-boss-guide/config.json';
import p10 from '@/data/site-010-boss-guide/pages.json';
import t10 from '@/data/site-010-boss-guide/tool-code.json';
import c11 from '@/data/site-011-ai-design/config.json'; import p11 from '@/data/site-011-ai-design/pages.json'; import t11 from '@/data/site-011-ai-design/tool-code.json';
import c12 from '@/data/site-012-ai-marketing/config.json'; import p12 from '@/data/site-012-ai-marketing/pages.json'; import t12 from '@/data/site-012-ai-marketing/tool-code.json';
import c13 from '@/data/site-013-ai-video/config.json'; import p13 from '@/data/site-013-ai-video/pages.json'; import t13 from '@/data/site-013-ai-video/tool-code.json';
import c14 from '@/data/site-014-game-items/config.json'; import p14 from '@/data/site-014-game-items/pages.json'; import t14 from '@/data/site-014-game-items/tool-code.json';
import c15 from '@/data/site-015-game-builds/config.json'; import p15 from '@/data/site-015-game-builds/pages.json'; import t15 from '@/data/site-015-game-builds/tool-code.json';
import c16 from '@/data/site-016-electrical/config.json'; import p16 from '@/data/site-016-electrical/pages.json'; import t16 from '@/data/site-016-electrical/tool-code.json';
import c17 from '@/data/site-017-garden/config.json'; import p17 from '@/data/site-017-garden/pages.json'; import t17 from '@/data/site-017-garden/tool-code.json';
import c18 from '@/data/site-018-cleaning/config.json'; import p18 from '@/data/site-018-cleaning/pages.json'; import t18 from '@/data/site-018-cleaning/tool-code.json';
import c19 from '@/data/site-019-solar/config.json'; import p19 from '@/data/site-019-solar/pages.json'; import t19 from '@/data/site-019-solar/tool-code.json';
import c20 from '@/data/site-020-hvac/config.json'; import p20 from '@/data/site-020-hvac/pages.json'; import t20 from '@/data/site-020-hvac/tool-code.json';
import c21 from '@/data/site-021-ai-productivity/config.json'; import p21 from '@/data/site-021-ai-productivity/pages.json'; import t21 from '@/data/site-021-ai-productivity/tool-code.json';
import c22 from '@/data/site-022-ai-audio/config.json'; import p22 from '@/data/site-022-ai-audio/pages.json'; import t22 from '@/data/site-022-ai-audio/tool-code.json';
import c23 from '@/data/site-023-ai-data/config.json'; import p23 from '@/data/site-023-ai-data/pages.json'; import t23 from '@/data/site-023-ai-data/tool-code.json';
import c24 from '@/data/site-024-game-weapons/config.json'; import p24 from '@/data/site-024-game-weapons/pages.json'; import t24 from '@/data/site-024-game-weapons/tool-code.json';
import c25 from '@/data/site-025-game-npcs/config.json'; import p25 from '@/data/site-025-game-npcs/pages.json'; import t25 from '@/data/site-025-game-npcs/tool-code.json';
import { GSCPanel } from './GSCPanel';

const SITE_DATA: [any, any, any, string][] = [
  [c1,p1,t1,'001-moving'],[c2,p2,t2,'002-mortgage'],[c3,p3,t3,'003-paint'],[c4,p4,t4,'004-ai-tools'],[c5,p5,t5,'005-game-guide'],
  [c6,p6,t6,'006-concrete'],[c7,p7,t7,'007-flooring'],[c8,p8,t8,'008-ai-coding'],[c9,p9,t9,'009-reno'],[c10,p10,t10,'010-boss-guide'],
  [c11,p11,t11,'011-ai-design'],[c12,p12,t12,'012-ai-marketing'],[c13,p13,t13,'013-ai-video'],[c14,p14,t14,'014-game-items'],[c15,p15,t15,'015-game-builds'],
  [c16,p16,t16,'016-electrical'],[c17,p17,t17,'017-garden'],[c18,p18,t18,'018-cleaning'],[c19,p19,t19,'019-solar'],[c20,p20,t20,'020-hvac'],
  [c21,p21,t21,'021-ai-productivity'],[c22,p22,t22,'022-ai-audio'],[c23,p23,t23,'023-ai-data'],[c24,p24,t24,'024-game-weapons'],[c25,p25,t25,'025-game-npcs'],
];

export default function DashboardPage() {
  const sites = SITE_DATA.map(([cfg, pages, tool, slug]) => ({
    slug, brand: cfg.designConfig.brandName, niche: cfg.niche,
    domain: cfg.domain, template: cfg.template,
    colorScheme: cfg.designConfig.colorScheme, fontPair: cfg.designConfig.fontPair,
    pages: pages.length, toolChars: tool.jsCode?.length || 0,
    keywords: cfg.keywords?.length || 0,
  }));

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, margin: 0 }}>站点工厂控制台</h1>
          <p style={{ color: '#666', marginTop: 4 }}>{sites.length} 个站点运行中</p>
        </div>
        <a href="/" style={{ color: '#2563eb', fontSize: 14 }}>← 回到首页</a>
      </div>

      {/* 数据概览 */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: '站点总数', value: sites.length },
          { label: '页面总数', value: sites.reduce((s, x) => s + x.pages, 0) },
          { label: '计算器模板', value: sites.filter(s => s.template === 'A').length },
          { label: '数据对比模板', value: sites.filter(s => s.template === 'B').length },
        ].map(stat => (
          <div key={stat.label} style={{ flex: 1, background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#2563eb' }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 站点卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {sites.map(s => (
          <div key={s.slug} style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>{s.brand}</h2>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: s.template === 'A' ? '#dbeafe' : '#dcfce7', color: s.template === 'A' ? '#1e40af' : '#166534' }}>
                {s.template === 'A' ? '计算器' : '数据对比'}
              </span>
            </div>
            <p style={{ color: '#666', fontSize: 13, margin: '0 0 12px 0' }}>{s.niche}</p>
            <div style={{ fontSize: 11, color: '#999', lineHeight: 1.8 }}>
              <div>🎨 {s.colorScheme} · {s.fontPair}</div>
              <div>📄 {s.pages} 页 · ⚙️ {Math.round(s.toolChars / 1000)}K 代码 · 🔍 {s.keywords} 关键词</div>
              <div style={{ marginTop: 8 }}>
                <a href={`https://${s.domain}`} target="_blank" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>
                  {s.domain} ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GSC数据面板 */}
      <GSCPanel />

      <p style={{ textAlign: 'center', color: '#ccc', fontSize: 11, marginTop: 32 }}>
        站点工厂 · {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
}
