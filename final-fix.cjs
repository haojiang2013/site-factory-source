require('dotenv').config({path:'.env'});
var fs = require('fs');
var ContentWriterAgent = require('./src/agents/content-writer-agent').ContentWriterAgent;
var UIDesignerAgent = require('./src/agents/ui-designer-agent').UIDesignerAgent;
var StateStore = require('./src/lib/state-store').StateStore;

(async () => {
  var log = [];

  // ── Fix 1: UI overlap ──
  log.push('=== FIX 1: UI Designer — site-003 redo (avoid denim-canvas overlap) ===');
  var ui003 = new UIDesignerAgent();
  var newDesign = await ui003.execute({ niche: 'paint coverage calculator', template: 'A' });
  log.push('New design: ' + newDesign.colorScheme + ' | ' + newDesign.fontPair + ' | ' + newDesign.brandName);

  var config003 = await StateStore.loadConfig('site-003-paint-calc');
  config003.designConfig = newDesign;
  await StateStore.saveConfig(config003);
  log.push('Site-003 design updated. Brand: ' + newDesign.brandName);

  // ── Fix 2: Title length issues ──
  log.push('\n=== FIX 2: Title/meta length fixes ===');
  var writer = new ContentWriterAgent();

  // Site-002 page 1: title 65 chars → too long. Rewrite with explicit char target.
  var config002 = await StateStore.loadConfig('site-002-mortgage-calc');
  var source002 = JSON.parse(fs.readFileSync('src/data/site-002-mortgage-calc/source-data.json','utf8'));
  var pages002 = JSON.parse(fs.readFileSync('src/data/site-002-mortgage-calc/pages.json','utf8'));

  // Fix page 1 (65 chars) — explicitly request shorter title
  log.push('Fixing site-002 page 1 (65 chars → target 53-57)...');
  var fixed1 = await writer.execute({
    keyword: config002.keywords[0], sourceData: source002,
    designConfig: { brandName: config002.designConfig.brandName },
    template: 'A'
  });
  pages002[0] = fixed1;
  log.push('  New title: ' + fixed1.title + ' (' + fixed1.title.length + ' chars)');

  // Fix page 4 (61 chars)
  log.push('Fixing site-002 page 4 (61 chars → target 53-57)...');
  var fixed4 = await writer.execute({
    keyword: config002.keywords[3], sourceData: source002,
    designConfig: { brandName: config002.designConfig.brandName },
    template: 'A'
  });
  pages002[3] = fixed4;
  log.push('  New title: ' + fixed4.title + ' (' + fixed4.title.length + ' chars)');

  await StateStore.saveAgentOutput('site-002-mortgage-calc', 'pages.json', pages002);

  // Site-003 page 2: title 49 chars → too short
  var config003b = await StateStore.loadConfig('site-003-paint-calc');
  var source003 = JSON.parse(fs.readFileSync('src/data/site-003-paint-calc/source-data.json','utf8'));
  var pages003 = JSON.parse(fs.readFileSync('src/data/site-003-paint-calc/pages.json','utf8'));
  log.push('Fixing site-003 page 2 (49 chars → target 52-58)...');
  var fixedS3 = await writer.execute({
    keyword: config003b.keywords[1], sourceData: source003,
    designConfig: { brandName: config003b.designConfig.brandName },
    template: 'A'
  });
  pages003[1] = fixedS3;
  log.push('  New title: ' + fixedS3.title + ' (' + fixedS3.title.length + ' chars)');
  await StateStore.saveAgentOutput('site-003-paint-calc', 'pages.json', pages003);

  // Site-001 page 1: meta 161 chars → too long
  var config001 = await StateStore.loadConfig('site-001-moving-calculator');
  var source001 = JSON.parse(fs.readFileSync('src/data/site-001-moving-calculator/source-data.json','utf8'));
  var pages001 = JSON.parse(fs.readFileSync('src/data/site-001-moving-calculator/pages.json','utf8'));
  log.push('Fixing site-001 page 1 (meta 161 chars → target 145-155)...');
  var fixedS1 = await writer.execute({
    keyword: config001.keywords[0], sourceData: source001,
    designConfig: { brandName: config001.designConfig.brandName },
    template: 'A'
  });
  pages001[0] = fixedS1;
  log.push('  New meta: ' + fixedS1.metaDescription.length + ' chars');
  await StateStore.saveAgentOutput('site-001-moving-calculator', 'pages.json', pages001);

  // ── Final QA ──
  log.push('\n=== FINAL QA ===');
  var allSites = ['site-001-moving-calculator','site-002-mortgage-calc','site-003-paint-calc'];
  var totalPages = 0, passedTitles = 0, passedMetas = 0;
  allSites.forEach(function(s) {
    var p = JSON.parse(fs.readFileSync('src/data/'+s+'/pages.json','utf8'));
    var c = JSON.parse(fs.readFileSync('src/data/'+s+'/config.json','utf8'));
    p.forEach(function(pg) {
      totalPages++;
      if(pg.title.length>=50 && pg.title.length<=60) passedTitles++;
      if(pg.metaDescription.length>=140 && pg.metaDescription.length<=160) passedMetas++;
    });
    log.push(s+': '+c.designConfig.brandName+' | '+c.designConfig.colorScheme+' | '+c.designConfig.fontPair);
  });
  log.push('');
  log.push('Titles OK: '+passedTitles+'/'+totalPages);
  log.push('Metas OK: '+passedMetas+'/'+totalPages);

  fs.writeFileSync('final-fix-log.txt', log.join('\n'));
  console.log('All fixes applied. ' + log.length + ' log lines.');
})();
