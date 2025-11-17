# 📝 Hướng Dẫn Đăng Ký Tài Khoản

## ✅ Đã Sửa Lỗi Đăng Ký

### Vấn đề trước đây:
- ❌ File `register.html` không có JavaScript xử lý form
- ❌ Không có validation
- ❌ Không có thông báo lỗi/thành công
- ❌ Không redirect sau khi đăng ký

### Đã sửa:
- ✅ Tạo file `js/register.js` với đầy đủ logic
- ✅ Thêm validation đầy vào
- ✅ Thêm thông báo đẹp
- ✅ Auto redirect đến login sau khi thành công
- ✅ Xử lý lỗi tốt hơn
- ✅ Tạo trang test `test-register.html`

---

## 🚀 Cách Đăng Ký

### Cách 1: Đăng Ký Thông Thường

1. Mở trang đăng ký:
   ```
   http://localhost:3000/register.html
   ```

2. Điền thông tin:
   - Chọn loại tài khoản (Nhà thiết kế / Khách hàng)
   - Nhập họ tên
   - Nhập email
   - Nhập mật khẩu (tối thiểu 6 ký tự)
   - Xác nhận mật khẩu

3. Nhấn "Đăng Ký"

4. Đợi thông báo thành công

5. Tự động chuyển đến trang đăng nhập

### Cách 2: Đăng Ký Nhanh (Test)

1. Mở trang test:
   ```
   http://localhost:3000/test-register.html
   ```

2. Nhấn một trong hai nút:
   - "Đăng Ký Nhà Thiết Kế" - Tạo tài khoản designer
   - "Đăng Ký Khách Hàng" - Tạo tài khoản client

3. Hệ thống tự động tạo tài khoản với:
   - Email: `test_[type]_[timestamp]@example.com`
   - Mật khẩu: `123456`

4. Copy thông tin và đăng nhập

---

## 📋 Validation Rules

### Họ tên:
- ✅ Bắt buộc
- ✅ Không được để trống

### Email:
- ✅ Bắt buộc
- ✅ Phải đúng định dạng email
- ✅ Chưa được sử dụng

### Mật khẩu:
- ✅ Bắt buộc
- ✅ Tối thiểu 6 ký tự
- ✅ Phải khớp với xác nhận mật khẩu

### Loại tài khoản:
- ✅ Bắt buộc chọn
- ✅ Chỉ có 2 loại: designer hoặc client

---

## 🧪 Test Đăng Ký

### Test 1: Kiểm tra API
```
Mở: http://localhost:3000/test-register.html
Nhấn: "Test Kết Nối API"
Kết quả: Phải thấy "✅ Kết nối thành công!"
```

### Test 2: Đăng ký nhanh
```
Nhấn: "Đăng Ký Nhà Thiết Kế"
Kết quả: Tạo tài khoản thành công với email và password hiển thị
```

### Test 3: Đăng ký tùy chỉnh
```
Điền form tùy chỉnh
Nhấn: "Đăng Ký"
Kết quả: Đăng ký thành công
```

### Test 4: Validation
```
Thử các trường hợp:
- Để trống email → Lỗi
- Email không đúng định dạng → Lỗi
- Mật khẩu < 6 ký tự → Lỗi
- Mật khẩu không khớp → Lỗi
- Email đã tồn tại → Lỗi
```

---

## 🔧 Troubleshooting

### Lỗi: "Lỗi kết nối server"

**Nguyên nhân:** Server chưa chạy

**Giải pháp:**
```bash
node server.js
```

### Lỗi: "Email đã được sử dụng"

**Nguyên nhân:** Email đã tồn tại trong database

**Giải pháp:**
- Sử dụng email khác
- Hoặc đăng nhập với email đó

### Lỗi: "Mật khẩu phải có ít nhất 6 ký tự"

**Nguyên nhân:** Mật khẩu quá ngắn

**Giải pháp:**
- Nhập mật khẩu dài hơn 6 ký tự

### Lỗi: "Mật khẩu xác nhận không khớp"

**Nguyên nhân:** Hai mật khẩu không giống nhau

**Giải pháp:**
- Nhập lại cho khớp

### Không có thông báo gì

**Nguyên nhân:** JavaScript không load

**Giải pháp:**
1. Mở Developer Tools (F12)
2. Xem tab Console
3. Kiểm tra có lỗi không
4. Đảm bảo file `js/register.js` tồn tại

---

## 📊 API Endpoint

### POST /api/auth/register

**Request:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "test@example.com",
  "password": "123456",
  "userType": "designer"
}
```

**Response (Success):**
```json
{
  "message": "Đăng ký thành công!",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Response (Error):**
```json
{
  "message": "Email đã được sử dụng!"
}
```

---

## 🎯 Sau Khi Đăng Ký

### Bước 1: Đăng nhập
```
http://localhost:3000/login.html
```

### Bước 2: Sử dụng hệ thống
- Xem dự án: `my-projects.html`
- Tạo dự án: Từ my-projects.html
- Thanh toán: Từ chi tiết dự án
- Xem lịch sử: `payment-history.html`

---

## 📁 Files Liên Quan

### Frontend:
- `register.html` - Trang đăng ký
- `js/register.js` - Logic đăng ký
- `test-register.html` - Trang test

### Backend:
- `routes/auth.js` - API đăng ký
- `models/User.js` - User schema

---

## 🔐 Bảo Mật

### Mật khẩu:
- ✅ Được hash bằng bcrypt
- ✅ Không lưu plain text
- ✅ Salt rounds: 10

### Email:
- ✅ Unique constraint
- ✅ Validation format
- ✅ Lowercase

### Token:
- ✅ JWT với secret key
- ✅ Expires: 7 days

---

## 💡 Tips

### Tạo tài khoản test nhanh:
```
Mở: test-register.html
Nhấn: "Đăng Ký Nhanh"
→ Tài khoản được tạo với email và password hiển thị
```

### Debug:
```javascript
// Trong browser console
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### Clear data:
```javascript
// Xóa tất cả data
localStorage.clear();
```

---

## 📞 Liên Hệ

Nếu gặp vấn đề:
- Email: NguyenVoMinhThu_110122174
- Xem file: `HUONG_DAN_SUA_LOI.md`

---

**Tóm tắt:**
1. Mở `test-register.html` để test nhanh
2. Hoặc dùng `register.html` để đăng ký thông thường
3. Sau khi đăng ký, đăng nhập tại `login.html`
4. Bắt đầu sử dụng hệ thống!
