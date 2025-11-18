@echo off
echo ========================================
echo 🔧 SỬA LỖI MONGODB TIMEOUT
echo ========================================
echo.

echo ⏳ Bước 1: Kiểm tra kết nối MongoDB...
node test-mongodb.js

echo.
echo ========================================
echo 📋 HƯỚNG DẪN SỬA LỖI:
echo ========================================
echo.
echo 1. Mở MongoDB Atlas: https://cloud.mongodb.com
echo 2. Đăng nhập tài khoản
echo 3. Chọn cluster "CHUYENNGANH"
echo 4. Vào "Network Access" (menu bên trái)
echo 5. Nhấn "Add IP Address"
echo 6. Nhấn "Allow Access from Anywhere"
echo 7. Nhấn "Confirm"
echo 8. Đợi 1-2 phút
echo 9. Chạy lại script này
echo.
echo ========================================
echo 🔄 Nhấn phím bất kỳ để thử lại...
echo ========================================
pause > nul

echo.
echo ⏳ Thử kết nối lại...
node test-mongodb.js

echo.
echo ========================================
echo 🚀 Khởi động server...
echo ========================================
node server.js