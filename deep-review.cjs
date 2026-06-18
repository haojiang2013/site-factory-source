require('dotenv').config({path:'.env'});
var fs = require('fs');
var ContentReviewerAgent = require('./src/agents/content-reviewer-agent').ContentReviewerAgent;
var StateStore = require('./src/lib/state-store').StateStore;

var sites = ['site-001-moving-calculator', 'site-002-mortgage-calc', 'site-003-paint-calc'];

(async () => {
  var fullReport = [];

  for (var si = 0; si < sites.length; si++) {
    var slug = sites[si];
    var config = await StateStore.loadConfig(slug);
    var sourceData = JSON.parse(fs.readFileSync('src/data/'+slug+'/source-data.json','utf-8'));
    var pages = JSON.parse(fs.readFileSync('src/data/'+slug+'/pages.json','utf-8'));
    var reviewer = new ContentReviewerAgent();

    fullReport.push('='.repeat(60));
    fullReport.push('SITE: ' + slug + ' (' + config.designConfig.brandName + ')');
    fullReport.push('Design: ' + config.designConfig.colorScheme + ' | ' + config.designConfig.fontPair + ' | ' + config.designConfig.layout);
    fullReport.push('='.repeat(60));

    var issues = [];
    for (var i = 0; i < pages.length; i++) {
      var review = await reviewer.execute({
        page: pages[i], sourceData: sourceData,
        designConfig: { brandName: config.designConfig.brandName }
      });

      var status = review.overallVerdict === 'PASS' ? '✅' : '❌';
      fullReport.push('');
      fullReport.push(status + ' Page ' + (i+1) + ': ' + pages[i].title);
      fullReport.push('   Title: ' + pages[i].title.length + ' chars | Meta: ' + pages[i].metaDescription.length + ' chars');
      fullReport.push('   Sections: ' + pages[i].sections.length + ' | FAQs: ' + pages[i].faqs.length);
      fullReport.push('   CTA: ' + (pages[i].affiliateCTA ? pages[i].affiliateCTA.platform : 'none'));

      if (review.overallVerdict === 'FAIL') {
        review.issues.forEach(function(iss) {
          fullReport.push('   ⚠️ ' + iss);
          issues.push({ page: i+1, title: pages[i].title, issue: iss });
        });
      }
    }

    var passRate = pages.length - issues.filter(function(i) { return issues.indexOf(i) >= 0; }).length;
    fullReport.push('');
    fullReport.push('PASS RATE: ' + (pages.length - new Set(issues.map(function(i) { return i.page; })).size) + '/' + pages.length);
  }

  fs.writeFileSync('deep-review.txt', fullReport.join('\n'));
  console.log('Deep review complete. ' + fullReport.length + ' lines written.');
})();
