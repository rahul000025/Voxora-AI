@echo off
title Voxora AI - Frontend (Port 3000)
color 0B
echo ========================================================
echo          Voxora AI - Starting Next.js 15 Frontend
echo ========================================================
echo.
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo [1/2] Installing Node.js packages...
    call npm install
)

echo [2/2] Launching Next.js Studio on http://localhost:3000 ...
echo.
call npm run dev
pause
