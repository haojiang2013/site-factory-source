/**
 * Site stats API — returns real page counts, keyword counts, template info
 * GET /api/site-stats
 */
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const dirs = fs.readdirSync(dataDir).filter((d: string) => d.startsWith('site-')).sort();

  const sites = dirs.map(dir => {
    try {
      const cfg = JSON.parse(fs.readFileSync(path.join(dataDir, dir, 'config.json'), 'utf8'));
      const pages = JSON.parse(fs.readFileSync(path.join(dataDir, dir, 'pages.json'), 'utf8'));
      const hasTool = fs.existsSync(path.join(dataDir, dir, 'tool-code.json'));
      // Vercel deploys don't preserve file mtimes — use build time instead
      const lastUpdated = process.env.VERCEL
        ? new Date().toISOString()
        : fs.statSync(path.join(dataDir, dir, 'pages.json')).mtime.toISOString();
      const kwTarget = cfg.keywords?.length || 0;
      return {
        domain: cfg.domain,
        brand: cfg.designConfig.brandName,
        niche: cfg.niche,
        template: cfg.template,
        pages: pages.length,
        keywords: kwTarget,
        kwTarget,
        hasTool,
        lastUpdated,
      };
    } catch { return null; }
  }).filter(Boolean);

  const totalPages = sites.reduce((s: number, x: any) => s + x.pages, 0);

  return NextResponse.json({
    total: sites.length,
    totalPages,
    sites,
  });
}
