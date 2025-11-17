# 🚀 Hướng Dẫn Test Tính Năng Thanh Toán

## Cách 1: Test Nhanh với Demo Page

### Bước 1: Khởi động server
```bash
node server.js
```

### Bước 2: Mở trang demo
Truy cập: `http://localhost:3000/demo-payment.html`

### Bước 3: Đăng nhập
- Nếu chưa đăng nhập, hệ thống sẽ yêu cầu đăng nhập
- Sử dụng tài khoản có sẵn hoặc đăng ký mới

### Bước 4: Tạo dự án demo
- Nhấn nút "Tạo Dự Án Demo"
- Hệ thống sẽ tự động tạo dự án với trạng thái sẵn sàng thanh toán

### Bước 5: Test thanh toán
- Nhấn "Thanh Toán Ngay"
- Chọn phương thức thanh toán
- Xác nhận và hoàn tất

---

## Cách 2: Test Thủ Công

### 1. Đăng nhập
```
URL: http://localhost:3000/login.html
```

### 2. Tạo dự án mới (nếu chưa có)
```
URL: http://localhost:3000/projects.html
Nhấn "Tạo Dự Án Mới"
```

### 3. Truy cập trang thanh toán
```
URL: http://localhost:3000/payment.html?projectId=<ID_DỰ_ÁN>
```

Hoặc từ trang chi tiết dự án:
```
URL: http://localhost:3000/project-detail.html?id=<ID_DỰ_ÁN>
Nhấn nút "💳 Thanh Toán Dự Án"
```

### 4. Xem lịch sử thanh toán
```
URL: http://localhost:3000/payment-history.html
```

---

## Cách 3: Test API Trực Tiếp

### Mở trang test
```
URL: http://localhost:3000/test-payment.html
```

Trang này cho phép bạn:
- Test tạo thanh toán
- Test lấy lịch sử
- Test thống kê
- Test validation
- Mở các trang UI

---

## Các Trang Liên Quan

| Trang | URL | Mô tả |
|-------|-----|-------|
| Demo Payment | `/demo-payment.html` | Trang demo và hướng dẫn |
| Payment | `/payment.html?projectId=<ID>` | Trang thanh toán |
| Payment History | `/payment-history.html` | Lịch sử giao dịch |
| Test API | `/test-payment.html` | Test các API endpoint |
| Project Detail | `/project-detail.html?id=<ID>` | Chi tiết dự án (có nút thanh toán) |

---

## Kiểm Tra Nhanh

### 1. Kiểm tra server đang chạy
```bash
curl http://localhost:3000/api/test
```

Kết quả mong đợi:
```json
{
  "message": "API đang hoạt động!",
  "status": "success"
}
```

### 2. Kiểm tra có dự án nào không
Mở console trình duyệt và chạy:
```javascript
fetch('http://localhost:3000/api/projects', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
.then(r => r.json())
.then(d => console.log('Projects:', d));
```

### 3. Kiểm tra lịch sử thanh toán
```javascript
const user = JSON.parse(localStorage.getItem('user'));
fetch(`http://localhost:3000/api/payments/history?userId=${user._id}`, {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
.then(r => r.json())
.then(d => console.log('Transactions:', d));
```

---

## Troubleshooting

### Lỗi: "Không tìm thấy dự án"
**Nguyên nhân**: Chưa có dự án nào trong database

**Giải pháp**:
1. Mở `demo-payment.html`
2. Nhấn "Tạo Dự Án Demo"
3. Hoặc tạo dự án thủ công từ trang projects

### Lỗi: "Vui lòng đăng nhập"
**Nguyên nhân**: Chưa đăng nhập hoặc token hết hạn

**Giải pháp**:
1. Truy cập `login.html`
2. Đăng nhập lại
3. Thử lại

### Lỗi: "Số tiền không chính xác"
**Nguyên nhân**: Số tiền thanh toán không khớp với budget + 5%

**Giải pháp**:
- Hệ thống tự động tính toán, không cần sửa
- Nếu vẫn lỗi, kiểm tra budget của dự án

### Không thấy nút "Thanh Toán"
**Nguyên nhân**: 
- Bạn không phải là khách hàng của dự án
- Dự án chưa ở trạng thái "review" hoặc "completed"

**Giải pháp**:
1. Đảm bảo bạn là người tạo dự án (client)
2. Cập nhật trạng thái dự án thành "review" hoặc "completed"

### Server không chạy
**Kiểm tra**:
```bash
# Kiểm tra port 3000 có đang được sử dụng không
netstat -ano | findstr :3000

# Nếu bị chiếm, kill process hoặc dùng port khác
```

---

## Demo Flow Hoàn Chỉnh

### Scenario: Khách hàng thanh toán cho dự án

1. **Đăng nhập** → `login.html`
2. **Xem dự án** → `dashboard.html` hoặc `projects.html`
3. **Chi tiết dự án** → `project-detail.html?id=<ID>`
4. **Nhấn "Thanh Toán"** → Chuyển đến `payment.html?projectId=<ID>`
5. **Chọn phương thức** → Bank Transfer / MoMo / ZaloPay / Credit Card
6. **Xác nhận thanh toán** → Popup xác nhận
7. **Thành công** → Hiển thị thông tin giao dịch
8. **Đánh giá** → Chuyển đến `review.html?projectId=<ID>`
9. **Xem lịch sử** → `payment-history.html`

---

## Video Demo (Nếu cần)

### Các bước quay video demo:
1. Khởi động server
2. Đăng nhập
3. Tạo dự án demo
4. Thực hiện thanh toán
5. Xem lịch sử
6. Test các bộ lọc

---

## Liên Hệ

Nếu gặp vấn đề, liên hệ:
- Email: NguyenVoMinhThu_110122174
- Hoặc xem file `HUONG_DAN_THANH_TOAN.md` để biết thêm chi tiết

---

**Lưu ý**: Đây là phiên bản demo. Trong production cần:
- Tích hợp cổng thanh toán thực
- Thêm xác thực 2 lớp
- Logging chi tiết hơn
- Email thông báo
- Webhook callbacks
