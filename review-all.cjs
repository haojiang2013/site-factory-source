require('dotenv').config({path:'.env'});
var fs = require('fs');
var ContentReviewerAgent = require('./src/agents/content-reviewer-agent').ContentReviewerAgent;
var StateStore = require('./src/lib/state-store').StateStore;

(async () => {
  var sites = ['site-001-moving-calculator', 'site-002-mortgage-calc', 'site-003-paint-calc'];
  var reviewer = new ContentReviewerAgent();
  var report = [];
  var totalPages = 0, totalPass = 0;
  var allIssues = [];

  for (var si = 0; si < sites.length; si++) {
    var slug = sites[si];
    var config = await StateStore.loadConfig(slug);
    var sourceData = JSON.parse(fs.readFileSync('src/data/'+slug+'/source-data.json','utf8'));
    var pages = JSON.parse(fs.readFileSync('src/data/'+slug+'/pages.json','utf8'));

    report.push('');
    report.push('='.repeat(50));
    report.push('SITE: ' + config.designConfig.brandName + ' — ' + config.niche);
    report.push('Design: ' + config.designConfig.colorScheme + ' | ' + config.designConfig.fontPair);
    report.push('='.repeat(50));

    var sitePass = 0;
    for (var i = 0; i < pages.length; i++) {
      totalPages++;
      var review = await reviewer.execute({
        page: pages[i], sourceData: sourceData,
        designConfig: { brandName: config.designConfig.brandName }
      });

      var icon = review.overallVerdict === 'PASS' ? '✅' : '❌';
      report.push(icon + ' ' + pages[i].title + ' (' + pages[i].title.length + 'c)');
      if (review.overallVerdict === 'PASS') { sitePass++; totalPass++; }
      else { review.issues.forEach(function(iss) { report.push('   ⚠️ ' + iss); allIssues.push({site:config.designConfig.brandName, page:i+1, issue:iss}); }); }
    }
    report.push('→ ' + sitePass + '/' + pages.length + ' passed');
  }

  report.push('');
  report.push('='.repeat(50));
  report.push('TOTAL: ' + totalPass + '/' + totalPages + ' passed (' + Math.round(totalPass/totalPages*100) + '%)');
  report.push('Issues found: ' + allIssues.length);

  // Categorize issues
  var cats = {};
  allIssues.forEach(function(i) {
    var cat = i.issue.includes('Title') || i.issue.includes('title') ? 'Title Length' :
              i.issue.includes('Meta') || i.issue.includes('meta') ? 'Meta Length' :
              i.issue.includes('Unsupported') || i.issue.includes('source') || i.issue.includes('data') ? 'Factual Accuracy' :
              i.issue.includes('CTA') || i.issue.includes('affiliate') ? 'CTA Format' :
              'Other';
    cats[cat] = (cats[cat]||0) + 1;
  });
  report.push('Issue categories: ' + JSON.stringify(cats));

  fs.writeFileSync('review-report.txt', report.join('\n'));
  console.log('Review complete. ' + totalPass + '/' + totalPages + ' passed.');
  console.log('Report: review-report.txt');
})();
