@echo off
title Voxora AI - Full Stack Launcher
color 0E
echo ========================================================
echo          Voxora AI - Launching Full Stack Application
echo ========================================================
echo.
echo [1/2] Starting Backend Service in a new terminal...
start "Voxora AI - Backend (Port 8000)" cmd /k "%~dp0run_backend.bat"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Service in a new terminal...
start "Voxora AI - Frontend (Port 3000)" cmd /k "%~dp0run_frontend.bat"

echo.
echo ========================================================
echo  Both services are starting!
echo  Backend:  http://localhost:8000 (Swagger: /docs)
echo  Frontend: http://localhost:3000
echo ========================================================
timeout /t 5
