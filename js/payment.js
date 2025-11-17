// Payment JavaScript
const API_URL = 'http://localhost:3000/api';
let currentProject = null;
let totalAmount = 0;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadProjectInfo();
    setupPaymentForm();
    setupPaymentMethodSelection();
});

// Kiểm tra đăng nhập
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
}

// Tải thông tin dự án
async function loadProjectInfo() {
    const projectId = new URLSearchParams(window.location.search).get('projectId');
    
    if (!projectId) {
        showNotification('Không tìm thấy thông tin dự án!', 'error');
        setTimeout(() => window.location.href = 'projects.html', 2000);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Không thể tải thông tin dự án');
        }

        currentProject = await response.json();
        displayProjectInfo(currentProject);
        calculatePayment(currentProject);
    } catch (error) {
        console.error('Error loading project:', error);
        showNotification('Lỗi tải thông tin dự án!', 'error');
    }
}

// Hiển thị thông tin dự án
function displayProjectInfo(project) {
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('designerName').textContent = project.designer?.fullName || 'Chưa có';
    
    const statusBadge = document.querySelector('.badge');
    statusBadge.textContent = getStatusText(project.status);
    statusBadge.className = `badge badge-${getStatusClass(project.status)}`;
    
    if (project.completedAt) {
        document.getElementById('completedDate').textContent = 
            new Date(project.completedAt).toLocaleDateString('vi-VN');
    }
}

// Tính toán thanh toán
function calculatePayment(project) {
    const projectPrice = project.budget || 5000000;
    const serviceFeePercent = 5;
    const serviceFee = Math.round(projectPrice * serviceFeePercent / 100);
    totalAmount = projectPrice + serviceFee;

    document.getElementById('projectPrice').textContent = formatCurrency(projectPrice);
    document.getElementById('serviceFee').textContent = formatCurrency(serviceFee);
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
}

// Thiết lập form thanh toán
function setupPaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await processPayment();
        });
    }
}

// Xử lý chọn phương thức thanh toán
function setupPaymentMethodSelection() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Highlight selected method
            document.querySelectorAll('label').forEach(label => {
                label.style.borderColor = 'var(--border-color)';
                label.style.background = 'white';
            });
            this.parentElement.style.borderColor = 'var(--dark-brown)';
            this.parentElement.style.background = 'var(--light-brown)';
        });
    });
}

// Xử lý thanh toán
async function processPayment() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const note = document.getElementById('note').value;
    const projectId = new URLSearchParams(window.location.search).get('projectId');

    // Xác nhận thanh toán
    if (!confirm(`Xác nhận thanh toán ${formatCurrency(totalAmount)} cho dự án này?`)) {
        return;
    }

    const paymentData = {
        projectId: projectId,
        paymentMethod: paymentMethod,
        note: note,
        amount: totalAmount
    };

    try {
        // Disable form
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Đang xử lý...';
        
        showNotification('Đang xử lý thanh toán...', 'info');
        
        const response = await fetch(`${API_URL}/payments/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(paymentData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccessPayment(data);
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = '💳 Thanh Toán Ngay';
            showNotification(data.message || 'Thanh toán thất bại!', 'error');
        }
    } catch (error) {
        showNotification('Lỗi kết nối server!', 'error');
        console.error('Error:', error);
        
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = '💳 Thanh Toán Ngay';
    }
}

function showSuccessPayment(data) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="container" style="max-width: 600px; text-align: center; padding: 3rem 2rem;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">✅</div>
            <h1 style="color: var(--dark-brown); margin-bottom: 1rem;">Thanh Toán Thành Công!</h1>
            <p style="color: var(--text-gray); margin-bottom: 2rem;">
                Giao dịch của bạn đã được xử lý thành công. Tiền đã được chuyển đến nhà thiết kế.
            </p>
            
            <div class="card" style="text-align: left; margin-bottom: 2rem;">
                <h3>📋 Thông Tin Giao Dịch</h3>
                <div style="margin-top: 1rem;">
                    <p><strong>Mã giao dịch:</strong> ${data.transactionId || 'TXN' + Date.now()}</p>
                    <p><strong>Dự án:</strong> ${currentProject?.title || 'N/A'}</p>
                    <p><strong>Số tiền:</strong> ${formatCurrency(totalAmount)}</p>
                    <p><strong>Phương thức:</strong> ${getPaymentMethodName(data.paymentMethod)}</p>
                    <p><strong>Trạng thái:</strong> <span class="badge badge-success">Thành công</span></p>
                    <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                </div>
            </div>

            <div class="card" style="text-align: left; margin-bottom: 2rem; background: var(--light-brown);">
                <h3>📧 Thông Báo</h3>
                <p style="margin-top: 1rem; color: var(--text-gray);">
                    ✓ Email xác nhận đã được gửi đến hộp thư của bạn<br>
                    ✓ Nhà thiết kế đã nhận được thông báo thanh toán<br>
                    ✓ Bạn có thể tải xuống hóa đơn từ trang lịch sử giao dịch
                </p>
            </div>
            
            <div style="display: grid; gap: 1rem;">
                <a href="review.html?projectId=${data.projectId}" class="btn btn-primary" style="text-decoration: none;">
                    ⭐ Đánh Giá Dự Án
                </a>
                <a href="projects.html" class="btn btn-secondary" style="text-decoration: none;">
                    📁 Xem Dự Án Của Tôi
                </a>
                <a href="dashboard.html" class="btn btn-secondary" style="text-decoration: none;">
                    🏠 Về Trang Chủ
                </a>
            </div>
        </div>
    `;
}

// Helper functions
function getPaymentMethodName(method) {
    const methods = {
        'bank_transfer': '🏦 Chuyển khoản ngân hàng',
        'momo': '📱 Ví MoMo',
        'zalopay': '💰 ZaloPay',
        'credit_card': '💳 Thẻ tín dụng'
    };
    return methods[method] || method;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xử lý',
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

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('💳 Payment system loaded');
