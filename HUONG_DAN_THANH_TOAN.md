# 💳 Hướng Dẫn Sử Dụng Tính Năng Thanh Toán

## Tổng Quan
Hệ thống thanh toán DesignHub cho phép khách hàng thanh toán cho các dự án thiết kế đã hoàn thành một cách an toàn và tiện lợi.

## Các Tính Năng Chính

### 1. Thanh Toán Dự Án (`payment.html`)
- **Truy cập**: Từ trang chi tiết dự án, nhấn nút "Thanh Toán"
- **URL**: `payment.html?projectId=<ID_DỰ_ÁN>`

#### Quy Trình Thanh Toán:
1. Hệ thống tự động tải thông tin dự án
2. Tính toán tự động:
   - Giá dự án (từ budget)
   - Phí dịch vụ (5% của giá dự án)
   - Tổng cộng = Giá dự án + Phí dịch vụ
3. Chọn phương thức thanh toán:
   - 🏦 Chuyển khoản ngân hàng
   - 📱 Ví MoMo
   - 💰 ZaloPay
   - 💳 Thẻ tín dụng/ghi nợ
4. Thêm ghi chú (tùy chọn)
5. Xác nhận và thanh toán

#### Sau Khi Thanh Toán Thành Công:
- Hiển thị thông tin giao dịch
- Cập nhật trạng thái dự án thành "Hoàn thành"
- Tạo bản ghi giao dịch trong database
- Chuyển hướng đến trang đánh giá hoặc dashboard

### 2. Lịch Sử Thanh Toán (`payment-history.html`)
- **Truy cập**: Từ menu điều hướng → "Thanh Toán"
- **URL**: `payment-history.html`

#### Tính Năng:
- Xem tất cả giao dịch (gửi và nhận)
- Thống kê:
  - Tổng tiền đã gửi
  - Tổng tiền đã nhận
  - Tổng số giao dịch
- Lọc giao dịch:
  - Theo loại (Tất cả / Đã gửi / Đã nhận)
  - Theo phương thức thanh toán
- Hiển thị chi tiết:
  - Mã giao dịch
  - Dự án liên quan
  - Người gửi/nhận
  - Số tiền
  - Phương thức
  - Thời gian
  - Trạng thái

## API Endpoints

### 1. Tạo Thanh Toán
```
POST /api/payments/create
```

**Request Body:**
```json
{
  "projectId": "string",
  "paymentMethod": "bank_transfer|momo|zalopay|credit_card",
  "note": "string (optional)",
  "amount": number
}
```

**Response:**
```json
{
  "message": "Thanh toán thành công!",
  "transactionId": "TXN123456789",
  "projectId": "string",
  "paymentMethod": "string",
  "amount": number,
  "project": {
    "title": "string",
    "designer": "string"
  }
}
```

### 2. Lấy Lịch Sử Thanh Toán
```
GET /api/payments/history?userId=<USER_ID>
```

**Response:**
```json
[
  {
    "_id": "string",
    "transactionId": "string",
    "project": {
      "title": "string",
      "budget": number
    },
    "from": {
      "fullName": "string",
      "email": "string"
    },
    "to": {
      "fullName": "string",
      "email": "string"
    },
    "amount": number,
    "paymentMethod": "string",
    "description": "string",
    "status": "completed|pending|failed",
    "createdAt": "date",
    "type": "sent|received"
  }
]
```

### 3. Lấy Chi Tiết Giao Dịch
```
GET /api/payments/:id
```

### 4. Thống Kê Thanh Toán
```
GET /api/payments/stats/:userId
```

**Response:**
```json
{
  "totalSent": number,
  "totalReceived": number,
  "totalTransactions": number,
  "sentCount": number,
  "receivedCount": number
}
```

## Validation và Bảo Mật

### Backend Validation:
- ✅ Kiểm tra thông tin đầy đủ
- ✅ Validate phương thức thanh toán
- ✅ Kiểm tra dự án tồn tại
- ✅ Kiểm tra trạng thái dự án
- ✅ Xác thực số tiền thanh toán
- ✅ Ngăn thanh toán trùng lặp

### Frontend Validation:
- ✅ Kiểm tra đăng nhập
- ✅ Xác nhận trước khi thanh toán
- ✅ Hiển thị loading state
- ✅ Xử lý lỗi và thông báo

### Bảo Mật:
- 🔒 Yêu cầu authentication token
- 🔒 Validate user permissions
- 🔒 Mã hóa thông tin nhạy cảm
- 🔒 Logging tất cả giao dịch

## Database Schema

### Transaction Model:
```javascript
{
  transactionId: String (unique, auto-generated),
  project: ObjectId (ref: Project),
  from: ObjectId (ref: User),
  to: ObjectId (ref: User),
  amount: Number,
  paymentMethod: String,
  description: String,
  status: String (completed, pending, failed, cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

### Test Thanh Toán:
1. Đăng nhập với tài khoản khách hàng
2. Tạo hoặc chọn một dự án có trạng thái "review" hoặc "in_progress"
3. Truy cập trang thanh toán với projectId
4. Chọn phương thức thanh toán
5. Nhấn "Thanh Toán Ngay"
6. Kiểm tra:
   - Thông báo thành công
   - Trạng thái dự án cập nhật
   - Giao dịch được tạo trong database
   - Hiển thị trang thành công

### Test Lịch Sử:
1. Truy cập `payment-history.html`
2. Kiểm tra hiển thị danh sách giao dịch
3. Test các bộ lọc
4. Kiểm tra thống kê

## Troubleshooting

### Lỗi "Không tìm thấy dự án"
- Kiểm tra projectId trong URL
- Đảm bảo dự án tồn tại trong database

### Lỗi "Số tiền không chính xác"
- Kiểm tra tính toán phí dịch vụ (5%)
- Đảm bảo amount = budget * 1.05

### Lỗi "Dự án đã được thanh toán"
- Dự án có status = "completed"
- Không thể thanh toán lại

### Không tải được lịch sử
- Kiểm tra userId trong localStorage
- Kiểm tra token authentication
- Xem console log để debug

## Tính Năng Tương Lai

- [ ] Tích hợp cổng thanh toán thực (VNPay, MoMo API)
- [ ] Hỗ trợ thanh toán từng phần
- [ ] Xuất hóa đơn PDF
- [ ] Email thông báo thanh toán
- [ ] Hoàn tiền tự động
- [ ] Lịch sử chi tiết hơn với biểu đồ
- [ ] Xuất báo cáo Excel

## Liên Hệ Hỗ Trợ

Nếu gặp vấn đề với thanh toán, vui lòng liên hệ:
- Email: NguyenVoMinhThu_110122174
- Hoặc tạo issue trên GitHub

---

**Lưu ý**: Đây là phiên bản demo. Trong production, cần tích hợp với cổng thanh toán thực và thêm các biện pháp bảo mật bổ sung.
