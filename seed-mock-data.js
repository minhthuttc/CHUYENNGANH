// Script tạo dữ liệu mẫu cho mock server
const API_URL = 'http://localhost:3000/api';

console.log('🌱 BẮT ĐẦU TẠO DỮ LIỆU MẪU...\n');

// Tạo users mẫu
async function createSampleUsers() {
    console.log('1️⃣ Tạo users mẫu...');
    
    const users = [
        {
            fullName: 'Nguyễn Văn A',
            email: 'client1@example.com',
            password: '123456',
            userType: 'client'
        },
        {
            fullName: 'Trần Thị B',
            email: 'designer1@example.com',
            password: '123456',
            userType: 'designer'
        },
        {
            fullName: 'Lê Văn C',
            email: 'designer2@example.com',
            password: '123456',
            userType: 'designer'
        }
    ];

    const createdUsers = [];

    for (const user of users) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log(`   ✅ Tạo user: ${user.email}`);
                createdUsers.push({ ...user, userId: data.userId });
            } else {
                console.log(`   ⚠️ User đã tồn tại: ${user.email}`);
            }
        } catch (error) {
            console.log(`   ❌ Lỗi tạo user: ${error.message}`);
        }
    }

    console.log('');
    return createdUsers;
}

// Đăng nhập để lấy token
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            return data.token;
        }
    } catch (error) {
        console.log(`   ❌ Lỗi đăng nhập: ${error.message}`);
    }
    return null;
}

// Tạo projects mẫu
async function createSampleProjects() {
    console.log('2️⃣ Tạo projects mẫu...');
    
    // Đăng nhập để lấy token
    const token = await loginUser('client1@example.com', '123456');
    
    if (!token) {
        console.log('   ❌ Không thể đăng nhập để tạo projects');
        return [];
    }

    const projects = [
        {
            title: 'Thiết Kế Logo Công Ty',
            description: 'Cần thiết kế logo chuyên nghiệp cho công ty khởi nghiệp trong lĩnh vực công nghệ. Logo cần thể hiện sự hiện đại, sáng tạo và đáng tin cậy.',
            category: 'logo',
            budget: 5000000,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            title: 'Thiết Kế UI/UX App Mobile',
            description: 'Thiết kế giao diện và trải nghiệm người dùng cho ứng dụng mobile về thương mại điện tử. Cần có kinh nghiệm về UI/UX và hiểu biết về xu hướng thiết kế hiện đại.',
            category: 'uiux',
            budget: 15000000,
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        },
        {
            title: 'Thiết Kế Bao Bì Sản Phẩm',
            description: 'Thiết kế bao bì cho dòng sản phẩm mỹ phẩm cao cấp. Yêu cầu thiết kế sang trọng, tinh tế và thu hút khách hàng mục tiêu.',
            category: 'packaging',
            budget: 8000000,
            deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'in_progress'
        },
        {
            title: 'Thiết Kế Banner Quảng Cáo',
            description: 'Cần thiết kế banner quảng cáo cho chiến dịch marketing online. Kích thước đa dạng cho Facebook, Instagram và Google Ads.',
            category: 'print',
            budget: 3000000,
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'review'
        },
        {
            title: 'Thiết Kế Website Landing Page',
            description: 'Thiết kế landing page cho sản phẩm mới. Cần tối ưu conversion rate và responsive trên mọi thiết bị.',
            category: 'web',
            budget: 12000000,
            deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
        }
    ];

    const createdProjects = [];

    for (const project of projects) {
        try {
            const response = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(project)
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log(`   ✅ Tạo project: ${project.title}`);
                createdProjects.push(data.project);
            } else {
                console.log(`   ❌ Lỗi: ${data.message}`);
            }
        } catch (error) {
            console.log(`   ❌ Lỗi tạo project: ${error.message}`);
        }
    }

    console.log('');
    return createdProjects;
}

// Chạy tất cả
async function seedAll() {
    console.log('═══════════════════════════════════════════════════');
    console.log('           🌱 TẠO DỮ LIỆU MẪU                      ');
    console.log('═══════════════════════════════════════════════════\n');

    const users = await createSampleUsers();
    const projects = await createSampleProjects();

    console.log('═══════════════════════════════════════════════════');
    console.log('           ✅ HOÀN THÀNH!                          ');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('📊 Tổng kết:');
    console.log(`   👤 Users: ${users.length}`);
    console.log(`   📁 Projects: ${projects.length}\n`);
    
    console.log('🎉 Bạn có thể sử dụng các tài khoản sau:');
    console.log('   📧 client1@example.com / 123456 (Client)');
    console.log('   📧 designer1@example.com / 123456 (Designer)');
    console.log('   📧 designer2@example.com / 123456 (Designer)\n');
    
    console.log('🌐 Xem dự án tại:');
    console.log('   http://localhost:3000/my-projects.html\n');
}

// Chạy
seedAll().catch(error => {
    console.error('❌ Lỗi nghiêm trọng:', error);
});
