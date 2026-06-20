/**
 * Tool health API — checks calculator tool integrity
 * Actual format: { jsCode: string, testCases: string[] }
 * GET /api/tool-health
 */
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const dirs = fs.readdirSync(dataDir).filter((d: string) => d.startsWith('site-')).sort();

  const results = dirs.map(dir => {
    try {
      const cfg = JSON.parse(fs.readFileSync(path.join(dataDir, dir, 'config.json'), 'utf8'));
      const toolPath = path.join(dataDir, dir, 'tool-code.json');
      if (!fs.existsSync(toolPath)) return null;

      const tool = JSON.parse(fs.readFileSync(toolPath, 'utf8'));
      const issues: string[] = [];

      // jsCode: must exist, be non-empty string, reasonable length
      if (!tool.jsCode || typeof tool.jsCode !== 'string') {
        issues.push('jsCode 缺失或非字符串');
      } else if (tool.jsCode.length < 500) {
        issues.push(`jsCode 仅${tool.jsCode.length}字符（异常短）`);
      }
      // Note: code uses various patterns (function keyword, method shorthand, arrow functions) - all valid

      // testCases: must exist and be non-empty array
      if (!tool.testCases || !Array.isArray(tool.testCases)) {
        issues.push('testCases 缺失或非数组');
      } else if (tool.testCases.length === 0) {
        issues.push('testCases 为空');
      }

      // Count TC comments in jsCode as a coverage check
      const tcMatches = (tool.jsCode || '').match(/\/\/\s*TC\d+/g);
      const tcInCode = tcMatches ? tcMatches.length : 0;

      return {
        domain: cfg.domain,
        brand: cfg.designConfig.brandName,
        template: cfg.template,
        jsCodeLen: tool.jsCode?.length || 0,
        testCaseCount: tool.testCases?.length || 0,
        tcInCode,
        healthy: issues.length === 0,
        issues,
      };
    } catch (e: any) {
      return null;
    }
  }).filter(Boolean);

  const total = results.length;
  const healthy = results.filter((r: any) => r.healthy).length;
  const unhealthy = total - healthy;

  return NextResponse.json({ total, healthy, unhealthy, results });
}
