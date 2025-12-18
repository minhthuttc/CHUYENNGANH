// Cập nhật navigation dựa trên trạng thái đăng nhập
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
});

function updateNavigation() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navLinks) return;
    
    // Xóa các link đăng nhập/đăng ký cũ nếu có
    const loginLink = navLinks.querySelector('a[href="login.html"]');
    const registerLink = navLinks.querySelector('a[href="register.html"]');
    const myProfileLink = navLinks.querySelector('a[href="my-profile.html"]');
    
    if (token && user && (user._id || user.id)) {
        // Đã đăng nhập - hiển thị Trang Cá Nhân và Đăng Xuất
        
        // Xóa link đăng nhập/đăng ký nếu có
        if (loginLink) loginLink.parentElement.remove();
        if (registerLink) registerLink.parentElement.remove();
        
        // Thêm Trang Cá Nhân nếu chưa có
        if (!myProfileLink) {
            const profileLi = document.createElement('li');
            profileLi.innerHTML = '<a href="my-profile.html">Trang Cá Nhân</a>';
            navLinks.appendChild(profileLi);
        }
        
        // Thêm nút Đăng Xuất nếu chưa có
        if (!navLinks.querySelector('.logout-btn')) {
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = '<a href="#" class="logout-btn" onclick="logoutUser()">Đăng Xuất</a>';
            navLinks.appendChild(logoutLi);
        }
    } else {
        // Chưa đăng nhập - hiển thị Đăng Nhập và Đăng Ký
        
        // Xóa Trang Cá Nhân và Đăng Xuất nếu có
        if (myProfileLink) myProfileLink.parentElement.remove();
        const logoutBtn = navLinks.querySelector('.logout-btn');
        if (logoutBtn) logoutBtn.parentElement.remove();
        
        // Thêm Đăng Nhập nếu chưa có
        if (!loginLink) {
            const loginLi = document.createElement('li');
            loginLi.innerHTML = '<a href="login.html">Đăng Nhập</a>';
            navLinks.appendChild(loginLi);
        }
        
        // Thêm Đăng Ký nếu chưa có
        if (!registerLink) {
            const registerLi = document.createElement('li');
            registerLi.innerHTML = '<a href="register.html">Đăng Ký</a>';
            navLinks.appendChild(registerLi);
        }
    }
}

function logoutUser() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Đã đăng xuất!');
        window.location.href = 'index.html';
    }
}
