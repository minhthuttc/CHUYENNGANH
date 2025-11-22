// Script để tạo dự án mẫu
const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('./models/Project');
const User = require('./models/User');

async function seedProjects() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        // Lấy danh sách designers
        const designers = await User.find({ userType: 'designer' });
        
        if (designers.length === 0) {
            console.log('❌ Không tìm thấy designer. Vui lòng chạy seed-data.js trước!');
            process.exit(1);
        }

        // Xóa dự án cũ
        await Project.deleteMany({});
        console.log('🗑️  Đã xóa dự án cũ');

        // Dữ liệu dự án theo 3 danh mục
        const projectsData = [
            // Thiết kế Logo
            { title: 'Thiết kế Logo cho Startup Công nghệ', category: 'logo', budget: 5000000, description: 'Cần thiết kế logo hiện đại, tối giản cho startup công nghệ AI' },
            { title: 'Logo Nhà hàng Cao cấp', category: 'logo', budget: 8000000, description: 'Thiết kế logo sang trọng cho nhà hàng fine dining' },
            { title: 'Logo Thương hiệu Thời trang', category: 'logo', budget: 6000000, description: 'Logo minimalist cho thương hiệu thời trang nữ' },
            { title: 'Logo Công ty Xây dựng', category: 'logo', budget: 4000000, description: 'Logo mạnh mẽ, chuyên nghiệp cho công ty xây dựng' },
            
            // UI/UX Design
            { title: 'Thiết kế App Mobile Banking', category: 'uiux', budget: 15000000, description: 'Thiết kế UI/UX cho ứng dụng ngân hàng di động' },
            { title: 'Website E-commerce', category: 'uiux', budget: 20000000, description: 'Thiết kế giao diện website bán hàng online' },
            { title: 'App Đặt đồ ăn', category: 'uiux', budget: 12000000, description: 'Thiết kế UI/UX cho app food delivery' },
            { title: 'Dashboard Quản lý', category: 'uiux', budget: 10000000, description: 'Thiết kế dashboard cho hệ thống quản lý doanh nghiệp' },
            
            // Thiết kế Poster
            { title: 'Poster Sự kiện Âm nhạc', category: 'print', budget: 3000000, description: 'Thiết kế poster cho concert nhạc rock' },
            { title: 'Poster Quảng cáo Sản phẩm', category: 'print', budget: 4000000, description: 'Poster quảng cáo cho sản phẩm mỹ phẩm' },
            { title: 'Poster Tuyển dụng', category: 'print', budget: 2500000, description: 'Poster tuyển dụng nhân sự cho công ty IT' },
            { title: 'Poster Triển lãm Nghệ thuật', category: 'print', budget: 3500000, description: 'Poster cho triển lãm tranh đương đại' }
        ];

        // Tạo dự án
        const projects = [];
        for (let i = 0; i < projectsData.length; i++) {
            const data = projectsData[i];
            const designer = designers[i % designers.length];
            
            const project = await Project.create({
                title: data.title,
                description: data.description,
                category: data.category,
                budget: data.budget,
                deadline: new Date(Date.now() + (Math.random() * 30 + 7) * 24 * 60 * 60 * 1000), // 7-37 ngày
                designer: designer._id,
                status: 'recruiting',
                requirements: ['Yêu cầu chất lượng cao', 'Giao đúng deadline', 'Có thể chỉnh sửa'],
                skills: data.category === 'logo' ? ['Thiết kế Logo', 'Adobe Illustrator'] : 
                       data.category === 'uiux' ? ['UI/UX Design', 'Figma'] : 
                       ['Thiết kế Poster', 'Photoshop']
            });
            projects.push(project);
        }

        console.log(`✅ Đã tạo ${projects.length} dự án mẫu!`);
        console.log('\n📊 Thống kê:');
        console.log(`- Thiết kế Logo: ${projects.filter(p => p.category === 'logo').length} dự án`);
        console.log(`- UI/UX Design: ${projects.filter(p => p.category === 'uiux').length} dự án`);
        console.log(`- Thiết kế Poster: ${projects.filter(p => p.category === 'print').length} dự án`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

seedProjects();
