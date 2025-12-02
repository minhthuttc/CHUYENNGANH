# 🔐 HƯỚNG DẪN ĐĂNG KÝ ADMIN VỚI MÃ BẢO MẬT

## 📋 THÔNG TIN MÃ BẢO MẬT

### Mã Bảo Mật Admin
```
DESIGNHUB_ADMIN_110122174
```

**⚠️ QUAN TRỌNG:**
- Mã này là BÍ MẬT TUYỆT ĐỐI
- Chỉ dành cho quản trị viên được ủy quyền
- KHÔNG chia sẻ với bất kỳ ai
- Thay đổi mã này trong production

---

## 🚀 CÁCH ĐĂNG KÝ ADMIN

### Bước 1: Truy cập trang đăng ký admin
```
http://localhost:3000/admin-register.html
```

### Bước 2: Điền thông tin

1. **Mã Bảo Mật Admin** (Bắt buộc)
   ```
   DESIGNHUB_ADMIN_110122174
   ```

2. **Họ và tên** (Bắt buộc)
   - Ví dụ: Nguyễn Văn A

3. **Email** (Bắt buộc)
   - Ví dụ: admin@designhub.com
   - Email phải chưa được sử dụng

4. **Mật khẩu** (Bắt buộc)
   - Tối thiểu 6 ký tự
   - Nên sử dụng mật khẩu mạnh

5. **Xác nhận mật khẩu** (Bắt buộc)
   - Phải trùng với mật khẩu

6. **Vai trò Admin** (Bắt buộc)
   - **Super Admin**: Toàn quyền trên hệ thống
   - **Admin**: Quản lý chung
   - **Moderator**: Kiểm duyệt nội dung

### Bước 3: Nhấn "Đăng Ký Admin"

Hệ thống sẽ:
1. Kiểm tra mã bảo mật
2. Kiểm tra email chưa tồn tại
3. Mã hóa mật khẩu
4. Tạo tài khoản admin
5. Hiển thị thông báo thành công
6. Tự động chuyển đến trang đăng nhập

---

## 🔑 VAI TRÒ ADMIN

### 1. Super Admin (super_admin)
**Quyền hạn:**
- ✅ Toàn quyền trên hệ thống
- ✅ Quản lý tất cả admin khác
- ✅ Thay đổi cấu hình hệ thống
- ✅ Xem tất cả log
- ✅ Xóa bất kỳ dữ liệu nào

**Sử dụng khi:**
- Chủ sở hữu hệ thống
- CTO/Technical Lead

### 2. Admin (admin)
**Quyền hạn:**
- ✅ Quản lý người dùng
- ✅ Quản lý dự án
- ✅ Quản lý thanh toán
- ✅ Xem báo cáo và thống kê
- ❌ Không thể xóa admin khác

**Sử dụng khi:**
- Quản trị viên hệ thống
- Customer Support Manager

### 3. Moderator (moderator)
**Quyền hạn:**
- ✅ Kiểm duyệt dự án
- ✅ Xem người dùng (không xóa)
- ✅ Xem báo cáo
- ❌ Không thể xóa người dùng
- ❌ Không thể quản lý thanh toán

**Sử dụng khi:**
- Nhân viên kiểm duyệt nội dung
- Content Moderator

---

## 🛡️ BẢO MẬT

### Mã bảo mật được lưu ở đâu?

1. **Frontend** (js/admin-register.js)
   ```javascript
   const ADMIN_SECURITY_CODE = 'DESIGNHUB_ADMIN_110122174';
   ```

2. **Backend** (routes/auth.js)
   ```javascript
   const ADMIN_SECURITY_CODE = 'DESIGNHUB_ADMIN_110122174';
   ```

### Cách thay đổi mã bảo mật

**Bước 1:** Sửa trong `js/admin-register.js`
```javascript
const ADMIN_SECURITY_CODE = 'MÃ_MỚI_CỦA_BẠN';
```

**Bước 2:** Sửa trong `routes/auth.js`
```javascript
const ADMIN_SECURITY_CODE = 'MÃ_MỚI_CỦA_BẠN';
```

**Bước 3:** Khởi động lại server
```bash
# Dừng server (Ctrl+C)
node server.js
```

### Khuyến nghị cho Production

1. **Lưu mã trong biến môi trường**
   ```env
   # .env
   ADMIN_SECURITY_CODE=your_secret_code_here
   ```

2. **Sử dụng trong code**
   ```javascript
   const ADMIN_SECURITY_CODE = process.env.ADMIN_SECURITY_CODE;
   ```

3. **Thêm rate limiting**
   ```javascript
   // Giới hạn 3 lần thử trong 15 phút
   const registerLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 3
   });
   ```

4. **Log mọi lần thử đăng ký**
   ```javascript
   console.log(`Attempt to register admin: ${email} at ${new Date()}`);
   ```

---

## 📝 QUY TRÌNH ĐĂNG KÝ ADMIN

```
┌─────────────────────────────────────┐
│  Truy cập admin-register.html       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Nhập mã bảo mật                    │
│  DESIGNHUB_ADMIN_110122174          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Kiểm tra mã bảo mật (Frontend)     │
└──────────────┬──────────────────────┘
               │
               ├─── ❌ Sai → Hiển thị lỗi
               │
               ▼ ✅ Đúng
┌─────────────────────────────────────┐
│  Gửi request đến server             │
│  POST /api/auth/register-admin      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Kiểm tra mã bảo mật (Backend)      │
└──────────────┬──────────────────────┘
               │
               ├─── ❌ Sai → Return 403
               │
               ▼ ✅ Đúng
┌─────────────────────────────────────┐
│  Kiểm tra email đã tồn tại?         │
└──────────────┬──────────────────────┘
               │
               ├─── ✅ Có → Return 400
               │
               ▼ ❌ Chưa
┌─────────────────────────────────────┐
│  Mã hóa mật khẩu (bcrypt)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Tạo admin trong MongoDB            │
│  userType: 'admin'                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Return success                     │
│  Chuyển đến trang login             │
└─────────────────────────────────────┘
```

---

## 🧪 TEST ĐĂNG KÝ ADMIN

### Test Case 1: Mã bảo mật sai
```
Input:
- Mã bảo mật: "wrong_code"
- Email: admin@test.com
- Password: 123456

Expected:
❌ "Mã bảo mật không đúng!"
```

### Test Case 2: Email đã tồn tại
```
Input:
- Mã bảo mật: "DESIGNHUB_ADMIN_110122174"
- Email: existing@test.com (đã có trong DB)
- Password: 123456

Expected:
❌ "Email đã được sử dụng!"
```

### Test Case 3: Mật khẩu không khớp
```
Input:
- Password: "123456"
- Confirm Password: "654321"

Expected:
❌ "Mật khẩu xác nhận không khớp!"
```

### Test Case 4: Thành công
```
Input:
- Mã bảo mật: "DESIGNHUB_ADMIN_110122174"
- Email: newadmin@test.com
- Password: "123456"
- Confirm Password: "123456"
- Role: "admin"

Expected:
✅ "Đăng ký admin thành công!"
→ Chuyển đến login.html
```

---

## 🔍 KIỂM TRA ADMIN TRONG DATABASE

### Sử dụng MongoDB Compass

1. Kết nối đến MongoDB Atlas
2. Chọn database: `designhub`
3. Chọn collection: `users`
4. Tìm user với `userType: "admin"`

### Sử dụng MongoDB Shell

```javascript
// Kết nối
mongosh "mongodb+srv://thu:12345@chuyennganh.piilkao.mongodb.net/designhub"

// Xem tất cả admin
db.users.find({ userType: "admin" })

// Đếm số admin
db.users.countDocuments({ userType: "admin" })

// Xem admin theo role
db.users.find({ userType: "admin", adminRole: "super_admin" })
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Bảo mật mã
- ❌ KHÔNG commit mã bảo mật lên Git
- ❌ KHÔNG chia sẻ mã qua email/chat
- ✅ Lưu mã ở nơi an toàn
- ✅ Thay đổi mã định kỳ

### 2. Quản lý admin
- Chỉ tạo admin khi thực sự cần thiết
- Xóa admin không còn hoạt động
- Kiểm tra log thường xuyên
- Sử dụng vai trò phù hợp

### 3. Mật khẩu admin
- Sử dụng mật khẩu mạnh (>12 ký tự)
- Kết hợp chữ hoa, chữ thường, số, ký tự đặc biệt
- Không sử dụng mật khẩu dễ đoán
- Đổi mật khẩu định kỳ

### 4. Giám sát
- Log mọi lần đăng ký admin
- Thông báo khi có admin mới
- Kiểm tra hoạt động admin
- Backup dữ liệu thường xuyên

---

## 🆘 TROUBLESHOOTING

### Lỗi: "Mã bảo mật không đúng"
**Nguyên nhân:**
- Nhập sai mã
- Copy/paste có khoảng trắng thừa

**Giải pháp:**
- Kiểm tra lại mã: `DESIGNHUB_ADMIN_110122174`
- Không có khoảng trắng đầu/cuối
- Phân biệt chữ hoa/thường

### Lỗi: "Email đã được sử dụng"
**Nguyên nhân:**
- Email đã tồn tại trong database

**Giải pháp:**
- Sử dụng email khác
- Hoặc xóa user cũ trong MongoDB

### Lỗi: "Lỗi kết nối server"
**Nguyên nhân:**
- Server không chạy
- Sai URL API

**Giải pháp:**
```bash
# Kiểm tra server
node server.js

# Kiểm tra port
netstat -ano | findstr :3000
```

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề khi đăng ký admin:
1. Kiểm tra console (F12) để xem lỗi
2. Kiểm tra log server
3. Liên hệ: NguyenVoMinhThu_110122174

---

**Phiên bản:** 1.0.0  
**Cập nhật:** 17/11/2025  
**Tác giả:** NguyenVoMinhThu_110122174
