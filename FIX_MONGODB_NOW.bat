@echo off
echo ========================================
echo    SUA LOI MONGODB - HUONG DAN
echo ========================================
echo.
echo LỖI: MongoDB Atlas khong cho phep IP cua ban ket noi
echo.
echo ========================================
echo    GIAI PHAP:
echo ========================================
echo.
echo 1. Mo trinh duyet va vao:
echo    https://cloud.mongodb.com
echo.
echo 2. Dang nhap voi tai khoan MongoDB Atlas
echo.
echo 3. Chon cluster: CHUYENNGANH
echo.
echo 4. Vao menu: Network Access (ben trai)
echo.
echo 5. Nhan nut: Add IP Address
echo.
echo 6. Chon: Allow Access from Anywhere
echo    (Hoac: Add Current IP Address)
echo.
echo 7. Nhan: Confirm
echo.
echo 8. Doi 1-2 phut de cap nhat
echo.
echo 9. Chay lai server:
echo    node server.js
echo.
echo ========================================
echo.
echo Nhan phim bat ky de mo MongoDB Atlas...
pause >nul
start https://cloud.mongodb.com/v2#/org/673938e0e1e0e5085e0e0e0e/projects
echo.
echo Da mo MongoDB Atlas trong trinh duyet!
echo.
pause
