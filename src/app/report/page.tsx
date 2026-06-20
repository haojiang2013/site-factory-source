import type { Metadata } from 'next';

export const metadata: Metadata = { title: '全部决策汇总 — Site Factory' };

const decisions = [
  {
    color: '#3b82f6', status: '✅ 已完成',
    items: [
      { id: '2', title: 'Next.js 14 → 15.5.19 升级', decision: '已升级部署，7个CVE全补，编译验证200', who: '我做完了', done: true },
    ],
  },
  {
    color: '#2563eb', status: '📋 已决策 · 待执行',
    items: [
      { id: '1', title: '5个 .xyz → .com 域名', decision: '用户自己处理。此外后续还要买4个语义域名分组管理20个子站点', who: '你做' },
      { id: '3', title: 'Vercel Hobby托管 → 备选方案', decision: '首选备选 Cloudflare Pages（免费商用），次选 VPS $5/月。暂不迁移，等商用前切', who: '我做' },
      { id: '4', title: '作者署名 + Person schema', decision: '你1人署名全25站。Person schema链 GitHub + Twitter/X。不需LinkedIn', who: '你做名字 / 我做代码' },
      { id: '5', title: 'About 页差异化', decision: '路径A — 诚实网络。25站统一品牌叙事"由[你]构建的工具网络"。Organization schema 统一@id', who: '我做' },
    ],
  },
  {
    color: '#059669', status: '📋 已决策 · 待执行',
    items: [
      { id: '6', title: 'AI 内容加人工痕迹', decision: '只改12个计算器站（首页+前3页）。我搜全网真实数据源（Reddit/行业报告/政府数据）→聚合→英文改写→嵌入页面。11个数据站+2个游戏站靠作者署名+About页补信任分', who: '我做' },
      { id: '7', title: '方法论 "How We Calculate" 页', decision: '12个计算器站各1页，深入模式——公式+代入示例+美国数据源链接+区域差异诚实标注', who: '我做' },
    ],
  },
  {
    color: '#d97706', status: '📋 已决策 · 待执行',
    items: [
      { id: '8', title: '模板同质化消除', decision: '桌面5套风格 + 移动5套交互 → 25站每站不同组合。暗色模式默认。移动优先375px起步。48px触控目标。inputmode数字键盘', who: '我做（6天）' },
    ],
  },
  {
    color: '#7c3aed', status: '📋 已决策 · 待执行',
    items: [
      { id: '9', title: '20个子域名 → 子目录', decision: '买新域名，按类型分4组（家庭计算器/专业计算器/AI工具/游戏），每组一个语义域名+子目录。先不做', who: '你买域名 / 我做迁移' },
    ],
  },
  {
    color: '#ef4444', status: '⏸️ 暂缓/否决',
    items: [
      { id: '10', title: 'AdSense 申请', decision: '现在不申。等P0+P1做完+Google Search Console有展示数据再申。现在申大概率被拒', who: '以后做' },
      { id: '11', title: 'Reddit 攒 karma', decision: 'API已关。只能手动。你的号 Sad_Concept_273 需先攒karma。不紧急', who: '你做' },
      { id: '12', title: 'Pinterest 自动发Pin', decision: '✅ 已注册Business账号+域名验证通过。API正在审核中（2-4周）。通过后自动发Pin', who: '✅ 你已做完 / 我做后续' },
      { id: '13', title: 'dev.to 自动发文', decision: '唯一免费全自动渠道。等P0做完再发文章', who: '以后做' },
      { id: '14', title: '流量入口优先级重排', decision: '主战场从Google排名→AI引用（ChatGPT/Perplexity/AI Overviews）。AI流量高5倍转化率。50%品牌还没做GEO', who: '战略调整' },
    ],
  },
];

export default function ReportPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#0f172a', color: '#fff', padding: '32px 28px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>🏭 Site Factory — 全部决策汇总</h1>
          <p style={{ color: '#94a3b8', margin: '6px 0 0', fontSize: 13 }}>2026.06.20 · 14项全部讨论完毕 · Pinterest已注册 · Reddit教程已就绪</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 20px' }}>
        {/* 执行路线 */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 18px', color: '#0f172a' }}>📅 执行路线</h2>
          <div style={{ display: 'flex', gap: 0, overflow: 'auto' }}>
            {[
              { w: 'Week 1', who: '我', items: '①首段改写 · ②作者署名', color: '#3b82f6' },
              { w: 'Week 2', who: '我', items: '③About页 · ④方法论页', color: '#2563eb' },
              { w: 'Week 3', who: '我', items: '⑤AI可见度 · ⑥dev.to', color: '#7c3aed' },
              { w: 'Week 4+', who: '我', items: '⑦模板消同质(6天)', color: '#d97706' },
              { w: '你决定', who: '你', items: '.com域名 · Pinterest', color: '#059669' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, minWidth: 130 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {i + 1}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: '#0f172a' }}>{s.w}</div>
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>👤 {s.who}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginLeft: 36, borderLeft: i < 4 ? '2px solid #e2e8f0' : 'none', paddingLeft: 10, paddingBottom: 16, lineHeight: 1.7 }}>
                  {s.items}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decision cards */}
        {decisions.map((section, si) => (
          <div key={si} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: section.color, marginBottom: 10 }}>{section.status}</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {section.items.map(item => (
                <div key={item.id} style={{
                  background: '#fff', borderRadius: 12, padding: '16px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
                  borderLeft: '3px solid ' + section.color,
                  opacity: (item as any).done ? 0.88 : 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                      background: (item as any).done ? '#10b981' : section.color,
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {(item as any).done ? '✓' : item.id}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.6 }}>{item.decision}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, background: '#f8fafc', padding: '4px 8px', borderRadius: 5, display: 'inline-block' }}>
                        👤 {item.who}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Strategy shift box */}
        <div style={{ background: '#eff6ff', borderRadius: 14, padding: 20, border: '1px solid #bfdbfe', marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px', color: '#1e40af' }}>🔄 核心战略转向</h3>
          <div style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.7 }}>
            <strong>以前</strong>：做 SEO → 等 Google 排名 → 来流量<br/>
            <strong>现在</strong>：做 E-E-A-T → AI 引用你 → ChatGPT/Perplexity/AI Overviews 推荐你 → 来流量<br/><br/>
            Google 排名是副产品，AI 引用才是主战场。AI 流量转化率 14.2% vs Google 2.8%（高 5 倍）。50% 品牌还没做 GEO——窗口还开着。
          </div>
        </div>

        {/* Traffic channels */}

        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#0f172a' }}>🚀 流量入口全景（按价值排序）</h2>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={th2}>#</th><th style={th2}>渠道</th><th style={th2}>类型</th><th style={th2}>能自动吗</th><th style={th2}>流量价值</th><th style={th2}>时机</th><th style={th2}>状态</th><th style={th2}>谁做</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1','AI搜索引用','ChatGPT/Perplexity/AIO引用','❌被动','⭐⭐⭐⭐⭐ 最高','P0做完即生效','🟡 等P0','—'],
                  ['2','Google自然搜索','SEO排名','❌被动','⭐⭐⭐⭐⭐','沙盒3-6月','🟡 等待','—'],
                  ['3','dev.to','文章发API','✅全自动','⭐⭐⭐','P0做完','🟢 可立即','我做'],
                  ['4','Reddit手动','r/moving等子版回复','❌手动','⭐⭐⭐⭐','已在做','🟡 Sad_Concept_273','你做'],
                  ['5','Pinterest','发Pin图片','✅API(审批后)','⭐⭐⭐⭐','2-4周审批','🟡 审核中','✅ 你已注册'],
                  ['6','Medium','借力发文','❌手动','⭐⭐⭐','随时','🟡 可做','我做'],
                  ['7','LinkedIn文章','B2B查询排名','❌手动','⭐⭐⭐','随时','🟡 可做','我做'],
                  ['8','TikTok/Shorts','计算器录屏','❌手动','⭐⭐','随时','🟢 可做','你做'],
                  ['9','Mastodon','自动3x/天','✅已自动','⭐','已在跑','✅ 已跑通','—'],
                  ['10','Product Hunt','产品发布','❌手动','⭐⭐一次性','1站已做','🟡 剩24站','你做'],
                  ['11','HN/IndieHackers','社区发帖','❌手动','⭐⭐一次性','随时','🟡 可做','你做'],
                  ['12','Email订阅','Newsletter','❌被动','⭐⭐⭐','需积累','🟡 Mailchimp已装','—'],
                ].map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc', background: i < 2 ? '#fef3c7' : 'transparent' }}>
                    <td style={{...td, fontWeight:700, color:'#94a3b8'}}>{r[0]}</td>
                    <td style={{...td, fontWeight:600}}>{r[1]}</td>
                    <td style={{...td, color:'#64748b',fontSize:11}}>{r[2]}</td>
                    <td style={td}>{r[3]}</td>
                    <td style={{...td,fontSize:11}}>{r[4]}</td>
                    <td style={{...td,fontSize:11}}>{r[5]}</td>
                    <td style={td}>{r[6]}</td>
                    <td style={{...td,fontSize:11,color:'#94a3b8'}}>{r[7]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
            <strong style={{ color: '#d97706' }}>🔑 关键变化</strong>：Google排名不是目标——AI引用才是。ChatGPT/Perplexity/AI Overviews 引用你的站 → 点击 → 转化。AI流量转化率 14.2% vs Google 2.8%（高5倍）。50%品牌还没做GEO，窗口还开着。<br/>
            <strong style={{ color: '#dc2626' }}>最大的坑</strong>：Reddit API已关（不能自动发）、Quora无API（不能发）、Medium API已死（不能用）。这三条路死了。
          </div>
        </div>

        {/* Risk box */}
        <div style={{ background: '#fef2f2', borderRadius: 14, padding: 20, border: '1px solid #fecaca' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px', color: '#991b1b' }}>⚠️ 最大风险提醒</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, fontSize: 12, color: '#7f1d1d' }}>
            <span>· SpamBrain识别25站垃圾网络→全站清零</span>
            <span>· .xyz长期劣势→排名天花板</span>
            <span>· Vercel关停→所有站下线</span>
            <span>· AI内容3月后集体崩盘</span>
            <span>· 没署名+没About页=AI不引用</span>
            <span>· 模板雷同=Google识别为农场</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 10, color: '#cbd5e1' }}>
          研究来源：Google官方文档 · QRG 2025 · John Mueller · Gary Illyes · Danny Sullivan · Ahrefs 60万页 · SE Ranking 16月实验 · GoodWeb A/B · 892域名迁移案例 · 2026 Spam Update
        </div>
      </div>
    </div>
  );
}

const th2: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', color: '#94a3b8', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '8px 10px', borderBottom: '1px solid #f8fafc', fontSize: 12, color: '#334155', lineHeight: 1.5 };
