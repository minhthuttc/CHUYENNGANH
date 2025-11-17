# 📚 HƯỚNG DẪN SỬ DỤNG SERVER

## 🎯 CÓ 2 LOẠI SERVER:

### 1. Server Chính (server.js) - CẦN MONGODB
```bash
node server.js
```

**Ưu điểm:**
- Lưu dữ liệu vĩnh viễn trong MongoDB
- Dùng cho production
- Có đầy đủ tính năng

**Nhược điểm:**
- Cần kết nối MongoDB Atlas
- Cần whitelist IP
- Cần internet

**Khi nào dùng:**
- Khi đã sửa xong lỗi MongoDB IP whitelist
- Khi deploy lên production
- Khi cần lưu dữ liệu thật

---

### 2. Mock Server (server-mock.js) - KHÔNG CẦN MONGODB
```bash
node server-mock.js
```

**Ưu điểm:**
- Không cần MongoDB
- Không cần internet
- Chạy ngay lập tức
- Dùng để test API

**Nhược điểm:**
- Dữ liệu lưu trong RAM
- Mất dữ liệu khi restart
- Chỉ dùng để development

**Khi nào dùng:**
- Khi test API nhanh
- Khi MongoDB chưa kết nối được
- Khi develop frontend
- Khi không cần lưu dữ liệu

---

## 🚀 CÁCH SỬ DỤNG:

### Bước 1: Chọn Server

**Nếu MongoDB đã OK:**
```bash
node server.js
```

**Nếu MongoDB chưa OK:**
```bash
node server-mock.js
```

### Bước 2: Kiểm Tra

Mở browser:
```
http://localhost:3000/check-server.html
```

Nhấn "Kiểm Tra Ngay" và "Test API"

### Bước 3: Test Đăng Ký

```
http://localhost:3000/test-register.html
```

---

## 🔧 SỬA LỖI MONGODB:

Nếu server.js báo lỗi MongoDB:

### Cách 1: Sửa IP Whitelist (Khuyến nghị)

1. Chạy file: `FIX_MONGODB_NOW.bat`
2. Làm theo hướng dẫn
3. Đợi 1-2 phút
4. Restart server

### Cách 2: Dùng Mock Server (Tạm thời)

```bash
node server-mock.js
```

---

## 📝 SCRIPTS HỮU ÍCH:

### restart-server.bat
Dừng và khởi động lại server chính

### FIX_MONGODB_NOW.bat
Hướng dẫn sửa lỗi MongoDB IP whitelist

### test-api-full.js
Test toàn bộ API (đăng ký, đăng nhập)

---

## ✅ CHECKLIST:

**Server Chính (server.js):**
- [ ] MongoDB Atlas đã whitelist IP
- [ ] File .env có MONGODB_URI đúng
- [ ] Có internet
- [ ] Chạy: `node server.js`
- [ ] Thấy: "✅ Kết nối MongoDB thành công!"

**Mock Server (server-mock.js):**
- [ ] Chạy: `node server-mock.js`
- [ ] Thấy: "🚀 MOCK SERVER - KHÔNG CẦN MONGODB"
- [ ] Test API OK

---

## 🎉 KẾT QUẢ:

Sau khi server chạy thành công:

1. **Test API:**
   ```bash
   node test-api-full.js
   ```

2. **Sử dụng Web:**
   - http://localhost:3000/register.html
   - http://localhost:3000/login.html
   - http://localhost:3000/admin-register.html

---

**Cập nhật:** 17/11/2025
**Tác giả:** NguyenVoMinhThu_110122174
