#!/usr/bin/env tsx
import 'dotenv/config';
import { execSync } from 'child_process';

// Daily automated operations — run all health checks + CSA brief
async function main() {
  console.log(`=== Site Factory Daily Run — ${new Date().toISOString().slice(0, 10)} ===\n`);

  const checks = [
    { name: 'CSA Daily Brief', cmd: 'npx ts-node --compiler-options \'{"ignoreDeprecations":"6.0","module":"commonjs","moduleResolution":"node","esModuleInterop":true,"skipLibCheck":true}\' --skip-project --transpile-only src/cli/ops.ts daily' },
    { name: 'Agent Health', cmd: 'npx ts-node --compiler-options \'{"ignoreDeprecations":"6.0","module":"commonjs","moduleResolution":"node","esModuleInterop":true,"skipLibCheck":true}\' --skip-project --transpile-only src/cli/ops.ts health' },
    { name: 'Affiliate Links', cmd: 'npx ts-node --compiler-options \'{"ignoreDeprecations":"6.0","module":"commonjs","moduleResolution":"node","esModuleInterop":true,"skipLibCheck":true}\' --skip-project --transpile-only src/cli/affiliate-check.ts' },
    { name: 'Backlink Monitor', cmd: 'npx ts-node --compiler-options \'{"ignoreDeprecations":"6.0","module":"commonjs","moduleResolution":"node","esModuleInterop":true,"skipLibCheck":true}\' --skip-project --transpile-only src/cli/backlink-check.ts' },
    { name: 'Competitor Check', cmd: 'npx ts-node --compiler-options \'{"ignoreDeprecations":"6.0","module":"commonjs","moduleResolution":"node","esModuleInterop":true,"skipLibCheck":true}\' --skip-project --transpile-only src/cli/competitor-check.ts' },
  ];

  for (const check of checks) {
    console.log(`\n--- ${check.name} ---`);
    try {
      const output = execSync(check.cmd, { encoding: 'utf-8', timeout: 60000, cwd: process.cwd() });
      console.log(output.slice(0, 500));
    } catch (e: any) {
      console.log(`Failed: ${e.message?.slice(0, 100)}`);
    }
  }

  console.log('\n=== Daily run complete ===');
}

main().catch(e => { console.error('Daily run failed:', e.message); process.exit(1); });
