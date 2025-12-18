// Load danh sách designers
let allDesigners = [];

document.addEventListener('DOMContentLoaded', async function() {
    await loadDesigners();
    
    // Event listener cho nút lọc
    const filterBtn = document.getElementById('filterBtn');
    const skillFilter = document.getElementById('skillFilter');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', filterDesigners);
    }
    
    if (skillFilter) {
        skillFilter.addEventListener('change', filterDesigners);
    }
});

async function loadDesigners() {
    try {
        const response = await fetch('http://localhost:3000/api/users?userType=designer');
        const designers = await response.json();
        
        allDesigners = designers;
        displayDesigners(designers);
    } catch (error) {
        console.error('Lỗi load designers:', error);
    }
}

function filterDesigners() {
    const skillFilter = document.getElementById('skillFilter');
    const selectedSkill = skillFilter.value;
    
    if (selectedSkill === 'all') {
        displayDesigners(allDesigners);
    } else {
        const filtered = allDesigners.filter(designer => {
            const skills = designer.skills || [];
            const bio = designer.bio || '';
            
            // Tìm kiếm trong skills và bio
            return skills.some(skill => 
                skill.toLowerCase().includes(selectedSkill.toLowerCase())
            ) || bio.toLowerCase().includes(selectedSkill.toLowerCase());
        });
        
        if (filtered.length === 0) {
            document.querySelector('.card-grid').innerHTML = `
                <div style="text-align: center; padding: 2rem; grid-column: 1/-1;">
                    <p>Không tìm thấy nhà thiết kế với chuyên môn này.</p>
                    <button onclick="document.getElementById('skillFilter').value='all'; filterDesigners();" class="btn btn-secondary" style="margin-top: 1rem;">Xem tất cả</button>
                </div>
            `;
        } else {
            displayDesigners(filtered);
        }
    }
}

function displayDesigners(designers) {
    const container = document.querySelector('.card-grid');
    
    if (!designers || designers.length === 0) {
        container.innerHTML = '<p>Chưa có nhà thiết kế nào.</p>';
        return;
    }

    // Kiểm tra user có phải admin không
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.userType === 'admin' || user.role === 'admin';
    
    container.innerHTML = designers.map(designer => `
        <div class="card">
            <h3>${designer.fullName}</h3>
            <p style="color: var(--text-gray);">${designer.bio || 'Nhà thiết kế'}</p>
            <p><strong>⭐ ${designer.rating ? designer.rating.toFixed(1) : '0.0'}</strong> (${designer.reviewCount || 0} đánh giá)</p>
            <div style="margin: 1rem 0;">
                ${(designer.skills || []).slice(0, 3).map(skill => 
                    `<span class="badge badge-info">${skill}</span>`
                ).join(' ')}
            </div>
            <p>Dự án hoàn thành: ${designer.completedProjects || 0}</p>
            <a href="profile.html?id=${designer._id}" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Xem Hồ Sơ</a>
            ${isAdmin ? `<button onclick="deleteDesigner('${designer._id}')" class="btn" style="width: 100%; margin-top: 0.5rem; background: #dc3545; color: white;">🗑️ Xóa</button>` : ''}
        </div>
    `).join('');
}

// Delete designer (admin only)
async function deleteDesigner(designerId) {
    if (!confirm('Bạn có chắc muốn xóa nhà thiết kế này? Hành động này không thể hoàn tác!')) return;

    try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${designerId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            alert('Đã xóa nhà thiết kế thành công!');
            location.reload();
        } else {
            alert(data.message || 'Lỗi xóa nhà thiết kế!');
        }
    } catch (error) {
        console.error('Lỗi xóa nhà thiết kế:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
}
