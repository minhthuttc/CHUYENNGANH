@echo off
echo ========================================
echo    KHOI DONG SERVER DESIGNHUB
echo ========================================
echo.

echo [1/4] Kiem tra Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js chua duoc cai dat!
    echo Vui long cai dat Node.js tu https://nodejs.org
    pause
    exit /b 1
)
echo OK: Node.js da duoc cai dat
echo.

echo [2/4] Kiem tra file server.js...
if not exist server.js (
    echo ERROR: Khong tim thay file server.js!
    pause
    exit /b 1
)
echo OK: File server.js ton tai
echo.

echo [3/4] Kiem tra file .env...
if not exist .env (
    echo WARNING: Khong tim thay file .env!
    echo Dang tao file .env mau...
    (
        echo MONGODB_URI=mongodb://localhost:27017/designhub
        echo JWT_SECRET=designhub_secret_key_2025
        echo PORT=3000
    ) > .env
    echo OK: Da tao file .env
) else (
    echo OK: File .env ton tai
)
echo.

echo [4/4] Khoi dong server...
echo.
echo ========================================
echo    SERVER DANG CHAY
echo ========================================
echo.
echo Nhan Ctrl+C de dung server
echo.

node server.js

pause
