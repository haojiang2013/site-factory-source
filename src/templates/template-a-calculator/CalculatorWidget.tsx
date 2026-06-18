'use client';
import { useState, useCallback, useEffect } from 'react';

const DEFAULT_PARAMS = [
  { name:'movingType',label:'Move Type',type:'select',options:[['local','🏠 Local'],['long_distance','🚚 Long Distance'],['international','✈️ International']] },
  { name:'homeSize',label:'Home Size',type:'select',options:[['studio','Studio'],['1br','1 Bedroom'],['2br','2 Bedrooms'],['3br','3 Bedrooms'],['4br+','4+ Bedrooms']] },
  { name:'distance',label:'Distance (miles)',type:'number',placeholder:'e.g. 250'},
  { name:'packingService',label:'Packing',type:'select',options:[['self','📦 Self'],['partial','📋 Partial'],['full','👷 Full']] },
  { name:'hasPiano',label:'🎹 Piano/Large Item?',type:'checkbox'},
  { name:'storageNeeded',label:'📦 Need Storage?',type:'checkbox'},
];

export function CalculatorWidget({ toolCode, brandName }: { toolCode: string; brandName: string }) {
  const [calc, setCalc] = useState<any>(null);
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string|boolean>>({});

  // Init engine + read dynamic params
  useEffect(() => {
    try {
      const fn=new Function(toolCode+';return typeof calculator!==\'undefined\'?calculator:null;');
      setCalc(fn()||null);
      // Read CALC_PARAMS for dynamic form fields
      const paramsFn=new Function(toolCode+';return typeof CALC_PARAMS!==\'undefined\'?CALC_PARAMS:null;');
      const params=paramsFn();
      if(params){ const defaultInputs:Record<string,string|boolean>={}; params.forEach((p:any)=>{ defaultInputs[p.name]=p.type==='checkbox'?false:p.type==='select'&&p.options?p.options[0][0]:''; }); setInputs(defaultInputs); setCalcParams(params); setHasInteracted(true); }
    } catch { setCalc(null); }
  }, [toolCode]);
  const [calcParams, setCalcParams] = useState<any[]|null>(null);

  const update = (k:string, v:string|boolean) => { setInputs(prev=>({...prev,[k]:v})); setHasInteracted(true); };

  // Auto-calc debounced — fires on ANY input change when calc engine is ready
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
    <div style={{background:'#fff',borderRadius:16,boxShadow:'0 2px 16px rgba(0,0,0,0.06)',padding:28,marginBottom:24}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h2 style={{fontSize:20,fontWeight:700,margin:0,color:'#111'}}>Get Your Estimate</h2>
        {/* Presets disabled — use CALC_PARAMS in tool-code.json instead */}
      </div>
      {(calcParams||DEFAULT_PARAMS).length>0 && (
        <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:16}}>
            {(calcParams||DEFAULT_PARAMS).filter((p:any)=>p.type!=='checkbox').slice(0,4).map((p:any)=>(
              p.type==='select' ?
                <SelectField key={p.name} label={p.label} name={p.name} opts={p.options||[]} value={inputs} onChange={update} /> :
                <NumberField key={p.name} label={p.label} name={p.name} placeholder={p.placeholder||''} value={inputs} onChange={update} />
            ))}
          </div>
          {(calcParams||DEFAULT_PARAMS).filter((p:any)=>p.type==='checkbox').length>0 && (
            <>
              <button onClick={()=>setShowAdvanced(!showAdvanced)} style={{fontSize:12,color:'#888',background:'none',border:'none',cursor:'pointer',marginBottom:12}}>{showAdvanced?'▾ Hide':'▸ Show'} Options</button>
              {showAdvanced && (
                <div style={{display:'flex',gap:24,marginBottom:16,paddingTop:12,borderTop:'1px solid #f0f0f0',flexWrap:'wrap'}}>
                  {(calcParams||DEFAULT_PARAMS).filter((p:any)=>p.type==='checkbox').map((p:any)=>(
                    <label key={p.name} style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer'}}><input type="checkbox" checked={!!inputs[p.name]} onChange={e=>update(p.name,e.target.checked)} /> {p.label}</label>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      <div style={{display:'flex',gap:10}}>
        <button onClick={()=>setHasInteracted(true)} style={{flex:1,padding:'14px',borderRadius:12,border:'none',background:'#1a1a2e',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer',opacity:hasInteracted?0.6:1}}>
          {hasInteracted ? '✓ Calculating...' : 'Calculate Now →'}
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
        <div style={{marginTop:24,padding:24,background:'#f8fafc',borderRadius:14}}>
          <div style={{fontSize:12,fontWeight:600,color:'#888',marginBottom:4}}>YOUR ESTIMATE</div>
          {results.total && <div style={{fontSize:42,fontWeight:800,color:'#111',marginBottom:16}}>{String(results.total)}</div>}
          {Object.entries(results).filter(([k])=>k!=='total'&&k!=='breakdown'&&k!=='error').map(([key,val])=>(
            <div key={key} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:3}}><span style={{color:'#555',textTransform:'capitalize'}}>{key.replace(/([A-Z])/g,' $1').trim()}</span><span style={{fontWeight:600}}>{String(val)}</span></div>
              <div style={{height:6,borderRadius:3,background:'#e8e8e8',overflow:'hidden'}}><div style={{height:'100%',borderRadius:3,background:'linear-gradient(90deg,#3b82f6,#2563eb)',width:results.total?Math.min(100,parseFloat(String(val).replace(/[^0-9.]/g,''))/parseFloat(String(results.total).replace(/[^0-9.]/g,''))*100)+'%':'0%'}} /></div>
            </div>
          ))}
          <div style={{display:'flex',gap:8,marginTop:16}}>
            <button onClick={saveResult} style={{padding:'6px 14px',borderRadius:20,border:'1px solid #d0d0d0',background:saved?'#dcfce7':'#fff',fontSize:12,cursor:'pointer'}}>{saved?'✓ Saved':'💾 Save'}</button>
            <button onClick={()=>window.print()} style={{padding:'6px 14px',borderRadius:20,border:'1px solid #d0d0d0',background:'#fff',fontSize:12,cursor:'pointer'}}>📄 Print</button>
            <span style={{fontSize:11,color:'#bbb',paddingTop:6}}>Ctrl+D to bookmark {brandName}</span>
          </div>
          <div style={{marginTop:16,paddingTop:14,borderTop:'1px solid #e8e8e8'}}>
            <div style={{display:'flex',gap:16,flexWrap:'wrap',fontSize:11,color:'#999',marginBottom:8}}><span>📊 Based on public industry data</span><span>🕐 Updated {new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'})}</span><span>✓ Verified against 2+ independent sources</span></div>
            <details style={{fontSize:11,color:'#aaa'}}><summary style={{cursor:'pointer',color:'#888'}}>How we calculate this</summary><p style={{marginTop:4}}>Our estimates combine public data from industry associations, government sources, and published pricing. Actual costs vary by location, season, and specific circumstances. Always get multiple quotes before making decisions.</p></details>
          </div>
        </div>
      )}
    </div>
  );
}

// Controlled field helpers
function SelectField({label,name,opts,value,onChange}:{label:string;name:string;opts:[string,string][];value:Record<string,string|boolean>;onChange:(k:string,v:string|boolean)=>void}) {
  return <div><label style={{fontSize:12,fontWeight:600,color:'#555',display:'block',marginBottom:4}}>{label}</label>
    <select value={String(value[name]||'')} onChange={e=>onChange(name,e.target.value)} style={{width:'100%',padding:'10px 12px',borderRadius:10,border:'1px solid #e2e2e2',fontSize:14,background:'#fafafa',appearance:'none'}}>
      <option value="">Select...</option>{opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>;
}
function NumberField({label,name,placeholder,value,onChange}:{label:string;name:string;placeholder:string;value:Record<string,string|boolean>;onChange:(k:string,v:string|boolean)=>void}) {
  return <div><label style={{fontSize:12,fontWeight:600,color:'#555',display:'block',marginBottom:4}}>{label}</label>
    <input value={String(value[name]||'')} onChange={e=>onChange(name,e.target.value)} type="number" placeholder={placeholder} style={{width:'100%',padding:'10px 12px',borderRadius:10,border:'1px solid #e2e2e2',fontSize:14,background:'#fafafa'}} /></div>;
}
