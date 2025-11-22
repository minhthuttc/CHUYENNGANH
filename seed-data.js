// Script để tạo dữ liệu mẫu
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');
const Transaction = require('./models/Transaction');

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        // Xóa dữ liệu cũ (chỉ xóa designers)
        await User.deleteMany({ userType: 'designer' });
        await Project.deleteMany({});
        await Transaction.deleteMany({});
        console.log('🗑️  Đã xóa dữ liệu cũ');

        // Tạo designers với thông tin liên hệ
        const designers = [];
        const designerNames = [
            { name: 'Phạm Quang Vinh', bio: 'Chuyên gia Thiết kế Logo', skills: ['Thiết kế Logo', 'Adobe Illustrator', 'Photoshop'] },
            { name: 'Nguyễn Thành Trung', bio: 'Chuyên gia UI/UX Design', skills: ['UI/UX Design', 'Figma', 'Prototyping'] },
            { name: 'Nguyễn Nhật Trường', bio: 'Chuyên gia Thiết kế Poster', skills: ['Thiết kế Poster', 'InDesign', 'Photoshop'] },
            { name: 'Hứa Thị Thảo Vy', bio: 'Chuyên gia Thiết kế Logo', skills: ['Thiết kế Logo', 'Branding', 'Illustrator'] },
            { name: 'Lâm Vĩnh Lộc', bio: 'Chuyên gia UI/UX Design', skills: ['UI/UX Design', 'Sketch', 'Adobe XD'] },
            { name: 'Nguyễn Huỳnh Kỹ Thuật', bio: 'Chuyên gia Thiết kế Poster', skills: ['Thiết kế Poster', 'Print Design', 'InDesign'] }
        ];
        const cities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
        
        for (let i = 0; i < designerNames.length; i++) {
            const password = await bcrypt.hash('123456', 10);
            const designer = await User.create({
                fullName: designerNames[i].name,
                email: `designer${i + 1}@example.com`,
                password: password,
                phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
                address: `${cities[Math.floor(Math.random() * cities.length)]}, Việt Nam`,
                website: `www.${designerNames[i].name.toLowerCase().replace(/\s+/g, '')}.com`,
                userType: 'designer',
                status: 'active',
                bio: designerNames[i].bio,
                skills: designerNames[i].skills,
                rating: 4 + Math.random(),
                reviewCount: Math.floor(Math.random() * 50) + 10,
                completedProjects: Math.floor(Math.random() * 100) + 20
            });
            designers.push(designer);
        }
        console.log('✅ Đã tạo 6 nhà thiết kế với thông tin liên hệ');

        console.log('\n🎉 Hoàn tất tạo dữ liệu mẫu!');
        console.log('\n📝 Thông tin đăng nhập:');
        console.log('Designer: designer1@example.com / 123456');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

seedData();
