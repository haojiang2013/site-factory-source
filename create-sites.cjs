require('dotenv').config({path:'.env'});
var fs = require('fs');

var sites = [
  {slug:'site-006-concrete-calc', domain:'pourtrue-tool.xyz', niche:'concrete calculator', template:'A',
   keywords:[{keyword:'concrete calculator',searchVolume:8000,difficulty:45,intent:'transactional',userComplaints:['no metric option','no waste factor']},{keyword:'how much concrete do i need',searchVolume:12000,difficulty:52,intent:'transactional',userComplaints:['only does slabs','units confusing']},{keyword:'concrete slab calculator',searchVolume:5000,difficulty:40,intent:'transactional',userComplaints:['no rebar estimate','depth presets wrong']},{keyword:'concrete cost estimator',searchVolume:3500,difficulty:48,intent:'commercial',userComplaints:['prices outdated','no delivery fee']},{keyword:'cement calculator for fence posts',searchVolume:2000,difficulty:30,intent:'transactional',userComplaints:['wrong bag count','no hole diameter']}],
   design:{colorScheme:'steel-workshop',fontPair:'ibm-plex+ibm-sans',layout:'tool-left-content-right',brandName:'PourTrue',componentStyles:{buttonRadius:6,cardShadow:'md',inputStyle:'filled'}}},
  {slug:'site-007-flooring-calc', domain:'floorfound-tool.xyz', niche:'flooring cost calculator', template:'A',
   keywords:[{keyword:'flooring cost calculator',searchVolume:6000,difficulty:50,intent:'transactional',userComplaints:['no install cost','metric missing']},{keyword:'hardwood flooring cost estimator',searchVolume:4000,difficulty:55,intent:'commercial',userComplaints:['prices per sqft wrong','finish missing']},{keyword:'how much flooring do i need',searchVolume:9000,difficulty:42,intent:'transactional',userComplaints:['no room shape options']},{keyword:'carpet cost calculator per square foot',searchVolume:2500,difficulty:38,intent:'commercial',userComplaints:['padding not included']},{keyword:'tile flooring calculator with waste',searchVolume:1800,difficulty:35,intent:'transactional',userComplaints:['grout not accounted']}],
   design:{colorScheme:'warm-wood',fontPair:'merriweather+opensans',layout:'tool-top-content-bottom',brandName:'FloorFound',componentStyles:{buttonRadius:8,cardShadow:'sm',inputStyle:'outlined'}}},
  {slug:'site-008-ai-coding', domain:'devtooltrove-tool.xyz', niche:'AI coding tools comparison', template:'B',
   keywords:[{keyword:'best AI coding assistant',searchVolume:15000,difficulty:75,intent:'commercial',userComplaints:['reviews outdated','no side by side']},{keyword:'GitHub Copilot vs Cursor',searchVolume:8000,difficulty:65,intent:'commercial',userComplaints:['pricing changed','no latency comparison']},{keyword:'AI code generator free',searchVolume:6000,difficulty:55,intent:'transactional',userComplaints:['code quality varies']},{keyword:'best AI for debugging',searchVolume:3000,difficulty:48,intent:'commercial',userComplaints:['only simple bugs']},{keyword:'AI pair programming tools ranked',searchVolume:2000,difficulty:40,intent:'commercial',userComplaints:['rankings paid','no benchmarks']}],
   design:{colorScheme:'charcoal-amber',fontPair:'space-grotesk+dm-sans',layout:'card-grid',brandName:'DevToolTrove',componentStyles:{buttonRadius:4,cardShadow:'lg',inputStyle:'outlined'}}},
  {slug:'site-009-reno-calc', domain:'renowise-tool.xyz', niche:'renovation cost estimator', template:'A',
   keywords:[{keyword:'kitchen remodel cost calculator',searchVolume:12000,difficulty:68,intent:'transactional',userComplaints:['no appliance cost','labor low']},{keyword:'bathroom renovation cost estimator',searchVolume:9000,difficulty:62,intent:'transactional',userComplaints:['plumbing missing','tile missing']},{keyword:'home renovation budget calculator',searchVolume:5000,difficulty:55,intent:'commercial',userComplaints:['too generic']},{keyword:'cost to finish basement calculator',searchVolume:3500,difficulty:45,intent:'transactional',userComplaints:['no egress window']},{keyword:'ADU cost calculator 2025',searchVolume:2000,difficulty:35,intent:'transactional',userComplaints:['permit fees missing']}],
   design:{colorScheme:'brick-kitchen',fontPair:'lora+nunito',layout:'two-panel-split',brandName:'RenoWise',componentStyles:{buttonRadius:8,cardShadow:'md',inputStyle:'outlined'}}},
  {slug:'site-010-boss-guide', domain:'bossbreak-tool.xyz', niche:'game boss strategy guide', template:'C',
   keywords:[{keyword:'Elden Ring boss order guide',searchVolume:10000,difficulty:48,intent:'informational',userComplaints:['no level recommendation']},{keyword:'Baldurs Gate 3 boss strategies',searchVolume:7000,difficulty:52,intent:'informational',userComplaints:['honour mode missing']},{keyword:'Zelda Tears boss weaknesses',searchVolume:5000,difficulty:40,intent:'informational',userComplaints:['weapon suggestions vague']},{keyword:'Soulslike boss difficulty ranking',searchVolume:3000,difficulty:35,intent:'informational',userComplaints:['subjective rankings']},{keyword:'boss fight cheat sheet printable',searchVolume:1500,difficulty:25,intent:'transactional',userComplaints:['format breaks on mobile']}],
   design:{colorScheme:'ocean-depth',fontPair:'crimson+inter',layout:'two-panel-split',brandName:'BossBreak',componentStyles:{buttonRadius:12,cardShadow:'md',inputStyle:'filled'}}}
];

sites.forEach(function(s) {
  var dir = 'src/data/' + s.slug;
  try { fs.mkdirSync(dir); } catch(e) {}
  var config = {
    slug: s.slug, domain: s.domain, niche: s.niche, template: s.template,
    targetCountry: 'US', language: 'en', keywords: s.keywords,
    designConfig: s.design,
    growthPlan: [
      {stage:'seed',startWeek:1,pageCount:5,pageTypes:['home','about','contact','privacy','1 content']},
      {stage:'sprout',startWeek:3,pageCount:20,pageTypes:['content']},
      {stage:'growth',startWeek:6,pageCount:50,pageTypes:['more']},
      {stage:'mature',startWeek:11,pageCount:80,pageTypes:['remaining']}
    ]
  };
  fs.writeFileSync(dir + '/config.json', JSON.stringify(config, null, 2));
  console.log(s.slug + ': ' + s.design.brandName + ' (' + s.template + ')');
});
console.log('Configs created. Running pipelines...');
