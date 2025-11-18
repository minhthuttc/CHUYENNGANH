const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function addDesigners() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        // Thêm 2 nhà thiết kế mới
        const newDesigners = [
            {
                fullName: 'Lâm Vĩnh Lộc',
                email: 'lamvinhloc@designhub.com',
                password: await bcrypt.hash('123456', 10),
                userType: 'designer',
                status: 'active',
                bio: 'Chuyên gia Motion Graphics và Video Design với hơn 5 năm kinh nghiệm',
                skills: ['Motion Graphics', 'Video Editing', 'After Effects', 'Premiere Pro'],
                rating: 4.8,
                reviewCount: 35,
                completedProjects: 92
            },
            {
                fullName: 'Nguyễn Huỳnh Kỹ Thuật',
                email: 'nguyenhuynhkythuat@designhub.com',
                password: await bcrypt.hash('123456', 10),
                userType: 'designer',
                status: 'active',
                bio: 'Creative Director và Brand Identity Designer với 7+ năm kinh nghiệm',
                skills: ['Branding', 'Identity Design', 'Creative Direction', 'Strategy'],
                rating: 4.9,
                reviewCount: 48,
                completedProjects: 156
            }
        ];

        const created = await User.insertMany(newDesigners);
        console.log(`✅ Đã thêm ${created.length} nhà thiết kế mới!`);

        console.log('\n📋 Danh sách nhà thiết kế mới:');
        created.forEach((d, i) => {
            console.log(`${i + 1}. ${d.fullName} - ${d.email}`);
            console.log(`   ⭐ Rating: ${d.rating} | 📊 Hoàn thành: ${d.completedProjects} dự án`);
        });

        console.log('\n🎉 Hoàn thành!');
        console.log('🔑 Password: 123456 (cho tất cả)');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

addDesigners();