'use client';

import { useEffect, useState, useMemo } from 'react';

interface SiteRow {
  domain: string; brand: string; niche: string; template: string;
  pages: number; keywords: number; hasTool: boolean;
}

interface AnalyticsData {
  total: number; last24h: number; last7d: number; avgDwellSec: number; avgScrollPct: number;
  toolUseRate: number; byDomain: [string, number][]; byCountry: [string, number][];
  byRef: [string, number][]; topPages: [string, number][];
}

type SortKey = 'brand' | 'template' | 'pages' | 'keywords';

export default function DashboardPage() {
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('pages');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    setRefreshing(true);
    Promise.all([
      fetch('/api/site-stats/').then(r => r.json()),
      fetch('/api/analytics/stats/').then(r => r.json()).catch(() => null),
    ]).then(([ss, aa]) => {
      setSites(ss.sites || []);
      setTotalPages(ss.totalPages || 0);
      setAnalytics(aa && aa.total > 0 ? aa : null);
      setRefreshing(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const sorted = useMemo(() => {
    const list = [...sites];
    list.sort((a, b) => {
      const va = sortKey === 'template' ? (a.template === 'A' ? 1 : a.template === 'B' ? 2 : 3) : (a[sortKey] as number);
      const vb = sortKey === 'template' ? (b.template === 'A' ? 1 : b.template === 'B' ? 2 : 3) : (b[sortKey] as number);
      return sortDir === 'desc' ? Number(vb) - Number(va) : Number(va) - Number(vb);
    });
    return list;
  }, [sites, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const tA = sites.filter(s => s.template === 'A').length;
  const tB = sites.filter(s => s.template === 'B').length;
  const tC = sites.filter(s => s.template === 'C').length;
  const now = new Date();
  const gaId = 'G-MZB09BVD0X';
  const gaConnected = true;

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* 顶部 */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '24px 28px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>📊 站点工厂指挥中心</h1>
            <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: 12 }}>
              {sites.length} 站 · {totalPages} 页 · {now.getFullYear()}年{now.getMonth()+1}月{now.getDate()}日
              {gaConnected && <span style={{ marginLeft: 12, padding: '2px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: 10, fontWeight: 600 }}>GA 已连接</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={fetchData} disabled={refreshing} style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '7px 14px', borderRadius: 7, fontSize: 11, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              {refreshing ? '⏳ 刷新中...' : '🔄 刷新'}
            </button>
            <a href="https://analytics.google.com" target="_blank" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '7px 14px', borderRadius: 7, fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>
              GA 后台 ↗
            </a>
            <a href="https://vercel.com/stevengu77-2664s-projects/site-factory/analytics" target="_blank" style={{ color: '#94a3b8', padding: '7px 14px', borderRadius: 7, fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>
              Vercel ↗
            </a>
            <a href="/hub" style={{ color: '#94a3b8', fontSize: 11, padding: '7px 0' }}>导航 ↗</a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 28px' }}>
        {/* 统计卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            [sites.length, '站点', '#3b82f6'],
            [totalPages, '页面', '#8b5cf6'],
            [tA, '计算器', '#10b981'],
            [tB, '数据对比', '#f59e0b'],
            [tC, '游戏攻略', '#ef4444'],
            [analytics?.total || 0, '事件追踪', '#06b6d4'],
            [analytics ? (analytics.avgDwellSec + 's') : '—', '平均停留', '#6366f1'],
            [analytics?.toolUseRate ? (analytics.toolUseRate + '%') : '—', '工具使用率', '#ec4899'],
          ].map(([n, label, color]) => (
            <div key={label as string} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: color as string }}>{n}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{label as string}</div>
            </div>
          ))}
        </div>

        {/* 追踪数据行 */}
        {analytics ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 20 }}>
            {[
              [analytics.last24h, '24h 访问'],
              [analytics.last7d, '7d 访问'],
              [analytics.avgDwellSec + 's', '停留'],
              [analytics.avgScrollPct + '%', '浏览深度'],
            ].map(([n, label]) => (
              <div key={label as string} style={{ background: '#eff6ff', borderRadius: 8, padding: '10px 14px', border: '1px solid #dbeafe', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#2563eb' }}>{n}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{label as string}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 20px', marginBottom: 20, border: '1px dashed #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
            📡 追踪数据等待累积中... 访问者浏览页面后自动出现
          </div>
        )}

        {/* 站点表 + 地理/来源 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16, marginBottom: 20 }}>
          {/* 站点表 */}
          <div style={{ background: '#fff', borderRadius: 10, padding: 18, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: '#0f172a' }}>🌐 站点列表 ({sites.length})</h2>
            <div style={{ maxHeight: 440, overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', cursor: 'pointer' }}>
                    <th onClick={()=>toggleSort('brand')} style={th}>站点 {sortKey==='brand'?sortDir==='desc'?'▾':'▴':''}</th>
                    <th onClick={()=>toggleSort('template')} style={th}>类型 {sortKey==='template'?sortDir==='desc'?'▾':'▴':''}</th>
                    <th onClick={()=>toggleSort('pages')} style={{...th,textAlign:'right'}}>页数 {sortKey==='pages'?sortDir==='desc'?'▾':'▴':''}</th>
                    <th onClick={()=>toggleSort('keywords')} style={{...th,textAlign:'right'}}>关键词 {sortKey==='keywords'?sortDir==='desc'?'▾':'▴':''}</th>
                    <th style={th}>工具</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(s => {
                    const hits = analytics?.byDomain?.find(d => d[0].includes(s.domain))?.[1] || 0;
                    return (
                      <tr key={s.domain} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '6px 4px' }}>
                          <a href={`https://${s.domain}`} target="_blank" style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none', fontSize: 12 }}>
                            {s.brand}
                          </a>
                          <div style={{ fontSize: 10, color: '#94a3b8' }}>{s.domain}</div>
                        </td>
                        <td style={{ padding: '6px 4px' }}>
                          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, fontWeight: 600,
                            background: s.template === 'A' ? '#dbeafe' : s.template === 'B' ? '#fef3c7' : '#fce7f3',
                            color: s.template === 'A' ? '#1e40af' : s.template === 'B' ? '#92400e' : '#9d174d',
                          }}>{s.template === 'A' ? '计算器' : s.template === 'B' ? '数据' : '攻略'}</span>
                        </td>
                        <td style={{ padding: '6px 4px', textAlign: 'right', fontSize: 12, fontWeight: 600 }}>{s.pages}</td>
                        <td style={{ padding: '6px 4px', textAlign: 'right', fontSize: 12 }}>{s.keywords}</td>
                        <td style={{ padding: '6px 4px', fontSize: 10 }}>
                          {s.hasTool ? <span style={{ color: '#10b981' }}>✓</span> : <span style={{ color: '#e2e8f0' }}>—</span>}
                          {hits > 0 && <span style={{ color: '#94a3b8', marginLeft: 4 }}>{hits}</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 地理 + 来源 (占位) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {analytics && analytics.byCountry.length > 0 ? (
              <StatBlock title="🌍 访问来源地区">
                {analytics.byCountry.slice(0, 8).map(([c, n]) => (
                  <Bar key={c} label={countryName(c)} flag={flag(c)} count={n} pct={Math.round(n/analytics.total*100)} />
                ))}
              </StatBlock>
            ) : (
              <EmptyBlock title="🌍 访问来源地区" text="有访问后显示" />
            )}
            {analytics && analytics.byRef.length > 0 ? (
              <StatBlock title="🔗 流量来源">
                {analytics.byRef.slice(0, 6).map(([r, n]) => (
                  <Bar key={r} label={r === 'direct' ? '直接访问/书签' : r} flag="" count={n} pct={Math.round(n/analytics.total*100)} />
                ))}
              </StatBlock>
            ) : (
              <EmptyBlock title="🔗 流量来源" text="有访问后显示" />
            )}
          </div>
        </div>

        {/* 页脚 */}
        <div style={{ textAlign: 'center', fontSize: 10, color: '#cbd5e1', padding: '16px 0' }}>
          仅展示聚合统计 · 不含个人信息 · 每次部署后自定义追踪数据归零 · GA 数据永久保留
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──

const th: React.CSSProperties = { padding: '6px 4px', color: '#94a3b8', fontSize: 10, fontWeight: 600, userSelect: 'none' };

function StatBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', flex: 1 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>{title}</h2>
      {children}
    </div>
  );
}

function EmptyBlock({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 10, padding: 20, border: '1px dashed #e2e8f0', textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 11, color: '#cbd5e1' }}>{text}</div>
    </div>
  );
}

function Bar({ label, flag: f, count, pct }: { label: string; flag: string; count: number; pct: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 12 }}>
      {f ? <span style={{ width: 20 }}>{f}</span> : null}
      <span style={{ flex: 1, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#0f172a' }}>{count}</span>
      <span style={{ color: '#94a3b8', fontSize: 10, width: 30 }}>{pct}%</span>
      <div style={{ width: 80, height: 4, background: '#f1f5f9', borderRadius: 2 }}>
        <div style={{ width: pct + '%', height: 4, background: '#3b82f6', borderRadius: 2 }} />
      </div>
    </div>
  );
}

function flag(code: string): string {
  const m: Record<string, string> = {
    US: '🇺🇸', GB: '🇬🇧', CA: '🇨🇦', AU: '🇦🇺', DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵', KR: '🇰🇷',
    CN: '🇨🇳', IN: '🇮🇳', BR: '🇧🇷', NL: '🇳🇱', SE: '🇸🇪', IT: '🇮🇹', ES: '🇪🇸', MX: '🇲🇽',
    RU: '🇷🇺', SG: '🇸🇬', NZ: '🇳🇿', PH: '🇵🇭', ID: '🇮🇩', TH: '🇹🇭', VN: '🇻🇳',
  };
  return m[code] || '🌐';
}

function countryName(code: string): string {
  const m: Record<string, string> = {
    US: '美国', GB: '英国', CA: '加拿大', AU: '澳大利亚', DE: '德国', FR: '法国',
    JP: '日本', KR: '韩国', CN: '中国', IN: '印度', BR: '巴西', NL: '荷兰',
    SE: '瑞典', IT: '意大利', ES: '西班牙', MX: '墨西哥', RU: '俄罗斯',
    SG: '新加坡', NZ: '新西兰', PH: '菲律宾', ID: '印尼', TH: '泰国', VN: '越南',
  };
  return m[code] || code;
}
