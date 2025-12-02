// Script tự động tạo admin mặc định khi server khởi động
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function initDefaultAdmin() {
    try {
        // Thông tin admin mặc định
        const defaultAdmin = {
            email: 'admin@designhub.com',
            password: 'admin123',
            fullName: 'Administrator',
            userType: 'admin',
            adminRole: 'super_admin'
        };

        // Kiểm tra admin đã tồn tại chưa
        const existingAdmin = await User.findOne({ email: defaultAdmin.email });

        if (existingAdmin) {
            console.log('✅ Admin mặc định đã tồn tại');
            console.log(`📧 Email: ${defaultAdmin.email}`);
            return existingAdmin;
        }

        // Tạo admin mới
        const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
        
        const admin = new User({
            fullName: defaultAdmin.fullName,
            email: defaultAdmin.email,
            password: hashedPassword,
            phone: '',
            userType: defaultAdmin.userType,
            adminRole: defaultAdmin.adminRole,
            status: 'active'
        });

        await admin.save();

        console.log('🎉 Đã tạo admin mặc định thành công!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 THÔNG TIN ĐĂNG NHẬP ADMIN:');
        console.log(`📧 Email: ${defaultAdmin.email}`);
        console.log(`🔑 Password: ${defaultAdmin.password}`);
        console.log(`👤 Vai trò: ${defaultAdmin.adminRole}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔗 Truy cập: http://localhost:3000/admin.html');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return admin;
    } catch (error) {
        console.error('❌ Lỗi khi tạo admin mặc định:', error.message);
        return null;
    }
}

module.exports = initDefaultAdmin;
