// Register JavaScript
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleRegister();
        });
    }
});

async function handleRegister() {
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.getElementById('userType').value;

    // Validation
    if (!userType) {
        showNotification('Vui lòng chọn loại tài khoản!', 'error');
        return;
    }

    if (!fullName) {
        showNotification('Vui lòng nhập họ tên!', 'error');
        return;
    }

    if (!email) {
        showNotification('Vui lòng nhập email!', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Email không hợp lệ!', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }

    // Prepare data
    const registerData = {
        fullName,
        email,
        password,
        userType
    };

    try {
        // Disable submit button
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang đăng ký...';

        console.log('Sending registration data:', { ...registerData, password: '***' });

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        const data = await response.json();
        console.log('Registration response:', data);

        if (response.ok) {
            showNotification('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');
            
            // Clear form
            document.getElementById('registerForm').reset();
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showNotification(data.message || 'Đăng ký thất bại!', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Đăng Ký';
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Lỗi kết nối server! Vui lòng kiểm tra server đang chạy.', 'error');
        
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Đăng Ký';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

console.log('📝 Register script loaded');
