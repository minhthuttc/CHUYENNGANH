# 🔧 Sửa Lỗi "Không Tìm Thấy Dự Án"

## Nguyên Nhân

Lỗi này xảy ra khi:
1. ❌ Chưa có dự án nào trong database
2. ❌ ID dự án không hợp lệ hoặc không tồn tại
3. ❌ Chưa đăng nhập
4. ❌ Server chưa chạy hoặc lỗi kết nối

---

## Giải Pháp Nhanh

### Bước 1: Kiểm Tra Database

Mở trang test:
```
http://localhost:3000/test-projects.html
```

Trang này sẽ:
- ✅ Kiểm tra kết nối API
- ✅ Hiển thị tất cả dự án trong database
- ✅ Cho phép tạo dự án test
- ✅ Link trực tiếp đến chi tiết dự án

### Bước 2: Tạo Dự Án Test

Từ trang `test-projects.html`:
1. Nhấn nút "Tạo Dự Án Test"
2. Đợi hệ thống tạo dự án
3. Click vào dự án vừa tạo để xem chi tiết

### Bước 3: Xem Chi Tiết

Sau khi có dự án, bạn có thể:
- Click vào dự án từ danh sách
- Hoặc copy link và mở trong tab mới
- Hoặc vào `my-projects.html` để xem tất cả

---

## Các Trang Hỗ Trợ Debug

### 1. Test Projects (KHUYẾN NGHỊ)
```
http://localhost:3000/test-projects.html
```
**Tính năng:**
- Kiểm tra database
- Tạo dự án test
- Xem danh sách dự án
- Link trực tiếp

### 2. My Projects
```
http://localhost:3000/my-projects.html
```
**Tính năng:**
- Xem tất cả dự án
- Tạo dự án demo
- Click để xem chi tiết

### 3. Demo Payment
```
http://localhost:3000/demo-payment.html
```
**Tính năng:**
- Tạo dự án demo nhanh
- Test thanh toán

---

## Kiểm Tra Chi Tiết

### 1. Kiểm Tra Server

Mở terminal và chạy:
```bash
node server.js
```

Đảm bảo thấy:
```
✅ Kết nối MongoDB thành công!
🚀 Server đang chạy tại http://localhost:3000
```

### 2. Kiểm Tra API

Mở browser console (F12) và chạy:
```javascript
// Test API
fetch('http://localhost:3000/api/test')
  .then(r => r.json())
  .then(d => console.log('API:', d));

// Test Projects
fetch('http://localhost:3000/api/projects', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
  .then(r => r.json())
  .then(d => console.log('Projects:', d));
```

### 3. Kiểm Tra Đăng Nhập

```javascript
// Check token
console.log('Token:', localStorage.getItem('token'));

// Check user
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

---

## Các Lỗi Thường Gặp

### Lỗi 1: "Không tìm thấy ID dự án"

**Nguyên nhân:** URL không có parameter `id`

**Giải pháp:**
- Không truy cập trực tiếp `project-detail.html`
- Phải truy cập qua `project-detail.html?id=<ID>`
- Hoặc click từ danh sách dự án

### Lỗi 2: "Dự án không tồn tại hoặc đã bị xóa"

**Nguyên nhân:** ID không có trong database

**Giải pháp:**
1. Mở `test-projects.html`
2. Nhấn "Kiểm Tra Dự Án"
3. Xem danh sách ID hợp lệ
4. Hoặc tạo dự án mới

### Lỗi 3: "Bạn cần đăng nhập"

**Nguyên nhân:** Chưa đăng nhập hoặc token hết hạn

**Giải pháp:**
1. Truy cập `login.html`
2. Đăng nhập lại
3. Thử lại

### Lỗi 4: "Không thể tải dự án"

**Nguyên nhân:** Server lỗi hoặc không chạy

**Giải pháp:**
1. Kiểm tra server đang chạy
2. Kiểm tra MongoDB đã kết nối
3. Xem console log server
4. Restart server

---

## Flow Đúng Để Xem Chi Tiết

```
1. Đăng nhập
   ↓
2. Mở test-projects.html
   ↓
3. Kiểm tra/Tạo dự án
   ↓
4. Click vào dự án
   ↓
5. Xem chi tiết thành công!
```

---

## Debug Steps

### Step 1: Kiểm tra server
```bash
# Terminal 1
node server.js

# Phải thấy:
# ✅ Kết nối MongoDB thành công!
# 🚀 Server đang chạy tại http://localhost:3000
```

### Step 2: Kiểm tra đăng nhập
```
Mở: http://localhost:3000/login.html
Đăng nhập với tài khoản có sẵn
```

### Step 3: Test database
```
Mở: http://localhost:3000/test-projects.html
Nhấn "Kiểm Tra Dự Án"
```

### Step 4: Tạo dự án nếu cần
```
Từ test-projects.html
Nhấn "Tạo Dự Án Test"
```

### Step 5: Xem chi tiết
```
Click vào dự án từ danh sách
Hoặc copy link và mở
```

---

## Nếu Vẫn Lỗi

### 1. Xóa cache và thử lại
```javascript
// Trong browser console
localStorage.clear();
location.reload();
```

### 2. Kiểm tra console log
```
F12 → Console tab
Xem có lỗi gì không
```

### 3. Kiểm tra network
```
F12 → Network tab
Xem API calls có thành công không
```

### 4. Restart everything
```bash
# Stop server (Ctrl+C)
# Restart
node server.js

# Refresh browser
Ctrl+Shift+R (hard refresh)
```

---

## Quick Fix Commands

```bash
# 1. Restart server
Ctrl+C
node server.js

# 2. Check MongoDB
# Đảm bảo MongoDB đang chạy

# 3. Seed data (nếu cần)
node seed-data.js
```

---

## Liên Hệ

Nếu vẫn gặp vấn đề:
- Xem file `HUONG_DAN_SUA_LOI.md`
- Email: NguyenVoMinhThu_110122174
- Hoặc mở issue trên GitHub

---

**TÓM TẮT:**
1. Mở `test-projects.html` để kiểm tra
2. Tạo dự án test nếu chưa có
3. Click vào dự án để xem chi tiết
4. Nếu vẫn lỗi, check console log và server
