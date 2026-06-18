import 'dotenv/config';
import { PageQAAgent } from './src/agents/page-qa-agent';
import * as fs from 'fs';
import * as path from 'path';

const j = JSON.parse(fs.readFileSync(path.join('src','data','site-001-moving-calculator','tool-code.json'),'utf-8'));

(async () => {
  const qa = new PageQAAgent();
  const result = await qa.execute({
    toolName: 'Moving Cost Calculator',
    jsCode: j.jsCode,
    testCases: j.testCases || [],
    competitorUrls: ['https://www.moving.com/move/moving-cost-calculator.asp'],
  });
  console.log('Verdict:', result.overallVerdict);
  console.log('Test cases:', JSON.stringify(result.testCaseResults));
  console.log('Fuzz:', JSON.stringify(result.fuzzTestResults));
  console.log('Critical:', result.criticalBugs.length || 'NONE');
  console.log('Recommendation:', result.recommendation);
})();
