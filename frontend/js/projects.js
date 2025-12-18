// Tìm kiếm và lọc dự án
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const projectsGrid = document.getElementById('projectsGrid');
    const projectCount = document.getElementById('projectCount');
    const activeSearch = document.getElementById('activeSearch');
    const searchTerm = document.getElementById('searchTerm');

    let allProjects = [];
    let searchTimeout;

    // Load dự án từ API
    async function loadProjects() {
        try {
            const response = await fetch('http://localhost:3000/api/projects');
            const data = await response.json();
            
            if (data.success) {
                allProjects = data.projects;
                displayProjects(allProjects);
            }
        } catch (error) {
            console.error('Lỗi tải dự án:', error);
            projectsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>Không thể tải dự án</h3>
                    <p>Vui lòng thử lại sau</p>
                </div>
            `;
        }
    }

    // Highlight từ khóa tìm kiếm
    function highlightText(text, search) {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    // Hiển thị dự án
    function displayProjects(projects) {
        const searchText = searchInput.value.trim();

        if (projects.length === 0) {
            const message = searchText 
                ? `Không tìm thấy dự án với từ khóa "${searchText}"`
                : 'Không tìm thấy dự án';
            
            projectsGrid.innerHTML = `
                <div class="empty-search">
                    <div class="empty-search-icon">🔍</div>
                    <h3>${message}</h3>
                    <p>Thử thay đổi từ khóa hoặc danh mục khác</p>
                    ${searchText ? '<button onclick="clearSearch()" class="btn btn-primary" style="margin-top: 1rem;">Xóa tìm kiếm</button>' : ''}
                </div>
            `;
            projectCount.textContent = '0 dự án';
            return;
        }

        // Kiểm tra user có phải admin không
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const isAdmin = user.userType === 'admin' || user.role === 'admin';

        projectsGrid.innerHTML = projects.map(project => `
            <div class="card hover-lift fade-in-up" data-project-id="${project._id}">
                <span class="badge ${getBadgeClass(project.status)}">${getStatusText(project.status)}</span>
                <h3>${highlightText(project.title, searchText)}</h3>
                <p><strong>Khách hàng:</strong> ${project.client?.fullName || 'Chưa có'}</p>
                <p><strong>Danh mục:</strong> ${project.category}</p>
                <p><strong>Ngân sách:</strong> ${formatCurrency(project.budget)}</p>
                <p><strong>Hạn chót:</strong> ${formatDate(project.deadline)}</p>
                <p style="margin-top: 1rem;">${highlightText(truncateText(project.description, 100), searchText)}</p>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
                    <a href="project-detail.html?id=${project._id}" class="btn btn-primary">Xem Chi Tiết</a>
                    ${project.status === 'open' ? '<button class="btn btn-secondary apply-btn">Ứng Tuyển</button>' : ''}
                    ${isAdmin ? `<button class="btn delete-project-btn" style="background: #dc3545; color: white;" data-id="${project._id}">🗑️ Xóa</button>` : ''}
                </div>
            </div>
        `).join('');

        projectCount.textContent = `${projects.length} dự án`;

        // Thêm event listener cho nút ứng tuyển
        document.querySelectorAll('.apply-btn').forEach(btn => {
            btn.addEventListener('click', handleApply);
        });

        // Thêm event listener cho nút xóa (admin)
        document.querySelectorAll('.delete-project-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteProject);
        });
    }

    // Xử lý xóa dự án (admin)
    async function handleDeleteProject(e) {
        const projectId = e.target.dataset.id;
        
        if (!confirm('Bạn có chắc muốn xóa dự án này? Hành động này không thể hoàn tác!')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/admin/projects/${projectId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                alert('Đã xóa dự án thành công!');
                loadProjects();
            } else {
                alert(data.message || 'Lỗi xóa dự án!');
            }
        } catch (error) {
            console.error('Lỗi xóa dự án:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại!');
        }
    }

    // Lọc và tìm kiếm dự án
    function filterProjects() {
        const searchText = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;

        let filtered = allProjects;

        // Tìm kiếm theo tên hoặc mô tả
        if (searchText) {
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(searchText) ||
                project.description.toLowerCase().includes(searchText)
            );
            
            // Hiển thị indicator tìm kiếm
            activeSearch.style.display = 'block';
            searchTerm.textContent = `"${searchInput.value}"`;
        } else {
            activeSearch.style.display = 'none';
        }

        // Lọc theo danh mục
        if (category && category !== 'all') {
            filtered = filtered.filter(project => project.category === category);
        }

        // Sắp xếp mặc định: mới nhất
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        displayProjects(filtered);
    }

    // Xóa tìm kiếm
    window.clearSearch = function() {
        searchInput.value = '';
        filterProjects();
        searchInput.focus();
    };

    // Xóa bộ lọc (reset về tất cả)
    function clearFilters() {
        categoryFilter.value = 'all';
        filterProjects();
    }

    // Xử lý ứng tuyển
    async function handleApply(e) {
        const card = e.target.closest('.card');
        const projectId = card.dataset.projectId;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vui lòng đăng nhập để ứng tuyển!');
            window.location.href = 'login.html';
            return;
        }

        if (confirm('Bạn có chắc muốn ứng tuyển dự án này?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/projects/${projectId}/apply`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    alert('Ứng tuyển thành công!');
                    loadProjects();
                } else {
                    alert(data.message || 'Ứng tuyển thất bại!');
                }
            } catch (error) {
                console.error('Lỗi ứng tuyển:', error);
                alert('Có lỗi xảy ra. Vui lòng thử lại!');
            }
        }
    }

    // Helper functions
    function getBadgeClass(status) {
        const classes = {
            'open': 'badge-success',
            'in_progress': 'badge-warning',
            'completed': 'badge-info',
            'cancelled': 'badge-danger'
        };
        return classes[status] || 'badge-secondary';
    }

    function getStatusText(status) {
        const texts = {
            'open': 'Đang tuyển',
            'in_progress': 'Đang thực hiện',
            'completed': 'Hoàn thành',
            'cancelled': 'Đã hủy'
        };
        return texts[status] || status;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Event listeners
    categoryFilter.addEventListener('change', filterProjects);
    
    // Tìm kiếm với debounce
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(filterProjects, 300);
    });

    // Enter để tìm kiếm ngay
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            filterProjects();
        }
    });

    // Load dự án khi trang load
    loadProjects();
});