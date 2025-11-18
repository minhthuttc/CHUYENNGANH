# 🎯 HƯỚNG DẪN TÌM KIẾM THU GỌN

## ✨ TÍNH NĂNG MỚI

Đã cập nhật trang `projects.html` với tính năng tìm kiếm thu gọn để giao diện gọn gàng hơn.

## 🎨 CÁC TÍNH NĂNG

### 1. **Nút Toggle**
- Nút "Tìm Kiếm & Lọc Dự Án" để mở/đóng bộ lọc
- Icon thay đổi: 🔽 (đóng) ↔️ 🔼 (mở)
- Badge hiển thị số lượng bộ lọc đang active

### 2. **Hiển Thị Bộ Lọc Active**
- Hiển thị các bộ lọc đang áp dụng
- Xóa từng bộ lọc riêng lẻ bằng nút ✕
- Tự động ẩn khi không có bộ lọc

### 3. **Bộ Lọc Chi Tiết**
- Tìm kiếm nhanh
- Lọc theo danh mục
- Lọc theo trạng thái
- Lọc theo ngân sách
- Sắp xếp

### 4. **Nút Hành Động**
- "🔄 Xóa bộ lọc" - Xóa tất cả
- "✅ Áp dụng" - Áp dụng và tự động đóng

## 🚀 CÁCH SỬ DỤNG

### Bước 1: Mở trang dự án
```
http://localhost:3000/projects.html
```

### Bước 2: Sử dụng tìm kiếm

#### Mở bộ lọc:
1. Nhấn nút "Tìm Kiếm & Lọc Dự Án"
2. Bộ lọc sẽ hiển thị với animation

#### Áp dụng bộ lọc:
1. Nhập từ khóa tìm kiếm
2. Chọn các tiêu chí lọc
3. Nhấn "✅ Áp dụng"
4. Bộ lọc tự động đóng

#### Xem bộ lọc đang active:
- Các bộ lọc hiển thị ở trên danh sách
- Badge trên nút toggle hiển thị số lượng

#### Xóa bộ lọc:
- Nhấn ✕ trên từng badge để xóa riêng
- Nhấn "🔄 Xóa bộ lọc" để xóa tất cả

## 🎨 GIAO DIỆN

### Trước khi mở:
```
┌─────────────────────────────────────┐
│ 🔽 Tìm Kiếm & Lọc Dự Án [3]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🔍 Đang lọc:                        │
│ [Tìm: "Logo" ✕]                    │
│ [Danh mục: UI/UX ✕]                │
│ [Trạng thái: Đang tuyển ✕]         │
└─────────────────────────────────────┘

[Danh sách dự án...]
```

### Sau khi mở:
```
┌─────────────────────────────────────┐
│ 🔼 Tìm Kiếm & Lọc Dự Án [3]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🔍 Tìm kiếm nhanh                   │
│ [________________]                  │
│                                     │
│ ⚙️ Bộ lọc chi tiết                  │
│ [Danh mục] [Trạng thái]            │
│ [Ngân sách] [Sắp xếp]              │
│                                     │
│ [🔄 Xóa bộ lọc] [✅ Áp dụng]       │
└─────────────────────────────────────┘
```

## 💻 CODE STRUCTURE

### HTML:
```html
<!-- Toggle button -->
<button id="toggleSearch">
    <span id="toggleIcon">🔽</span>
    Tìm Kiếm & Lọc Dự Án
    <span id="activeFilterCount"></span>
</button>

<!-- Active filters display -->
<div id="activeFilters"></div>

<!-- Collapsible search section -->
<div id="searchSection" style="display: none;">
    <!-- Filters here -->
</div>
```

### JavaScript:
```javascript
// Toggle functionality
toggleSearchBtn.addEventListener('click', function() {
    isSearchVisible = !isSearchVisible;
    searchSection.style.display = isSearchVisible ? 'block' : 'none';
    toggleIcon.textContent = isSearchVisible ? '🔼' : '🔽';
});

// Update active filters
function updateActiveFilters() {
    // Show active filters with remove buttons
}

// Remove individual filter
window.removeFilter = function(type) {
    // Clear specific filter
};
```

### CSS:
```css
#searchSection {
    transition: all 0.3s ease;
}

.filter-badge {
    background: var(--light-brown);
    border-radius: 15px;
}

.active-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}
```

## 🎯 LỢI ÍCH

### 1. **Giao Diện Gọn Gàng**
- Bộ lọc ẩn khi không sử dụng
- Tập trung vào danh sách dự án
- Giảm scroll

### 2. **Trải Nghiệm Tốt Hơn**
- Dễ dàng xem bộ lọc đang áp dụng
- Xóa nhanh bộ lọc không cần
- Animation mượt mà

### 3. **Mobile Friendly**
- Responsive design
- Touch-friendly buttons
- Compact layout

### 4. **Hiệu Quả**
- Tự động đóng sau khi áp dụng
- Badge hiển thị số lượng bộ lọc
- Quick access

## 🧪 TEST

### Demo page:
```
http://localhost:3000/demo-search-collapse.html
```

### Test cases:
1. ✅ Mở/đóng bộ lọc
2. ✅ Áp dụng bộ lọc
3. ✅ Hiển thị active filters
4. ✅ Xóa từng filter
5. ✅ Xóa tất cả filters
6. ✅ Badge counter
7. ✅ Auto close sau apply
8. ✅ Responsive design

## 📱 RESPONSIVE

### Desktop:
- Full width toggle button
- Grid layout cho filters
- Hover effects

### Tablet:
- 2 columns grid
- Touch-friendly buttons
- Optimized spacing

### Mobile:
- Single column
- Full width inputs
- Larger touch targets

## 🎨 CUSTOMIZATION

### Thay đổi icon:
```javascript
toggleIcon.textContent = isSearchVisible ? '▲' : '▼';
```

### Thay đổi màu badge:
```css
#activeFilterCount {
    background: #your-color;
}
```

### Thay đổi animation:
```css
#searchSection {
    transition: all 0.5s ease-in-out;
}
```

## 💡 TIPS

1. **Auto-save filters:**
   - Lưu vào localStorage
   - Restore khi load lại trang

2. **URL parameters:**
   - Sync filters với URL
   - Share-able links

3. **Keyboard shortcuts:**
   - Ctrl+F để mở search
   - Esc để đóng

4. **Advanced features:**
   - Saved searches
   - Filter presets
   - Recent searches

## 🐛 TROUBLESHOOTING

### Toggle không hoạt động:
- Kiểm tra JavaScript loaded
- Xem console errors
- Verify element IDs

### Active filters không hiển thị:
- Kiểm tra updateActiveFilters()
- Xem CSS display property
- Verify filter values

### Animation không mượt:
- Kiểm tra CSS transitions
- Browser compatibility
- Performance issues

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Xem demo page
2. Check console log
3. Inspect elements
4. Test từng tính năng

---

**Tác giả:** NguyenVoMinhThu_110122174
**Ngày cập nhật:** 18/11/2025
**Version:** 2.0