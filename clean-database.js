// Script để xóa admin và khách hàng khỏi database
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function cleanDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB thành công!');

        // Xóa tất cả admin
        const deletedAdmins = await User.deleteMany({ userType: 'admin' });
        console.log(`🗑️  Đã xóa ${deletedAdmins.deletedCount} admin`);

        // Xóa tất cả khách hàng
        const deletedClients = await User.deleteMany({ userType: 'client' });
        console.log(`🗑️  Đã xóa ${deletedClients.deletedCount} khách hàng`);

        // Đếm số designers còn lại
        const designerCount = await User.countDocuments({ userType: 'designer' });
        console.log(`✅ Còn lại ${designerCount} nhà thiết kế`);

        console.log('\n🎉 Hoàn tất dọn dẹp database!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
}

cleanDatabase();
