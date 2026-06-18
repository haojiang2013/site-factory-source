require('dotenv').config({path:'.env'});
var fs = require('fs');
var ContentWriterAgent = require('./src/agents/content-writer-agent').ContentWriterAgent;
var ContentReviewerAgent = require('./src/agents/content-reviewer-agent').ContentReviewerAgent;
var StateStore = require('./src/lib/state-store').StateStore;

var sites = ['site-001-moving-calculator', 'site-002-mortgage-calc', 'site-003-paint-calc'];

(async () => {
  var totalRewrites = 0, totalPassedAfter = 0;

  for (var si = 0; si < sites.length; si++) {
    var slug = sites[si];
    var config = await StateStore.loadConfig(slug);
    var sourceData = JSON.parse(fs.readFileSync('src/data/'+slug+'/source-data.json','utf-8'));
    var pages = JSON.parse(fs.readFileSync('src/data/'+slug+'/pages.json','utf-8'));
    var writer = new ContentWriterAgent();
    var reviewer = new ContentReviewerAgent();
    var siteRewrites = 0, sitePassed = 0;

    console.log('\n' + slug);
    console.log('-'.repeat(50));

    for (var i = 0; i < pages.length; i++) {
      var review = await reviewer.execute({
        page: pages[i], sourceData: sourceData,
        designConfig: { brandName: config.designConfig.brandName }
      });

      if (review.overallVerdict === 'PASS') { sitePassed++; continue; }

      console.log('  REWRITE #'+(i+1)+': ' + pages[i].title.slice(0,50) + ' — ' + review.issues.slice(0,2).join(' | '));
      try {
        pages[i] = await writer.execute({
          keyword: config.keywords[i], sourceData: sourceData,
          designConfig: { brandName: config.designConfig.brandName },
          template: config.template
        });
        siteRewrites++;
      } catch(e) { console.log('    FAILED: ' + e.message.slice(0,80)); }
    }

    await StateStore.saveAgentOutput(slug, 'pages.json', pages);
    totalRewrites += siteRewrites;
    totalPassedAfter += sitePassed;
    console.log('  Result: ' + siteRewrites + ' rewritten, ' + sitePassed + ' already passing');
  }

  console.log('\n' + '='.repeat(50));
  console.log('TOTAL: ' + totalRewrites + ' pages rewritten across ' + sites.length + ' sites');
  fs.writeFileSync('fix-result.txt', 'Rewrites: ' + totalRewrites + '\nAlready passed: ' + totalPassedAfter);
})();
