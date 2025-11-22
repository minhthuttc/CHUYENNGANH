# Hướng Dẫn Tạo Bài Đăng Mẫu

## Các bước thực hiện:

### 1. Đảm bảo server đang chạy
```bash
node server.js
```

### 2. Chạy script tạo bài đăng mẫu
```bash
node seed-posts.js
```

Script sẽ tạo 10 bài đăng với 3 danh mục:
- **Logo Design**: 3 bài
- **UI/UX Design**: 4 bài  
- **Thiết kế Poster**: 3 bài

### 3. Xem kết quả
Mở trình duyệt và truy cập:
- Trang bài đăng: `http://localhost:3000/portfolio.html`
- API endpoint: `http://localhost:3000/api/posts`

### 4. Lọc theo danh mục
Sử dụng dropdown "Lọc" để xem bài đăng theo từng danh mục:
- Tất cả
- Logo Design
- UI/UX Design
- Thiết kế Poster

### 5. Sắp xếp
Sử dụng dropdown "Sắp xếp" để xem theo:
- Mới nhất
- Phổ biến (lượt xem)
- Nhiều like

## Lưu ý:
- Cần chạy `node seed-data.js` trước để tạo designers
- Mỗi lần chạy `node seed-posts.js` sẽ xóa bài đăng cũ và tạo mới
- Bài đăng sẽ được gán ngẫu nhiên cho các designers đã tạo

## API Endpoints:

### Lấy danh sách bài đăng
```
GET /api/posts?category=logo&sort=newest
```

### Lấy chi tiết bài đăng
```
GET /api/posts/:id
```

### Tạo bài đăng mới (cần đăng nhập)
```
POST /api/posts
Body: {
  "title": "Tiêu đề",
  "description": "Mô tả",
  "category": "logo",
  "tags": ["tag1", "tag2"]
}
```

### Like/Unlike bài đăng (cần đăng nhập)
```
POST /api/posts/:id/like
```
