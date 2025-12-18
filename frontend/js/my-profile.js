// Trang cá nhân người dùng đã đăng nhập
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadMyProfile();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Vui lòng đăng nhập để xem trang cá nhân!');
        window.location.href = 'login.html';
        return;
    }
}

function loadMyProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Kiểm tra cả _id và id (API trả về id)
    if (!user || (!user._id && !user.id)) {
        document.getElementById('profileContent').innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h2>Chưa đăng nhập</h2>
                <p style="color: var(--text-gray);">Vui lòng đăng nhập để xem trang cá nhân</p>
                <a href="login.html" class="btn btn-primary" style="margin-top: 1rem;">Đăng Nhập</a>
            </div>
        `;
        return;
    }
    
    // Chuẩn hóa _id nếu chỉ có id
    if (!user._id && user.id) {
        user._id = user.id;
    }
    
    displayProfile(user);
}

function displayProfile(user) {
    // API trả về userType thay vì role
    const role = user.role || user.userType;
    
    const roleText = role === 'designer' ? 'Nhà Thiết Kế' : 
                     role === 'client' ? 'Khách Hàng' : 
                     role === 'admin' ? 'Quản Trị Viên' : 'Người Dùng';
    
    const roleIcon = role === 'designer' ? '🎨' : 
                     role === 'client' ? '👤' : 
                     role === 'admin' ? '👑' : '👤';

    document.getElementById('profileContent').innerHTML = `
        <div class="card" style="text-align: center; padding: 2rem; margin-bottom: 2rem;">
            <div style="width: 100px; height: 100px; background: linear-gradient(135deg, var(--primary-brown), var(--dark-brown)); border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">
                ${roleIcon}
            </div>
            <h1 style="margin-bottom: 0.5rem;">${user.fullName || 'Chưa cập nhật'}</h1>
            <span class="badge badge-info" style="font-size: 1rem; padding: 0.5rem 1rem;">${roleText}</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div class="card">
                <h3>📧 Thông Tin Liên Hệ</h3>
                <div style="margin-top: 1rem;">
                    <p><strong>Email:</strong></p>
                    <p style="color: var(--text-gray);">${user.email || 'Chưa cập nhật'}</p>
                </div>
            </div>

            <div class="card">
                <h3>📊 Thông Tin Tài Khoản</h3>
                <div style="margin-top: 1rem;">
                    <p><strong>Vai trò:</strong></p>
                    <p style="color: var(--text-gray);">${roleText}</p>
                </div>
                <div style="margin-top: 1rem;">
                    <p><strong>ID Tài khoản:</strong></p>
                    <p style="color: var(--text-gray); font-size: 0.85rem;">${user._id || 'N/A'}</p>
                </div>
            </div>
        </div>

        ${role === 'designer' ? `
        <div class="card" style="margin-top: 2rem;">
            <h3>🎨 Thông Tin Nhà Thiết Kế</h3>
            <div style="margin-top: 1rem;">
                <p><strong>Giới thiệu:</strong></p>
                <p style="color: var(--text-gray);">${user.bio || 'Chưa cập nhật giới thiệu'}</p>
            </div>
            <div style="margin-top: 1rem;">
                <p><strong>Kỹ năng:</strong></p>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                    ${(user.skills || []).map(skill => `<span class="badge badge-secondary">${skill}</span>`).join('') || '<span style="color: var(--text-gray);">Chưa cập nhật</span>'}
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <p><strong>Đánh giá:</strong></p>
                <p style="color: var(--text-gray);">⭐ ${user.rating ? user.rating.toFixed(1) : '0.0'} (${user.reviewCount || 0} đánh giá)</p>
            </div>
        </div>
        ` : ''}

        <div class="card" style="margin-top: 2rem;">
            <h3>⚙️ Hành Động</h3>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                ${role === 'designer' ? `
                <a href="create-post.html" class="btn btn-primary">📝 Đăng Bài Mới</a>
                ` : ''}
                <a href="portfolio.html" class="btn btn-secondary">🖼️ Xem Bài Đăng</a>
                <a href="projects.html" class="btn btn-secondary">📁 Xem Dự Án</a>
                <button onclick="logout()" class="btn" style="background: #dc3545; color: white;">🚪 Đăng Xuất</button>
            </div>
        </div>
    `;
}

function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Đã đăng xuất!');
        window.location.href = 'index.html';
    }
}

console.log('👤 My profile page loaded');
