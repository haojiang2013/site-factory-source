require('dotenv').config({path:'.env'});
var UIDesignerAgent = require('./src/agents/ui-designer-agent').UIDesignerAgent;
var StateStore = require('./src/lib/state-store').StateStore;

(async()=>{
  var ui = new UIDesignerAgent();
  var d = await ui.execute({niche:'mortgage overpayment calculator',template:'A'});
  var c = await StateStore.loadConfig('site-002-mortgage-calc');
  c.designConfig = d;
  await StateStore.saveConfig(c);
  console.log('site-002: ' + d.colorScheme + ' | ' + d.fontPair + ' | ' + d.brandName);
})();
