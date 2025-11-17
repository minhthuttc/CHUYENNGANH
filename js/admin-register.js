// Admin Registration JavaScript
const API_URL = 'http://localhost:3000/api';

// MÃ BẢO MẬT ADMIN - Chỉ admin cấp cao biết
const ADMIN_SECURITY_CODE = 'DESIGNHUB_ADMIN_110122174';

document.addEventListener('DOMContentLoaded', function() {
    const adminRegisterForm = document.getElementById('adminRegisterForm');
    
    if (adminRegisterForm) {
        adminRegisterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu form
            const securityCode = document.getElementById('securityCode').value;
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const adminRole = document.getElementById('adminRole').value;
            
            // Bỏ qua kiểm tra mã ở frontend, để backend xử lý
            
            // Kiểm tra mật khẩu
            if (password !== confirmPassword) {
                showNotification('❌ Mật khẩu xác nhận không khớp!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('❌ Mật khẩu phải có ít nhất 6 ký tự!', 'error');
                return;
            }
            
            // Kiểm tra vai trò
            if (!adminRole) {
                showNotification('❌ Vui lòng chọn vai trò admin!', 'error');
                return;
            }
            
            // Tạo tài khoản admin
            const formData = {
                fullName: fullName,
                email: email,
                password: password,
                userType: 'admin',
                adminRole: adminRole,
                securityCode: securityCode.trim() // Loại bỏ khoảng trắng
            };
            
            // Debug: Xem mã đang gửi
            console.log('Đang gửi mã:', formData.securityCode);
            console.log('Độ dài:', formData.securityCode.length);
            
            try {
                const response = await fetch(`${API_URL}/auth/register-admin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showNotification('✅ Đăng ký admin thành công!', 'success');
                    
                    // Hiển thị thông tin
                    showSuccessMessage(data);
                    
                    // Chuyển đến trang đăng nhập sau 3 giây
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 3000);
                } else {
                    showNotification(data.message || '❌ Đăng ký thất bại!', 'error');
                }
            } catch (error) {
                showNotification('❌ Lỗi kết nối server!', 'error');
                console.error('Error:', error);
            }
        });
    }
});

// Hiển thị thông báo thành công
function showSuccessMessage(data) {
    const form = document.getElementById('adminRegisterForm');
    form.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h2 style="color: var(--dark-brown); margin-bottom: 1rem;">Đăng Ký Thành Công!</h2>
            <p style="color: var(--text-gray); margin-bottom: 2rem;">
                Tài khoản admin đã được tạo thành công.
            </p>
            <div style="background: var(--light-brown); padding: 1.5rem; border-radius: 10px; text-align: left;">
                <h3 style="margin-bottom: 1rem;">📋 Thông tin tài khoản:</h3>
                <p><strong>Email:</strong> ${data.user?.email || 'N/A'}</p>
                <p><strong>Vai trò:</strong> ${data.user?.adminRole || 'admin'}</p>
                <p><strong>ID:</strong> ${data.userId || 'N/A'}</p>
                <p style="margin-top: 1rem; color: var(--text-gray); font-size: 0.9rem;">
                    Đang chuyển đến trang đăng nhập...
                </p>
            </div>
        </div>
    `;
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--dark-brown)' : '#dc3545'};
        color: white;
        border-radius: 5px;
        box-shadow: var(--shadow);
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Thêm CSS animation
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

console.log('🔐 Admin Registration System Loaded');
console.log('⚠️  Mã bảo mật admin được bảo vệ');
