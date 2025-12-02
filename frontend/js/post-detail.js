// Load chi tiết bài đăng
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
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
        displayPost(post);
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Không thể tải bài đăng');
        window.location.href = 'portfolio.html';
    }
});

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
