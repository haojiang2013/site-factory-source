require('dotenv').config({path:'.env'});
var fs = require('fs');

// Dynamic import helper for ts-node
async function runPipeline(slug) {
  var mod = require('./src/cli/pipeline');
  try {
    await mod.runPipeline(slug);
    return { slug: slug, status: 'ok' };
  } catch(e) {
    return { slug: slug, status: 'failed', error: e.message.slice(0,200) };
  }
}

(async () => {
  var results = [];
  var sites = ['site-001-moving-calculator', 'site-002-mortgage-calc', 'site-003-paint-calc'];

  for (var i = 0; i < sites.length; i++) {
    var s = sites[i];
    console.log('\n' + '='.repeat(60));
    console.log('SITE ' + (i+1) + '/' + sites.length + ': ' + s);
    console.log('='.repeat(60));
    var r = await runPipeline(s);
    results.push(r);
    console.log('STATUS: ' + r.status + (r.error ? ' — ' + r.error : ''));
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('BATCH COMPLETE');
  console.log('='.repeat(60));
  results.forEach(function(r) {
    console.log((r.status === 'ok' ? '✅' : '❌') + ' ' + r.slug + (r.error ? ': ' + r.error : ''));
  });
  fs.writeFileSync('batch-result.json', JSON.stringify(results, null, 2));
})();
