// Hiển thị portfolio
document.addEventListener('DOMContentLoaded', function() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    const filterCategory = document.getElementById('filterCategory');
    const sortBy = document.getElementById('sortBy');

    // Load posts từ API
    async function loadPosts() {
        try {
            const category = filterCategory.value;
            const sort = sortBy.value;
            
            const response = await fetch(`http://localhost:3000/api/posts?category=${category}&sort=${sort}`);
            
            if (!response.ok) {
                throw new Error('Không thể tải bài đăng');
            }
            
            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error('Lỗi:', error);
            portfolioGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>Không thể tải bài đăng</h3>
                    <p>Vui lòng kiểm tra kết nối server</p>
                </div>
            `;
        }
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

        portfolioGrid.innerHTML = posts.map(post => {
            // Kiểm tra ảnh hợp lệ
            let imageUrl = post.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image';
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:image')) {
                imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
            }
            
            return `
            <div class="card hover-lift">
                <div style="position: relative;">
                    <img src="${imageUrl}" 
                         onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"
                         style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                    <span class="badge badge-info" style="position: absolute; top: 10px; left: 10px;">
                        ${getCategoryName(post.category)}
                    </span>
                    <span class="badge badge-secondary" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white;">
                        ${post.author?.fullName || 'Anonymous'}
                    </span>
                </div>
                <h3 style="margin-top: 1rem;">${post.title}</h3>
                <p style="color: var(--text-gray); margin: 0.5rem 0;">
                    ${truncateText(post.description, 100)}
                </p>
                <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0; color: var(--text-gray); font-size: 0.9rem;">
                    <span>${post.author?.fullName || 'Anonymous'}</span>
                    <span>❤️ ${post.likesCount || 0}</span>
                    <span>👁️ ${post.views || 0}</span>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${(post.tags || []).slice(0, 3).map(tag => `<span class="badge badge-secondary">${tag}</span>`).join('')}
                </div>
                <p style="font-size: 1.2rem; color: var(--dark-brown); font-weight: bold; margin: 0.5rem 0;">
                    ${formatCurrency(post.price || 500000)}
                </p>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button onclick="viewPost('${post._id}')" class="btn btn-secondary" style="flex: 1;">
                        Xem Chi Tiết
                    </button>
                    <button onclick="buyPost('${post._id}')" class="btn btn-primary" style="flex: 1;">
                        Mua Ngay
                    </button>
                </div>
            </div>
            `;
        }).join('');
    }

    function getCategoryName(category) {
        const names = {
            'logo': '🏷️ Logo Design',
            'uiux': '� UI/UX Desi gn',
            'print': '🖨️ Thiết kế Poster'
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

    // Buy post
    window.buyPost = function(postId) {
        window.location.href = `buy-post.html?id=${postId}`;
    };

    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    // Event listeners
    filterCategory.addEventListener('change', loadPosts);
    sortBy.addEventListener('change', loadPosts);

    // Load posts
    loadPosts();
});
