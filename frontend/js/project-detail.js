// Project Detail JavaScript
const API_URL = 'http://localhost:3000/api';
let currentProject = null;
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserInfo();
    loadProjectDetail();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
}

async function loadUserInfo() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        currentUser = user;
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

async function loadProjectDetail() {
    let projectId = new URLSearchParams(window.location.search).get('id');
    
    // Nếu không có ID, load dự án đầu tiên từ database
    if (!projectId) {
        try {
            const response = await fetch(`${API_URL}/projects`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const projects = await response.json();
                if (projects && projects.length > 0) {
                    projectId = projects[0]._id;
                    // Cập nhật URL để có ID
                    window.history.replaceState({}, '', `project-detail.html?id=${projectId}`);
                }
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
        
        if (!projectId) {
            showLoading(false);
            const container = document.querySelector('.container');
            container.innerHTML = `
                <div class="card" style="text-align: center; padding: 3rem; margin-top: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                    <h2>Chưa có dự án nào</h2>
                    <p style="color: var(--text-gray); margin: 1rem 0;">
                        Hãy tạo dự án mới hoặc xem danh sách dự án
                    </p>
                    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                        <button onclick="window.location.href='projects.html'" class="btn btn-primary">
                            📁 Xem Danh Sách Dự Án
                        </button>
                        <button onclick="window.location.href='dashboard.html'" class="btn btn-secondary">
                            🏠 Về Dashboard
                        </button>
                    </div>
                </div>
            `;
            return;
        }
    }

    try {
        // Show loading
        showLoading(true);

        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Dự án không tồn tại hoặc đã bị xóa');
            } else if (response.status === 401) {
                throw new Error('Bạn cần đăng nhập để xem dự án này');
            } else {
                throw new Error('Không thể tải dự án. Vui lòng thử lại sau.');
            }
        }

        currentProject = await response.json();
        console.log('Project loaded:', currentProject);
        
        // Hide loading and show content
        showLoading(false);
        displayProject(currentProject);
    } catch (error) {
        console.error('Error loading project:', error);
        showLoading(false);
        
        // Show error message
        const container = document.querySelector('.container');
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem; margin-top: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h2>Không thể tải dự án</h2>
                <p style="color: var(--text-gray); margin: 1rem 0;">
                    ${error.message}
                </p>
                <p style="color: var(--text-gray); font-size: 0.9rem; margin: 1rem 0;">
                    ID dự án: ${new URLSearchParams(window.location.search).get('id')}
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                    <button onclick="window.location.href='my-projects.html'" class="btn btn-primary">
                        📁 Xem Dự Án Của Tôi
                    </button>
                    <button onclick="window.location.reload()" class="btn btn-secondary">
                        🔄 Thử Lại
                    </button>
                </div>
            </div>
        `;
    }
}

function showLoading(show) {
    const loadingState = document.getElementById('loadingState');
    const projectContent = document.getElementById('projectContent');
    
    if (loadingState && projectContent) {
        loadingState.style.display = show ? 'block' : 'none';
        projectContent.style.display = show ? 'none' : 'block';
    }
}

function displayProject(project) {
    console.log('Displaying project:', project);
    
    // Update title and status
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.textContent = project.title;
    }
    
    const statusBadge = document.querySelector('.badge');
    if (statusBadge) {
        statusBadge.textContent = getStatusText(project.status);
        statusBadge.className = `badge badge-${getStatusClass(project.status)}`;
    }

    // Update description section
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        const descCard = cards[0];
        descCard.innerHTML = `
            <h2>Mô Tả Dự Án</h2>
            <p>${project.description || 'Chưa có mô tả'}</p>
            
            <h3 style="margin-top: 2rem;">Thông Tin Chi Tiết</h3>
            <ul style="margin-left: 1.5rem; color: var(--text-gray);">
                <li>Danh mục: ${project.category || 'Chưa phân loại'}</li>
                <li>Ngân sách: ${formatCurrency(project.budget)}</li>
                <li>Hạn chót: ${new Date(project.deadline).toLocaleDateString('vi-VN')}</li>
                <li>Trạng thái: ${getStatusText(project.status)}</li>
            </ul>

            <h3 style="margin-top: 2rem;">Kỹ Năng Cần Thiết</h3>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;">
                ${project.skills?.map(skill => `<span class="badge badge-info">${skill}</span>`).join('') || '<span class="badge badge-info">Thiết kế đồ họa</span>'}
            </div>
        `;
    }

    // Update project info sidebar
    if (cards.length >= 3) {
        const infoCard = cards[2];
        infoCard.innerHTML = `
            <h3>Thông Tin Dự Án</h3>
            <p><strong>Khách hàng:</strong> ${project.client?.fullName || 'N/A'}</p>
            <p><strong>Email:</strong> ${project.client?.email || 'N/A'}</p>
            <p><strong>Nhà thiết kế:</strong> ${project.designer?.fullName || 'Chưa có'}</p>
            <p><strong>Ngân sách:</strong> ${formatCurrency(project.budget)}</p>
            <p><strong>Hạn chót:</strong> ${new Date(project.deadline).toLocaleDateString('vi-VN')}</p>
            <p><strong>Trạng thái:</strong> <span class="badge badge-${getStatusClass(project.status)}">${getStatusText(project.status)}</span></p>
            <p><strong>Đăng ngày:</strong> ${new Date(project.createdAt).toLocaleDateString('vi-VN')}</p>
            
            ${renderActionButtons(project)}
        `;
    }

    // Update client info if exists
    if (cards.length >= 4 && project.client) {
        const clientCard = cards[3];
        clientCard.innerHTML = `
            <h3>Về Khách Hàng</h3>
            <p><strong>Tên:</strong> ${project.client.fullName}</p>
            <p><strong>Email:</strong> ${project.client.email}</p>
            <p><strong>Vai trò:</strong> ${project.client.role === 'client' ? 'Khách hàng' : 'Nhà thiết kế'}</p>
            <p><strong>Thành viên từ:</strong> ${new Date(project.client.createdAt).getFullYear()}</p>
        `;
    }
}

function renderActionButtons(project) {
    const isClient = currentUser._id === project.client?._id;
    const isDesigner = currentUser._id === project.designer?._id;
    
    let buttons = '';

    // Nút thanh toán cho khách hàng khi dự án hoàn thành
    if (isClient && (project.status === 'completed' || project.status === 'review')) {
        buttons += `
            <button onclick="goToPayment('${project._id}')" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                💳 Thanh Toán Dự Án
            </button>
        `;
    }

    // Nút đánh giá cho khách hàng sau khi thanh toán
    if (isClient && project.status === 'completed') {
        buttons += `
            <button onclick="goToReview('${project._id}')" class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;">
                ⭐ Đánh Giá Dự Án
            </button>
        `;
    }

    // Nút ứng tuyển cho designer
    if (!isClient && !isDesigner && project.status === 'pending') {
        buttons += `
            <button onclick="applyProject('${project._id}')" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                ✍️ Ứng Tuyển Ngay
            </button>
        `;
    }

    // Nút cập nhật tiến độ cho designer
    if (isDesigner && project.status === 'in_progress') {
        buttons += `
            <button onclick="updateProgress('${project._id}')" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                📊 Cập Nhật Tiến Độ
            </button>
        `;
    }

    buttons += `
        <button onclick="saveProject('${project._id}')" class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;">
            💾 Lưu Dự Án
        </button>
    `;

    return buttons;
}

function goToPayment(projectId) {
    window.location.href = `payment.html?projectId=${projectId}`;
}

function goToReview(projectId) {
    window.location.href = `review.html?projectId=${projectId}`;
}

function applyProject(projectId) {
    alert('Tính năng ứng tuyển đang được phát triển!');
}

function updateProgress(projectId) {
    alert('Tính năng cập nhật tiến độ đang được phát triển!');
}

function saveProject(projectId) {
    alert('Đã lưu dự án!');
}

// Helper functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Đang tuyển',
        'in_progress': 'Đang thực hiện',
        'review': 'Đang xem xét',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    const classMap = {
        'pending': 'warning',
        'in_progress': 'info',
        'review': 'info',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return classMap[status] || 'secondary';
}

console.log('📄 Project detail loaded');
