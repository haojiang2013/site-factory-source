@echo off
cd /d g:\cc-test\site-factory

REM Find Node.js
for %%d in ("d:\Program Files\nodejs" "c:\Program Files\nodejs" "d:\Program Files (x86)\nodejs" "%APPDATA%\nvm") do (
  if exist "%%~d\node.exe" set NODE_PATH=%%~d
)
if defined NODE_PATH (
  echo Node found at: %NODE_PATH%
  set PATH=%NODE_PATH%;%PATH%
  node -e "console.log('Starting dev server on http://localhost:3475/report/')"
  npx next dev -p 3475
) else (
  echo Node.js not found. Please install from https://nodejs.org
)
pause
