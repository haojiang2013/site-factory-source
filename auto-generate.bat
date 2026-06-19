@echo off
cd /d g:\cc-test\site-factory
echo === AI Page Generator ===
echo.
npx tsx src/cli/generate-pages.ts --write
echo.
echo === Deploying to Vercel ===
npx vercel --prod --yes
echo.
echo === Done! ===
pause
