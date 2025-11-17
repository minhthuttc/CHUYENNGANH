# HƯỚNG DẪN SỬ DỤNG CHỨC NĂNG ADMIN - DESIGNHUB

## 📋 MỤC LỤC
1. [Giới thiệu](#giới-thiệu)
2. [Đăng nhập Admin](#đăng-nhập-admin)
3. [Dashboard - Bảng điều khiển](#dashboard)
4. [Quản lý người dùng](#quản-lý-người-dùng)
5. [Quản lý dự án](#quản-lý-dự-án)
6. [Quản lý thanh toán](#quản-lý-thanh-toán)
7. [Báo cáo và thống kê](#báo-cáo-và-thống-kê)
8. [API Endpoints](#api-endpoints)

---

## 🎯 GIỚI THIỆU

Trang Admin là nơi quản trị viên có thể:
- Giám sát toàn bộ hoạt động của hệ thống
- Quản lý người dùng (nhà thiết kế và khách hàng)
- Kiểm duyệt và theo dõi dự án
- Quản lý giao dịch thanh toán
- Xem báo cáo và thống kê chi tiết

**Truy cập:** http://localhost:3000/admin.html

---

## 🔐 ĐĂNG NHẬP ADMIN

### Cách 1: Tạo tài khoản Admin thủ công

1. Đăng ký tài khoản bình thường tại trang đăng ký
2. Vào MongoDB Atlas hoặc sử dụng MongoDB Compass
3. Tìm user vừa tạo trong collection `users`
4. Sửa field `userType` từ `"designer"` hoặc `"client"` thành `"admin"`

```javascript
// Ví dụ trong MongoDB
db.users.updateOne(
  { email: "admin@designhub.com" },
  { $set: { userType: "admin" } }
)
```

### Cách 2: Chạy script tạo dữ liệu mẫu

```bash
node seed-data.js
```

**Thông tin đăng nhập mặc định:**
- Email: `admin@designhub.com`
- Password: `admin123`

---

## 📊 DASHBOARD - BẢNG ĐIỀU KHIỂN

### Thống kê tổng quan (4 card đầu tiên)

1. **Tổng Người Dùng**
   - Hiển thị tổng số người dùng trong hệ thống
   - Bao gồm: Admin, Nhà thiết kế, Khách hàng

2. **Nhà Thiết Kế**
   - Số lượng nhà thiết kế đang hoạt động
   - Chỉ đếm user có `userType: "designer"`

3. **Dự Án Đang Hoạt Động**
   - Số dự án có trạng thái `"in_progress"`
   - Không bao gồm dự án đã hoàn thành hoặc bị hủy

4. **Tổng Doanh Thu**
   - Tổng số tiền từ tất cả giao dịch đã hoàn thành
   - Chỉ tính giao dịch có `status: "completed"`

### Thống kê chi tiết (4 card tiếp theo)

1. **Doanh Thu Tháng Này**
   - Doanh thu từ đầu tháng đến hiện tại
   - Tự động reset vào ngày 1 hàng tháng

2. **Người Dùng Mới**
   - Số người đăng ký trong 30 ngày qua
   - Dựa trên field `createdAt`

3. **Dự Án Hoàn Thành**
   - Tổng số dự án có `status: "completed"`
   - Tính từ khi hệ thống bắt đầu

4. **Đánh Giá Trung Bình**
   - Trung bình rating của tất cả nhà thiết kế
   - Chỉ tính những người có `reviewCount > 0`

**Tự động cập nhật:** Dashboard tự động refresh mỗi 30 giây

---

## 👥 QUẢN LÝ NGƯỜI DÙNG

### Xem danh sách người dùng

Bảng hiển thị thông tin:
- **ID**: 6 ký tự cuối của MongoDB ObjectId
- **Tên**: Họ và tên đầy đủ
- **Email**: Địa chỉ email
- **Loại**: Nhà thiết kế / Khách hàng / Admin
- **Trạng thái**: Hoạt động / Tạm khóa
- **Ngày đăng ký**: Ngày tạo tài khoản

### Các thao tác

#### 1. Xem chi tiết người dùng
```
Nhấn nút "Xem" → Chuyển đến trang profile của user
```

#### 2. Khóa/Mở khóa tài khoản
```javascript
// Khi nhấn nút "Khóa" hoặc "Mở khóa"
PUT /api/admin/users/:id/toggle-status

// Response
{
  "message": "Đã khóa người dùng!",
  "user": {
    "id": "673abc123...",
    "status": "blocked"
  }
}
```

**Lưu ý:**
- User bị khóa không thể đăng nhập
- Không thể xóa dữ liệu của user đã khóa
- Có thể mở khóa bất cứ lúc nào

#### 3. Xóa người dùng
```javascript
// Khi nhấn nút "Xóa"
DELETE /api/admin/users/:id

// Response
{
  "message": "Đã xóa người dùng thành công!"
}
```

**Cảnh báo:**
- Hành động này KHÔNG THỂ HOÀN TÁC
- Sẽ hiện popup xác nhận trước khi xóa
- Nên khóa tài khoản thay vì xóa

---

## 📁 QUẢN LÝ DỰ ÁN

### Xem danh sách dự án

Bảng hiển thị:
- **ID**: 6 ký tự cuối của project ID
- **Tên dự án**: Tiêu đề dự án
- **Khách hàng**: Người đăng dự án
- **Nhà thiết kế**: Người thực hiện (hoặc "-" nếu chưa có)
- **Trạng thái**: 
  - 🟢 Đang tuyển (recruiting)
  - 🟡 Đang thực hiện (in_progress)
  - 🔵 Hoàn thành (completed)
  - ⚫ Đã hủy (cancelled)
- **Ngân sách**: Số tiền dự án

### Các thao tác

#### 1. Xem chi tiết dự án
```
Nhấn nút "Xem" → Chuyển đến trang chi tiết dự án
```

#### 2. Cập nhật trạng thái dự án
```javascript
// API để cập nhật trạng thái
PUT /api/admin/projects/:id/status

// Body
{
  "status": "completed" // hoặc "cancelled", "in_progress"
}
```

#### 3. Xóa dự án
```javascript
DELETE /api/admin/projects/:id
```

**Khi nào nên xóa dự án:**
- Dự án vi phạm quy định
- Dự án spam
- Yêu cầu từ khách hàng

---

## 💳 QUẢN LÝ THANH TOÁN

### Xem danh sách giao dịch

Bảng hiển thị:
- **ID Giao dịch**: Mã giao dịch duy nhất (TXN...)
- **Dự án**: Tên dự án liên quan
- **Từ**: Người chuyển tiền (khách hàng)
- **Đến**: Người nhận tiền (nhà thiết kế)
- **Số tiền**: Số tiền giao dịch
- **Trạng thái**:
  - 🟡 Chờ xử lý (pending)
  - 🔵 Đang xử lý (processing)
  - 🟢 Hoàn thành (completed)
  - ⚫ Thất bại (failed)
  - 🟠 Hoàn tiền (refunded)
- **Ngày**: Ngày tạo giao dịch

### Cập nhật trạng thái giao dịch

```javascript
PUT /api/admin/transactions/:id/status

// Body
{
  "status": "completed" // hoặc "failed", "refunded"
}
```

**Quy trình xử lý giao dịch:**

1. **Pending** → Giao dịch mới tạo, chờ xác nhận
2. **Processing** → Đang xử lý thanh toán
3. **Completed** → Thanh toán thành công
4. **Failed** → Thanh toán thất bại
5. **Refunded** → Đã hoàn tiền

---

## 📈 BÁO CÁO VÀ THỐNG KÊ

### Top 5 Nhà Thiết Kế Xuất Sắc

Bảng xếp hạng dựa trên:
1. Số dự án hoàn thành (ưu tiên cao nhất)
2. Đánh giá trung bình
3. Tổng doanh thu

**Hiển thị:**
- 🥇 🥈 🥉 cho top 3
- Tên nhà thiết kế
- Số dự án hoàn thành
- Đánh giá (rating)
- Tổng doanh thu

### Các API thống kê khác

#### 1. Thống kê tổng quan
```javascript
GET /api/admin/statistics

// Response
{
  "totalUsers": 1234,
  "totalDesigners": 567,
  "totalClients": 667,
  "totalProjects": 345,
  "activeProjects": 120,
  "completedProjects": 200,
  "totalRevenue": 2500000000,
  "monthlyRevenue": 250000000,
  "newUsersThisMonth": 45,
  "avgRating": 4.7
}
```

#### 2. Top nhà thiết kế
```javascript
GET /api/admin/top-designers

// Response: Array of top 10 designers
[
  {
    "_id": "...",
    "fullName": "Nguyễn Văn A",
    "completedProjects": 120,
    "rating": 4.9,
    "reviewCount": 45
  },
  ...
]
```

#### 3. Doanh thu theo tháng
```javascript
GET /api/admin/revenue-by-month

// Response: 12 tháng gần nhất
[
  {
    "_id": { "year": 2025, "month": 11 },
    "total": 250000000,
    "count": 15
  },
  ...
]
```

---

## 🔌 API ENDPOINTS

### Quản lý người dùng

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/users` | Lấy danh sách tất cả người dùng |
| PUT | `/api/admin/users/:id/toggle-status` | Khóa/Mở khóa người dùng |
| DELETE | `/api/admin/users/:id` | Xóa người dùng |

### Quản lý dự án

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/projects` | Lấy danh sách tất cả dự án |
| PUT | `/api/admin/projects/:id/status` | Cập nhật trạng thái dự án |
| DELETE | `/api/admin/projects/:id` | Xóa dự án |

### Quản lý thanh toán

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/transactions` | Lấy danh sách giao dịch |
| PUT | `/api/admin/transactions/:id/status` | Cập nhật trạng thái giao dịch |

### Báo cáo và thống kê

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/statistics` | Thống kê tổng quan |
| GET | `/api/admin/top-designers` | Top 10 nhà thiết kế |
| GET | `/api/admin/revenue-by-month` | Doanh thu theo tháng |

---

## 🛠️ HƯỚNG DẪN TRIỂN KHAI

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình MongoDB
Tạo file `.env`:
```
MONGODB_URI=mongodb+srv://thu:12345@chuyennganh.piilkao.mongodb.net/designhub?retryWrites=true&w=majority&appName=CHUYENNGANH
PORT=3000
JWT_SECRET=designhub_secret_key_2025
```

### 3. Khởi động server
```bash
node server.js
```

### 4. Tạo dữ liệu mẫu (tùy chọn)
```bash
node seed-data.js
```

### 5. Truy cập trang admin
```
http://localhost:3000/admin.html
```

---

## 🔒 BẢO MẬT

### Hiện tại
- Chưa có authentication middleware
- Bất kỳ ai cũng có thể truy cập `/admin.html`

### Nên thêm (Production)

1. **JWT Authentication**
```javascript
// Middleware kiểm tra admin
const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.userType !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

2. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100 // giới hạn 100 requests
});

app.use('/api/admin', adminLimiter);
```

3. **Logging**
```javascript
// Log mọi hành động admin
const logAdminAction = (action, userId, details) => {
  console.log({
    timestamp: new Date(),
    action,
    userId,
    details
  });
};
```

---

## 📝 LƯU Ý QUAN TRỌNG

1. **Backup dữ liệu thường xuyên**
   - Trước khi xóa user hoặc project
   - Định kỳ hàng ngày/tuần

2. **Kiểm tra kỹ trước khi xóa**
   - Xóa user sẽ ảnh hưởng đến dự án liên quan
   - Không thể khôi phục sau khi xóa

3. **Giám sát giao dịch**
   - Kiểm tra giao dịch bất thường
   - Xử lý khiếu nại kịp thời

4. **Bảo mật tài khoản admin**
   - Sử dụng mật khẩu mạnh
   - Không chia sẻ thông tin đăng nhập
   - Đổi mật khẩu định kỳ

---

## 🆘 TROUBLESHOOTING

### Không kết nối được MongoDB
```
Lỗi: MongooseServerSelectionError
Giải pháp: 
1. Kiểm tra IP whitelist trên MongoDB Atlas
2. Thêm IP hiện tại vào whitelist
3. Hoặc cho phép truy cập từ mọi IP (0.0.0.0/0)
```

### Dữ liệu không hiển thị
```
Giải pháp:
1. Mở Console (F12) để xem lỗi
2. Kiểm tra server đang chạy
3. Kiểm tra API endpoint đúng
4. Xem log server để debug
```

### Không thể xóa user
```
Giải pháp:
1. Kiểm tra user có dự án đang hoạt động không
2. Xóa hoặc chuyển dự án trước
3. Sau đó mới xóa user
```

---

## 📞 HỖ TRỢ

Nếu cần hỗ trợ, liên hệ:
- Email: NguyenVoMinhThu_110122174
- GitHub Issues: [Link repository]

---

**Phiên bản:** 1.0.0  
**Cập nhật:** 16/11/2025  
**Tác giả:** NguyenVoMinhThu_110122174
