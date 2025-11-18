const mongoose = require('mongoose');
require('dotenv').config();
const Project = require('./models/Project');
const User = require('./models/User');

async function createProjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        const client = await User.findOne({ email: 'admin@designhub.com' });
        if (!client) {
            console.log('❌ Không tìm thấy user!');
            process.exit(1);
        }

        await Project.deleteMany({});
        console.log('🗑️  Đã xóa dự án cũ');

        const projects = [
            { title: 'Thiết Kế Logo Công Ty Công Nghệ', description: 'Cần thiết kế logo chuyên nghiệp cho công ty khởi nghiệp trong lĩnh vực công nghệ.', category: 'logo', budget: 5000000, deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), client: client._id, status: 'recruiting' },
            { title: 'Thiết Kế UI/UX App Mobile', description: 'Thiết kế giao diện app thương mại điện tử hiện đại.', category: 'uiux', budget: 15000000, deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), client: client._id, status: 'recruiting' },
            { title: 'Thiết Kế Brochure Sản Phẩm', description: 'Brochure giới thiệu sản phẩm, kích thước A4, 8 trang.', category: 'print', budget: 3000000, deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), client: client._id, status: 'recruiting' },
            { title: 'Thiết Kế Bao Bì Thực Phẩm', description: 'Bao bì cho sản phẩm thực phẩm hữu cơ.', category: 'packaging', budget: 6000000, deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), client: client._id, status: 'recruiting' },
            { title: 'Thiết Kế Banner Quảng Cáo', description: 'Banner cho Facebook và Instagram.', category: 'print', budget: 2000000, deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), client: client._id, status: 'recruiting' },
            { title: 'Thiết Kế Poster Sự Kiện', description: 'Poster âm nhạc, kích thước A2.', category: 'print', budget: 2500000, deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), client: client._id, status: 'recruiting' },
            { title: 'Thiết Kế Website Landing Page', description: 'Landing page responsive cho sản phẩm mới.', category: 'web', budget: 12000000, deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), client: client._id, status: 'recruiting' },
            { title: 'Thiết Kế Logo Startup Fintech', description: 'Logo cho startup fintech, thể hiện tin cậy.', category: 'logo', budget: 4000000, deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), client: client._id, status: 'recruiting' },
            { title: 'Thiết Kế Branding Thương Hiệu', description: 'Bộ nhận diện thương hiệu hoàn chỉnh.', category: 'branding', budget: 20000000, deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), client: client._id, status: 'recruiting' },
            { title: 'Thiết Kế Minh Họa Sách', description: 'Minh họa sách thiếu nhi, phong cách dễ thương.', category: 'illustration', budget: 8000000, deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000), client: client._id, status: 'recruiting' }
        ];

        const created = await Project.insertMany(projects);
        console.log(`✅ Đã tạo ${created.length} dự án!`);
        console.log('\n🎉 Mở http://localhost:3000/projects.html');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

createProjects();