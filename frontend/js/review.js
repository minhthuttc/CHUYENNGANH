// Review JavaScript
const API_URL = 'http://localhost:3000/api';

let ratings = {
    overall: 0,
    quality: 0,
    communication: 0,
    time: 0
};

document.addEventListener('DOMContentLoaded', function() {
    // Xử lý đánh giá sao
    setupStarRating('overallRating', 'ratingValue', 'overall');
    setupStarRating('qualityRating', 'qualityValue', 'quality');
    setupStarRating('communicationRating', 'communicationValue', 'communication');
    setupStarRating('timeRating', 'timeValue', 'time');
    
    // Xử lý form submit
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Kiểm tra đã đánh giá chưa
            if (ratings.overall === 0) {
                showNotification('❌ Vui lòng đánh giá tổng thể!', 'error');
                return;
            }
            
            if (ratings.quality === 0 || ratings.communication === 0 || ratings.time === 0) {
                showNotification('❌ Vui lòng đánh giá đầy đủ tất cả các tiêu chí!', 'error');
                return;
            }
            
            const comment = document.getElementById('comment').value;
            if (comment.length < 50) {
                showNotification('❌ Nhận xét phải có ít nhất 50 ký tự!', 'error');
                return;
            }
            
            const recommend = document.getElementById('recommend').checked;
            const projectId = new URLSearchParams(window.location.search).get('projectId') || 'demo_project_id';
            
            const reviewData = {
                projectId: projectId,
                ratings: ratings,
                comment: comment,
                recommend: recommend
            };
            
            try {
                showNotification('Đang gửi đánh giá...', 'info');
                
                const response = await fetch(`${API_URL}/reviews/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(reviewData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showSuccessReview(data);
                } else {
                    showNotification(data.message || 'Gửi đánh giá thất bại!', 'error');
                }
            } catch (error) {
                showNotification('Lỗi kết nối server!', 'error');
                console.error('Error:', error);
            }
        });
    }
});

function setupStarRating(containerId, inputId, ratingKey) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    const stars = container.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratings[ratingKey] = rating;
            input.value = rating;
            
            // Cập nhật hiển thị sao
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#FFD700';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
    
    container.addEventListener('mouseleave', function() {
        const currentRating = ratings[ratingKey];
        stars.forEach((s, index) => {
            if (index < currentRating) {
                s.style.color = '#FFD700';
            } else {
                s.style.color = '#ddd';
            }
        });
    });
}

function showSuccessReview(data) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="container" style="max-width: 600px; text-align: center; padding: 3rem 2rem;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">⭐</div>
            <h1 style="color: var(--dark-brown); margin-bottom: 1rem;">Cảm Ơn Đánh Giá Của Bạn!</h1>
            <p style="color: var(--text-gray); margin-bottom: 2rem;">
                Đánh giá của bạn đã được gửi thành công và sẽ giúp cải thiện chất lượng dịch vụ.
            </p>
            
            <div class="card" style="text-align: left; margin-bottom: 2rem;">
                <h3>📊 Tóm Tắt Đánh Giá</h3>
                <div style="margin-top: 1rem;">
                    <p><strong>Đánh giá tổng thể:</strong> ${getStars(ratings.overall)}</p>
                    <p><strong>Chất lượng thiết kế:</strong> ${getStars(ratings.quality)}</p>
                    <p><strong>Giao tiếp & Hỗ trợ:</strong> ${getStars(ratings.communication)}</p>
                    <p><strong>Thời gian hoàn thành:</strong> ${getStars(ratings.time)}</p>
                    <p><strong>Trung bình:</strong> ${getStars(calculateAverage())}</p>
                </div>
            </div>
            
            <div style="display: grid; gap: 1rem;">
                <a href="dashboard.html" class="btn btn-primary" style="text-decoration: none;">
                    🏠 Về Trang Chủ
                </a>
                <a href="projects.html" class="btn btn-secondary" style="text-decoration: none;">
                    📁 Xem Dự Án Khác
                </a>
            </div>
        </div>
    `;
}

function getStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '⭐' : '☆';
    }
    return stars + ` (${rating}/5)`;
}

function calculateAverage() {
    const sum = ratings.overall + ratings.quality + ratings.communication + ratings.time;
    return Math.round((sum / 4) * 10) / 10;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--dark-brown)' : type === 'error' ? '#dc3545' : '#17a2b8'};
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

console.log('⭐ Review system loaded');
