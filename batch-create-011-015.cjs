require('dotenv').config({path:'.env'});
var fs = require('fs');

var sites = [
  {slug:'site-011-ai-design', domain:'aitool-design.xyz', niche:'AI design tools comparison', template:'B',
   keywords:[{keyword:'best AI design tools',searchVolume:7000,difficulty:65,intent:'commercial',userComplaints:['no free tier comparison','UI screenshots outdated']},{keyword:'AI image generator comparison',searchVolume:12000,difficulty:72,intent:'commercial',userComplaints:['resolution limits hidden','commercial use unclear']},{keyword:'Figma AI plugins ranked',searchVolume:3000,difficulty:48,intent:'commercial',userComplaints:['plugin compatibility issues','pricing per seat']},{keyword:'Canva vs Adobe AI features',searchVolume:5000,difficulty:60,intent:'commercial',userComplaints:['feature parity changes monthly','export quality varies']},{keyword:'free AI logo maker no signup',searchVolume:4000,difficulty:42,intent:'transactional',userComplaints:['watermark on free tier','vector export paywalled']}],
   design:{colorScheme:'concrete-rose',fontPair:'dm-serif+inter',layout:'card-grid',brandName:'DesignToolTrove',componentStyles:{buttonRadius:8,cardShadow:'lg',inputStyle:'outlined'}}},
  {slug:'site-012-ai-marketing', domain:'aitool-marketing.xyz', niche:'AI marketing tools comparison', template:'B',
   keywords:[{keyword:'best AI marketing tools',searchVolume:9000,difficulty:70,intent:'commercial',userComplaints:['no pricing per contact','integrations list outdated']},{keyword:'AI email marketing comparison',searchVolume:5000,difficulty:58,intent:'commercial',userComplaints:['deliverability not tested','automation limits hidden']},{keyword:'AI SEO tools ranked',searchVolume:4000,difficulty:62,intent:'commercial',userComplaints:['keyword data inaccurate','no local SEO features']},{keyword:'AI social media scheduler',searchVolume:3500,difficulty:50,intent:'commercial',userComplaints:['platform support limited','analytics basic']},{keyword:'free AI copywriting tool',searchVolume:6000,difficulty:55,intent:'transactional',userComplaints:['word limit reached fast','tone options limited']}],
   design:{colorScheme:'forest-floor',fontPair:'fraunces+work-sans',layout:'card-grid',brandName:'MarketToolTrove',componentStyles:{buttonRadius:6,cardShadow:'md',inputStyle:'filled'}}},
  {slug:'site-013-ai-video', domain:'aitool-video.xyz', niche:'AI video tools comparison', template:'B',
   keywords:[{keyword:'best AI video editor',searchVolume:8000,difficulty:68,intent:'commercial',userComplaints:['export time limits','watermark on free']},{keyword:'AI video generator from text',searchVolume:10000,difficulty:72,intent:'commercial',userComplaints:['video length capped','voiceover robotic']},{keyword:'AI video upscaler comparison',searchVolume:2500,difficulty:45,intent:'commercial',userComplaints:['processing queue long','max resolution limited']},{keyword:'CapCut vs Descript AI',searchVolume:4000,difficulty:55,intent:'commercial',userComplaints:['features missing in free','collab tools weak']},{keyword:'free AI video maker no watermark',searchVolume:5500,difficulty:48,intent:'transactional',userComplaints:['hidden paywall after export','template library small']}],
   design:{colorScheme:'moss-stone',fontPair:'space-grotesk+dm-sans',layout:'two-panel-split',brandName:'VideoToolTrove',componentStyles:{buttonRadius:4,cardShadow:'sm',inputStyle:'underlined'}}},
  {slug:'site-014-game-items', domain:'item-db-game.xyz', niche:'game item stats database', template:'B',
   keywords:[{keyword:'Elden Ring weapon stats',searchVolume:12000,difficulty:50,intent:'informational',userComplaints:['scaling data wrong after patch','no DLC weapons']},{keyword:'Genshin Impact artifact stats',searchVolume:9000,difficulty:48,intent:'informational',userComplaints:['substat rolls not shown','set bonus unclear']},{keyword:'Diablo 4 unique items list',searchVolume:7000,difficulty:45,intent:'informational',userComplaints:['item power not updated','aspect values missing']},{keyword:'Baldurs Gate 3 legendary items',searchVolume:5000,difficulty:42,intent:'informational',userComplaints:['act location missing','build synergy not shown']},{keyword:'Path of Exile 2 item database',searchVolume:4000,difficulty:38,intent:'informational',userComplaints:['mod tier unclear','trade value missing']}],
   design:{colorScheme:'ocean-depth',fontPair:'crimson+inter',layout:'card-grid',brandName:'ItemArchive',componentStyles:{buttonRadius:12,cardShadow:'md',inputStyle:'filled'}}},
  {slug:'site-015-game-builds', domain:'build-calc-game.xyz', niche:'game character build calculator', template:'A',
   keywords:[{keyword:'Elden Ring build calculator',searchVolume:15000,difficulty:55,intent:'transactional',userComplaints:['no DLC items','talisman slots wrong']},{keyword:'Genshin Impact team builder',searchVolume:10000,difficulty:52,intent:'transactional',userComplaints:['reaction damage not calculated','new characters missing']},{keyword:'Diablo 4 build planner',searchVolume:8000,difficulty:50,intent:'transactional',userComplaints:['paragon board not interactive','aspect calculator broken']},{keyword:'Honkai Star Rail team comp',searchVolume:6000,difficulty:45,intent:'transactional',userComplaints:['light cone stats outdated','eidolon effects missing']},{keyword:'Baldurs Gate 3 multiclass calculator',searchVolume:4000,difficulty:40,intent:'transactional',userComplaints:['spell slots wrong at high level','feat interactions missing']}],
   design:{colorScheme:'canyon-dusk',fontPair:'crimson+inter',layout:'tool-left-content-right',brandName:'BuildCraft',componentStyles:{buttonRadius:8,cardShadow:'md',inputStyle:'outlined'}}}
];

sites.forEach(function(s) {
  var config = {
    slug:s.slug, domain:s.domain, niche:s.niche, template:s.template,
    targetCountry:'US', language:'en', keywords:s.keywords,
    designConfig:s.design,
    growthPlan:[{stage:'seed',startWeek:1,pageCount:5,pageTypes:['home','about','contact','privacy','1 content']},{stage:'sprout',startWeek:3,pageCount:20,pageTypes:['content']},{stage:'growth',startWeek:6,pageCount:50,pageTypes:['more']},{stage:'mature',startWeek:11,pageCount:80,pageTypes:['remaining']}]
  };
  fs.writeFileSync('src/data/'+s.slug+'/config.json', JSON.stringify(config,null,2));
  console.log(s.slug + ': ' + s.design.brandName + ' (' + s.template + ')');
});
console.log('\nRunning pipelines...');
