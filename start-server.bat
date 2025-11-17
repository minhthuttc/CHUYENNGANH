@echo off
echo ========================================
echo    DESIGNHUB - Khoi dong Server
echo ========================================
echo.

echo [1/3] Dang kiem tra port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do (
    echo Port 3000 dang duoc su dung boi PID: %%a
    echo Dang dung process...
    taskkill /F /PID %%a >nul 2>&1
)
echo Port 3000 da san sang!
echo.

echo [2/3] Dang khoi dong server...
echo.
node server.js
