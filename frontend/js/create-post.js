// Xử lý đăng bài
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createPostForm');
    const imageInput = document.getElementById('postImages');
    const imagePreview = document.getElementById('imagePreview');

    let selectedImages = [];

    // Preview ảnh khi chọn
    imageInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        if (files.length > 5) {
            alert('Chỉ được chọn tối đa 5 ảnh!');
            return;
        }

        selectedImages = [];
        imagePreview.innerHTML = '';

        files.forEach((file, index) => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} quá lớn! Tối đa 5MB`);
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                selectedImages.push({
                    file: file,
                    dataUrl: e.target.result
                });

                const imgContainer = document.createElement('div');
                imgContainer.style.position = 'relative';
                imgContainer.innerHTML = `
                    <img src="${e.target.result}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                    <button type="button" onclick="removeImage(${index})" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">✕</button>
                `;
                imagePreview.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        });
    });

    // Xóa ảnh
    window.removeImage = function(index) {
        selectedImages.splice(index, 1);
        imageInput.value = '';
        updateImagePreview();
    };

    function updateImagePreview() {
        imagePreview.innerHTML = '';
        selectedImages.forEach((img, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.innerHTML = `
                <img src="${img.dataUrl}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                <button type="button" onclick="removeImage(${index})" style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">✕</button>
            `;
            imagePreview.appendChild(imgContainer);
        });
    }

    // Submit form
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vui lòng đăng nhập để đăng bài!');
            window.location.href = 'login.html';
            return;
        }

        // Lấy tools đã chọn
        const tools = Array.from(document.querySelectorAll('input[name="tools"]:checked'))
            .map(cb => cb.value);

        // Lấy tags
        const tagsInput = document.getElementById('postTags').value;
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

        const postData = {
            title: document.getElementById('postTitle').value,
            category: document.getElementById('postCategory').value,
            description: document.getElementById('postDescription').value,
            tags: tags,
            link: document.getElementById('postLink').value,
            clientName: document.getElementById('clientName').value,
            completionTime: document.getElementById('completionTime').value,
            tools: tools,
            images: selectedImages.map(img => img.dataUrl) // Trong thực tế cần upload lên server
        };

        try {
            // Hiển thị loading
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '⏳ Đang đăng...';
            submitBtn.disabled = true;

            // Gọi API thực sự
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: postData.title,
                    description: postData.description,
                    category: postData.category,
                    imageUrl: selectedImages.length > 0 ? selectedImages[0].dataUrl : 'https://via.placeholder.com/400x300',
                    tags: postData.tags
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng bài thất bại');
            }

            alert('✅ Đăng bài thành công!');
            window.location.href = 'portfolio.html';

        } catch (error) {
            console.error('Lỗi:', error);
            alert('❌ Có lỗi xảy ra. Vui lòng thử lại!');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});

// Lưu nháp
function saveDraft() {
    const draftData = {
        title: document.getElementById('postTitle').value,
        category: document.getElementById('postCategory').value,
        description: document.getElementById('postDescription').value,
        tags: document.getElementById('postTags').value,
        link: document.getElementById('postLink').value,
        clientName: document.getElementById('clientName').value,
        completionTime: document.getElementById('completionTime').value
    };

    localStorage.setItem('postDraft', JSON.stringify(draftData));
    alert('💾 Đã lưu nháp!');
}

// Xem trước
function previewPost() {
    const title = document.getElementById('postTitle').value;
    const description = document.getElementById('postDescription').value;
    const category = document.getElementById('postCategory').value;

    if (!title || !description) {
        alert('Vui lòng nhập tiêu đề và mô tả!');
        return;
    }

    const previewWindow = window.open('', 'Preview', 'width=800,height=600');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Preview - ${title}</title>
            <link rel="stylesheet" href="css/style.css">
        </head>
        <body>
            <div class="container">
                <div class="card" style="max-width: 800px; margin: 2rem auto;">
                    <span class="badge badge-info">${category}</span>
                    <h1>${title}</h1>
                    <p style="white-space: pre-wrap;">${description}</p>
                    <div id="images"></div>
                </div>
            </div>
        </body>
        </html>
    `);
}

// Load draft nếu có
window.addEventListener('load', function() {
    const draft = localStorage.getItem('postDraft');
    if (draft && confirm('Bạn có muốn tiếp tục bài viết đã lưu?')) {
        const data = JSON.parse(draft);
        document.getElementById('postTitle').value = data.title || '';
        document.getElementById('postCategory').value = data.category || '';
        document.getElementById('postDescription').value = data.description || '';
        document.getElementById('postTags').value = data.tags || '';
        document.getElementById('postLink').value = data.link || '';
        document.getElementById('clientName').value = data.clientName || '';
        document.getElementById('completionTime').value = data.completionTime || '';
    }
});