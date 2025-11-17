// DesignHub - Main JavaScript File
const API_URL = 'http://localhost:3000/api';

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        showNotification('Đăng nhập thành công!', 'success');
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 1000);
                    } else {
                        showNotification(data.message || 'Đăng nhập thất bại!', 'error');
                    }
                } catch (error) {
                    showNotification('Lỗi kết nối server!', 'error');
                    console.error('Error:', error);
                }
            } else {
                showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showNotification('Mật khẩu xác nhận không khớp!', 'error');
                return;
            }
            
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                password: password,
                userType: document.getElementById('userType').value
            };
            
            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showNotification('Đăng ký thành công!', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    showNotification(data.message || 'Đăng ký thất bại!', 'error');
                }
            } catch (error) {
                showNotification('Lỗi kết nối server!', 'error');
                console.error('Error:', error);
            }
        });
    }
    
    // Load projects on projects page
    if (window.location.pathname.includes('projects.html')) {
        loadProjects();
    }
    
    // Load designers on designers page
    if (window.location.pathname.includes('designers.html')) {
        loadDesigners();
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle (for future responsive implementation)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Search functionality
function searchProjects(query) {
    console.log('Searching for:', query);
    // Implement search logic here
}

// Filter functionality
function filterProjects(category, status) {
    console.log('Filtering:', category, status);
    // Implement filter logic here
}

// File upload handler
function handleFileUpload(event) {
    const files = event.target.files;
    console.log('Files uploaded:', files);
    // Implement file upload logic here
}

// Chat message sender
function sendMessage(message) {
    console.log('Sending message:', message);
    // Implement chat logic here
}

// Project application
function applyToProject(projectId) {
    console.log('Applying to project:', projectId);
    alert('Đã gửi đơn ứng tuyển thành công!');
}

// Save project
function saveProject(projectId) {
    console.log('Saving project:', projectId);
    alert('Đã lưu dự án!');
}

// Rating system
function rateProject(projectId, rating) {
    console.log('Rating project:', projectId, 'with', rating, 'stars');
    alert('Cảm ơn bạn đã đánh giá!');
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: var(--dark-green);
        color: white;
        border-radius: 5px;
        box-shadow: var(--shadow);
        z-index: 9999;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Admin functions
function blockUser(userId) {
    if (confirm('Bạn có chắc muốn khóa người dùng này?')) {
        console.log('Blocking user:', userId);
        showNotification('Đã khóa người dùng!', 'success');
    }
}

function unblockUser(userId) {
    if (confirm('Bạn có chắc muốn mở khóa người dùng này?')) {
        console.log('Unblocking user:', userId);
        showNotification('Đã mở khóa người dùng!', 'success');
    }
}

function deleteUser(userId) {
    if (confirm('Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác!')) {
        console.log('Deleting user:', userId);
        showNotification('Đã xóa người dùng!', 'success');
    }
}

// Export data
function exportData(type) {
    console.log('Exporting data:', type);
    showNotification('Đang xuất dữ liệu...', 'info');
}

console.log('DesignHub loaded successfully!');

// Load projects from API
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`);
        const projects = await response.json();
        
        console.log('Projects loaded:', projects);
        // Có thể render projects vào DOM ở đây
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load designers from API
async function loadDesigners() {
    try {
        const response = await fetch(`${API_URL}/users/designers/search`);
        const designers = await response.json();
        
        console.log('Designers loaded:', designers);
        // Có thể render designers vào DOM ở đây
    } catch (error) {
        console.error('Error loading designers:', error);
    }
}

// Create new project
async function createProject(projectData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(projectData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Tạo dự án thành công!', 'success');
            return data.project;
        } else {
            showNotification(data.message || 'Tạo dự án thất bại!', 'error');
        }
    } catch (error) {
        showNotification('Lỗi kết nối server!', 'error');
        console.error('Error:', error);
    }
}

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showNotification('Đã đăng xuất!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}
