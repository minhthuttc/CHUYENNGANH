// Payment History JavaScript
const API_URL = 'http://localhost:3000/api';
let allTransactions = [];
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserInfo();
    loadTransactions();
    loadStats();
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
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            currentUser = await response.json();
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

async function loadTransactions() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`${API_URL}/payments/history?userId=${user._id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Không thể tải lịch sử');
        }

        allTransactions = await response.json();
        displayTransactions(allTransactions);
    } catch (error) {
        console.error('Error loading transactions:', error);
        document.getElementById('transactionsList').innerHTML = `
            <div class="card" style="text-align: center; padding: 2rem;">
                <p style="color: var(--text-gray);">❌ Không thể tải lịch sử thanh toán</p>
                <button onclick="loadTransactions()" class="btn btn-secondary" style="margin-top: 1rem;">
                    🔄 Thử lại
                </button>
            </div>
        `;
    }
}

async function loadStats() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`${API_URL}/payments/stats/${user._id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            displayStats(stats);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function displayStats(stats) {
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
        <div class="stat-card">
            <div style="font-size: 0.9rem; color: var(--text-gray);">Đã gửi</div>
            <div style="font-size: 1.2rem; font-weight: bold; color: #dc3545;">
                ${formatCurrency(stats.totalSent)}
            </div>
        </div>
        <div class="stat-card">
            <div style="font-size: 0.9rem; color: var(--text-gray);">Đã nhận</div>
            <div style="font-size: 1.2rem; font-weight: bold; color: #28a745;">
                ${formatCurrency(stats.totalReceived)}
            </div>
        </div>
        <div class="stat-card">
            <div style="font-size: 0.9rem; color: var(--text-gray);">Tổng GD</div>
            <div style="font-size: 1.2rem; font-weight: bold; color: var(--dark-brown);">
                ${stats.totalTransactions}
            </div>
        </div>
    `;
}

function displayTransactions(transactions) {
    const container = document.getElementById('transactionsList');

    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                <h3>Chưa có giao dịch nào</h3>
                <p style="color: var(--text-gray); margin-top: 1rem;">
                    Lịch sử thanh toán của bạn sẽ hiển thị ở đây
                </p>
            </div>
        `;
        return;
    }

    const html = transactions.map(tx => `
        <div class="card" style="margin-bottom: 1rem;">
            <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: center;">
                <div style="font-size: 2rem;">
                    ${tx.type === 'sent' ? '📤' : '📥'}
                </div>
                
                <div>
                    <h3 style="margin: 0;">${tx.project?.title || 'Dự án đã xóa'}</h3>
                    <p style="margin: 0.5rem 0 0 0; color: var(--text-gray); font-size: 0.9rem;">
                        ${tx.type === 'sent' ? 'Gửi đến' : 'Nhận từ'}: 
                        ${tx.type === 'sent' ? tx.to?.fullName : tx.from?.fullName}
                    </p>
                    <p style="margin: 0.25rem 0 0 0; color: var(--text-gray); font-size: 0.85rem;">
                        ${getPaymentMethodName(tx.paymentMethod)} • 
                        ${new Date(tx.createdAt).toLocaleString('vi-VN')}
                    </p>
                    ${tx.description ? `
                        <p style="margin: 0.25rem 0 0 0; color: var(--text-gray); font-size: 0.85rem; font-style: italic;">
                            "${tx.description}"
                        </p>
                    ` : ''}
                </div>
                
                <div style="text-align: right;">
                    <div style="font-size: 1.2rem; font-weight: bold; color: ${tx.type === 'sent' ? '#dc3545' : '#28a745'};">
                        ${tx.type === 'sent' ? '-' : '+'} ${formatCurrency(tx.amount)}
                    </div>
                    <span class="badge badge-${getStatusClass(tx.status)}" style="margin-top: 0.5rem;">
                        ${getStatusText(tx.status)}
                    </span>
                    <div style="margin-top: 0.5rem;">
                        <small style="color: var(--text-gray);">
                            Mã GD: ${tx.transactionId}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

function applyFilters() {
    const filterType = document.getElementById('filterType').value;
    const filterMethod = document.getElementById('filterMethod').value;

    let filtered = allTransactions;

    if (filterType !== 'all') {
        filtered = filtered.filter(tx => tx.type === filterType);
    }

    if (filterMethod !== 'all') {
        filtered = filtered.filter(tx => tx.paymentMethod === filterMethod);
    }

    displayTransactions(filtered);
}

// Helper functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function getPaymentMethodName(method) {
    const methods = {
        'bank_transfer': '🏦 Chuyển khoản',
        'momo': '📱 MoMo',
        'zalopay': '💰 ZaloPay',
        'credit_card': '💳 Thẻ tín dụng'
    };
    return methods[method] || method;
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'completed': 'Thành công',
        'failed': 'Thất bại',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    const classMap = {
        'pending': 'warning',
        'processing': 'info',
        'completed': 'success',
        'failed': 'danger',
        'cancelled': 'secondary'
    };
    return classMap[status] || 'secondary';
}

console.log('💰 Payment history loaded');
