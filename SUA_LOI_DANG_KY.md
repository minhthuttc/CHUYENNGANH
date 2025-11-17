# 🔧 Sửa Lỗi "Lỗi Server" Khi Đăng Ký

## Lỗi Hiện Tại

Khi đăng ký, xuất hiện thông báo màu đỏ: **"Lỗi server"**

---

## Nguyên Nhân Có Thể

1. ❌ Server chưa chạy
2. ❌ MongoDB chưa kết nối
3. ❌ Thiếu dependencies (bcryptjs, jsonwebtoken)
4. ❌ Lỗi trong User model
5. ❌ Route /auth/register chưa được đăng ký đúng

---

## Giải Pháp Từng Bước

### Bước 1: Kiểm Tra Server

**Cách 1: Dùng file check-server.html**
```
Mở: http://localhost:3000/check-server.html
Nhấn: "Kiểm Tra Ngay"
```

**Cách 2: Kiểm tra thủ công**
```bash
# Mở terminal và chạy
node server.js
```

**Kết quả mong đợi:**
```
✅ Kết nối MongoDB thành công!
📊 Database: designhub
🚀 Server đang chạy tại http://localhost:3000
```

**Nếu thấy lỗi:**
- Xem phần Troubleshooting bên dưới

---

### Bước 2: Kiểm Tra Dependencies

```bash
# Kiểm tra package.json có đủ dependencies không
npm list bcryptjs jsonwebtoken mongoose express

# Nếu thiếu, cài đặt
npm install bcryptjs jsonwebtoken mongoose express cors dotenv
```

---

### Bước 3: Kiểm Tra MongoDB

**Kiểm tra kết nối:**
```javascript
// Mở browser console và chạy
fetch('http://localhost:3000/api/test')
  .then(r => r.json())
  .then(d => console.log(d));
```

**Kết quả mong đợi:**
```json
{
  "message": "API đang hoạt động!",
  "status": "success"
}
```

---

### Bước 4: Test API Đăng Ký

**Mở trang test:**
```
http://localhost:3000/check-server.html
```

**Nhấn:** "Test API"

**Kết quả mong đợi:**
- ✅ API hoạt động tốt!
- Hiển thị User ID

**Nếu lỗi:**
- Xem message lỗi cụ thể
- Kiểm tra console log server

---

## Troubleshooting Chi Tiết

### Lỗi 1: "Cannot connect to MongoDB"

**Nguyên nhân:** MongoDB chưa chạy hoặc URI sai

**Giải pháp:**

**Nếu dùng MongoDB Atlas (Cloud):**
1. Kiểm tra file .env có MONGODB_URI đúng không
2. Kiểm tra IP whitelist trên MongoDB Atlas
3. Kiểm tra username/password

**Nếu dùng MongoDB Local:**
1. Khởi động MongoDB service
2. Kiểm tra MongoDB đang chạy trên port 27017
3. Sửa MONGODB_URI trong .env:
   ```
   MONGODB_URI=mongodb://localhost:27017/designhub
   ```

---

### Lỗi 2: "bcryptjs is not defined"

**Nguyên nhân:** Thiếu package bcryptjs

**Giải pháp:**
```bash
npm install bcryptjs
```

Sau đó restart server:
```bash
node server.js
```

---

### Lỗi 3: "User is not defined"

**Nguyên nhân:** User model chưa được import đúng

**Giải pháp:**

Kiểm tra file `routes/auth.js` có dòng này không:
```javascript
const User = require('../models/User');
```

Kiểm tra file `models/User.js` tồn tại không:
```bash
# Windows
dir models\User.js

# Hoặc
ls models/User.js
```

---

### Lỗi 4: "Route not found"

**Nguyên nhân:** Route chưa được đăng ký trong server.js

**Giải pháp:**

Kiểm tra file `server.js` có các dòng này:
```javascript
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
```

---

### Lỗi 5: "Port 3000 already in use"

**Nguyên nhân:** Port 3000 đang bị chiếm

**Giải pháp:**

**Cách 1: Kill process**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc dùng npx
npx kill-port 3000
```

**Cách 2: Dùng port khác**
Sửa file .env:
```
PORT=3001
```

---

## Các Lệnh Hữu Ích

### Khởi động server
```bash
# Cách 1: Thủ công
node server.js

# Cách 2: Dùng batch file (Windows)
start-server.bat

# Cách 3: Dùng nodemon (auto restart)
npm install -g nodemon
nodemon server.js
```

### Kiểm tra server
```bash
# Test API
curl http://localhost:3000/api/test

# Hoặc mở browser
http://localhost:3000/check-server.html
```

### Xem log
```bash
# Server log sẽ hiển thị trong terminal
# Để xem chi tiết, thêm console.log trong code
```

---

## Debug Steps

### Step 1: Kiểm tra server chạy
```bash
node server.js
```
Phải thấy: "✅ Kết nối MongoDB thành công!"

### Step 2: Test API cơ bản
```
Mở: http://localhost:3000/api/test
```
Phải thấy: `{"message":"API đang hoạt động!","status":"success"}`

### Step 3: Test đăng ký
```
Mở: http://localhost:3000/test-register.html
Nhấn: "Đăng Ký Nhanh"
```
Phải thấy: "✅ Đăng ký thành công!"

### Step 4: Kiểm tra database
```javascript
// Trong browser console
fetch('http://localhost:3000/api/projects')
  .then(r => r.json())
  .then(d => console.log('Projects:', d));
```

---

## Quick Fix

### Fix Nhanh Nhất

1. **Stop server** (Ctrl+C trong terminal)

2. **Cài đặt lại dependencies:**
```bash
npm install
```

3. **Restart server:**
```bash
node server.js
```

4. **Test lại:**
```
http://localhost:3000/check-server.html
```

---

## Kiểm Tra Từng File

### File 1: server.js
```javascript
// Phải có các dòng này
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
```

### File 2: routes/auth.js
```javascript
// Phải có
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  // ... code đăng ký
});
```

### File 3: models/User.js
```javascript
// Phải có schema đầy đủ
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  userType: String,
  // ...
});

module.exports = mongoose.model('User', userSchema);
```

### File 4: .env
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=3000
```

---

## Nếu Vẫn Lỗi

### 1. Xem Console Log Server
Trong terminal chạy server, xem có lỗi gì không

### 2. Xem Browser Console
F12 → Console tab, xem có lỗi JavaScript không

### 3. Xem Network Tab
F12 → Network tab → Thử đăng ký → Xem request/response

### 4. Test Trực Tiếp API
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","password":"123456","userType":"client"}'
```

---

## Liên Hệ

Nếu vẫn không giải quyết được:
- Email: NguyenVoMinhThu_110122174
- Xem file: HUONG_DAN_SUA_LOI.md

---

## Tóm Tắt

1. ✅ Chạy: `node server.js`
2. ✅ Mở: `http://localhost:3000/check-server.html`
3. ✅ Nhấn: "Kiểm Tra Ngay"
4. ✅ Nhấn: "Test API"
5. ✅ Nếu OK → Test đăng ký tại `test-register.html`
6. ✅ Nếu lỗi → Xem message cụ thể và sửa theo hướng dẫn
