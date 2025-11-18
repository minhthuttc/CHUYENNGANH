// Hiển thị portfolio
document.addEventListener('DOMContentLoaded', function() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    const filterCategory = document.getElementById('filterCategory');
    const sortBy = document.getElementById('sortBy');

    // Load posts
    function loadPosts() {
        // Lấy từ localStorage (trong thực tế gọi API)
        let posts = JSON.parse(localStorage.getItem('posts') || '[]');

        // Nếu chưa có posts, tạo sample data
        if (posts.length === 0) {
            posts = createSamplePosts();
            localStorage.setItem('posts', JSON.stringify(posts));
        }

        // Lọc theo category
        const category = filterCategory.value;
        if (category !== 'all') {
            posts = posts.filter(p => p.category === category);
        }

        // Sắp xếp
        const sort = sortBy.value;
        if (sort === 'popular') {
            posts.sort((a, b) => b.views - a.views);
        } else if (sort === 'mostLiked') {
            posts.sort((a, b) => b.likes - a.likes);
        } else {
            posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        displayPosts(posts);
    }

    function displayPosts(posts) {
        if (posts.length === 0) {
            portfolioGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>Chưa có bài đăng</h3>
                    <p>Hãy là người đầu tiên chia sẻ tác phẩm!</p>
                    <a href="create-post.html" class="btn btn-primary">Đăng Bài Ngay</a>
                </div>
            `;
            return;
        }

        portfolioGrid.innerHTML = posts.map(post => `
            <div class="card hover-lift">
                <div style="position: relative;">
                    <img src="${post.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}" 
                         style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                    <span class="badge badge-info" style="position: absolute; top: 10px; left: 10px;">
                        ${getCategoryName(post.category)}
                    </span>
                </div>
                <h3 style="margin-top: 1rem;">${post.title}</h3>
                <p style="color: var(--text-gray); margin: 0.5rem 0;">
                    ${truncateText(post.description, 100)}
                </p>
                <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0; color: var(--text-gray); font-size: 0.9rem;">
                    <span>👤 ${post.author.fullName || 'Anonymous'}</span>
                    <span>❤️ ${post.likes}</span>
                    <span>👁️ ${post.views}</span>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${post.tags.slice(0, 3).map(tag => `<span class="badge badge-secondary">${tag}</span>`).join('')}
                </div>
                <button onclick="viewPost(${post.id})" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                    Xem Chi Tiết
                </button>
            </div>
        `).join('');
    }

    function createSamplePosts() {
        return [
            {
                id: 1,
                title: 'Logo Design cho Startup Công Nghệ',
                category: 'logo',
                description: 'Thiết kế logo hiện đại, tối giản cho startup công nghệ. Sử dụng màu xanh dương thể hiện sự tin cậy và công nghệ.',
                tags: ['logo', 'startup', 'tech', 'minimalist'],
                images: ['https://via.placeholder.com/800x600?text=Logo+Design'],
                author: { fullName: 'Phạm Quang Vinh' },
                createdAt: new Date().toISOString(),
                likes: 45,
                comments: 12,
                views: 234
            },
            {
                id: 2,
                title: 'UI/UX Design App Mobile Food Delivery',
                category: 'uiux',
                description: 'Thiết kế giao diện app đặt đồ ăn với trải nghiệm người dùng tối ưu. Màu sắc tươi sáng, dễ sử dụng.',
                tags: ['uiux', 'mobile', 'app', 'food'],
                images: ['https://via.placeholder.com/800x600?text=UI+UX+Design'],
                author: { fullName: 'Nguyễn Thành Trung' },
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                likes: 67,
                comments: 23,
                views: 456
            },
            {
                id: 3,
                title: 'Branding cho Cafe Organic',
                category: 'branding',
                description: 'Bộ nhận diện thương hiệu hoàn chỉnh cho chuỗi cafe organic. Phong cách tự nhiên, thân thiện môi trường.',
                tags: ['branding', 'cafe', 'organic', 'natural'],
                images: ['https://via.placeholder.com/800x600?text=Branding'],
                author: { fullName: 'Nguyễn Huỳnh Kỹ Thuật' },
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                likes: 89,
                comments: 34,
                views: 678
            },
            {
                id: 4,
                title: 'Illustration cho Sách Thiếu Nhi',
                category: 'illustration',
                description: 'Minh họa dễ thương cho truyện thiếu nhi. Màu sắc tươi sáng, nhân vật đáng yêu.',
                tags: ['illustration', 'children', 'book', 'cute'],
                images: ['https://via.placeholder.com/800x600?text=Illustration'],
                author: { fullName: 'Hứa Thị Thảo Vy' },
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                likes: 123,
                comments: 45,
                views: 890
            }
        ];
    }

    function getCategoryName(category) {
        const names = {
            'logo': '🏷️ Logo',
            'uiux': '📱 UI/UX',
            'print': '🖨️ Print',
            'branding': '✨ Branding',
            'packaging': '📦 Packaging',
            'web': '🌐 Web',
            'illustration': '🎨 Illustration'
        };
        return names[category] || category;
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // View post detail
    window.viewPost = function(postId) {
        window.location.href = `post-detail.html?id=${postId}`;
    };

    // Event listeners
    filterCategory.addEventListener('change', loadPosts);
    sortBy.addEventListener('change', loadPosts);

    // Load posts
    loadPosts();
});