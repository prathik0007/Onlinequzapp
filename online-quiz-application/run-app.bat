@echo off
TITLE Launch Online Quiz Application
echo ========================================================
echo   Launching Online Quiz Application (MERN + GraphQL)
echo ========================================================
echo.

echo [1/2] Starting GraphQL Backend Server on http://localhost:5000/graphql...
start "Quiz Backend (Express + GraphQL)" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Vite Frontend on http://localhost:3000...
start "Quiz Frontend (React + Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   Both servers launched successfully!
echo   Frontend URL: http://localhost:3000
echo   GraphQL URL:  http://localhost:5000/graphql
echo ========================================================
echo.
pause

