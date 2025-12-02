// Load danh sách designers
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3000/api/users?userType=designer');
        const designers = await response.json();
        
        displayDesigners(designers);
    } catch (error) {
        console.error('Lỗi load designers:', error);
    }
});

function displayDesigners(designers) {
    const container = document.querySelector('.card-grid');
    
    if (!designers || designers.length === 0) {
        container.innerHTML = '<p>Chưa có nhà thiết kế nào.</p>';
        return;
    }
    
    container.innerHTML = designers.map(designer => `
        <div class="card">
            <div style="text-align: center;">
                <div style="width: 100px; height: 100px; background: var(--light-brown); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                    👨‍🎨
                </div>
                <h3>${designer.fullName}</h3>
                <p style="color: var(--text-gray);">${designer.bio || 'Nhà thiết kế'}</p>
                <p><strong>⭐ ${designer.rating ? designer.rating.toFixed(1) : '0.0'}</strong> (${designer.reviewCount || 0} đánh giá)</p>
            </div>
            <div style="margin: 1rem 0;">
                ${(designer.skills || []).slice(0, 3).map(skill => 
                    `<span class="badge badge-info">${skill}</span>`
                ).join(' ')}
            </div>
            <p>Kinh nghiệm: 5+ năm</p>
            <p>Dự án hoàn thành: ${designer.completedProjects || 0}</p>
            <a href="profile.html?id=${designer._id}" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Xem Hồ Sơ</a>
        </div>
    `).join('');
}
