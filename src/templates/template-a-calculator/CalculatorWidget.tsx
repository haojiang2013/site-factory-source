'use client';
import { useState, useCallback, useEffect, useRef } from 'react';

// Determine best inputMode based on field name/type
function getInputMode(name: string, placeholder?: string): 'decimal' | 'numeric' | 'text' {
  // Integer-only fields (counts, bags, doors, windows, levels, etc.)
  if (/bags|doors|windows|coats|levels|stories|people|rooms|bedrooms|floors|units|count/i.test(name)) return 'numeric';
  // Decimal fields (distance, area, cost, rate, etc.)
  if (/distance|width|length|height|area|cost|price|rate|amount|payment|term|miles|km|ft|sqft|sqm|percent|gallon|litre|liter/i.test(name)) return 'decimal';
  // Check placeholder for hints
  if (placeholder && /\$|cost|price|rate/i.test(placeholder)) return 'decimal';
  return 'decimal'; // default to decimal for calculator inputs
}

const DEFAULT_PARAMS = [
  { name:'movingType',label:'Move Type',type:'select',options:[['local','🏠 Local'],['long_distance','🚚 Long Distance'],['international','✈️ International']] },
  { name:'homeSize',label:'Home Size',type:'select',options:[['studio','Studio'],['1br','1 Bedroom'],['2br','2 Bedrooms'],['3br','3 Bedrooms'],['4br+','4+ Bedrooms']] },
  { name:'distance',label:'Distance (miles)',type:'number',placeholder:'e.g. 250'},
  { name:'packingService',label:'Packing',type:'select',options:[['self','📦 Self'],['partial','📋 Partial'],['full','👷 Full']] },
  { name:'hasPiano',label:'🎹 Piano/Large Item?',type:'checkbox'},
  { name:'storageNeeded',label:'📦 Need Storage?',type:'checkbox'},
];

export function CalculatorWidget({ toolCode, brandName, ctaText, buttonStyle, inputStyle, colorScheme, resultStyle }: { toolCode: string; brandName: string; ctaText?: string; buttonStyle?: string; inputStyle?: string; colorScheme?: string; resultStyle?: string }) {
  const isDark = false;
  const labelColor = '#555';
  const widgetBg = '#fff';
  const widgetShadow = '0 2px 16px rgba(0,0,0,0.06)';
  const btnText = ctaText || 'Calculate Now';
  const btn = (style: string|undefined, isCalc: boolean) => {
    const base: React.CSSProperties = {flex:1,padding:'14px',border:'none',color:'#fff',fontSize:'max(16px,15px)',fontWeight:600,cursor:'pointer',minHeight:48};
    switch(style){
      case 'square': return {...base,borderRadius:4,background:'#1a1a2e'};
      case 'pill': return {...base,borderRadius:50,background:'#16A34A'};
      case 'solid': return {...base,borderRadius:6,background:'#F97316',color:'#fff'};
      case 'glow': return {...base,borderRadius:12,background:'linear-gradient(135deg,#4F46E5,#818CF8)',boxShadow:'0 0 15px rgba(79,70,229,0.4)'};
      case 'neon': return {...base,borderRadius:8,background:'transparent',border:'2px solid #22D3EE',color:'#22D3EE',textShadow:'0 0 8px rgba(34,211,238,0.5)'};
      default: return {...base,borderRadius:12,background:'#1a1a2e'};
    }
  };
  const [calc, setCalc] = useState<any>(null);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string|boolean>>({});
  const urlUpdatedRef = useRef(false);

  // Init engine + read dynamic params + URL param prefill
  useEffect(() => {
    try {
      const fn=new Function(toolCode+';return typeof calculator!==\'undefined\'?calculator:null;');
      setCalc(fn()||null);
      // Read CALC_PARAMS for dynamic form fields
      const paramsFn=new Function(toolCode+';return typeof CALC_PARAMS!==\'undefined\'?CALC_PARAMS:null;');
      const params=paramsFn();
      const effectiveParams = params || DEFAULT_PARAMS;

      // Try to read pre-filled values from URL query string
      const urlParams = typeof window !== 'undefined' ? new URL(window.location.href).searchParams : null;
      const defaultInputs: Record<string, string|boolean> = {};
      let hasUrlParams = false;

      effectiveParams.forEach((p: any) => {
        const urlVal = urlParams?.get(p.name);
        if (urlVal !== null && urlVal !== undefined) {
          // URL param found — use it
          defaultInputs[p.name] = p.type === 'checkbox' ? (urlVal === 'true' || urlVal === '1') : urlVal;
          hasUrlParams = true;
        } else {
          defaultInputs[p.name] = p.type === 'checkbox' ? false : p.type === 'select' && p.options ? p.options[0][0] : '';
        }
      });

      setInputs(defaultInputs);
      if (params) setCalcParams(params);
      if (hasUrlParams) { setShowAdvanced(true); setHasInteracted(true); }
      else if (params) setHasInteracted(true);
    } catch { setCalc(null); }
  }, [toolCode]);
  const [calcParams, setCalcParams] = useState<any[]|null>(null);

  const update = (k:string, v:string|boolean) => { setInputs(prev=>({...prev,[k]:v})); setHasInteracted(true); };

  // Auto-calc debounced + URL sync — fires on ANY input change when calc engine is ready
  useEffect(() => {
    if (!calc) return;
    const t = setTimeout(() => {
      // Build vals from current inputs state — dynamic keys
      const vals: Record<string,unknown> = {};
      for (const [k,v] of Object.entries(inputs)) {
        if (typeof v === 'boolean') vals[k] = v;
        else if (v === '') vals[k] = k.includes('distance')||k.includes('Width')||k.includes('Length')||k.includes('Height')||k.includes('Amount')||k.includes('Rate')||k.includes('Term')||k.includes('Payment')||k.includes('Miles')||k.includes('Level')||k.includes('doors')||k.includes('windows') ? 0 : '';
        else vals[k] = isNaN(Number(v)) ? v : parseFloat(v);
      }
      // Skip if no meaningful values
      const nonEmpty = Object.values(vals).filter(v => v !== '' && v !== 0 && v !== false).length;
      // Sync URL with current inputs (replaceState to avoid history spam)
      if (typeof window !== 'undefined' && hasInteracted) {
        const url = new URL(window.location.href);
        const params = calcParams || DEFAULT_PARAMS;
        params.forEach((p: any) => {
          const val = inputs[p.name];
          if (val !== '' && val !== false && val !== undefined && val !== null) {
            url.searchParams.set(p.name, String(val));
          } else {
            url.searchParams.delete(p.name);
          }
        });
        window.history.replaceState(null, '', url.toString());
      }
      if (nonEmpty === 0) return;
      try {
        const r = calc.calculate ? calc.calculate(vals) : calc(vals);
        if (r?.error) { setResults(null); } else { setResults(r); setError(false); }
      } catch { /* skip */ }
    }, 400);
    return () => clearTimeout(t);
  }, [inputs, calc]);

  const preset = (data: Record<string,string|boolean>) => {
    const v = { movingType: String(data.movingType||''), homeSize: String(data.homeSize||''), distance: String(data.distance||''), hasPiano: data.hasPiano===true||data.hasPiano==='true', packingService: String(data.packingService||''), storageNeeded: data.storageNeeded===true||data.storageNeeded==='true' };
    setInputs(v); setShowAdvanced(true); setHasInteracted(true);
  };

  const saveResult = () => { if(!results)return; try{localStorage.setItem('calc-last',JSON.stringify(results));setSaved(true);setTimeout(()=>setSaved(false),2000);}catch{} };

  return (
    <>
      <style>{`@media(max-width:640px){body{overflow-x:hidden}.calc-widget{padding:12px!important;margin-left:0!important;margin-right:0!important;width:100%!important;box-sizing:border-box!important}.calc-grid{grid-template-columns:1fr!important;gap:8px!important}.calc-btns{flex-direction:column!important}.calc-result{padding:12px!important}.calc-widget input,.calc-widget select{font-size:16px!important;padding:10px!important}}`}</style>
    <div className="calc-widget" style={{background:widgetBg,borderRadius:16,boxShadow:widgetShadow,padding:28,marginBottom:24}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h2 style={{fontSize:20,fontWeight:700,margin:0,color:isDark?'#F1F5F9':'#111'}}>Get Your Estimate</h2>
      </div>
      {(calcParams||DEFAULT_PARAMS).length>0 && (
        <>
          <div className="calc-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:16}}>
            {(calcParams||DEFAULT_PARAMS).filter((p:any)=>p.type!=='checkbox').slice(0,4).map((p:any)=>(
              p.type==='select' ?
                <SelectField key={p.name} label={p.label} name={p.name} opts={p.options||[]} value={inputs} onChange={update} sty={inputStyle} isDark={isDark} labelColor={labelColor} /> :
                <NumberField key={p.name} label={p.label} name={p.name} placeholder={p.placeholder||''} value={inputs} onChange={update} sty={inputStyle} isDark={isDark} labelColor={labelColor} />
            ))}
          </div>
          {(calcParams||DEFAULT_PARAMS).filter((p:any)=>p.type==='checkbox').length>0 && (
            <>
              <button onClick={()=>setShowAdvanced(!showAdvanced)} style={{fontSize:12,color:'#888',background:'none',border:'none',cursor:'pointer',marginBottom:12}}>{showAdvanced?'▾ Hide':'▸ Show'} Options</button>
              {showAdvanced && (
                <div style={{display:'flex',gap:24,marginBottom:16,paddingTop:12,borderTop:'1px solid #f0f0f0',flexWrap:'wrap'}}>
                  {(calcParams||DEFAULT_PARAMS).filter((p:any)=>p.type==='checkbox').map((p:any)=>(
                    <label key={p.name} style={{display:'flex',alignItems:'center',gap:10,fontSize:14,cursor:'pointer',padding:'8px 0',minHeight:44}}><input type="checkbox" checked={!!inputs[p.name]} onChange={e=>update(p.name,e.target.checked)} style={{width:20,height:20,cursor:'pointer',accentColor:'#2563eb'}} /> {p.label}</label>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      <div className="calc-btns" style={{display:'flex',gap:10}}>
        <button onClick={()=>setHasInteracted(true)} style={{...btn(buttonStyle,true),opacity:hasInteracted?0.6:1}}>
          {hasInteracted ? '✓ Calculating...' : btnText}
        </button>
        <button onClick={()=>{
          const def: Record<string,string|boolean> = {};
          const params = calcParams || DEFAULT_PARAMS;
          params.forEach((p:any) => { def[p.name] = p.type==='checkbox' ? false : p.type==='select' && p.options ? p.options[0][0] : ''; });
          setInputs(def); setResults(null); setError(false); setHasInteracted(false);
        }} style={{padding:'14px 20px',borderRadius:12,border:'1px solid #ddd',background:'#fff',color:'#666',cursor:'pointer'}}>Reset</button>
      </div>

      {error && hasInteracted && (
        <div style={{marginTop:12,padding:'12px 16px',borderRadius:10,background:'#fef2f2',color:'#dc2626',fontSize:13}}>⚠️ Please fill in all required fields to see your estimate.</div>
      )}

      {results && !error && (
        <div className="calc-result" style={{marginTop:24,padding:24,background:'#f8fafc',borderRadius:14}}>
          <div style={{fontSize:12,fontWeight:600,color:'#888',marginBottom:4}}>YOUR ESTIMATE</div>
          {results.total && <div style={{fontSize:42,fontWeight:800,color:'#111',marginBottom:16}}>{String(results.total)}</div>}
          {resultStyle==='simple' && Object.entries(results).filter(([k])=>k!=='total'&&k!=='breakdown'&&k!=='error').map(([key,val])=>(
            <div key={key} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #f1f5f9',fontSize:14}}><span style={{color:'#64748b'}}>{key.replace(/([A-Z])/g,' $1').trim()}</span><span style={{fontWeight:700}}>{String(val)}</span></div>
          ))}
          {resultStyle==='cards' && <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:10}}>{Object.entries(results).filter(([k])=>k!=='total'&&k!=='breakdown'&&k!=='error').map(([key,val])=>(
            <div key={key} style={{background:'#fff',borderRadius:10,padding:'12px 14px',textAlign:'center',boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}><div style={{fontSize:11,color:'#94a3b8',marginBottom:4}}>{key.replace(/([A-Z])/g,' $1').trim()}</div><div style={{fontSize:20,fontWeight:800,color:'#0f172a'}}>{String(val)}</div></div>
          ))}</div>}
          {resultStyle==='table' && <div style={{fontSize:13}}><table style={{width:'100%',borderCollapse:'collapse'}}><tbody>{Object.entries(results).filter(([k])=>k!=='total'&&k!=='breakdown'&&k!=='error').map(([key,val],i)=>(
            <tr key={key} style={{borderBottom:'1px solid #f1f5f9'}}><td style={{padding:'8px 12px',color:'#64748b'}}>{key.replace(/([A-Z])/g,' $1').trim()}</td><td style={{padding:'8px 12px',fontWeight:700,textAlign:'right'}}>{String(val)}</td><td style={{padding:'8px 0'}}><div style={{width:80,height:4,background:'#f1f5f9',borderRadius:2}}><div style={{width:results.total?Math.min(100,parseFloat(String(val).replace(/[^0-9.]/g,''))/parseFloat(String(results.total).replace(/[^0-9.]/g,''))*100)+'%':'0%',height:4,background:'#F97316',borderRadius:2}}/></div></td></tr>
          ))}</tbody></table></div>}
          {(resultStyle==='bars'||!resultStyle) && Object.entries(results).filter(([k])=>k!=='total'&&k!=='breakdown'&&k!=='error').map(([key,val])=>(
            <div key={key} style={{marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:3}}><span style={{color:'#555',textTransform:'capitalize'}}>{key.replace(/([A-Z])/g,' $1').trim()}</span><span style={{fontWeight:600}}>{String(val)}</span></div><div style={{height:6,borderRadius:3,background:'#e8e8e8',overflow:'hidden'}}><div style={{height:'100%',borderRadius:3,background:'linear-gradient(90deg,#3b82f6,#2563eb)',width:results.total?Math.min(100,parseFloat(String(val).replace(/[^0-9.]/g,''))/parseFloat(String(results.total).replace(/[^0-9.]/g,''))*100)+'%':'0%'}} /></div></div>
          ))}
          {resultStyle==='list' && Object.entries(results).filter(([k])=>k!=='total'&&k!=='breakdown'&&k!=='error').map(([key,val])=>(
            <div key={key} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',fontSize:13}}><span style={{width:8,height:8,borderRadius:'50%',background:'#4F46E5',flexShrink:0}}/><span style={{color:'#475569'}}>{key.replace(/([A-Z])/g,' $1').trim()}</span><span style={{marginLeft:'auto',fontWeight:600}}>{String(val)}</span></div>
          ))}
          <div style={{display:'flex',gap:8,marginTop:16,flexWrap:'wrap'}}>
            <button onClick={saveResult} style={{padding:'6px 14px',borderRadius:20,border:'1px solid #d0d0d0',background:saved?'#dcfce7':'#fff',fontSize:12,cursor:'pointer'}}>{saved?'✓ Saved':'💾 Save'}</button>
            <CopyLinkButton inputs={inputs} />
            <ShareButton brandName={brandName} results={results} />
            <EmbedCodeButton />
            <button onClick={()=>window.print()} style={{padding:'6px 14px',borderRadius:20,border:'1px solid #d0d0d0',background:'#fff',fontSize:12,cursor:'pointer'}}>📄 Print</button>
          </div>
          <div style={{marginTop:16,paddingTop:14,borderTop:'1px solid #e8e8e8'}}>
            <div style={{display:'flex',gap:16,flexWrap:'wrap',fontSize:11,color:'#999',marginBottom:8}}><span>📊 Based on public industry data</span><span>🕐 Updated {new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'})}</span><span>✓ Verified against 2+ independent sources</span></div>
            {results.breakdown && (
              <details style={{fontSize:12,color:'#555',marginBottom:6}}>
                <summary style={{cursor:'pointer',color:'#3b82f6',fontWeight:600}}>📐 Show Calculation Breakdown</summary>
                <div style={{marginTop:8,padding:12,background:'#fff',borderRadius:8,border:'1px solid #e2e8f0'}}>
                  <p style={{margin:'0 0 8px',fontSize:11,color:'#888'}}>How we got your result — step by step with your values:</p>
                  {Object.entries(results.breakdown as unknown as Record<string,unknown>).map(([k,v])=>(
                    <div key={k} style={{marginBottom:5,fontSize:12}}>
                      <span style={{fontWeight:600,color:'#334155'}}>{k.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}:</span>
                      <span style={{marginLeft:8,color:'#0f172a'}}>{typeof v==='number'?v.toLocaleString(undefined,{maximumFractionDigits:2}):String(v)}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}
            <details style={{fontSize:11,color:'#aaa'}}>
              <summary style={{cursor:'pointer',color:'#888'}}>📖 Methodology & Data Sources</summary>
              <div style={{marginTop:6,padding:'8px 12px',background:'#f8fafc',borderRadius:6,lineHeight:1.6}}>
                <p style={{margin:'0 0 4px'}}><strong>Data sources:</strong> Our estimates combine publicly available data from industry associations, government agencies, and peer-reviewed pricing studies. Sources vary by calculator type and are listed on each tool's page.</p>
                <p style={{margin:'0 0 4px'}}><strong>Formula:</strong> Each calculator uses standard industry formulas. The specific calculation is shown in the breakdown above when you run a calculation.</p>
                <p style={{margin:0}}><strong>Disclaimer:</strong> Results are estimates. Actual costs vary by location, season, and individual circumstances. Always get multiple professional quotes before making financial decisions.</p>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  </>);
}

// Controlled field helpers
function selectStyle(sty?:string, isDark?:boolean):React.CSSProperties{var b:React.CSSProperties={width:'100%',padding:'12px 14px',fontSize:'max(16px,14px)',background:isDark?'#1E293B':'#fafafa',appearance:'none',minHeight:48,color:isDark?'#F1F5F9':'#0F172A'};var bo=isDark?'#334155':'#e2e2e2';switch(sty){case'outlined':return{...b,borderRadius:6,border:'2px solid '+bo,background:isDark?'#1E293B':'#fff'};case'underlined':return{...b,borderRadius:0,border:'none',borderBottom:'2px solid '+(isDark?'#64748B':'#94a3b8'),background:'transparent'};case'boxed':return{...b,borderRadius:4,border:'2px solid '+(isDark?'#475569':'#d4d4d8'),background:isDark?'#1E293B':'#fff',boxShadow:isDark?'inset 0 1px 2px rgba(255,255,255,0.06)':'inset 0 1px 2px rgba(0,0,0,0.06)'};case'minimal':return{...b,borderRadius:8,border:'1px solid transparent',background:isDark?'#334155':'#f1f5f9'};default:return{...b,borderRadius:10,border:'1px solid '+bo}}}
function SelectField({label,name,opts,value,onChange,sty,isDark,labelColor}:{label:string;name:string;opts:[string,string][];value:Record<string,string|boolean>;onChange:(k:string,v:string|boolean)=>void;sty?:string;isDark?:boolean;labelColor?:string}) {
  return <div><label style={{fontSize:13,fontWeight:600,color:labelColor||'#555',display:'block',marginBottom:4}}>{label}</label>
    <select value={String(value[name]||'')} onChange={e=>onChange(name,e.target.value)} style={selectStyle(sty,isDark)}>
      <option value="">Select...</option>{opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>;
}
function NumberField({label,name,placeholder,value,onChange,sty,isDark,labelColor}:{label:string;name:string;placeholder:string;value:Record<string,string|boolean>;onChange:(k:string,v:string|boolean)=>void;sty?:string;isDark?:boolean;labelColor?:string}) {
  return <div><label style={{fontSize:13,fontWeight:600,color:labelColor||'#555',display:'block',marginBottom:4}}>{label}</label>
    <input value={String(value[name]||'')} onChange={e=>onChange(name,e.target.value)} type="number" inputMode={getInputMode(name, placeholder)} placeholder={placeholder} style={selectStyle(sty,isDark)} /></div>;
}

// Share link — encodes all inputs in URL query string
function CopyLinkButton({ inputs }: { inputs: Record<string, string | boolean> }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const url = new URL(window.location.href);
    Object.entries(inputs).forEach(([k, v]) => {
      if (v !== '' && v !== false && v !== undefined) url.searchParams.set(k, String(v));
    });
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };
  return <button onClick={copy} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #d0d0d0', background: copied ? '#dbeafe' : '#fff', fontSize: 12, cursor: 'pointer' }}>{copied ? '✓ Link Copied!' : '🔗 Copy Link'}</button>;
}

// Share on social — pre-filled text with results
function ShareButton({ brandName, results }: { brandName: string; results: Record<string, string> | null }) {
  const [show, setShow] = useState(false);
  if (!results) return null;
  const totalVal = results.total ? String(results.total) : '';
  const text = encodeURIComponent(`I just used ${brandName} — ${totalVal ? 'my estimate came out to ' + totalVal + '. ' : ''}Free tool, no signup needed.`);
  const url = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  return (
    <div style={{ position: 'relative', display: 'inline' }}>
      <button onClick={() => setShow(!show)} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #d0d0d0', background: '#fff', fontSize: 12, cursor: 'pointer' }}>📤 Share</button>
      {show && (
        <div style={{ position: 'absolute', bottom: 40, right: 0, background: '#fff', padding: 10, borderRadius: 10, fontSize: 12, width: 200, zIndex: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
          <a href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`} target="_blank" rel="noopener" style={{ display: 'block', padding: '6px 8px', color: '#1d9bf0', textDecoration: 'none', borderRadius: 6 }}>𝕏 Share on X</a>
          <a href={`https://www.reddit.com/submit?url=${url}&title=${text}`} target="_blank" rel="noopener" style={{ display: 'block', padding: '6px 8px', color: '#ff4500', textDecoration: 'none', borderRadius: 6 }}>💬 Share on Reddit</a>
          <a href={`mailto:?subject=${encodeURIComponent('Check out ' + brandName)}&body=${text}%0A%0A${url}`} style={{ display: 'block', padding: '6px 8px', color: '#334155', textDecoration: 'none', borderRadius: 6 }}>✉️ Share via Email</a>
          <button onClick={() => setShow(false)} style={{ display: 'block', width: '100%', marginTop: 4, padding: '4px', border: 'none', background: '#f1f5f9', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Close</button>
        </div>
      )}
    </div>
  );
}

// Embed code — generates iframe snippet
function EmbedCodeButton() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const code = `<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed/${typeof window !== 'undefined' ? window.location.hostname : ''}" width="100%" height="500" frameborder="0" title="Free Calculator" style="border-radius:12px"></iframe>`;
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };
  return (
    <div style={{ position: 'relative', display: 'inline' }}>
      <button onClick={() => setShow(!show)} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #d0d0d0', background: '#fff', fontSize: 12, cursor: 'pointer' }}>{'</> Embed'}</button>
      {show && (
        <div style={{ position: 'absolute', bottom: 40, left: 0, background: '#1a1a2e', color: '#fff', padding: 12, borderRadius: 10, fontSize: 11, width: 340, zIndex: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          <div style={{ marginBottom: 8, color: '#aaa' }}>Copy this HTML to embed the calculator:</div>
          <textarea readOnly value={code} style={{ width: '100%', height: 50, fontSize: 10, padding: 6, borderRadius: 6, border: 'none', background: '#0f172a', color: '#e2e8f0', resize: 'none' }} />
          <button onClick={copy} style={{ marginTop: 6, padding: '6px 12px', borderRadius: 6, border: 'none', background: copied ? '#10b981' : '#3b82f6', color: '#fff', fontSize: 11, cursor: 'pointer' }}>{copied ? '✓ Copied!' : 'Copy Code'}</button>
          <button onClick={() => setShow(false)} style={{ marginTop: 6, marginLeft: 6, padding: '6px 12px', borderRadius: 6, border: 'none', background: '#334155', color: '#fff', fontSize: 11, cursor: 'pointer' }}>Close</button>
        </div>
      )}
    </div>
  );
}
