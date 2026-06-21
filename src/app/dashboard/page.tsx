'use client';

import { useEffect, useState, useMemo, Fragment } from 'react';

interface SiteRow { domain: string; brand: string; niche: string; template: string; pages: number; keywords: number; kwTarget: number; lastUpdated: string; hasTool?: boolean; }
interface SiteItem extends SiteRow { color: string; groupName: string; score: string; online: boolean|null; starred: boolean; trend: number; freshness: number; kwCov: number }
interface SiteData { total: number; totalPages: number; sites: SiteRow[] }

const GROUP_COLORS: Record<string, {color:string;name:string}> = {
  'dark-gradient':{color:'#6366f1',name:'AI工具'},
  'minimal-white':{color:'#2563eb',name:'金融'},
  'fresh-green':{color:'#059669',name:'家用'},
  'industrial-warm':{color:'#ea580c',name:'工业'},
  'game-dark':{color:'#a855f7',name:'游戏'},
};

// dir → group mapping
const dirGroup: Record<string,string> = {
  'site-004':'dark-gradient','site-008':'dark-gradient','site-011':'dark-gradient','site-012':'dark-gradient','site-013':'dark-gradient','site-021':'dark-gradient','site-022':'dark-gradient','site-023':'dark-gradient',
  'site-001':'minimal-white','site-002':'minimal-white',
  'site-003':'fresh-green','site-017':'fresh-green','site-018':'fresh-green','site-019':'fresh-green',
  'site-006':'industrial-warm','site-007':'industrial-warm','site-009':'industrial-warm','site-016':'industrial-warm','site-020':'industrial-warm',
  'site-005':'game-dark','site-010':'game-dark','site-014':'game-dark','site-015':'game-dark','site-024':'game-dark','site-025':'game-dark',
};

// Country code → flag emoji
const countryFlag = (code: string): string => {
  if (!code || code.length !== 2) return '';
  const base = 0x1F1E6 - 65;
  return String.fromCodePoint(base + code.charCodeAt(0), base + code.charCodeAt(1));
};

// Country code → Chinese name
const countryCN = (code: string): string => {
  const map: Record<string,string> = {
    US:'美国',SG:'新加坡',CN:'中国',AE:'阿联酋',CA:'加拿大',FR:'法国',JP:'日本',
    CL:'智利',DE:'德国',IR:'伊朗',RU:'俄罗斯',TW:'台湾',HK:'香港',KR:'韩国',
    GB:'英国',AU:'澳大利亚',IN:'印度',BR:'巴西',IT:'意大利',ES:'西班牙',
    MX:'墨西哥',NL:'荷兰',SE:'瑞典',CH:'瑞士',NO:'挪威',DK:'丹麦',
    FI:'芬兰',PL:'波兰',TR:'土耳其',SA:'沙特',TH:'泰国',VN:'越南',
    ID:'印尼',MY:'马来西亚',PH:'菲律宾',NZ:'新西兰',IE:'爱尔兰',AT:'奥地利',
    BE:'比利时',PT:'葡萄牙',CZ:'捷克',GR:'希腊',HU:'匈牙利',RO:'罗马尼亚',
    UA:'乌克兰',ZA:'南非',EG:'埃及',NG:'尼日利亚',KE:'肯尼亚',IL:'以色列',
    PK:'巴基斯坦',BD:'孟加拉',CO:'哥伦比亚',AR:'阿根廷',PE:'秘鲁',
  };
  return map[code] || '';
};

export default function DashboardPage() {
  const [sites, setSites] = useState<SiteItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('all');
  const [pinging, setPinging] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [toolResults, setToolResults] = useState<{total:number;healthy:number;unhealthy:number;results:any[]}|null>(null);
  const [checkingTools, setCheckingTools] = useState(false);
  const [gaData, setGaData] = useState<any>(null);
  const [gscData, setGscData] = useState<any>(null);

  useEffect(()=>{
    fetch('/api/ga-stats/').then(r=>r.json()).then(d=>{if(!d.error)setGaData(d)}).catch(()=>{});
    fetch('/api/gsc-stats/').then(r=>r.json()).then(d=>{if(!d.error)setGscData(d)}).catch(()=>{});
  },[]);

  const toggleCompare = (domain:string)=>{
    setCompare(prev=>prev.includes(domain)?prev.filter(d=>d!==domain):prev.length<2?[...prev,domain]:prev);
  };

  // Load previous snapshot for trend comparison
  const loadSnapshot = ():Record<string,{pages:number;kw:number}>|null => {
    try{const r=localStorage.getItem('df-snapshot');return r?JSON.parse(r):null;}catch{return null;}
  };
  const saveSnapshot = (list:SiteItem[]) => {
    const snap:Record<string,{pages:number;kw:number}>={};
    list.forEach(s=>{snap[s.domain]={pages:s.pages,kw:s.keywords}});
    try{localStorage.setItem('df-snapshot',JSON.stringify(snap))}catch{}
  };

  useEffect(() => {
    fetch('/api/site-stats/').then(r=>r.json()).then((d:SiteData)=>{
      const prev=loadSnapshot();
      const list=(d.sites||[]).map((s,i)=>{
        const dir='site-'+(String(i+1).padStart(3,'0'));
        const grp=dirGroup[dir]||'dark-gradient';
        const gc=GROUP_COLORS[grp]||{color:'#6366f1',name:'未知'};
        let score='C';
        if(s.pages>=10&&s.keywords>=12) score='A';
        else if(s.pages>=7&&s.keywords>=8) score='B';
        const trend=prev&&prev[s.domain]?s.pages-prev[s.domain].pages:0;
        const now=Date.now();
        const updated=new Date(s.lastUpdated).getTime();
        const freshness=Math.floor((now-updated)/(1000*60*60*24));
        const kwCov=s.kwTarget>0?Math.round(s.pages/s.kwTarget*100):0;
        return {...s,color:gc.color,groupName:gc.name,score,online:null,starred:false,trend,freshness,kwCov};
      });
      // Apply saved stars to list before setting state
      try{
        const stars: string[] = JSON.parse(localStorage.getItem('df-stars')||'[]');
        stars.forEach(d=>{const s=list.find(x=>x.domain===d);if(s)s.starred=true;});
      }catch{}
      setSites(list);setTotalPages(d.totalPages||0);
      saveSnapshot(list);
    }).catch(()=>{});
  }, []);

  const pingAll = async ()=>{
    setPinging(true);
    const updated=await Promise.all(sites.map(async s=>{
      try{const r=await fetch(`https://${s.domain}/`,{signal:AbortSignal.timeout(5000)});return{...s,online:r.ok};}
      catch{return{...s,online:false};}
    }));
    setSites(updated);setPinging(false);
  };

  const checkTools = async ()=>{
    setCheckingTools(true);
    try{const r=await fetch('/api/tool-health/');const d=await r.json();setToolResults(d);}catch{}
    setCheckingTools(false);
  };

  const toggleStar = (domain:string)=>{
    setSites(prev=>{
      const next=prev.map(s=>s.domain===domain?{...s,starred:!s.starred}:s);
      try{localStorage.setItem('df-stars',JSON.stringify(next.filter(s=>s.starred).map(s=>s.domain)))}catch{}
      return next;
    });
  };

  const filtered=useMemo(()=>{
    let list=filter==='all'?sites:filter==='starred'?sites.filter(s=>s.starred):sites.filter(s=>s.template===filter);
    return list;
  },[sites,filter]);

  const problems=filtered.filter(s=>s.pages<=5||s.keywords===0||s.online===false).length;
  const aCount=sites.filter(s=>s.score==='A').length;
  const bCount=sites.filter(s=>s.score==='B').length;
  const cCount=sites.filter(s=>s.score==='C').length;
  const tA=sites.filter(s=>s.template==='A').length;
  const tB=sites.filter(s=>s.template==='B').length;
  const kwCov=sites.length>0?Math.round(sites.reduce((a,s)=>a+s.pages,0)/Math.max(1,sites.reduce((a,s)=>a+(s.kwTarget||0),0))*100):0;

  // Issues content
  const thinSites=sites.filter(s=>s.pages<=5).map(s=>s.brand).join('、');
  const noKwSites=sites.filter(s=>s.keywords===0).map(s=>s.brand).join('、');

  return (
    <div style={{minHeight:'100vh',background:'#f0fdf4',color:'#18181b',fontFamily:"system-ui,'PingFang SC','Microsoft YaHei',sans-serif",padding:'32px 40px'}}>
      <div style={{maxWidth:1400,margin:'0 auto'}}>

        {/* ── HEADER ── */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28,padding:'18px 24px',background:'#fff',border:'1px solid #e4e4e7',borderRadius:16,boxShadow:'0 1px 2px rgba(0,0,0,0.03)'}}>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <h1 style={{fontSize:20,fontWeight:600,margin:0,letterSpacing:'-0.3px'}}>🏭 站点指挥中心</h1>
            <span style={{fontSize:12,background:'#f4f4f5',color:'#71717a',padding:'4px 14px',borderRadius:24}}>{sites.length} 站 · {totalPages} 页</span>
            {problems>0
              ?<span style={{fontSize:12,background:'rgba(245,158,11,0.1)',color:'#d97706',padding:'4px 14px',borderRadius:24,fontWeight:500}}>⚠ {problems} 个关注</span>
              :<span style={{fontSize:12,background:'rgba(16,185,129,0.1)',color:'#059669',padding:'4px 14px',borderRadius:24,fontWeight:500}}>✓ 全部健康</span>
            }
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={pingAll} disabled={pinging} style={{fontSize:12,background:'#eff6ff',color:'#2563eb',padding:'6px 16px',borderRadius:24,border:'none',cursor:'pointer',fontWeight:500}}>{pinging?'⏳ 检测中...':'🔄 刷新在线检测'}</button>
            <button onClick={checkTools} disabled={checkingTools} style={{fontSize:12,background:'#fef3c7',color:'#d97706',padding:'6px 16px',borderRadius:24,border:'none',cursor:'pointer',fontWeight:500}}>{checkingTools?'⏳ 检测中...':'🔧 工具健康'}</button>
            <a href="https://analytics.google.com" target="_blank" style={{fontSize:12,color:'#71717a',textDecoration:'none',background:'#f4f4f5',padding:'4px 14px',borderRadius:24}}>GA 后台 →</a>
            <a href="https://vercel.com/stevengu77-2664s-projects/site-factory/analytics" target="_blank" style={{fontSize:12,color:'#71717a',textDecoration:'none',background:'#f4f4f5',padding:'4px 14px',borderRadius:24}}>Vercel →</a>
          </div>
        </div>

        {/* ── KPI ── */}
        <div style={{display:'flex',gap:14,marginBottom:24}}>
          {[[sites.length,'站点总数','#2563eb'],[totalPages,'页面总数','#7c3aed'],[aCount,'A 级站','#059669'],[bCount,'B 级站','#d97706'],[cCount,'C 级站','#dc2626'],[kwCov+'%','词覆盖率','#0891b2']].map(([n,l,c],i)=>(
            <div key={i} style={{flex:1,background:'#fff',border:'1px solid #e4e4e7',borderRadius:14,padding:'20px 22px',textAlign:'center',boxShadow:'0 1px 2px rgba(0,0,0,0.02)'}}>
              <div style={{fontSize:36,fontWeight:700,color:c as string,letterSpacing:'-1px',lineHeight:1.1}}>{n}</div>
              <div style={{fontSize:12,color:'#a1a1aa',marginTop:4}}>{l as string}</div>
            </div>
          ))}
        </div>

        {/* ── ALERTS ── */}
        {(thinSites||noKwSites) && (
          <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
            {thinSites&&<span style={{padding:'10px 18px',borderRadius:10,fontSize:13,background:'rgba(245,158,11,0.08)',color:'#d97706',border:'1px solid rgba(245,158,11,0.2)'}}>⚠ 薄页站：{thinSites}</span>}
            {noKwSites&&<span style={{padding:'10px 18px',borderRadius:10,fontSize:13,background:'rgba(245,158,11,0.08)',color:'#d97706',border:'1px solid rgba(245,158,11,0.2)'}}>⚠ 缺关键词：{noKwSites}</span>}
            <span style={{padding:'10px 18px',borderRadius:10,fontSize:13,background:'rgba(16,185,129,0.06)',color:'#059669',border:'1px solid rgba(16,185,129,0.15)'}}>✓ 其余站点正常</span>
          </div>
        )}

        {/* ── TABS ── */}
        <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>站点列表</div>
        <div style={{display:'flex',gap:6,marginBottom:20}}>
          {[['all','全部 25 站'],['starred','⭐ 收藏'],['A','🧮 计算器'],['B','📊 数据对比'],['C','🎮 游戏攻略']].map(([k,label])=>(
            <button key={k} onClick={()=>setFilter(k)} style={{padding:'8px 20px',borderRadius:10,fontSize:13,cursor:'pointer',border:'1px solid #e4e4e7',background:filter===k?'#18181b':'#fff',color:filter===k?'#fafafa':'#71717a',fontWeight:500,transition:'all .15s'}}>{label}</button>
          ))}
        </div>

        {/* ── SITE CARDS ── */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14,marginBottom:28}}>
          {filtered.map(s=>{
            const catLabel=s.template==='A'?'计算器':s.template==='B'?'数据':'攻略';
            const catBg=s.template==='A'?'#eef2ff':s.template==='B'?'#ecfdf5':'#f5f3ff';
            const catColor=s.template==='A'?'#4f46e5':s.template==='B'?'#059669':'#a855f7';
            const scoreBg=s.score==='A'?'#dcfce7':s.score==='B'?'#fef3c7':'#fee2e2';
            const scoreColor=s.score==='A'?'#166534':s.score==='B'?'#92400e':'#991b1b';
            return (
              <a key={s.domain} href={`https://${s.domain}`} target="_blank" rel="noopener"
                style={{background:'#fff',border:'1px solid #e4e4e7',borderRadius:14,padding:20,textDecoration:'none',color:'inherit',display:'block',position:'relative',overflow:'hidden',boxShadow:'0 1px 2px rgba(0,0,0,0.02)',borderTop:'3px solid '+s.color,transition:'all .2s'}}
                onMouseEnter={e=>{const t=e.currentTarget;t.style.borderColor=s.color;t.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';t.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{const t=e.currentTarget;t.style.borderColor='#e4e4e7';t.style.boxShadow='0 1px 2px rgba(0,0,0,0.02)';t.style.transform='none'}}>
                <span onClick={e=>{e.preventDefault();toggleCompare(s.domain)}} style={{position:'absolute',top:14,left:16,fontSize:16,cursor:'pointer',opacity:compare.includes(s.domain)?1:0.25,lineHeight:'18px'}} title="加入对比">{compare.includes(s.domain)?'☑':'☐'}</span>
                <span onClick={e=>{e.preventDefault();toggleStar(s.domain)}} style={{position:'absolute',top:14,right:44,fontSize:15,cursor:'pointer',opacity:s.starred?1:0.3}}>{s.starred?'⭐':'☆'}</span>
                <span style={{position:'absolute',top:16,right:16,fontSize:12,fontWeight:700,padding:'4px 10px',borderRadius:4,background:scoreBg,color:scoreColor}}>{s.score}</span>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10,paddingRight:56}}>
                  <span style={{fontSize:15,fontWeight:600}}>{s.template==='A'?'🧮':s.template==='B'?'📊':'🎮'} {s.brand}</span>
                  <span style={{fontSize:11,padding:'3px 10px',borderRadius:4,fontWeight:600,background:catBg,color:catColor,whiteSpace:'nowrap'}}>{catLabel}</span>
                </div>
                <div style={{fontSize:13,color:'#71717a',marginBottom:14,lineHeight:1.5,paddingRight:40}}>{s.niche} · {s.domain}</div>
                <div style={{display:'flex',gap:16,fontSize:12,color:'#a1a1aa',paddingTop:12,borderTop:'1px solid #f4f4f5',flexWrap:'wrap',alignItems:'center'}}>
                  <span><span style={{width:6,height:6,borderRadius:'50%',display:'inline-block',marginRight:4,background:s.online===true?'#10b981':s.online===false?'#ef4444':'#d4d4d8',animation:s.online===true?'pulse 2s infinite':'none'}}/>{s.online===true?'在线':s.online===false?'离线':'未检测'}</span>
                  <span>📄 {s.pages} 页{s.trend>0?<span style={{color:'#059669',marginLeft:2,fontWeight:600}}> ↑{s.trend}</span>:s.trend<0?<span style={{color:'#dc2626',marginLeft:2,fontWeight:600}}> ↓{Math.abs(s.trend)}</span>:null}</span>
                  <span>🔑 {s.keywords} 词</span>
                  <span style={{color:s.kwCov>=80?'#059669':s.kwCov>=50?'#d97706':'#dc2626'}}>🎯 {s.kwCov}% 覆盖</span>
                  <span style={{color:s.freshness>90?'#dc2626':s.freshness>30?'#d97706':'#059669',marginLeft:'auto'}}>🕐 {s.freshness}天前</span>
                  <span style={{color:'#a1a1aa'}}>{s.groupName}</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* ── COMPARE PANEL ── */}
        {compare.length===2&&(()=>{
          const a=sites.find(s=>s.domain===compare[0]);
          const b=sites.find(s=>s.domain===compare[1]);
          if(!a||!b) return null;
          const rows:{label:string; ak:keyof SiteItem; bk?:keyof SiteItem; fmt?:(v:any)=>string; better?:(a:any,b:any)=>number}[]=[
            {label:'品牌',ak:'brand',better:(a,b)=>0},
            {label:'域名',ak:'domain',better:(a,b)=>0},
            {label:'模板',ak:'template',fmt:v=>({A:'🧮 计算器',B:'📊 数据对比',C:'🎮 游戏攻略'}[v as string]||v),better:(a,b)=>0},
            {label:'分组',ak:'groupName',better:(a,b)=>0},
            {label:'页数',ak:'pages',better:(a,b)=>a>b?1:a<b?-1:0},
            {label:'关键词',ak:'keywords',better:(a,b)=>a>b?1:a<b?-1:0},
            {label:'覆盖率',ak:'kwCov',fmt:v=>v+'%',better:(a,b)=>a>b?1:a<b?-1:0},
            {label:'新鲜度',ak:'freshness',fmt:v=>v+'天前',better:(a,b)=>a<b?1:a>b?-1:0},
            {label:'评分',ak:'score',better:(a,b)=>a==='A'?1:b==='A'?-1:a==='B'&&b!=='A'?1:-1},
            {label:'在线',ak:'online',fmt:v=>v===true?'🟢在线':v===false?'🔴离线':'未检测',better:(a,b)=>0},
            {label:'趋势',ak:'trend',fmt:v=>v>0?`↑+${v}`:v<0?`↓${v}`:'→0',better:(a,b)=>a>b?1:a<b?-1:0},
          ];
          return (
            <div style={{marginBottom:24,background:'#fff',border:'1px solid #e4e4e7',borderRadius:14,padding:24,boxShadow:'0 1px 2px rgba(0,0,0,0.03)'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                <div style={{fontSize:14,fontWeight:600}}>🔄 站点对比</div>
                <button onClick={()=>setCompare([])} style={{fontSize:11,background:'#f4f4f5',border:'none',borderRadius:8,padding:'4px 14px',cursor:'pointer',color:'#71717a'}}>✕ 关闭对比</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 24px',fontSize:13}}>
                <div style={{fontWeight:600,padding:'10px 0',borderBottom:'2px solid #18181b',textAlign:'center'}}>{a.brand}</div>
                <div style={{fontWeight:600,padding:'10px 0',borderBottom:'2px solid #18181b',textAlign:'center'}}>{b.brand}</div>
                {rows.map((r,i)=>{
                  const av=r.ak?String(a[r.ak]??''):'';
                  const bv=r.ak?String(b[r.ak]??''):'';
                  const cmp=r.better?r.better(r.ak?a[r.ak]:null,r.ak?b[r.ak]:null):0;
                  const abg=cmp===1?'rgba(16,185,129,0.06)':cmp===-1?'rgba(239,68,68,0.04)':'transparent';
                  const bbg=cmp===-1?'rgba(16,185,129,0.06)':cmp===1?'rgba(239,68,68,0.04)':'transparent';
                  const atc=cmp===1?'#059669':cmp===-1?'#dc2626':'inherit';
                  const btc=cmp===-1?'#059669':cmp===1?'#dc2626':'inherit';
                  return <div key={i} style={{display:'contents'}}>
                    <div style={{padding:'9px 14px',borderBottom:'1px solid #f4f4f5',background:abg,color:atc,fontWeight:cmp===1?600:400}}>{r.fmt?r.fmt(av):av}</div>
                    <div style={{padding:'9px 14px',borderBottom:'1px solid #f4f4f5',background:bbg,color:btc,fontWeight:cmp===-1?600:400}}>{r.fmt?r.fmt(bv):bv}</div>
                  </div>;
                })}
              </div>
            </div>
          );
        })()}

        {/* ── DISTRIBUTION MAP ── */}
        {(()=>{
          const groups=['AI工具','金融','家用','工业','游戏'];
          const tmpls=['A','B','C'];
          const tmplLabels:Record<string,string>={A:'🧮 计算器',B:'📊 数据对比',C:'🎮 游戏攻略'};
          const groupColor:Record<string,string>={};
          sites.forEach(s=>{if(!groupColor[s.groupName]) groupColor[s.groupName]=s.color});
          const m:Record<string,Record<string,number>>={};
          groups.forEach(g=>{m[g]={};tmpls.forEach(t=>{m[g][t]=0})});
          sites.forEach(s=>{if(m[s.groupName]) m[s.groupName][s.template]=(m[s.groupName][s.template]||0)+1});
          const maxVal=Math.max(1,...groups.flatMap(g=>tmpls.map(t=>m[g][t])));
          return (
            <div style={{marginBottom:28}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>📊 分布矩阵 · 5组 × 3模板</div>
              <div style={{display:'grid',gridTemplateColumns:'120px repeat(3,1fr)',gap:6,fontSize:13}}>
                <div style={{fontWeight:600,color:'#71717a',padding:'10px 12px'}}></div>
                {tmpls.map(t=><div key={t} style={{fontWeight:600,color:'#71717a',textAlign:'center',padding:'10px 12px',background:'#fff',borderRadius:8,border:'1px solid #e4e4e7'}}>{tmplLabels[t]}</div>)}
                {groups.map(g=><Fragment key={g}>
                  <div style={{fontWeight:600,padding:'10px 12px',background:'#fff',borderRadius:8,border:'1px solid #e4e4e7',display:'flex',alignItems:'center'}}>
                    <span style={{width:8,height:8,borderRadius:2,background:groupColor[g]||'#6366f1',marginRight:8}}/>{g}
                  </div>
                  {tmpls.map(t=>{
                    const v=m[g][t];
                    const intensity=v/maxVal;
                    const bg=v>0?`rgba(99,102,241,${0.08+intensity*0.18})`:'#fafafa';
                    const tc=v>0?'#18181b':'#d4d4d8';
                    return <div key={t} style={{textAlign:'center',padding:'16px 12px',background:bg,borderRadius:8,border:'1px solid #e4e4e7',fontWeight:700,fontSize:20,color:tc}}>{v||'—'}</div>;
                  })}
                </Fragment>)}
              </div>
              <div style={{display:'flex',gap:20,marginTop:10,fontSize:11,color:'#a1a1aa',justifyContent:'center'}}>
                {tmpls.map(t=>(<span key={t}>{tmplLabels[t]}: {groups.reduce((a,g)=>a+m[g][t],0)} 站</span>))}
                <span>总计: {sites.length} 站</span>
              </div>
            </div>
          );
        })()}

        {/* ── SMART SUGGESTIONS ── */}
        {(()=>{
          const tips: {brand:string;msg:string;sev:'critical'|'warn'|'good'}[]=[];
          sites.forEach(s=>{
            if(s.pages<=5) tips.push({brand:s.brand,msg:`仅 ${s.pages} 页，内容严重不足 → 建议补至12页`,sev:'critical'});
            if(s.keywords===0) tips.push({brand:s.brand,msg:'缺关键词研究数据 → 需要运行kw-research',sev:'critical'});
            if(s.kwTarget>0&&s.pages>0&&s.pages/s.kwTarget<0.5) tips.push({brand:s.brand,msg:`关键词覆盖率仅 ${s.kwCov}%（${s.pages}/${s.kwTarget}）→ 建议创建目标页`,sev:'warn'});
            if(s.freshness>90) tips.push({brand:s.brand,msg:`${s.freshness} 天未更新 → 内容可能过时，建议刷新`,sev:'critical'});
            else if(s.freshness>30) tips.push({brand:s.brand,msg:`${s.freshness} 天未更新 → 建议近期刷新内容`,sev:'warn'});
            if(s.kwCov>=80&&s.pages>=10&&s.freshness<=30) tips.push({brand:s.brand,msg:'各项指标健康 ✓',sev:'good'});
          });
          const display=tips.filter(t=>t.sev!=='good');
          const goodCount=tips.filter(t=>t.sev==='good').length;
          if(display.length===0) return <div style={{marginBottom:24,textAlign:'center',fontSize:13,color:'#059669'}}>✅ 全部25站状态良好，无需关注</div>;
          return (
            <div style={{marginBottom:28}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
                💡 智能建议
                {goodCount>0&&<span style={{fontSize:11,fontWeight:400,color:'#059669',background:'rgba(16,185,129,0.06)',padding:'2px 10px',borderRadius:12}}>✅ {goodCount} 站健康</span>}
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {display.slice(0,8).map((t,i)=>(
                  <div key={i} style={{padding:'10px 16px',borderRadius:10,fontSize:12,background:t.sev==='critical'?'rgba(239,68,68,0.06)':'rgba(245,158,11,0.06)',border:`1px solid ${t.sev==='critical'?'rgba(239,68,68,0.2)':'rgba(245,158,11,0.2)'}`,color:t.sev==='critical'?'#dc2626':'#d97706',display:'flex',alignItems:'center',gap:6}}>
                    <span>{t.sev==='critical'?'🔴':'🟡'}</span>
                    <span><strong>{t.brand}</strong> — {t.msg}</span>
                  </div>
                ))}
                {display.length>8&&<div style={{padding:'10px 16px',fontSize:11,color:'#a1a1aa'}}>...还有 {display.length-8} 条建议</div>}
              </div>
            </div>
          );
        })()}

        {/* ── TOOL HEALTH ── */}
        {toolResults && (
          <div style={{marginBottom:28,background:'#fff',border:'1px solid #e4e4e7',borderRadius:14,padding:24,boxShadow:'0 1px 2px rgba(0,0,0,0.03)'}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
              🔧 工具健康报告
              <span style={{fontSize:12,fontWeight:400,color:'#059669'}}>✅ {toolResults.healthy} 健康</span>
              {toolResults.unhealthy>0&&<span style={{fontSize:12,fontWeight:400,color:'#dc2626'}}>⚠ {toolResults.unhealthy} 异常</span>}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              {(toolResults.results||[]).map((t:any)=>(
                <div key={t.domain} style={{padding:'10px 16px',borderRadius:10,fontSize:12,background:t.healthy?'rgba(16,185,129,0.05)':'rgba(239,68,68,0.05)',border:`1px solid ${t.healthy?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.2)'}`,color:t.healthy?'#059669':'#dc2626',minWidth:200}}>
                  <div style={{fontWeight:600,marginBottom:4}}>{t.healthy?'✅':'⚠'} {t.brand}</div>
                  <div style={{fontSize:11,opacity:0.8}}>{t.jsCodeLen}字符 · {t.testCaseCount}测试用例 · {t.tcInCode}注释</div>
                  {!t.healthy&&<div style={{fontSize:11,marginTop:4,opacity:0.9}}>{t.issues.join(' · ')}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GA4 + GSC LIVE DATA ── */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:28}}>
          {/* ⑫ Geography */}
          <div style={{background:'#fff',border:'1px solid #ec489920',borderRadius:12,padding:18,borderTop:'3px solid #ec4899'}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>🌍 访问地区</div>
            {gaData?.geo?.length>0 ? (
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {gaData.geo.slice(0,6).map((g:any,i:number)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:12,alignItems:'center'}}>
                    <span>{countryFlag(g.country)} {countryCN(g.country) || g.country}</span>
                    <span style={{color:'#a1a1aa'}}>{g.users} 用户</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{fontSize:11,color:'#a1a1aa',textAlign:'center',padding:'20px 0'}}>{gaData?.error||'配置后显示国家分布数据'}</div>
            )}
          </div>

          {/* ⑬ Traffic */}
          <div style={{background:'#fff',border:'1px solid #ec489920',borderRadius:12,padding:18,borderTop:'3px solid #ec4899'}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>🔗 流量入口</div>
            {gaData?.categories ? (
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {[
                  {k:'google',label:'Google',icon:'🔍'},
                  {k:'direct',label:'直接访问',icon:'↗️'},
                  {k:'reddit',label:'Reddit',icon:'🤖'},
                  {k:'other',label:'其他',icon:'🔗'},
                ].map(({k,label,icon})=>{
                  const d=gaData.categories[k];
                  return (
                    <div key={k} style={{display:'flex',alignItems:'center',gap:8,fontSize:12}}>
                      <span>{icon}</span><span style={{flex:1}}>{label}</span>
                      <span style={{color:'#71717a'}}>{d.sessions.toLocaleString()}</span>
                      <span style={{fontWeight:600,color:'#2563eb',minWidth:36,textAlign:'right'}}>{d.pct}%</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{fontSize:11,color:'#a1a1aa',textAlign:'center',padding:'20px 0'}}>{gaData?.error||'配置后显示流量来源分布'}</div>
            )}
          </div>

          {/* ⑰ GSC Keywords */}
          <div style={{background:'#fff',border:'1px solid #ec489920',borderRadius:12,padding:18,borderTop:'3px solid #ec4899'}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>🔑 关键词点击 {gscData?.verified>0&&<span style={{fontSize:10,fontWeight:400,color:'#059669'}}>已验证 {gscData.verified} 站</span>}</div>
            {gscData?.sites?.length>0 ? (
              <div style={{display:'flex',flexDirection:'column',gap:6,fontSize:12}}>
                <div style={{display:'flex',justifyContent:'space-between',color:'#71717a',fontWeight:600,marginBottom:4}}>
                  <span>站点</span><span>点击/展示</span>
                </div>
                {gscData.sites.filter((s:any)=>!s.error).slice(0,7).map((s:any,i:number)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between'}}>
                    <span>{s.label}</span>
                    <span style={{color:'#71717a'}}>{s.clicks}/{s.impressions}</span>
                  </div>
                ))}
                {gscData.totalClicks>0&&(
                  <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid #f4f4f5',display:'flex',justifyContent:'space-between',fontWeight:600}}>
                    <span>合计</span><span style={{color:'#2563eb'}}>{gscData.totalClicks} 点击 / {gscData.totalImpressions.toLocaleString()} 展示</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{fontSize:11,color:'#a1a1aa',textAlign:'center',padding:'20px 0'}}>{gscData?.error||'配置后显示关键词点击数据'}</div>
            )}
          </div>
        </div>

        <div style={{textAlign:'center',fontSize:11,color:'#d4d4d8'}}>
          ⭐ 收藏 · 🏷️ 分组标签 · 🅰️ 质量评级 · 🟢 在线检测 · ☑ 对比 · 🔧 工具健康 · 点卡片直达站点
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
      </div>
    </div>
  );
}
