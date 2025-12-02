// Load thông tin profile từ URL parameter
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get('id');
    
    // Nếu không có ID, load nhà thiết kế đầu tiên
    if (!userId) {
        try {
            const response = await fetch('http://localhost:3000/api/users?userType=designer');
            const designers = await response.json();
            if (designers && designers.length > 0) {
                userId = designers[0]._id;
            }
        } catch (error) {
            console.error('Lỗi load designers:', error);
            return;
        }
    }
    
    if (!userId) {
        console.log('Không có ID user');
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
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userPhone').textContent = user.phone || 'Chưa cập nhật';
    document.getElementById('userAddress').textContent = user.address || 'Chưa cập nhật';
    document.getElementById('userWebsite').textContent = user.website || 'Chưa cập nhật';
    
    // Cập nhật kỹ năng
    const skillsContainer = document.querySelector('.card:nth-child(3) div[style*="flex-wrap"]');
    if (skillsContainer && user.skills) {
        skillsContainer.innerHTML = user.skills.map(skill => 
            `<span class="badge badge-info">${skill}</span>`
        ).join('');
    }
    
    // Cập nhật thống kê
    const statsCard = document.querySelector('.card:nth-child(4)');
    if (statsCard) {
        statsCard.innerHTML = `
            <h3>Thống Kê</h3>
            <p><strong>Kinh nghiệm:</strong> 5+ năm</p>
            <p><strong>Dự án hoàn thành:</strong> ${user.completedProjects || 0}</p>
            <p><strong>Đánh giá:</strong> ${user.rating ? user.rating.toFixed(1) : '0.0'} ⭐ (${user.reviewCount || 0} đánh giá)</p>
            <p><strong>Tỷ lệ hoàn thành:</strong> 98%</p>
            <p><strong>Thời gian phản hồi:</strong> 2 giờ</p>
        `;
    }
    
    // Cập nhật giới thiệu
    const introCard = document.querySelector('.card h2');
    if (introCard && introCard.nextElementSibling) {
        introCard.nextElementSibling.textContent = user.bio || 'Chưa có thông tin giới thiệu.';
    }
}
