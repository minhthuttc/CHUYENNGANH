// Load thông tin profile từ URL parameter
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get('id');
    
    // Nếu không có ID trong URL, giữ nguyên thông tin mặc định trong HTML
    if (!userId) {
        console.log('Hiển thị hồ sơ mặc định: Nguyễn Võ Minh Thư');
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/auth/user/${userId}`);
        
        if (!response.ok) {
            throw new Error('Không thể tải thông tin user');
        }
        
        const user = await response.json();
        displayUserProfile(user);
    } catch (error) {
        console.error('Lỗi:', error);
        // Giữ nguyên thông tin mặc định nếu có lỗi
    }
});

function displayUserProfile(user) {
    // Cập nhật tên
    const nameElement = document.getElementById('userName');
    if (nameElement) {
        nameElement.textContent = user.fullName;
    }
    
    // Cập nhật bio/chuyên môn
    const bioElement = document.getElementById('userBio');
    if (bioElement) {
        bioElement.textContent = user.bio || 'Nhà thiết kế';
    }
    
    // Cập nhật rating
    const ratingElement = document.getElementById('userRating');
    if (ratingElement) {
        ratingElement.innerHTML = `<strong>⭐ ${user.rating ? user.rating.toFixed(1) : '0.0'}</strong> (${user.completedProjects || 0} dự án hoàn thành)`;
    }
    
    // Cập nhật thông tin liên hệ
    const emailEl = document.getElementById('userEmail');
    const phoneEl = document.getElementById('userPhone');
    const addressEl = document.getElementById('userAddress');
    const websiteEl = document.getElementById('userWebsite');
    
    if (emailEl) emailEl.textContent = user.email;
    if (phoneEl) phoneEl.textContent = user.phone || 'Chưa cập nhật';
    if (addressEl) addressEl.textContent = user.address || 'Chưa cập nhật';
    if (websiteEl) websiteEl.textContent = user.website || 'Chưa cập nhật';
}
