#!/usr/bin/env tsx
import 'dotenv/config';  // Load .env.local for tsx runtime
/**
 * CLI entry point for site generation.
 * Usage: npx tsx src/cli/generate-site.ts <site-slug>
 */
import { StateStore } from '../lib/state-store';
import { runPipeline } from './pipeline';

async function main() {
  const siteSlug = process.argv[2];

  if (!siteSlug) {
    console.log('Usage: npx tsx src/cli/generate-site.ts <site-slug>');
    console.log('Available sites:');
    const sites = await StateStore.listSites();
    sites.forEach(s => console.log(`  - ${s}`));
    process.exit(1);
  }

  if (!(await StateStore.siteExists(siteSlug))) {
    console.error(`❌ Site "${siteSlug}" not found. Create config first at:`);
    console.error(`   src/data/${siteSlug}/config.json`);
    process.exit(1);
  }

  try {
    const skip = parseInt(process.argv[3] || '0');
    await runPipeline(siteSlug, skip);
  } catch (err) {
    console.error(`\n❌ Pipeline failed for ${siteSlug}:`, err);
    process.exit(1);
  }
}

main();
