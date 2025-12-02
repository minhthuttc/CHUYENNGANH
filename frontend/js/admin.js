// Admin JavaScript
const API_URL = 'http://localhost:3000/api';

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch(`${API_URL}/admin/statistics`);
        const stats = await response.json();
        
        // Update stat cards
        document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
        document.getElementById('totalDesigners').textContent = stats.totalDesigners || 0;
        document.getElementById('activeProjects').textContent = stats.activeProjects || 0;
        document.getElementById('totalRevenue').textContent = formatCurrency(stats.totalRevenue || 0);
        
        // Update monthly stats
        document.getElementById('monthlyRevenue').textContent = formatCurrency(stats.monthlyRevenue || 0);
        document.getElementById('newUsers').textContent = stats.newUsersThisMonth || 0;
        document.getElementById('completedProjects').textContent = stats.completedProjects || 0;
        document.getElementById('avgRating').textContent = (stats.avgRating || 0).toFixed(1) + '/5.0';
        
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/admin/users`);
        const users = await response.json();
        
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${user._id.slice(-6)}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="badge badge-${user.userType === 'designer' ? 'info' : 'warning'}">${user.userType === 'designer' ? 'Nhà thiết kế' : 'Khách hàng'}</span></td>
                <td><span class="badge badge-${user.status === 'active' ? 'success' : 'warning'}">${user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span></td>
                <td>${new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                    <button class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.9rem;" onclick="viewUser('${user._id}')">Xem</button>
                    <button class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.9rem;" onclick="toggleUserStatus('${user._id}', '${user.status}')">${user.status === 'active' ? 'Khóa' : 'Mở khóa'}</button>
                    <button class="btn btn-secondary" style="padding: 0.4rem 1rem; font-size: 0.9rem; background: #dc3545;" onclick="deleteUser('${user._id}')">Xóa</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Load projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/admin/projects`);
        const projects = await response.json();
        
        const tbody = document.getElementById('projectsTableBody');
        tbody.innerHTML = '';
        
        projects.forEach(project => {
            const row = document.createElement('tr');
            const statusBadge = {
                'recruiting': 'success',
                'in_progress': 'warning',
                'completed': 'info',
                'cancelled': 'secondary'
            };
            const statusText = {
                'recruiting': 'Đang tuyển',
                'in_progress': 'Đang thực hiện',
                'completed': 'Hoàn thành',
                'cancelled': 'Đã hủy'
            };
            
            row.innerHTML = `
                <td>#${project._id.slice(-6)}</td>
                <td>${project.title}</td>
                <td>${project.client?.fullName || 'N/A'}</td>
                <td>${project.designer?.fullName || '-'}</td>
                <td><span class="badge badge-${statusBadge[project.status]}">${statusText[project.status]}</span></td>
                <td>${formatCurrency(project.budget)}</td>
                <td>
                    <button class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.9rem;" onclick="viewProject('${project._id}')">Xem</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load transactions
async function loadTransactions() {
    try {
        const response = await fetch(`${API_URL}/admin/transactions`);
        const transactions = await response.json();
        
        const tbody = document.getElementById('transactionsTableBody');
        tbody.innerHTML = '';
        
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            const statusBadge = {
                'pending': 'warning',
                'processing': 'info',
                'completed': 'success',
                'failed': 'secondary',
                'refunded': 'warning'
            };
            const statusText = {
                'pending': 'Chờ xử lý',
                'processing': 'Đang xử lý',
                'completed': 'Hoàn thành',
                'failed': 'Thất bại',
                'refunded': 'Hoàn tiền'
            };
            
            row.innerHTML = `
                <td>${transaction.transactionId}</td>
                <td>${transaction.project?.title || 'N/A'}</td>
                <td>${transaction.from?.fullName || 'N/A'}</td>
                <td>${transaction.to?.fullName || 'N/A'}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td><span class="badge badge-${statusBadge[transaction.status]}">${statusText[transaction.status]}</span></td>
                <td>${new Date(transaction.createdAt).toLocaleDateString('vi-VN')}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Load top designers
async function loadTopDesigners() {
    try {
        const response = await fetch(`${API_URL}/admin/top-designers`);
        const designers = await response.json();
        
        const tbody = document.getElementById('topDesignersTableBody');
        tbody.innerHTML = '';
        
        designers.slice(0, 5).forEach((designer, index) => {
            const medals = ['🥇', '🥈', '🥉'];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${medals[index] || (index + 1)}</td>
                <td>${designer.fullName}</td>
                <td>${designer.completedProjects || 0}</td>
                <td>${designer.rating?.toFixed(1) || 0}⭐</td>
                <td>${formatCurrency(designer.totalEarnings || 0)}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading top designers:', error);
    }
}

// Toggle user status
async function toggleUserStatus(userId, currentStatus) {
    const action = currentStatus === 'active' ? 'khóa' : 'mở khóa';
    if (!confirm(`Bạn có chắc muốn ${action} người dùng này?`)) return;
    
    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}/toggle-status`, {
            method: 'PUT'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification(data.message, 'success');
            loadUsers();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Lỗi kết nối server!', 'error');
        console.error('Error:', error);
    }
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác!')) return;
    
    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification(data.message, 'success');
            loadUsers();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        showNotification('Lỗi kết nối server!', 'error');
        console.error('Error:', error);
    }
}

// View user details
function viewUser(userId) {
    window.location.href = `profile.html?id=${userId}`;
}

// View project details
function viewProject(projectId) {
    window.location.href = `project-detail.html?id=${projectId}`;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Show notification
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
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadStatistics();
    loadUsers();
    loadProjects();
    loadTransactions();
    loadTopDesigners();
    
    // Refresh data every 30 seconds
    setInterval(() => {
        loadStatistics();
    }, 30000);
});
