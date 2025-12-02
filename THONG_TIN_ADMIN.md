# 🔐 THÔNG TIN TÀI KHOẢN ADMIN MẶC ĐỊNH

## 📋 THÔNG TIN ĐĂNG NHẬP

### Tài khoản Admin mặc định
```
📧 Email:    admin@designhub.com
🔑 Password: admin123
👤 Vai trò:  Super Admin (Toàn quyền)
```

---

## 🚀 CÁCH SỬ DỤNG

### 1. Khởi động server
```bash
node server.js
```

Server sẽ tự động:
- ✅ Kết nối MongoDB
- ✅ Kiểm tra admin mặc định
- ✅ Tạo admin nếu chưa có
- ✅ Hiển thị thông tin đăng nhập

### 2. Đăng nhập
```
🔗 Trang đăng nhập: http://localhost:3000/login.html

Nhập:
- Email: admin@designhub.com
- Password: admin123
```

### 3. Truy cập trang Admin
```
🔗 Trang admin: http://localhost:3000/admin.html
```

---

## 🔑 MÃ BẢO MẬT ĐĂNG KÝ ADMIN MỚI

Nếu muốn tạo thêm admin khác:

```
Mã bảo mật: DESIGNHUB_ADMIN_110122174
```

**Truy cập:** http://localhost:3000/admin-register.html

---

## 🛡️ BẢO MẬT

### ⚠️ QUAN TRỌNG - ĐỌC KỸ!

1. **Đổi mật khẩu ngay sau lần đăng nhập đầu tiên**
   - Mật khẩu mặc định `admin123` chỉ dùng cho development
   - KHÔNG sử dụng trong production

2. **Thay đổi email admin**
   - Vào MongoDB và sửa email thành email thực của bạn
   - Hoặc tạo admin mới và xóa admin mặc định

3. **Xóa file này trong production**
   - File `THONG_TIN_ADMIN.md` chứa thông tin nhạy cảm
   - Thêm vào `.gitignore`

4. **Sử dụng biến môi trường**
   ```env
   # .env
   DEFAULT_ADMIN_EMAIL=your_email@example.com
   DEFAULT_ADMIN_PASSWORD=your_strong_password
   ```

---

## 📝 CÁCH THAY ĐỔI THÔNG TIN ADMIN MẶC ĐỊNH

### Cách 1: Sửa trong file `init-admin.js`

```javascript
const defaultAdmin = {
    email: 'your_email@example.com',      // Đổi email
    password: 'your_strong_password',      // Đổi password
    fullName: 'Your Name',                 // Đổi tên
    userType: 'admin',
    adminRole: 'super_admin'
};
```

### Cách 2: Sử dụng biến môi trường

**Bước 1:** Thêm vào `.env`
```env
DEFAULT_ADMIN_EMAIL=admin@yourcompany.com
DEFAULT_ADMIN_PASSWORD=YourStrongPassword123!
DEFAULT_ADMIN_NAME=Your Name
```

**Bước 2:** Sửa `init-admin.js`
```javascript
const defaultAdmin = {
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@designhub.com',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
    fullName: process.env.DEFAULT_ADMIN_NAME || 'Administrator',
    userType: 'admin',
    adminRole: 'super_admin'
};
```

---

## 🔄 RESET ADMIN MẶC ĐỊNH

Nếu quên mật khẩu hoặc muốn reset:

### Cách 1: Xóa và tạo lại

```bash
# Vào MongoDB Shell
mongosh "mongodb+srv://thu:12345@chuyennganh.piilkao.mongodb.net/designhub"

# Xóa admin cũ
db.users.deleteOne({ email: "admin@designhub.com" })

# Khởi động lại server để tạo admin mới
node server.js
```

### Cách 2: Đổi mật khẩu trực tiếp

```bash
# Vào MongoDB Shell
mongosh "mongodb+srv://thu:12345@chuyennganh.piilkao.mongodb.net/designhub"

# Tạo mật khẩu mới đã hash (ví dụ: "newpassword123")
# Sử dụng bcrypt online hoặc Node.js

# Update password
db.users.updateOne(
  { email: "admin@designhub.com" },
  { $set: { password: "hashed_password_here" } }
)
```

---

## 📊 KIỂM TRA ADMIN TRONG DATABASE

### Sử dụng MongoDB Compass

1. Kết nối: `mongodb+srv://thu:12345@chuyennganh.piilkao.mongodb.net/designhub`
2. Database: `designhub`
3. Collection: `users`
4. Filter: `{ "userType": "admin" }`

### Sử dụng MongoDB Shell

```javascript
// Xem tất cả admin
db.users.find({ userType: "admin" }).pretty()

// Đếm số admin
db.users.countDocuments({ userType: "admin" })

// Xem admin mặc định
db.users.findOne({ email: "admin@designhub.com" })
```

---

## 🎯 CHECKLIST SAU KHI CÀI ĐẶT

- [ ] Server đã khởi động thành công
- [ ] Admin mặc định đã được tạo
- [ ] Đăng nhập thành công với admin@designhub.com
- [ ] Truy cập được trang admin
- [ ] Đã đổi mật khẩu admin
- [ ] Đã tạo admin cá nhân (nếu cần)
- [ ] Đã xóa/bảo mật file THONG_TIN_ADMIN.md

---

## 🆘 TROUBLESHOOTING

### Lỗi: "Admin mặc định đã tồn tại"
**Giải pháp:** Đây là thông báo bình thường, admin đã được tạo từ trước.

### Lỗi: "Không thể tạo admin"
**Nguyên nhân:** Lỗi kết nối MongoDB
**Giải pháp:**
1. Kiểm tra MongoDB Atlas đang chạy
2. Kiểm tra IP whitelist
3. Kiểm tra username/password trong .env

### Lỗi: "Email hoặc mật khẩu không đúng"
**Giải pháp:**
1. Kiểm tra lại email: `admin@designhub.com`
2. Kiểm tra lại password: `admin123`
3. Xóa admin cũ và tạo lại (xem phần Reset)

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra log server
2. Kiểm tra MongoDB connection
3. Liên hệ: NguyenVoMinhThu_110122174

---

## 🔗 LIÊN KẾT QUAN TRỌNG

- 🏠 Trang chủ: http://localhost:3000
- 🔐 Đăng nhập: http://localhost:3000/login.html
- 👤 Đăng ký: http://localhost:3000/register.html
- 🛡️ Admin: http://localhost:3000/admin.html
- ➕ Đăng ký admin mới: http://localhost:3000/admin-register.html

---

**⚠️ LƯU Ý CUỐI CÙNG:**

```
THÔNG TIN TRONG FILE NÀY LÀ BÍ MẬT!
- Không commit lên Git
- Không chia sẻ công khai
- Chỉ dùng cho development
- Thay đổi trong production
```

---

**Phiên bản:** 1.0.0  
**Cập nhật:** 17/11/2025  
**Tác giả:** NguyenVoMinhThu_110122174
