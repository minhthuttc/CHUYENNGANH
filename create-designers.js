const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function createDesigners() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        // Xóa designers cũ (giữ lại admin và client)
        await User.deleteMany({ userType: 'designer' });
        console.log('🗑️  Đã xóa designers cũ');

        // Tạo designers mới
        const designers = [
            {
                fullName: 'Phạm Quang Vinh',
                email: 'phamquangvinh@designhub.com',
                password: await bcrypt.hash('123456', 10),
                userType: 'designer',
                status: 'active',
                bio: 'Chuyên gia thiết kế Logo và Branding với 5 năm kinh nghiệm',
                skills: ['Logo Design', 'Branding', 'Illustrator', 'Photoshop'],
                rating: 4.8,
                reviewCount: 45,
                completedProjects: 78
            },
            {
                fullName: 'Nguyễn Thành Trung',
                email: 'nguyenthanhtrung@designhub.com',
                password: await bcrypt.hash('123456', 10),
                userType: 'designer',
                status: 'active',
                bio: 'Chuyên về UI/UX Design và Web Design hiện đại',
                skills: ['UI/UX Design', 'Web Design', 'Figma', 'Adobe XD'],
                rating: 4.9,
                reviewCount: 62,
                completedProjects: 95
            },
            {
                fullName: 'Nguyễn Nhật Trường',
                email: 'nguyennhattruong@designhub.com',
                password: await bcrypt.hash('123456', 10),
                userType: 'designer',
                status: 'active',
                bio: 'Thiết kế đồ họa in ấn và bao bì sản phẩm chuyên nghiệp',
                skills: ['Print Design', 'Packaging Design', 'InDesign', 'Illustrator'],
                rating: 4.7,
                reviewCount: 38,
                completedProjects: 65
            },
            {
                fullName: 'Hứa Thị Thảo Vy',
                email: 'huathithaovy@designhub.com',
                password: await bcrypt.hash('123456', 10),
                userType: 'designer',
                status: 'active',
                bio: 'Nghệ sĩ minh họa và thiết kế sáng tạo',
                skills: ['Illustration', 'Branding', 'Digital Art', 'Procreate'],
                rating: 4.9,
                reviewCount: 52,
                completedProjects: 88
            }
        ];

        const created = await User.insertMany(designers);
        console.log(`✅ Đã tạo ${created.length} nhà thiết kế!`);

        console.log('\n📋 Danh sách nhà thiết kế:');
        created.forEach((d, i) => {
            console.log(`${i + 1}. ${d.fullName} - ${d.email}`);
            console.log(`   ⭐ Rating: ${d.rating} | 📊 Hoàn thành: ${d.completedProjects} dự án`);
        });

        console.log('\n🔑 Thông tin đăng nhập:');
        console.log('Email: [tên]@designhub.com');
        console.log('Password: 123456');

        console.log('\n🎉 Hoàn thành! Xem tại http://localhost:3000/designers.html');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

createDesigners();