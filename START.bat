@echo off
title CV Maker PDF
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js nu este instalat. Instaleaza-l de la https://nodejs.org
  pause
  exit /b 1
)

echo Pornesc CV Maker PDF...
start "" "http://localhost:3847"
node server.js
