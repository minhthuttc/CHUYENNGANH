# 🔍 HƯỚNG DẪN TÌM KIẾM & LỌC DỰ ÁN

## ✨ TÍNH NĂNG MỚI

Đã thêm tính năng tìm kiếm và lọc dự án mạnh mẽ vào trang `projects.html`

## 🎯 CÁC TÍNH NĂNG

### 1. **Tìm Kiếm Văn Bản**
- Tìm kiếm theo tên dự án
- Tìm kiếm theo mô tả dự án
- Tự động cập nhật kết quả khi gõ (debounce 300ms)

### 2. **Lọc Theo Danh Mục**
- Logo Design
- UI/UX Design
- Print Design
- Branding
- Packaging Design
- Digital Marketing
- Illustration
- Web Design

### 3. **Lọc Theo Trạng Thái**
- Đang tuyển (open)
- Đang thực hiện (in_progress)
- Hoàn thành (completed)
- Đã hủy (cancelled)

### 4. **Lọc Theo Ngân Sách**
- Dưới 5 triệu
- 5 - 10 triệu
- 10 - 20 triệu
- Trên 20 triệu

### 5. **Sắp Xếp**
- Mới nhất
- Cũ nhất
- Ngân sách cao nhất
- Ngân sách thấp nhất
- Hạn chót gần nhất

### 6. **Tính Năng Khác**
- Đếm số lượng dự án
- Xóa bộ lọc nhanh
- Hiển thị trạng thái loading
- Hiển thị empty state khi không có kết quả
- Responsive design

## 🚀 CÁCH SỬ DỤNG

### Bước 1: Khởi động server
```bash
node server.js
```

### Bước 2: Mở trang dự án
```
http://localhost:3000/projects.html
```

### Bước 3: Sử dụng bộ lọc

#### Tìm kiếm:
1. Nhập từ khóa vào ô "Tìm kiếm"
2. Kết quả tự động cập nhật

#### Lọc:
1. Chọn danh mục từ dropdown
2. Chọn trạng thái
3. Chọn khoảng ngân sách
4. Chọn cách sắp xếp

#### Xóa bộ lọc:
- Nhấn nút "🔄 Xóa bộ lọc"

## 🧪 TEST TÍNH NĂNG

### Test thủ công:
```
http://localhost:3000/test-search-filter.html
```

### Test cases:
1. ✅ Load tất cả dự án
2. ✅ Tìm kiếm theo tên
3. ✅ Lọc theo danh mục
4. ✅ Lọc theo trạng thái
5. ✅ Lọc theo ngân sách
6. ✅ Sắp xếp
7. ✅ Kết hợp nhiều bộ lọc

## 📡 API ENDPOINTS

### GET /api/projects
Lấy danh sách dự án với tìm kiếm và lọc

**Query Parameters:**
- `search` - Tìm kiếm theo tên/mô tả
- `category` - Lọc theo danh mục
- `status` - Lọc theo trạng thái
- `minBudget` - Ngân sách tối thiểu
- `maxBudget` - Ngân sách tối đa
- `sort` - Sắp xếp (newest, oldest, budget-high, budget-low, deadline)

**Ví dụ:**
```
GET /api/projects?search=Logo&status=open&minBudget=5000000&sort=budget-high
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "projects": [...]
}
```

## 📁 FILES LIÊN QUAN

### Frontend:
- `projects.html` - Giao diện trang dự án
- `js/projects.js` - Logic tìm kiếm và lọc
- `css/style.css` - Styles

### Backend:
- `routes/projects.js` - API endpoints
- `models/Project.js` - Model dự án

### Test:
- `test-search-filter.html` - Test tính năng

## 🎨 UI/UX FEATURES

### Loading States:
- Spinner khi đang tải
- Skeleton screens (có thể thêm)

### Empty States:
- Icon và message khi không có kết quả
- Gợi ý thay đổi bộ lọc

### Animations:
- Fade in khi hiển thị dự án
- Hover effects
- Smooth transitions

### Responsive:
- Mobile friendly
- Grid layout tự động điều chỉnh
- Touch-friendly buttons

## 🔧 CUSTOMIZATION

### Thêm danh mục mới:
Sửa file `projects.html`:
```html
<option value="New Category">Danh mục mới</option>
```

### Thêm khoảng ngân sách:
Sửa file `js/projects.js`:
```javascript
case 'custom':
    matchBudget = projectBudget >= X && projectBudget < Y;
    break;
```

### Thêm cách sắp xếp:
```javascript
case 'custom-sort':
    sorted.sort((a, b) => /* logic */);
    break;
```

## 💡 TIPS

1. **Performance:**
   - Sử dụng debounce cho tìm kiếm
   - Cache kết quả nếu cần
   - Pagination cho nhiều dự án

2. **UX:**
   - Hiển thị số lượng kết quả
   - Highlight từ khóa tìm kiếm
   - Lưu bộ lọc vào URL

3. **Accessibility:**
   - Label cho tất cả inputs
   - Keyboard navigation
   - Screen reader friendly

## 🐛 TROUBLESHOOTING

### Không load được dự án:
1. Kiểm tra server đang chạy
2. Kiểm tra MongoDB đã kết nối
3. Xem console log

### Tìm kiếm không hoạt động:
1. Kiểm tra API endpoint
2. Xem network tab
3. Kiểm tra query parameters

### Lọc không chính xác:
1. Kiểm tra logic trong `filterProjects()`
2. Xem data structure
3. Test từng bộ lọc riêng

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Xem console log
2. Test API với test-search-filter.html
3. Kiểm tra network requests
4. Xem MongoDB data

---

**Tác giả:** NguyenVoMinhThu_110122174
**Ngày tạo:** 18/11/2025
**Version:** 1.0