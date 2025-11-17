@echo off
echo ========================================
echo    KHOI DONG LAI SERVER DESIGNHUB
echo ========================================
echo.

echo [1/3] Dung tat ca process Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Kiem tra MongoDB connection...
echo.

echo [3/3] Khoi dong server...
echo.
node server.js
