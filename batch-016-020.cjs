require('dotenv').config({path:'.env'}); var fs=require('fs');
var sites=[
  {slug:'site-016-electrical',niche:'electrical load calculator',template:'A',brand:'VoltWise',color:'industrial-blue',font:'ibm-plex+ibm-sans',layout:'tool-left-content-right',
   kw:[{k:'electrical load calculator',v:5000,d:48,i:'transactional',c:['no 240V appliances','breaker panel limit missing']},{k:'home electrical panel sizing',v:3000,d:42,i:'transactional',c:['no EV charger load','future expansion missing']},{k:'generator sizing calculator',v:4000,d:50,i:'transactional',c:['startup watts wrong','transfer switch not included']},{k:'circuit breaker calculator',v:2500,d:38,i:'informational',c:['wire gauge not shown','continuous load rule missing']},{k:'electrical cost per kWh calculator',v:6000,d:45,i:'transactional',c:['rate tiers not supported','time of use missing']}]},
  {slug:'site-017-garden',niche:'garden soil calculator',template:'A',brand:'SoilWise',color:'forest-floor',font:'merriweather+opensans',layout:'tool-top-content-bottom',
   kw:[{k:'soil calculator for raised bed',v:8000,d:42,i:'transactional',c:['metric not supported','no compost ratio']},{k:'mulch calculator cubic yards',v:10000,d:40,i:'transactional',c:['depth defaults wrong','no bag count conversion']},{k:'garden fertilizer calculator',v:4000,d:48,i:'commercial',c:['NPK ratios confusing','no soil test input']},{k:'plant spacing calculator',v:3000,d:35,i:'informational',c:['no companion planting','square foot not supported']},{k:'watering calculator for garden',v:2500,d:32,i:'informational',c:['drip vs sprinkler not differentiated','no rainfall adjustment']}]},
  {slug:'site-018-cleaning',niche:'house cleaning cost estimator',template:'A',brand:'CleanCalc',color:'coastal-blue',font:'lora+nunito',layout:'two-panel-split',
   kw:[{k:'house cleaning cost calculator',v:9000,d:55,i:'transactional',c:['square footage not considered','deep clean vs standard not clear']},{k:'maid service cost estimator',v:6000,d:52,i:'commercial',c:['frequency discount missing','supply fee hidden']},{k:'move out cleaning cost',v:4000,d:45,i:'transactional',c:['security deposit relevance not explained','carpet cleaning extra']},{k:'office cleaning cost per square foot',v:3000,d:48,i:'commercial',c:['frequency not factored','after hours surcharge missing']},{k:'window cleaning estimate calculator',v:2000,d:38,i:'transactional',c:['pane count not accurate','second story surcharge missing']}]},
  {slug:'site-019-solar',niche:'solar panel calculator',template:'A',brand:'SolarWise',color:'harvest-gold',font:'space-grotesk+dm-sans',layout:'tool-left-content-right',
   kw:[{k:'solar panel calculator for home',v:12000,d:60,i:'transactional',c:['roof angle not considered','shade analysis missing']},{k:'solar ROI calculator',v:8000,d:55,i:'commercial',c:['tax credit outdated','SREC value missing']},{k:'how many solar panels do I need',v:15000,d:52,i:'informational',c:['panel wattage not adjustable','battery storage missing']},{k:'solar payback period calculator',v:5000,d:50,i:'commercial',c:['electric rate inflation not factored','net metering not included']},{k:'off grid solar calculator',v:3000,d:42,i:'transactional',c:['battery days autonomy missing','inverter sizing wrong']}]},
  {slug:'site-020-hvac',niche:'HVAC sizing calculator',template:'A',brand:'HVACWise',color:'steel-workshop',font:'ibm-plex+ibm-sans',layout:'tool-top-content-bottom',
   kw:[{k:'HVAC sizing calculator',v:7000,d:55,i:'transactional',c:['Manual J not used','ceiling height ignored']},{k:'AC tonnage calculator by square foot',v:10000,d:50,i:'transactional',c:['climate zone missing','insulation R value not asked']},{k:'furnace BTU calculator',v:5000,d:48,i:'transactional',c:['efficiency rating ignored','duct loss not factored']},{k:'mini split sizing calculator',v:4000,d:42,i:'transactional',c:['multiple zones not supported','heat pump mode missing']},{k:'ductless AC cost estimator',v:3000,d:45,i:'commercial',c:['installation labor missing','electrical upgrade not included']}]}
];
sites.forEach(function(s){
  var cfg={slug:s.slug,domain:s.slug.replace('site-','').replace(/-/g,'')+'.xyz',niche:s.niche,template:s.template,targetCountry:'US',language:'en',
   keywords:s.kw.map(function(k){return {keyword:k.k,searchVolume:k.v,difficulty:k.d,intent:k.i,userComplaints:k.c}}),
   designConfig:{colorScheme:s.color,fontPair:s.font,layout:s.layout,brandName:s.brand,componentStyles:{buttonRadius:8,cardShadow:'md',inputStyle:'outlined'}},
   growthPlan:[{stage:'seed',startWeek:1,pageCount:5,pageTypes:['home','about','contact','privacy','1 content']}]};
  fs.writeFileSync('src/data/'+s.slug+'/config.json',JSON.stringify(cfg,null,2));
  console.log(s.slug+': '+s.brand+' ('+s.template+')');
});
console.log('\nRunning...');
var execSync=require('child_process').execSync;
sites.forEach(function(s){
  try {
    var out=execSync('npx ts-node --compiler-options \'{"ignoreDeprecations":"6.0","module":"commonjs","moduleResolution":"node","esModuleInterop":true,"skipLibCheck":true}\' --skip-project --transpile-only src/cli/generate-site.ts '+s.slug,{cwd:process.cwd(),timeout:120000,encoding:'utf8'});
    var ok=out.includes('Pipeline complete')?'✅':'⚠️';
    console.log(ok+' '+s.slug);
  } catch(e) { console.log('❌ '+s.slug+': '+e.message.slice(0,80)); }
});
console.log('Done');
