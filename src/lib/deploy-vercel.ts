import fs from 'fs/promises';
import path from 'path';

/**
 * Prepare a site directory for Next.js static export.
 * Copies template files, injects generated content, and writes site-specific configs.
 */
export async function prepareSite(siteSlug: string): Promise<string> {
  const siteDir = path.join(process.cwd(), 'sites', siteSlug);
  const dataDir = path.join(process.cwd(), 'src', 'data', siteSlug);
  const templateDir = path.join(process.cwd(), 'src', 'templates', 'template-a-calculator');

  // 1. Ensure clean site directory
  await fs.rm(siteDir, { recursive: true, force: true });
  await fs.mkdir(siteDir, { recursive: true });

  // 2. Copy template files
  await cpDir(templateDir, siteDir);

  // 3. Read generated data
  const config = JSON.parse(
    await fs.readFile(path.join(dataDir, 'config.json'), 'utf-8')
  );
  const pages = JSON.parse(
    await fs.readFile(path.join(dataDir, 'pages.json'), 'utf-8')
  );
  const toolCode = JSON.parse(
    await fs.readFile(path.join(dataDir, 'tool-code.json'), 'utf-8')
  );

  // 4. Write site-specific data files
  await fs.writeFile(
    path.join(siteDir, 'site-data.json'),
    JSON.stringify({ config, pages, toolCode: toolCode.jsCode }, null, 2)
  );

  console.log(`✅ Site prepared at: ${siteDir}`);
  return siteDir;
}

/**
 * Deploy to Vercel using the CLI.
 * Requires: Vercel CLI installed + VERCEL_TOKEN env var
 */
export async function deployToVercel(
  siteSlug: string,
  domain?: string
): Promise<string> {
  const siteDir = await prepareSite(siteSlug);
  const vercelDir = path.join(siteDir, '.vercel');

  // Ensure .vercel directory for project config
  await fs.mkdir(vercelDir, { recursive: true });

  const projectConfig = {
    name: siteSlug,
    framework: 'nextjs',
  };
  await fs.writeFile(
    path.join(vercelDir, 'project.json'),
    JSON.stringify(projectConfig, null, 2)
  );

  const deployCmd = domain
    ? `npx vercel deploy ${siteDir} --prod --token $VERCEL_TOKEN --scope $VERCEL_SCOPE 2>&1`
    : `npx vercel deploy ${siteDir} --prod --token $VERCEL_TOKEN 2>&1`;

  console.log(`\n🚀 Deploying ${siteSlug} to Vercel...`);
  console.log(`   Command: ${deployCmd}`);
  console.log(`   NOTE: Set VERCEL_TOKEN env var to enable auto-deploy.`);
  console.log(`   Manual: cd sites/${siteSlug} && vercel --prod`);

  return siteDir;
}

/** Recursive directory copy helper */
async function cpDir(src: string, dest: string): Promise<void> {
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await cpDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}
