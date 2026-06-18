'use client';
import { useState, useEffect } from 'react';

export function GSCPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gsc-data').then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ marginTop: 24, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>📊 搜索分析 (近7天)</h3>
      <p style={{ color: '#999', fontSize: 13 }}>正在从 Google Search Console 加载数据...</p>
    </div>
  );

  if (data?.error) return (
    <div style={{ marginTop: 24, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>📊 搜索分析</h3>
      <p style={{ color: '#dc2626' }}>GSC 未配置: {data.error}</p>
    </div>
  );

  return (
    <div style={{ marginTop: 24, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>📊 Google 搜索分析 (近7天)</h3>
      {data?.sites && Object.entries(data.sites as Record<string, any>).map(([domain, siteData]) => (
        <div key={domain} style={{ marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ fontSize: 14 }}>{domain}</strong>
            <span style={{ fontSize: 12, color: '#666' }}>
              {siteData.totalClicks || 0} 点击 · {siteData.totalImpressions || 0} 展示
            </span>
          </div>
          {siteData.error && <p style={{ fontSize: 12, color: '#999' }}>{siteData.error}</p>}
          {siteData.queries?.length > 0 ? (
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', color: '#999' }}>
                  <th style={{ padding: '4px 8px' }}>搜索词</th>
                  <th style={{ padding: '4px 8px', textAlign: 'right' }}>点击</th>
                  <th style={{ padding: '4px 8px', textAlign: 'right' }}>展示</th>
                  <th style={{ padding: '4px 8px', textAlign: 'right' }}>点击率</th>
                  <th style={{ padding: '4px 8px', textAlign: 'right' }}>排名</th>
                </tr>
              </thead>
              <tbody>
                {siteData.queries.slice(0, 5).map((q: any) => (
                  <tr key={q.query} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '4px 8px' }}>{q.query}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right' }}>{q.clicks}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right' }}>{q.impressions}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right' }}>{q.ctr}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right' }}>{q.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : !siteData.error && (
            <p style={{ fontSize: 12, color: '#999' }}>暂无搜索词数据——等 Google 收录后会逐渐出现</p>
          )}
        </div>
      ))}
      {!data?.sites && <p style={{ color: '#999', fontSize: 13 }}>暂无数据——等 Google 收录后会显示。</p>}
    </div>
  );
}
