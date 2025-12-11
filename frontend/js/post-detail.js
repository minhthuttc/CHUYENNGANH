let currentPostId = null;
let currentPost = null;

// Load chi tiết bài đăng
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    currentPostId = postId;
    
    if (!postId) {
        alert('Không tìm thấy bài đăng');
        window.location.href = 'portfolio.html';
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
        
        if (!response.ok) {
            throw new Error('Không thể tải bài đăng');
        }
        
        const post = await response.json();
        currentPost = post;
        displayPost(post);
        checkDeletePermission(post);
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Không thể tải bài đăng');
        window.location.href = 'portfolio.html';
    }
});

// Kiểm tra quyền xóa bài
function checkDeletePermission(post) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const deleteBtn = document.getElementById('deletePostBtn');
    
    // Hiển thị nút xóa nếu là chủ bài đăng hoặc admin
    if (deleteBtn && user && (user._id === post.author?._id || user.role === 'admin')) {
        deleteBtn.style.display = 'inline-block';
    }
}

// Xóa bài đăng
async function deletePost() {
    if (!currentPostId) return;
    
    if (!confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Vui lòng đăng nhập!');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${currentPostId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Không thể xóa bài đăng');
        }
        
        alert('✅ Đã xóa bài đăng thành công!');
        window.location.href = 'portfolio.html';
    } catch (error) {
        console.error('Lỗi:', error);
        alert('❌ Lỗi: ' + error.message);
    }
}

function displayPost(post) {
    // Update image
    document.getElementById('postImage').src = post.imageUrl || 'https://via.placeholder.com/1200x800?text=Design+Image';
    
    // Update title
    document.getElementById('postTitle').textContent = post.title;
    
    // Update category
    const categoryNames = {
        'logo': '🏷️ Thiết kế Logo',
        'uiux': '📱 UI/UX Design',
        'print': '🖨️ Thiết kế Poster'
    };
    document.getElementById('postCategory').textContent = categoryNames[post.category] || post.category;
    
    // Update stats
    document.getElementById('postLikes').textContent = post.likesCount || 0;
    document.getElementById('postViews').textContent = post.views || 0;
    
    // Update author info
    if (post.author) {
        document.getElementById('authorName').textContent = post.author.fullName || 'Anonymous';
        document.getElementById('authorBio').textContent = post.author.bio || 'Nhà thiết kế';
        document.getElementById('authorProfileLink').href = `profile.html?id=${post.author._id}`;
    }
    
    // Update description
    document.getElementById('postDescription').textContent = post.description;
    
    // Update tags
    const tagsContainer = document.getElementById('postTagsContainer');
    if (post.tags && post.tags.length > 0) {
        tagsContainer.innerHTML = post.tags.map(tag => 
            `<span class="badge badge-secondary">${tag}</span>`
        ).join('');
    }
}
