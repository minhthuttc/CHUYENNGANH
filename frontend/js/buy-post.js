// Thanh toán bài đăng
const API_URL = 'http://localhost:3000/api';

let currentPost = null;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        alert('Không tìm thấy bài đăng!');
        window.location.href = 'portfolio.html';
        return;
    }

    loadPostInfo(postId);
    setupPaymentForm();
});

async function loadPostInfo(postId) {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}`);
        if (!response.ok) throw new Error('Không tìm thấy bài đăng');
        
        currentPost = await response.json();
        displayPostInfo(currentPost);
        updatePriceDisplay(currentPost.price || 500000);
    } catch (error) {
        console.error('Lỗi:', error);
        document.getElementById('postInfo').innerHTML = `
            <div class="empty-state">
                <p>Không thể tải thông tin bài đăng</p>
            </div>
        `;
    }
}

function displayPostInfo(post) {
    const price = post.price || 500000;
    document.getElementById('postInfo').innerHTML = `
        <img src="${post.imageUrl}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
        <h3>${post.title}</h3>
        <p style="color: var(--text-gray);">${post.description}</p>
        <div style="margin: 1rem 0;">
            <span class="badge badge-info">${getCategoryName(post.category)}</span>
        </div>
        <p><strong>Tác giả:</strong> ${post.author?.fullName || 'Anonymous'}</p>
        <p style="font-size: 1.5rem; color: var(--dark-brown); font-weight: bold; margin-top: 1rem;">
            ${formatCurrency(price)}
        </p>
    `;
}

function updatePriceDisplay(price) {
    const fee = price * 0.05;
    const total = price + fee;
    
    document.getElementById('priceDisplay').textContent = formatCurrency(price);
    document.getElementById('feeDisplay').textContent = formatCurrency(fee);
    document.getElementById('totalDisplay').textContent = formatCurrency(total);
}

function setupPaymentForm() {
    document.getElementById('paymentForm').addEventListener('submit', handlePayment);
}

async function handlePayment(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Vui lòng đăng nhập để mua thiết kế!');
        window.location.href = 'login.html';
        return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const note = document.getElementById('note').value;
    const price = currentPost.price || 500000;
    const total = price * 1.05;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.textContent = '⏳ Đang xử lý...';
    submitBtn.disabled = true;

    try {
        // Giả lập thanh toán (demo)
        await simulatePayment(paymentMethod);

        // Gọi API mua bài đăng
        const response = await fetch(`${API_URL}/posts/${currentPost._id}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                amount: total,
                paymentMethod: paymentMethod,
                note: note
            })
        });

        const data = await response.json();

        if (response.ok) {
            showPaymentSuccess(data);
        } else {
            throw new Error(data.message || 'Thanh toán thất bại');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('❌ ' + error.message);
        submitBtn.textContent = '✅ Thanh toán ngay';
        submitBtn.disabled = false;
    }
}

function simulatePayment(method) {
    return new Promise((resolve) => {
        const messages = {
            'momo': '📱 Đang kết nối MoMo...',
            'zalopay': '💳 Đang kết nối ZaloPay...',
            'bank_transfer': '🏦 Đang xử lý chuyển khoản...',
            'credit_card': '💳 Đang xác thực thẻ...'
        };
        console.log(messages[method] || 'Đang xử lý...');
        setTimeout(resolve, 2000);
    });
}

function showPaymentSuccess(data) {
    document.querySelector('main').innerHTML = `
        <div class="card" style="max-width: 600px; margin: 2rem auto; text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h1 style="color: #28a745;">Thanh toán thành công!</h1>
            <p style="margin: 1rem 0;">Cảm ơn bạn đã mua thiết kế.</p>
            <div style="background: var(--light-brown); padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: left;">
                <p><strong>Mã giao dịch:</strong> ${data.transactionId || 'TXN' + Date.now()}</p>
                <p><strong>Thiết kế:</strong> ${currentPost.title}</p>
                <p><strong>Số tiền:</strong> ${formatCurrency(data.amount || currentPost.price * 1.05)}</p>
                <p><strong>Phương thức:</strong> ${getPaymentMethodName(data.paymentMethod)}</p>
            </div>
            <p style="color: var(--text-gray);">File thiết kế sẽ được gửi đến email của bạn trong vòng 24 giờ.</p>
            <div style="margin-top: 2rem;">
                <a href="portfolio.html" class="btn btn-primary">Tiếp tục mua sắm</a>
            </div>
        </div>
    `;
}

function getCategoryName(category) {
    const names = { 'logo': 'Logo Design', 'uiux': 'UI/UX Design', 'print': 'Thiết kế Poster' };
    return names[category] || category;
}

function getPaymentMethodName(method) {
    const names = { 'momo': 'Ví MoMo', 'zalopay': 'ZaloPay', 'bank_transfer': 'Chuyển khoản' };
    return names[method] || method;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
