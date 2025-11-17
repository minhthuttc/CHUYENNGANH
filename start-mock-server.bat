@echo off
echo ========================================
echo    KHOI DONG MOCK SERVER
echo ========================================
echo.
echo [1/3] Dung tat ca process Node.js cu...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
echo.
echo [2/3] Khoi dong Mock Server...
echo (Khong can MongoDB, du lieu luu trong RAM)
echo.
start /B node server-mock.js
timeout /t 3 /nobreak >nul
echo.
echo [3/3] Tao du lieu mau...
node seed-mock-data.js
echo.
echo ========================================
echo    HOAN THANH!
echo ========================================
echo.
echo Server dang chay tai: http://localhost:3000
echo.
echo Dang nhap voi:
echo   Email: client1@example.com
echo   Password: 123456
echo.
echo Xem du an: http://localhost:3000/my-projects.html
echo.
pause
