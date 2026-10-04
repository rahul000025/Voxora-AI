@echo off
title Voxora AI - Backend (Port 8000)
color 0A
echo ========================================================
echo          Voxora AI - Starting Backend Service
echo ========================================================
echo.
cd /d "%~dp0backend"

echo [1/2] Checking Python dependencies...
python -m pip install -r requirements.txt --quiet

echo [2/2] Starting FastAPI Server on http://localhost:8000 ...
echo Swagger API Docs: http://localhost:8000/docs
echo.
python run.py
pause
